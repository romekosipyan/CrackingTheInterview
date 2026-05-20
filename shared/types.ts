export type SolveMode = 'fast' | 'deep'

export type InterviewCategory = 'coding' | 'general' | 'no-code'

export type SolveResponse = {
  status: 'waiting' | 'solved'
  problemSummary: string
  approach: string
  complexity: { time: string; space: string }
  code: { language: string; solution: string }
  edgeCases: string[]
  followUpQuestions: string[]
}

export type RoleCard = {
  id: string
  companyName: string
  roleTitle: string
  description: string
}

export type InterviewSession = {
  sessionId: string
  programmingLanguage: string
  interviewLanguage: string
  interviewCategory: InterviewCategory
  generalCategory?: string
  captureSource: 'entire-screen'
  displayId: string
  startedAt: number
  roleId?: string
  roleCompany?: string
  roleTitle?: string
}

export type SolutionRound = {
  round: number
  timestamp: string
  processType: SolveMode
  content: string
  status: 'streaming' | 'waiting' | 'solved'
}

export type AppSettings = {
  profile: { name: string; email: string }
  defaultProgrammingLanguage: string
  appLanguage: string
  subscriptionUrl: string
  legalAcceptedVersion: string
  legalAcceptedAt: number
  preferredDisplayId: string
}

export const LEGAL_VERSION = '1.1.0'

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
  | 'upgrade'
  | 'exit'

export const MAX_SCREENSHOTS = 3

export const GENERAL_INTERVIEW_CATEGORIES = [
  'Behavioral',
  'System Design',
  'Product Management',
  'Leadership & Management',
  'Problem Solving',
  'Communication',
  'Business Strategy',
  'Data Analysis',
  'Project Management',
  'Team Collaboration'
] as const

export type GeneralInterviewCategory = (typeof GENERAL_INTERVIEW_CATEGORIES)[number]

export const PROGRAMMING_LANGUAGES = [
  'General/No Code',
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'C',
  'C#',
  'Go',
  'Rust',
  'SQL',
  'Kotlin',
  'Swift',
  'Objective-C',
  'Dart',
  'Ruby',
  'PHP',
  'Scala',
  'R',
  'MATLAB',
  'Shell/Bash',
  'PowerShell',
  'WebAssembly'
] as const

export const INTERVIEW_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Chinese',
  'Chinese Traditional',
  'Japanese',
  'Korean',
  'Hindi',
  'Russian',
  'Italian',
  'Dutch',
  'Polish',
  'Turkish',
  'Vietnamese',
  'Swedish',
  'Ukrainian',
  'Arabic',
  'Hebrew'
] as const

export const INTERVIEW_LANGUAGE_WHISPER_CODES: Record<(typeof INTERVIEW_LANGUAGES)[number], string> = {
  English: 'en',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Portuguese: 'pt',
  Chinese: 'zh',
  'Chinese Traditional': 'zh',
  Japanese: 'ja',
  Korean: 'ko',
  Hindi: 'hi',
  Russian: 'ru',
  Italian: 'it',
  Dutch: 'nl',
  Polish: 'pl',
  Turkish: 'tr',
  Vietnamese: 'vi',
  Swedish: 'sv',
  Ukrainian: 'uk',
  Arabic: 'ar',
  Hebrew: 'he'
}

export function getWhisperLanguageCode(interviewLanguage: string): string | undefined {
  return INTERVIEW_LANGUAGE_WHISPER_CODES[
    interviewLanguage as (typeof INTERVIEW_LANGUAGES)[number]
  ]
}

export function isNonCodingLanguage(language: string): boolean {
  return language === 'General/No Code'
}

export function resolveInterviewCategory(
  programmingLanguage: string,
  generalCategory?: string
): InterviewCategory {
  if (programmingLanguage === 'General/No Code') {
    return generalCategory?.toLowerCase().includes('system design') ? 'general' : 'no-code'
  }
  return 'coding'
}

export const DEFAULT_SETTINGS: AppSettings = {
  profile: { name: '', email: '' },
  defaultProgrammingLanguage: 'Python',
  appLanguage: 'en',
  subscriptionUrl: 'https://example.com/subscription',
  legalAcceptedVersion: '',
  legalAcceptedAt: 0,
  preferredDisplayId: ''
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
  upgrade: 'Alt+U',
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
  upgrade: 'Upgrade',
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
  'screenshot:queue': () => ScreenshotBuffer[]
  'ai:solve': (mode: SolveMode) => { ok: true; data: SolveResponse } | { ok: false; error: string }
  'ai:followUp': (question: string, mode: SolveMode) => { ok: true } | { ok: false; error: string }
  'ai:stop': () => void
  'recording:toggle': () => { recording: boolean }
  'recording:submit-chunk': (
    base64: string,
    mimeType: string,
    source?: 'system' | 'microphone'
  ) => { ok: true } | { ok: false; error: string }
  'recording:report-error': (message: string) => void
  'recording:set-source': (source: 'system' | 'microphone' | 'both') => void
  'subscription:open': () => void
  'privacy:export-local-data': () => Record<string, unknown>
  'privacy:clear-local-data': () => AppSettings
  'resume:get': () => {
    fileName: string
    uploadedAt: number
    characterCount: number
    preview: string
  } | null
  'resume:upload': (payload: { fileName: string; base64: string }) => {
    fileName: string
    uploadedAt: number
    characterCount: number
    preview: string
  }
  'resume:clear': () => void
  'overlay:toggleSidebar': () => void
  'overlay:toggleHelp': () => void
  'overlay:scroll': (payload: { delta: number }) => void
  'hotkeys:list': () => Record<HotkeyAction, string>
}

export type RendererEvents = {
  'hotkey:action': HotkeyAction
  'ai:status': { state: 'idle' | 'loading' | 'error'; message?: string; mode?: SolveMode }
  'ai:stream-start': { mode: SolveMode; round: number }
  'ai:stream-delta': { mode: SolveMode; round: number; delta: string; content: string }
  'ai:stream-done': { mode: SolveMode; round: number; content: string; status: 'waiting' | 'solved' }
  'session:updated': InterviewSession
  'recording:status': { recording: boolean }
  'recording:transcript': { transcript: string; transcribing: boolean }
  'recording:control': { action: 'start' | 'stop' }
  'recording:source': { source: 'system' | 'microphone' | 'both' }
  'screenshot:captured': ScreenshotBuffer
  'screenshot:queue-updated': ScreenshotBuffer[]
  'screenshot:limit-reached': void
  'hotkeys:failed': string[]
}
