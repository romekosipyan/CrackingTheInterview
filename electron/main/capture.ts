import { desktopCapturer, nativeImage, screen } from 'electron'
import type { InterviewSession, ScreenshotBuffer, SolveMode } from '../../shared/types'
import { MAX_SCREENSHOTS } from '../../shared/types'

const screenshotQueue: ScreenshotBuffer[] = []

const CAPTURE_MAX_WIDTH = 1280
const CAPTURE_MAX_HEIGHT = 720
const CAPTURE_JPEG_QUALITY = 70
const FINGERPRINT_WIDTH = 33
const FINGERPRINT_HEIGHT = 32

export type ScreenshotPreview = {
  shot: ScreenshotBuffer
  fingerprint: string
}

/** Difference hash — stable across JPEG recompression of the same screen content. */
export function computeScreenshotFingerprint(jpegBuffer: Buffer): string {
  const image = nativeImage.createFromBuffer(jpegBuffer)
  if (image.isEmpty()) return ''

  const resized = image.resize({
    width: FINGERPRINT_WIDTH,
    height: FINGERPRINT_HEIGHT,
    quality: 'best'
  })
  const bitmap = resized.toBitmap()
  const gray: number[] = []

  for (let i = 0; i < bitmap.length; i += 4) {
    gray.push((bitmap[i + 2]! + bitmap[i + 1]! + bitmap[i]!) / 3)
  }

  let hash = ''
  for (let y = 0; y < FINGERPRINT_HEIGHT; y++) {
    for (let x = 0; x < FINGERPRINT_WIDTH - 1; x++) {
      const left = gray[y * FINGERPRINT_WIDTH + x]!
      const right = gray[y * FINGERPRINT_WIDTH + x + 1]!
      hash += left < right ? '1' : '0'
    }
  }

  return hash
}

export function screenshotFingerprintsSimilar(
  previous: string | null,
  next: string,
  maxHammingDistance = 12
): boolean {
  if (!previous || !next || previous.length !== next.length) return false

  let distance = 0
  for (let i = 0; i < previous.length; i++) {
    if (previous[i] !== next[i]) distance++
    if (distance > maxHammingDistance) return false
  }

  return true
}

export function getScreenshotQueue(): ScreenshotBuffer[] {
  return [...screenshotQueue]
}

export function getLastScreenshot(): ScreenshotBuffer | null {
  return screenshotQueue.at(-1) ?? null
}

export function clearScreenshotBuffer(): void {
  screenshotQueue.length = 0
}

export function takeScreenshotQueueForSolve(): ScreenshotBuffer[] {
  const queue = [...screenshotQueue]
  screenshotQueue.length = 0
  return queue
}

export function isScreenshotQueueFull(): boolean {
  return screenshotQueue.length >= MAX_SCREENSHOTS
}

export function replaceScreenshotQueue(shot: ScreenshotBuffer): void {
  screenshotQueue.length = 0
  screenshotQueue.push(shot)
}

export async function captureDisplayPreview(
  session: InterviewSession
): Promise<ScreenshotPreview | null> {
  const display = screen.getAllDisplays().find((d) => String(d.id) === session.displayId)
  if (!display) return null

  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: Math.min(display.bounds.width, CAPTURE_MAX_WIDTH),
      height: Math.min(display.bounds.height, CAPTURE_MAX_HEIGHT)
    }
  })

  const source =
    sources.find((s) => s.display_id === String(display.id)) ??
    sources.find((s) => s.id.toLowerCase().includes('screen')) ??
    sources[0]

  if (!source) return null

  const jpeg = source.thumbnail.toJPEG(CAPTURE_JPEG_QUALITY)
  const dataUrl = `data:image/jpeg;base64,${jpeg.toString('base64')}`
  const shot: ScreenshotBuffer = { dataUrl, capturedAt: Date.now() }
  const fingerprint = computeScreenshotFingerprint(jpeg)
  return { shot, fingerprint }
}

export async function captureDisplay(
  session: InterviewSession,
  _mode: SolveMode = 'fast'
): Promise<ScreenshotBuffer | null> {
  if (isScreenshotQueueFull()) return null

  const display = screen.getAllDisplays().find((d) => String(d.id) === session.displayId)
  if (!display) return null

  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: Math.min(display.bounds.width, CAPTURE_MAX_WIDTH),
      height: Math.min(display.bounds.height, CAPTURE_MAX_HEIGHT)
    }
  })

  const source =
    sources.find((s) => s.display_id === String(display.id)) ??
    sources.find((s) => s.id.toLowerCase().includes('screen')) ??
    sources[0]

  if (!source) return null

  const jpeg = source.thumbnail.toJPEG(CAPTURE_JPEG_QUALITY)
  const dataUrl = `data:image/jpeg;base64,${jpeg.toString('base64')}`
  const shot: ScreenshotBuffer = { dataUrl, capturedAt: Date.now() }
  screenshotQueue.push(shot)
  return shot
}

export function listDisplays(): Array<{ id: string; label: string; primary: boolean }> {
  const primaryId = screen.getPrimaryDisplay().id
  return screen.getAllDisplays().map((d, index) => ({
    id: String(d.id),
    label: `Display ${index + 1} (${d.bounds.width}x${d.bounds.height})${d.id === primaryId ? ' [Primary]' : ''}`,
    primary: d.id === primaryId
  }))
}
