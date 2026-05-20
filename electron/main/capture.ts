import { desktopCapturer, screen } from 'electron'
import type { InterviewSession, ScreenshotBuffer, SolveMode } from '../../shared/types'

let lastScreenshot: ScreenshotBuffer | null = null

const FAST_MAX_WIDTH = 1024
const FAST_MAX_HEIGHT = 576
const FAST_JPEG_QUALITY = 65
const DEEP_MAX_WIDTH = 1280
const DEEP_MAX_HEIGHT = 720
const DEEP_JPEG_QUALITY = 60

export function getLastScreenshot(): ScreenshotBuffer | null {
  return lastScreenshot
}

export function clearScreenshotBuffer(): void {
  lastScreenshot = null
}

function captureLimits(mode: SolveMode): { width: number; height: number; quality: number } {
  if (mode === 'fast') {
    return { width: FAST_MAX_WIDTH, height: FAST_MAX_HEIGHT, quality: FAST_JPEG_QUALITY }
  }
  return { width: DEEP_MAX_WIDTH, height: DEEP_MAX_HEIGHT, quality: DEEP_JPEG_QUALITY }
}

export async function captureDisplay(
  session: InterviewSession,
  mode: SolveMode = 'deep'
): Promise<ScreenshotBuffer | null> {
  const display = screen.getAllDisplays().find((d) => String(d.id) === session.displayId)
  if (!display) return null

  const limits = captureLimits(mode)
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: Math.min(display.bounds.width, limits.width),
      height: Math.min(display.bounds.height, limits.height)
    }
  })

  const source =
    sources.find((s) => s.display_id === String(display.id)) ??
    sources.find((s) => s.id.toLowerCase().includes('screen')) ??
    sources[0]

  if (!source) return null

  const jpeg = source.thumbnail.toJPEG(limits.quality)
  const dataUrl = `data:image/jpeg;base64,${jpeg.toString('base64')}`
  lastScreenshot = { dataUrl, capturedAt: Date.now() }
  return lastScreenshot
}

export async function ensureScreenshot(
  session: InterviewSession,
  mode: SolveMode = 'deep'
): Promise<ScreenshotBuffer | null> {
  const fresh =
    lastScreenshot && Date.now() - lastScreenshot.capturedAt < 30_000 ? lastScreenshot : null

  if (mode === 'deep') {
    return captureDisplay(session, 'deep')
  }

  if (fresh) return fresh

  return captureDisplay(session, 'fast')
}

export function listDisplays(): Array<{ id: string; label: string; primary: boolean }> {
  const primaryId = screen.getPrimaryDisplay().id
  return screen.getAllDisplays().map((d, index) => ({
    id: String(d.id),
    label: `Display ${index + 1} (${d.bounds.width}x${d.bounds.height})${d.id === primaryId ? ' [Primary]' : ''}`,
    primary: d.id === primaryId
  }))
}
