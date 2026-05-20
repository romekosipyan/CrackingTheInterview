let recording = false
let transcript = ''
let pendingTranscriptions = 0

export function isRecording(): boolean {
  return recording
}

export function setRecording(value: boolean): void {
  recording = value
}

export function getRecordingTranscript(): string {
  return transcript
}

export function clearTranscript(): void {
  transcript = ''
}

export function appendTranscript(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return transcript
  transcript = transcript ? `${transcript} ${trimmed}` : trimmed
  return transcript
}

export function beginTranscription(): void {
  pendingTranscriptions += 1
}

export function endTranscription(): void {
  pendingTranscriptions = Math.max(0, pendingTranscriptions - 1)
}

export async function waitForTranscriptionIdle(timeoutMs = 20000): Promise<void> {
  const startedAt = Date.now()
  while (pendingTranscriptions > 0 && Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

export function stopRecording(): void {
  recording = false
}
