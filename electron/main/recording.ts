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
  const system = systemTranscript.trim()
  const mic = micTranscript.trim()

  // When system loopback is available it already captures the interview audio.
  // Avoid duplicating the same speech from the microphone stream.
  if (system) return system
  return mic
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

function mergeTranscriptChunk(existing: string, chunk: string): string {
  const trimmed = chunk.trim()
  if (!trimmed) return existing
  if (!existing) return trimmed

  const normalizedExisting = existing.toLowerCase()
  const normalizedChunk = trimmed.toLowerCase()
  if (
    normalizedExisting === normalizedChunk ||
    normalizedExisting.endsWith(` ${normalizedChunk}`) ||
    normalizedExisting.endsWith(normalizedChunk)
  ) {
    return existing
  }

  const existingWords = existing.split(/\s+/).filter(Boolean)
  const chunkWords = trimmed.split(/\s+/).filter(Boolean)

  for (let overlap = Math.min(existingWords.length, chunkWords.length, 12); overlap >= 1; overlap--) {
    const tail = existingWords.slice(-overlap).join(' ').toLowerCase()
    const head = chunkWords.slice(0, overlap).join(' ').toLowerCase()
    if (tail === head) {
      const rest = chunkWords.slice(overlap).join(' ')
      return rest ? `${existing} ${rest}` : existing
    }
  }

  return `${existing} ${trimmed}`
}

export function appendTranscript(text: string, source: 'system' | 'microphone' = 'system'): string {
  const trimmed = text.trim()
  if (!trimmed) return getRecordingTranscript()

  if (source === 'microphone') {
    micTranscript = mergeTranscriptChunk(micTranscript, trimmed)
  } else {
    systemTranscript = mergeTranscriptChunk(systemTranscript, trimmed)
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
