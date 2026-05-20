export type SolveMode = 'fast' | 'deep'

export type SolveResponse = {
  status: 'waiting' | 'solved'
  problemSummary: string
  approach: string
  complexity: { time: string; space: string }
  code: { language: string; solution: string }
  edgeCases: string[]
  followUpQuestions: string[]
}

export type InterviewSession = {
  sessionId: string
  programmingLanguage: string
  interviewLanguage: string
  captureSource: 'entire-screen'
  displayId: string
  startedAt: number
}

export type AppSettings = {
  profile: { name: string; email: string }
  defaultProgrammingLanguage: string
  appLanguage: string
  subscriptionUrl: string
  apiKey: string
  fastModel: string
  deepModel: string
  apiBaseUrl: string
  whisperModel: string
}

export type ScreenshotBuffer = {
  dataUrl: string
  capturedAt: number
}

export type HotkeyAction =
  | 'screenshot'
  | 'fastSolve'
  | 'deepSolve'
  | 'stop'
  | 'newSession'
  | 'toggleApp'
  | 'toggleSidebar'
  | 'toggleRecording'
  | 'scrollUp'
  | 'scrollDown'
  | 'moveUp'
  | 'moveDown'
  | 'moveLeft'
  | 'moveRight'
  | 'help'
  | 'exit'

export const PROGRAMMING_LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'C#',
  'Go',
  'Kotlin',
  'Swift',
  'Rust',
  'Ruby',
  'PHP'
] as const

export const INTERVIEW_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Hindi',
  'Arabic'
] as const

export const INTERVIEW_LANGUAGE_WHISPER_CODES: Record<(typeof INTERVIEW_LANGUAGES)[number], string> = {
  English: 'en',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Portuguese: 'pt',
  Chinese: 'zh',
  Japanese: 'ja',
  Korean: 'ko',
  Hindi: 'hi',
  Arabic: 'ar'
}

export function getWhisperLanguageCode(interviewLanguage: string): string | undefined {
  return INTERVIEW_LANGUAGE_WHISPER_CODES[
    interviewLanguage as (typeof INTERVIEW_LANGUAGES)[number]
  ]
}

export const DEFAULT_SETTINGS: AppSettings = {
  profile: { name: '', email: '' },
  defaultProgrammingLanguage: 'Python',
  appLanguage: 'en',
  subscriptionUrl: 'https://example.com/subscription',
  apiKey: '',
  fastModel: 'gpt-4o-mini',
  deepModel: 'gpt-4.1',
  apiBaseUrl: 'https://api.openai.com/v1',
  whisperModel: 'whisper-1'
}

export const HOTKEY_BINDINGS: Record<HotkeyAction, string> = {
  screenshot: 'Alt+S',
  fastSolve: 'Alt+Enter',
  deepSolve: 'Alt+Shift+Enter',
  stop: 'Alt+C',
  newSession: 'Alt+N',
  toggleApp: 'Alt+A',
  toggleSidebar: 'Alt+/',
  toggleRecording: 'Alt+B',
  scrollUp: 'Alt+Up',
  scrollDown: 'Alt+Down',
  moveUp: 'Alt+Shift+Up',
  moveDown: 'Alt+Shift+Down',
  moveLeft: 'Alt+Shift+Left',
  moveRight: 'Alt+Shift+Right',
  help: 'Alt+H',
  exit: 'Alt+Escape'
}

export const HOTKEY_LABELS: Record<HotkeyAction, string> = {
  screenshot: 'Screenshot',
  fastSolve: 'Fast Solve',
  deepSolve: 'Deep Solve',
  stop: 'Stop',
  newSession: 'Create Session',
  toggleApp: 'Toggle App',
  toggleSidebar: 'Toggle Sidebar',
  toggleRecording: 'Toggle Recording',
  scrollUp: 'Scroll Up',
  scrollDown: 'Scroll Down',
  moveUp: 'Move Up',
  moveDown: 'Move Down',
  moveLeft: 'Move Left',
  moveRight: 'Move Right',
  help: 'Help',
  exit: 'Exit'
}

export type IpcChannels = {
  'settings:get': () => AppSettings
  'settings:save': (settings: Partial<AppSettings>) => AppSettings
  'displays:list': () => Array<{ id: string; label: string; primary: boolean }>
  'session:start': (config: Omit<InterviewSession, 'sessionId' | 'startedAt'>) => InterviewSession
  'session:end': () => void
  'session:get': () => InterviewSession | null
  'session:new': () => InterviewSession | null
  'screenshot:capture': () => ScreenshotBuffer | null
  'ai:solve': (mode: SolveMode) => { ok: true; data: SolveResponse } | { ok: false; error: string }
  'ai:stop': () => void
  'recording:toggle': () => { recording: boolean }
  'recording:submit-chunk': (base64: string, mimeType: string) => { ok: true } | { ok: false; error: string }
  'recording:report-error': (message: string) => void
  'recording:set-source': (source: 'system' | 'microphone') => void
  'subscription:open': () => void
  'overlay:toggleSidebar': () => void
  'overlay:toggleHelp': () => void
  'overlay:scroll': (direction: 'up' | 'down') => void
}

export type RendererEvents = {
  'hotkey:action': HotkeyAction
  'ai:status': { state: 'idle' | 'loading' | 'error'; message?: string; mode?: SolveMode }
  'ai:result': SolveResponse
  'session:updated': InterviewSession
  'recording:status': { recording: boolean }
  'recording:transcript': { transcript: string; transcribing: boolean }
  'recording:control': { action: 'start' | 'stop' }
  'recording:source': { source: 'system' | 'microphone' }
  'screenshot:captured': ScreenshotBuffer
  'hotkeys:failed': string[]
}
