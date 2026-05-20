let recording = false
let systemTranscript = ''
let micTranscript = ''
let pendingTranscriptions = 0

export function isRecording(): boolean {
  return recording
}

export function setRecording(value: boolean): void {
  recording = value
}

export function getRecordingTranscript(): string {
  const parts = [systemTranscript.trim(), micTranscript.trim()].filter(Boolean)
  return parts.join(' ')
}

export function getSystemTranscript(): string {
  return systemTranscript
}

export function getMicTranscript(): string {
  return micTranscript
}

export function clearTranscript(): void {
  systemTranscript = ''
  micTranscript = ''
}

export function appendTranscript(text: string, source: 'system' | 'microphone' = 'system'): string {
  const trimmed = text.trim()
  if (!trimmed) return getRecordingTranscript()

  if (source === 'microphone') {
    micTranscript = micTranscript ? `${micTranscript} ${trimmed}` : trimmed
  } else {
    systemTranscript = systemTranscript ? `${systemTranscript} ${trimmed}` : trimmed
  }

  return getRecordingTranscript()
}

export function beginTranscription(): void {
  pendingTranscriptions += 1
}

export function endTranscription(): void {
  pendingTranscriptions = Math.max(0, pendingTranscriptions - 1)
}

export async function waitForTranscriptionIdle(timeoutMs = 25000): Promise<void> {
  const startedAt = Date.now()
  while (pendingTranscriptions > 0 && Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 80))
  }
}

export function stopRecording(): void {
  recording = false
}
