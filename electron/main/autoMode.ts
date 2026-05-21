import type { InterviewSession, ScreenshotBuffer } from '../../shared/types'
import {
  captureDisplayPreview,
  replaceScreenshotQueue,
  screenshotFingerprintsSimilar
} from './capture'
import { getRecordingTranscript } from './recording'
import { getActiveSession } from './session'

const AUTO_SCREENSHOT_INTERVAL_MS = 5000
const AUTO_MIN_SOLVE_INTERVAL_MS = 10_000
const MIN_TRANSCRIPT_TOTAL_CHARS = 15
const MIN_TRANSCRIPT_DELTA_CHARS = 30
const MIN_TRANSCRIPT_DELTA_WORDS = 5

const NOISE_FRAGMENT =
  /^(thanks?|thank you|okay|ok|yeah|yes|no|um+|uh+|hmm+|you|the|and|so|well|right|like|just|oh+|hi+|hello|bye|please|sorry)\.?$/i

let intervalId: ReturnType<typeof setInterval> | null = null
let lastScreenshotFingerprint: string | null = null
let lastAutoSolveTranscript = ''
let lastAutoSolveAt = 0
let solveInFlight = false
let pendingScreenshotChange = false
let pendingTranscriptChange = false
let retryTimeoutId: ReturnType<typeof setTimeout> | null = null

type AutoModeDeps = {
  runDeepSolve: () => Promise<boolean>
  onScreenshotCaptured: (shot: ScreenshotBuffer) => void
  broadcastScreenshotQueue: () => void
}

let deps: AutoModeDeps | null = null

export function configureAutoMode(next: AutoModeDeps): void {
  deps = next
}

export function isAutoModeSession(session: InterviewSession | null | undefined): boolean {
  return session?.interviewMode === 'auto'
}

export function startAutoMode(): void {
  stopAutoMode()
  lastScreenshotFingerprint = null
  lastAutoSolveTranscript = getRecordingTranscript().trim()
  lastAutoSolveAt = 0
  pendingScreenshotChange = false
  pendingTranscriptChange = false
  void tickAutoScreenshot()
  intervalId = setInterval(() => void tickAutoScreenshot(), AUTO_SCREENSHOT_INTERVAL_MS)
}

export function stopAutoMode(): void {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (retryTimeoutId) {
    clearTimeout(retryTimeoutId)
    retryTimeoutId = null
  }
  lastScreenshotFingerprint = null
  lastAutoSolveTranscript = ''
  lastAutoSolveAt = 0
  solveInFlight = false
  pendingScreenshotChange = false
  pendingTranscriptChange = false
}

export function resetAutoModeState(): void {
  lastScreenshotFingerprint = null
  lastAutoSolveTranscript = getRecordingTranscript().trim()
  lastAutoSolveAt = 0
  solveInFlight = false
  pendingScreenshotChange = false
  pendingTranscriptChange = false
}

function getTranscriptDelta(baseline: string, current: string): string {
  const normalizedBaseline = baseline.trim()
  const normalizedCurrent = current.trim()
  if (!normalizedCurrent) return ''
  if (!normalizedBaseline) return normalizedCurrent
  if (normalizedCurrent.startsWith(normalizedBaseline)) {
    return normalizedCurrent.slice(normalizedBaseline.length).trim()
  }
  if (normalizedBaseline.startsWith(normalizedCurrent)) return ''
  return normalizedCurrent
}

function countMeaningfulWords(text: string): number {
  return text
    .split(/\s+/)
    .map((word) => word.replace(/^[^\w]+|[^\w]+$/g, ''))
    .filter((word) => word.length > 2 && !NOISE_FRAGMENT.test(word)).length
}

export function hasSignificantTranscriptChange(baseline: string): boolean {
  const current = getRecordingTranscript().trim()
  if (current.length < MIN_TRANSCRIPT_TOTAL_CHARS) return false

  const delta = getTranscriptDelta(baseline, current)
  if (delta.length < MIN_TRANSCRIPT_DELTA_CHARS) return false
  if (countMeaningfulWords(delta) < MIN_TRANSCRIPT_DELTA_WORDS) return false

  return true
}

export function notifyAutoTranscriptChange(): void {
  const active = getActiveSession()
  if (!active || !isAutoModeSession(active) || !deps) return
  if (!hasSignificantTranscriptChange(lastAutoSolveTranscript)) return

  pendingTranscriptChange = true
  void tryScheduleAutoDeepSolve()
}

async function tickAutoScreenshot(): Promise<void> {
  const active = getActiveSession()
  if (!active || !isAutoModeSession(active) || !deps) return

  const preview = await captureDisplayPreview(active)
  if (!preview || !preview.fingerprint) return

  if (lastScreenshotFingerprint === null) {
    lastScreenshotFingerprint = preview.fingerprint
    return
  }

  if (screenshotFingerprintsSimilar(lastScreenshotFingerprint, preview.fingerprint)) {
    return
  }

  lastScreenshotFingerprint = preview.fingerprint
  replaceScreenshotQueue(preview.shot)
  deps.onScreenshotCaptured(preview.shot)
  deps.broadcastScreenshotQueue()
  pendingScreenshotChange = true
  void tryScheduleAutoDeepSolve()
}

function canRunAutoSolveNow(): boolean {
  if (!pendingScreenshotChange && !pendingTranscriptChange) return false
  if (pendingTranscriptChange && !hasSignificantTranscriptChange(lastAutoSolveTranscript)) {
    pendingTranscriptChange = false
    return pendingScreenshotChange
  }
  return true
}

function scheduleRetry(delayMs: number): void {
  if (retryTimeoutId) return
  retryTimeoutId = setTimeout(() => {
    retryTimeoutId = null
    void tryScheduleAutoDeepSolve()
  }, delayMs)
}

async function tryScheduleAutoDeepSolve(): Promise<void> {
  if (!deps) return
  if (solveInFlight) return
  if (!canRunAutoSolveNow()) return

  const elapsed = Date.now() - lastAutoSolveAt
  if (lastAutoSolveAt > 0 && elapsed < AUTO_MIN_SOLVE_INTERVAL_MS) {
    scheduleRetry(AUTO_MIN_SOLVE_INTERVAL_MS - elapsed)
    return
  }

  pendingScreenshotChange = false
  pendingTranscriptChange = false

  solveInFlight = true
  try {
    const solved = await deps.runDeepSolve()
    lastAutoSolveAt = Date.now()
    if (solved) {
      lastAutoSolveTranscript = getRecordingTranscript().trim()
    }
  } finally {
    solveInFlight = false
    if (pendingScreenshotChange || pendingTranscriptChange) {
      void tryScheduleAutoDeepSolve()
    }
  }
}
