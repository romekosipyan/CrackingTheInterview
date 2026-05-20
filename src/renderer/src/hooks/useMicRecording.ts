import { useEffect, useRef } from 'react'

const SEGMENT_MS = 6000
const MIN_CHUNK_BYTES = 8000

function pickMimeType(): string {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
  for (const candidate of candidates) {
    if (MediaRecorder.isTypeSupported(candidate)) return candidate
  }
  return ''
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to read audio chunk'))
        return
      }
      const commaIndex = result.indexOf(',')
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read audio chunk'))
    reader.readAsDataURL(blob)
  })
}

function recordSegment(stream: MediaStream, mimeType: string, durationMs: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    const chunks: BlobPart[] = []

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }
    recorder.onerror = () => reject(recorder.error ?? new Error('Audio recording failed'))
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType || 'audio/webm' }))

    recorder.start()
    window.setTimeout(() => {
      if (recorder.state !== 'inactive') recorder.stop()
    }, durationMs)
  })
}

async function acquireSystemAudioStream(): Promise<{ stream: MediaStream; source: 'system' | 'microphone' }> {
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    })

    displayStream.getVideoTracks().forEach((track) => track.stop())

    const audioTracks = displayStream.getAudioTracks()
    if (audioTracks.length > 0) {
      return {
        stream: new MediaStream(audioTracks),
        source: 'system'
      }
    }

    displayStream.getTracks().forEach((track) => track.stop())
  } catch {
    // Fall back to microphone below.
  }

  const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  return { stream: micStream, source: 'microphone' }
}

export function useMicRecording(): void {
  const activeRef = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)
  const loopRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    const releaseStream = (): void => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    const submitBlob = async (blob: Blob, mimeType: string): Promise<void> => {
      if (blob.size < MIN_CHUNK_BYTES) return
      const base64 = await blobToBase64(blob)
      await window.api.recording.submitChunk(base64, mimeType)
    }

    const runSegmentLoop = async (stream: MediaStream, mimeType: string): Promise<void> => {
      while (activeRef.current) {
        const blob = await recordSegment(stream, mimeType, SEGMENT_MS)
        if (!activeRef.current) {
          await submitBlob(blob, mimeType)
          break
        }
        await submitBlob(blob, mimeType)
      }
    }

    const start = async (): Promise<void> => {
      if (activeRef.current) return

      const { stream, source } = await acquireSystemAudioStream()
      const mimeType = pickMimeType()
      streamRef.current = stream
      activeRef.current = true
      void window.api.recording.setSource(source)
      loopRef.current = runSegmentLoop(stream, mimeType)
    }

    const stop = async (): Promise<void> => {
      if (!activeRef.current) return
      activeRef.current = false
      await loopRef.current
      loopRef.current = null
      releaseStream()
    }

    const unsubControl = window.api.on('recording:control', (payload) => {
      const { action } = payload as { action: 'start' | 'stop' }
      if (action === 'start') {
        void start().catch((error) => {
          const message = error instanceof Error ? error.message : 'Audio capture failed'
          void window.api.recording.reportError(message)
        })
        return
      }
      void stop()
    })

    return () => {
      unsubControl()
      activeRef.current = false
      releaseStream()
    }
  }, [])
}
