import { contextBridge, ipcRenderer } from 'electron'
import type {
  AppSettings,
  HotkeyAction,
  InterviewSession,
  InterviewSessionStartConfig,
  SolveMode,
  ScreenshotBuffer
} from '../../shared/types'

const api = {
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
    save: (partial: Partial<AppSettings>): Promise<AppSettings> =>
      ipcRenderer.invoke('settings:save', partial)
  },
  displays: {
    list: (): Promise<Array<{ id: string; label: string; primary: boolean }>> =>
      ipcRenderer.invoke('displays:list')
  },
  session: {
    start: (config: InterviewSessionStartConfig): Promise<InterviewSession> =>
      ipcRenderer.invoke('session:start', config),
    end: (): Promise<void> => ipcRenderer.invoke('session:end'),
    get: (): Promise<InterviewSession | null> => ipcRenderer.invoke('session:get'),
    new: (): Promise<InterviewSession | null> => ipcRenderer.invoke('session:new'),
    lastRoundCount: (): Promise<number> => ipcRenderer.invoke('session:lastRoundCount')
  },
  screenshot: {
    capture: (): Promise<ScreenshotBuffer | null> => ipcRenderer.invoke('screenshot:capture'),
    queue: (): Promise<ScreenshotBuffer[]> => ipcRenderer.invoke('screenshot:queue')
  },
  ai: {
    solve: (mode: SolveMode): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke('ai:solve', mode),
    followUp: (
      question: string,
      mode: SolveMode
    ): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke('ai:followUp', question, mode),
    stop: (): Promise<void> => ipcRenderer.invoke('ai:stop')
  },
  recording: {
    toggle: (): Promise<{ recording: boolean }> => ipcRenderer.invoke('recording:toggle'),
    submitChunk: (
      base64: string,
      mimeType: string,
      source?: 'system' | 'microphone'
    ): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke('recording:submit-chunk', base64, mimeType, source),
    reportError: (message: string): Promise<void> => ipcRenderer.invoke('recording:report-error', message),
    setSource: (source: 'system' | 'microphone' | 'both'): Promise<void> =>
      ipcRenderer.invoke('recording:set-source', source)
  },
  subscription: {
    open: (): Promise<void> => ipcRenderer.invoke('subscription:open'),
    activate: (): Promise<import('../../shared/deviceRegistration').DeviceActivationResult> =>
      ipcRenderer.invoke('subscription:activate'),
    getStatus: (): Promise<import('../../shared/deviceRegistration').DeviceActivationResult> =>
      ipcRenderer.invoke('subscription:get-status'),
    getMachineId: (): Promise<string> => ipcRenderer.invoke('subscription:get-machine-id')
  },
  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),
    checkForUpdates: (): Promise<import('../../shared/appVersion').AppUpdateCheckResult> =>
      ipcRenderer.invoke('app:check-updates'),
    downloadUpdate: (
      downloadUrl?: string
    ): Promise<import('../../shared/appVersion').AppUpdateDownloadResult> =>
      ipcRenderer.invoke('app:download-update', downloadUrl),
    installUpdate: (
      installerPath?: string
    ): Promise<import('../../shared/appVersion').AppUpdateInstallResult> =>
      ipcRenderer.invoke('app:install-update', installerPath)
  },
  privacy: {
    exportLocalData: (): Promise<Record<string, unknown>> =>
      ipcRenderer.invoke('privacy:export-local-data'),
    clearLocalData: (): Promise<AppSettings> => ipcRenderer.invoke('privacy:clear-local-data')
  },
  resume: {
    get: (): Promise<{
      fileName: string
      uploadedAt: number
      characterCount: number
      preview: string
    } | null> => ipcRenderer.invoke('resume:get'),
    upload: (payload: {
      fileName: string
      base64: string
    }): Promise<{
      fileName: string
      uploadedAt: number
      characterCount: number
      preview: string
    }> => ipcRenderer.invoke('resume:upload', payload),
    clear: (): Promise<void> => ipcRenderer.invoke('resume:clear')
  },
  hotkeys: {
    list: (): Promise<Record<HotkeyAction, string>> => ipcRenderer.invoke('hotkeys:list')
  },
  shell: {
    close: (): Promise<void> => ipcRenderer.invoke('shell:close'),
    openExternal: (url: string): Promise<void> => ipcRenderer.invoke('shell:openExternal', url)
  },
  openExternal: (url: string): Promise<void> => ipcRenderer.invoke('shell:openExternal', url),
  on: (
    channel:
      | 'hotkey:action'
      | 'ai:status'
      | 'ai:stream-start'
      | 'ai:stream-delta'
      | 'ai:stream-done'
      | 'session:updated'
      | 'recording:status'
      | 'recording:transcript'
      | 'recording:control'
      | 'recording:source'
      | 'overlay:toggleSidebar'
      | 'overlay:toggleHelp'
      | 'overlay:scroll'
      | 'screenshot:captured'
      | 'screenshot:queue-updated'
      | 'screenshot:limit-reached'
      | 'hotkeys:failed',
    listener: (...args: unknown[]) => void
  ) => {
    const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) =>
      listener(...args)
    ipcRenderer.on(channel, subscription)
    return () => ipcRenderer.removeListener(channel, subscription)
  }
}

contextBridge.exposeInMainWorld('api', api)

export type PreloadApi = typeof api
