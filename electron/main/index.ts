import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, session } from 'electron'
import path from 'path'
import {
  stopAiRequest,
  clearConversation,
  hasActiveConversation,
  runStreamFollowUp,
  runStreamSolve
} from './ai/client'
import { transcribeAudio } from './ai/transcribe'
import {
  captureDisplay,
  clearScreenshotBuffer,
  getScreenshotQueue,
  isScreenshotQueueFull,
  listDisplays,
  takeScreenshotQueueForSolve
} from './capture'
import { setupDisplayMediaHandler } from './displayMedia'
import { registerInterviewHotkeys, unregisterInterviewHotkeys, listHotkeyBindings } from './hotkeys/registry'
import {
  appendTranscript,
  beginTranscription,
  clearTranscript,
  endTranscription,
  getRecordingTranscript,
  getTranscriptDeltaSinceCheckpoint,
  isRecording,
  markTranscriptCheckpoint,
  setRecording,
  waitForTranscriptionIdle
} from './recording'
import { endSession, getActiveSession, newSessionFromActive, startSession } from './session'
import { scrapeJobDescription, normalizeJobDescriptionUrl } from './jobDescription'
import { clearResume, getResumeExport, getResumeInfo, saveResume } from './resume'
import { extractResumeText, MAX_RESUME_UPLOAD_BYTES } from './resumeParser'
import { getSettings, saveSettings, clearLocalUserData } from './store'
import type { HotkeyAction, InterviewSession, InterviewSessionStartConfig, SolveMode } from '../../shared/types'
import { MAX_SCREENSHOTS } from '../../shared/types'
import {
  createInterviewWindow,
  createMainWindow,
  destroyInterviewWindow,
  hideMainWindow,
  moveInterviewWindow,
  openSubscriptionUrl,
  scrollInterviewContent,
  sendToInterview,
  showMainWindow
} from './windows'

const INPUT_REQUIRED_MSG =
  'Provide at least a screenshot (Ctrl+Shift+S) or voice transcript (Ctrl+Shift+R) before solving.'

let tray: Tray | null = null
let solutionRound = 0

function broadcastScreenshotQueue(): void {
  sendToInterview('screenshot:queue-updated', getScreenshotQueue())
}

function broadcastTranscript(transcribing: boolean): void {
  sendToInterview('recording:transcript', {
    transcript: getRecordingTranscript(),
    transcribing
  })
}

function startRecordingFlow(): void {
  setRecording(true)
  broadcastTranscript(false)
  sendToInterview('recording:control', { action: 'start' })
  sendToInterview('recording:status', { recording: true })
}

function stopRecordingFlow(): void {
  setRecording(false)
  sendToInterview('recording:control', { action: 'stop' })
  sendToInterview('recording:status', { recording: false })
}

async function flushPendingTranscription(): Promise<void> {
  await waitForTranscriptionIdle()
}

async function handleRecordingChunk(
  base64: string,
  mimeType: string,
  source: 'system' | 'microphone' = 'system'
): Promise<void> {
  beginTranscription()
  broadcastTranscript(true)

  try {
    const audio = Buffer.from(base64, 'base64')
    const active = getActiveSession()
    const text = await transcribeAudio(audio, mimeType, active?.interviewLanguage)
    appendTranscript(text, source)
    broadcastTranscript(false)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transcription failed'
    broadcastTranscript(false)
    sendToInterview('ai:status', { state: 'error', message })
  } finally {
    endTranscription()
  }
}

async function runSolve(mode: SolveMode): Promise<void> {
  const active = getActiveSession()
  if (!active) return

  const recordingActive = isRecording()
  await flushPendingTranscription()

  const fullTranscript = getRecordingTranscript().trim()
  const hasScreenshots = getScreenshotQueue().length > 0
  const hasTranscript = fullTranscript.length > 0

  if (!hasScreenshots && !hasTranscript) {
    sendToInterview('ai:status', { state: 'error', message: INPUT_REQUIRED_MSG })
    return
  }

  let transcriptForSolve: string | undefined
  if (hasTranscript) {
    if (recordingActive && hasActiveConversation() && !hasScreenshots) {
      const delta = getTranscriptDeltaSinceCheckpoint()
      transcriptForSolve = delta.length > 0 ? delta : fullTranscript
    } else {
      transcriptForSolve = fullTranscript
    }
  }

  const screenshotUrls = hasScreenshots
    ? getScreenshotQueue().map((shot) => shot.dataUrl)
    : []

  const startedAt = Date.now()
  solutionRound += 1
  const round = solutionRound

  sendToInterview('ai:status', { state: 'loading', mode })
  sendToInterview('ai:stream-start', { mode, round })

  try {
    const { content, status } = await runStreamSolve(
      active,
      mode,
      screenshotUrls,
      transcriptForSolve,
      {
        onChunk: (_delta, full) => {
          sendToInterview('ai:stream-delta', { mode, round, delta: _delta, content: full })
        }
      }
    )

    if (hasScreenshots && status === 'solved') {
      takeScreenshotQueueForSolve()
    }

    if (status === 'solved') {
      if (recordingActive) {
        markTranscriptCheckpoint()
      } else {
        clearTranscript()
      }
    }
    broadcastScreenshotQueue()
    broadcastTranscript(false)

    sendToInterview('ai:stream-done', { mode, round, content, status })

    const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1)
    sendToInterview('ai:status', {
      state: 'idle',
      message:
        status === 'waiting'
          ? 'Could not detect a question — capture again with Ctrl+Shift+S or Ctrl+Shift+R.'
          : recordingActive
            ? `${mode === 'fast' ? 'Quick' : 'Deep'} answer in ${elapsedSec}s · still recording (Ctrl+Shift+R to stop)`
            : mode === 'fast'
              ? `Quick answer in ${elapsedSec}s`
              : `Deep answer in ${elapsedSec}s`
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message.includes('aborted')) {
      sendToInterview('ai:status', { state: 'idle', message: 'Stopped.' })
      return
    }
    if (message === INPUT_REQUIRED_MSG) {
      sendToInterview('ai:status', { state: 'error', message: INPUT_REQUIRED_MSG })
      return
    }
    sendToInterview('ai:status', { state: 'error', message })
  }
}

async function handleHotkey(action: HotkeyAction): Promise<void> {
  const active = getActiveSession()

  switch (action) {
    case 'screenshot': {
      if (!active) return
      if (isScreenshotQueueFull()) {
        sendToInterview('screenshot:limit-reached')
        sendToInterview('ai:status', {
          state: 'error',
          message: `Screenshot limit reached (max ${MAX_SCREENSHOTS}). Run Quick answer to continue.`
        })
        return
      }
      const shot = await captureDisplay(active, 'fast')
      if (!shot) return
      sendToInterview('hotkey:action', action)
      sendToInterview('screenshot:captured', shot)
      broadcastScreenshotQueue()
      break
    }
    case 'fastSolve':
      await runSolve('fast')
      break
    case 'deepSolve':
      await runSolve('deep')
      break
    case 'stop':
      stopAiRequest()
      stopRecordingFlow()
      sendToInterview('ai:status', { state: 'idle', message: 'Stopped.' })
      break
    case 'toggleSidebar':
      sendToInterview('overlay:toggleSidebar')
      break
    case 'toggleRecording': {
      if (isRecording()) {
        stopRecordingFlow()
      } else {
        startRecordingFlow()
      }
      sendToInterview('hotkey:action', action)
      break
    }
    case 'scrollUp':
      scrollInterviewContent(-120)
      break
    case 'scrollDown':
      scrollInterviewContent(120)
      break
    case 'moveUp':
      moveInterviewWindow(0, -40)
      break
    case 'moveDown':
      moveInterviewWindow(0, 40)
      break
    case 'moveLeft':
      moveInterviewWindow(-40, 0)
      break
    case 'moveRight':
      moveInterviewWindow(40, 0)
      break
    case 'help':
      sendToInterview('overlay:toggleHelp')
      break
    case 'exit':
      await endInterviewSession()
      break
  }
}

function beginInterview(active: InterviewSession): void {
  solutionRound = 0
  hideMainWindow()
  createInterviewWindow()
  const failed = registerInterviewHotkeys(handleHotkey)
  sendToInterview('session:updated', active)
  sendToInterview('recording:status', { recording: isRecording() })
  broadcastScreenshotQueue()
  broadcastTranscript(false)
  if (failed.length > 0) {
    sendToInterview('hotkeys:failed', failed)
  }
  refreshTrayMenu()
}

function refreshTrayMenu(): void {
  if (!tray) return
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Home',
      click: () => showMainWindow()
    },
    {
      label: 'End Interview',
      enabled: !!getActiveSession(),
      click: () => void endInterviewSession()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ])
  tray.setContextMenu(contextMenu)
}

async function endInterviewSession(): Promise<void> {
  unregisterInterviewHotkeys()
  stopAiRequest()
  stopRecordingFlow()
  clearScreenshotBuffer()
  clearTranscript()
  clearConversation()
  solutionRound = 0
  endSession()
  destroyInterviewWindow()
  showMainWindow()
  refreshTrayMenu()
}

function setupTray(): void {
  const iconPath = path.join(__dirname, '../../resources/icon.png')
  let trayIcon = nativeImage.createFromPath(iconPath)
  if (trayIcon.isEmpty()) {
    trayIcon = nativeImage.createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJDAj8dSf9VAAAAAElFTkSuQmCC'
    )
  }

  tray = new Tray(trayIcon)
  tray.setToolTip('Kraken Interview')
  refreshTrayMenu()
  tray.on('click', () => showMainWindow())
}

function setupIpc(): void {
  ipcMain.handle('settings:get', () => getSettings())

  ipcMain.handle('settings:save', (_event, partial) => saveSettings(partial))

  ipcMain.handle('privacy:export-local-data', () => ({
    settings: getSettings(),
    resume: getResumeExport()
  }))

  ipcMain.handle('privacy:clear-local-data', () => {
    clearResume()
    return clearLocalUserData()
  })

  ipcMain.handle('resume:get', () => getResumeInfo())

  ipcMain.handle('resume:upload', async (_event, payload: { fileName: string; base64: string }) => {
    const buffer = Buffer.from(payload.base64, 'base64')
    if (buffer.length > MAX_RESUME_UPLOAD_BYTES) {
      throw new Error('Resume file is too large (max 10 MB).')
    }
    const text = await extractResumeText(payload.fileName, buffer)
    const saved = saveResume(payload.fileName, text)
    return (
      getResumeInfo() ?? {
        fileName: saved.fileName,
        uploadedAt: saved.uploadedAt,
        characterCount: saved.text.length,
        preview: saved.text.slice(0, 280)
      }
    )
  })

  ipcMain.handle('resume:clear', () => {
    clearResume()
  })

  ipcMain.handle('displays:list', () => listDisplays())

  ipcMain.handle('session:start', async (_event, config: InterviewSessionStartConfig) => {
    let jobDescriptionText: string | undefined
    let jobDescriptionUrl: string | undefined

    if (config.jobDescriptionUrl?.trim()) {
      jobDescriptionUrl = normalizeJobDescriptionUrl(config.jobDescriptionUrl)
      jobDescriptionText = await scrapeJobDescription(jobDescriptionUrl)
    }

    const active = startSession({
      ...config,
      jobDescriptionUrl,
      jobDescriptionText
    })
    beginInterview(active)
    return active
  })

  ipcMain.handle('session:end', () => {
    void endInterviewSession()
  })

  ipcMain.handle('session:get', () => getActiveSession())

  ipcMain.handle('session:new', () => {
    const active = newSessionFromActive()
    clearScreenshotBuffer()
    broadcastScreenshotQueue()
    stopRecordingFlow()
    clearTranscript()
    clearConversation()
    solutionRound = 0
    broadcastTranscript(false)
    return active
  })

  ipcMain.handle('screenshot:capture', async () => {
    const active = getActiveSession()
    if (!active || isScreenshotQueueFull()) return null
    return captureDisplay(active, 'fast')
  })

  ipcMain.handle('screenshot:queue', () => getScreenshotQueue())

  ipcMain.handle('ai:solve', async (_event, mode: SolveMode) => {
    try {
      await runSolve(mode)
      return { ok: true as const }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { ok: false as const, error: message }
    }
  })

  ipcMain.handle('ai:stop', () => {
    stopAiRequest()
    stopRecordingFlow()
    sendToInterview('ai:status', { state: 'idle', message: 'Stopped.' })
  })

  ipcMain.handle('recording:toggle', () => {
    if (isRecording()) {
      stopRecordingFlow()
    } else {
      startRecordingFlow()
    }
    return { recording: isRecording() }
  })

  ipcMain.handle(
    'recording:submit-chunk',
    async (_event, base64: string, mimeType: string, source?: 'system' | 'microphone') => {
      try {
        await handleRecordingChunk(base64, mimeType, source ?? 'system')
        return { ok: true as const }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Transcription failed'
        return { ok: false as const, error: message }
      }
    }
  )

  ipcMain.handle('recording:report-error', (_event, message: string) => {
    stopRecordingFlow()
    sendToInterview('ai:status', { state: 'error', message })
  })

  ipcMain.handle('recording:set-source', (_event, source: 'system' | 'microphone' | 'both') => {
    sendToInterview('recording:source', { source })
  })

  ipcMain.handle('subscription:open', () => {
    openSubscriptionUrl(getSettings().subscriptionUrl)
  })

  ipcMain.handle('ai:followUp', async (_event, question: string, mode: SolveMode) => {
    const active = getActiveSession()
    if (!active) {
      return { ok: false as const, error: 'No active interview session.' }
    }

    solutionRound += 1
    const round = solutionRound

    try {
      sendToInterview('ai:status', { state: 'loading', mode })
      sendToInterview('ai:stream-start', { mode, round })

      const { content, status } = await runStreamFollowUp(question, active, mode, {
        onChunk: (_delta, full) => {
          sendToInterview('ai:stream-delta', { mode, round, delta: _delta, content: full })
        }
      })

      sendToInterview('ai:stream-done', { mode, round, content, status })
      sendToInterview('ai:status', { state: 'idle' })
      return { ok: true as const }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      sendToInterview('ai:status', { state: 'error', message })
      return { ok: false as const, error: message }
    }
  })

  ipcMain.handle('hotkeys:list', () => listHotkeyBindings())
}

export function bootstrapApp(): void {
  const gotLock = app.requestSingleInstanceLock()
  if (!gotLock) {
    app.quit()
    return
  }

  app.on('second-instance', () => {
    showMainWindow()
  })

  app.whenReady().then(() => {
    setupDisplayMediaHandler()

    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      callback(permission === 'media' || permission === 'display-capture')
    })
    session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
      return permission === 'media' || permission === 'display-capture'
    })

    setupIpc()
    createMainWindow()
    try {
      setupTray()
    } catch {
      // Tray icon optional if resources missing in dev
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
  })

  app.on('will-quit', () => {
    unregisterInterviewHotkeys()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}

bootstrapApp()
