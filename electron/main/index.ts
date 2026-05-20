import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, session } from 'electron'
import path from 'path'
import { stopAiRequest, solveFromScreenshot, solveFollowUp, clearConversation } from './ai/client'
import { transcribeAudio } from './ai/transcribe'
import { captureDisplay, clearScreenshotBuffer, ensureScreenshot, listDisplays } from './capture'
import { setupDisplayMediaHandler } from './displayMedia'
import { registerInterviewHotkeys, unregisterInterviewHotkeys, listHotkeyBindings } from './hotkeys/registry'
import {
  appendTranscript,
  beginTranscription,
  clearTranscript,
  endTranscription,
  getRecordingTranscript,
  isRecording,
  setRecording,
  stopRecording,
  waitForTranscriptionIdle
} from './recording'
import { endSession, getActiveSession, newSessionFromActive, startSession } from './session'
import { getSettings, saveSettings } from './store'
import type { HotkeyAction, InterviewSession, SolveMode } from '../../shared/types'
import {
  createInterviewWindow,
  createMainWindow,
  destroyInterviewWindow,
  getInterviewWindow,
  hideMainWindow,
  moveInterviewWindow,
  openSubscriptionUrl,
  scrollInterviewContent,
  sendToInterview,
  showMainWindow,
  toggleInterviewWindow
} from './windows'

let tray: Tray | null = null

function broadcastTranscript(transcribing: boolean): void {
  sendToInterview('recording:transcript', {
    transcript: getRecordingTranscript(),
    transcribing
  })
}

function startRecordingFlow(): void {
  clearTranscript()
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

async function finalizeRecording(): Promise<void> {
  if (isRecording()) {
    stopRecordingFlow()
  }
  await waitForTranscriptionIdle()
}

async function handleRecordingChunk(base64: string, mimeType: string): Promise<void> {
  beginTranscription()
  broadcastTranscript(true)

  try {
    const audio = Buffer.from(base64, 'base64')
    const session = getActiveSession()
    const text = await transcribeAudio(audio, mimeType, session?.interviewLanguage)
    appendTranscript(text)
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
  const session = getActiveSession()
  if (!session) return

  const startedAt = Date.now()
  sendToInterview('ai:status', { state: 'loading', mode })

  try {
    await finalizeRecording()

    const transcript = getRecordingTranscript()
    const screenshot = await ensureScreenshot(session, mode)
    if (!screenshot && !transcript) {
      sendToInterview('ai:status', {
        state: 'error',
        message: 'Capture a screenshot (Alt+S) or record the question (Alt+B) first.'
      })
      return
    }

    const result = await solveFromScreenshot(
      screenshot?.dataUrl ?? '',
      session.programmingLanguage,
      session.interviewLanguage,
      mode,
      transcript || undefined
    )

    const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1)
    sendToInterview('ai:result', result)
    sendToInterview('ai:status', {
      state: 'idle',
      message:
        result.status === 'waiting'
          ? 'No question detected — waiting for problem.'
          : mode === 'fast'
            ? `Fast solve in ${elapsedSec}s`
            : `Deep solve in ${elapsedSec}s`
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message.includes('aborted')) {
      sendToInterview('ai:status', { state: 'idle', message: 'Stopped.' })
      return
    }
    sendToInterview('ai:status', { state: 'error', message })
  }
}

async function handleHotkey(action: HotkeyAction): Promise<void> {
  const session = getActiveSession()

  switch (action) {
    case 'screenshot': {
      if (!session) return
      const shot = await captureDisplay(session, 'fast')
      sendToInterview('hotkey:action', action)
      sendToInterview('screenshot:captured', shot)
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
    case 'newSession': {
      const next = newSessionFromActive()
      clearScreenshotBuffer()
      stopRecordingFlow()
      clearTranscript()
      clearConversation()
      broadcastTranscript(false)
      if (next) sendToInterview('session:updated', next)
      sendToInterview('hotkey:action', action)
      break
    }
    case 'toggleApp':
      toggleInterviewWindow()
      sendToInterview('hotkey:action', action)
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
      scrollInterviewContent(-80)
      break
    case 'scrollDown':
      scrollInterviewContent(80)
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

function beginInterview(session: InterviewSession): void {
  hideMainWindow()
  createInterviewWindow()
  const failed = registerInterviewHotkeys(handleHotkey)
  sendToInterview('session:updated', session)
  sendToInterview('recording:status', { recording: isRecording() })
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
  tray.setToolTip('CrackingTheInterview')
  refreshTrayMenu()
  tray.on('click', () => showMainWindow())
}

function setupIpc(): void {
  ipcMain.handle('settings:get', () => getSettings())

  ipcMain.handle('settings:save', (_event, partial) => saveSettings(partial))

  ipcMain.handle('displays:list', () => listDisplays())

  ipcMain.handle('session:start', (_event, config) => {
    const session = startSession(config)
    beginInterview(session)
    return session
  })

  ipcMain.handle('session:end', () => {
    void endInterviewSession()
  })

  ipcMain.handle('session:get', () => getActiveSession())

  ipcMain.handle('session:new', () => {
    const session = newSessionFromActive()
    clearScreenshotBuffer()
    stopRecordingFlow()
    clearTranscript()
    broadcastTranscript(false)
    return session
  })

  ipcMain.handle('screenshot:capture', async () => {
    const session = getActiveSession()
    if (!session) return null
    return captureDisplay(session, 'fast')
  })

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

  ipcMain.handle('recording:submit-chunk', async (_event, base64: string, mimeType: string) => {
    try {
      await handleRecordingChunk(base64, mimeType)
      return { ok: true as const }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transcription failed'
      return { ok: false as const, error: message }
    }
  })

  ipcMain.handle('recording:report-error', (_event, message: string) => {
    stopRecordingFlow()
    sendToInterview('ai:status', { state: 'error', message })
  })

  ipcMain.handle('recording:set-source', (_event, source: 'system' | 'microphone') => {
    sendToInterview('recording:source', { source })
  })

  ipcMain.handle('subscription:open', () => {
    openSubscriptionUrl(getSettings().subscriptionUrl)
  })

  ipcMain.handle('ai:followUp', async (_event, question: string, mode: SolveMode) => {
    const session = getActiveSession()
    if (!session) {
      return { ok: false as const, error: 'No active interview session.' }
    }
    try {
      sendToInterview('ai:status', { state: 'loading', mode })
      const result = await solveFollowUp(
        question,
        session.programmingLanguage,
        session.interviewLanguage,
        mode
      )
      sendToInterview('ai:result', result)
      sendToInterview('ai:status', {
        state: 'idle',
        message: result.status === 'waiting' ? 'No question detected — waiting for problem.' : undefined
      })
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
