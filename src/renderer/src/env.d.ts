import type { PreloadApi } from '../../../electron/preload/index'
import type {
  AppSettings,
  HotkeyAction,
  InterviewSession,
  SolveMode,
  SolveResponse,
  ScreenshotBuffer
} from '../../../shared/types'

declare global {
  interface Window {
    api: PreloadApi
  }
}

export type { AppSettings, HotkeyAction, InterviewSession, SolveMode, SolveResponse, ScreenshotBuffer }
