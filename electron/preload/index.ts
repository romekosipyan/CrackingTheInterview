import { contextBridge, ipcRenderer } from 'electron'
import type {
  AppSettings,
  HotkeyAction,
  InterviewSession,
  SolveMode,
  SolveResponse,
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
    start: (
      config: Omit<InterviewSession, 'sessionId' | 'startedAt'>
    ): Promise<InterviewSession> => ipcRenderer.invoke('session:start', config),
    end: (): Promise<void> => ipcRenderer.invoke('session:end'),
    get: (): Promise<InterviewSession | null> => ipcRenderer.invoke('session:get'),
    new: (): Promise<InterviewSession | null> => ipcRenderer.invoke('session:new')
  },
  screenshot: {
    capture: (): Promise<ScreenshotBuffer | null> => ipcRenderer.invoke('screenshot:capture')
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
      mimeType: string
    ): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke('recording:submit-chunk', base64, mimeType),
    reportError: (message: string): Promise<void> => ipcRenderer.invoke('recording:report-error', message),
    setSource: (source: 'system' | 'microphone'): Promise<void> =>
      ipcRenderer.invoke('recording:set-source', source)
  },
  subscription: {
    open: (): Promise<void> => ipcRenderer.invoke('subscription:open')
  },
  hotkeys: {
    list: (): Promise<Record<HotkeyAction, string>> => ipcRenderer.invoke('hotkeys:list')
  },
  on: (
    channel:
      | 'hotkey:action'
      | 'ai:status'
      | 'ai:result'
      | 'session:updated'
      | 'recording:status'
      | 'recording:transcript'
      | 'recording:control'
      | 'recording:source'
      | 'overlay:toggleSidebar'
      | 'overlay:toggleHelp'
      | 'overlay:scroll'
      | 'screenshot:captured'
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
