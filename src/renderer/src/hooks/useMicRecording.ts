import { useEffect, useRef } from 'react'

const SEGMENT_MS = 4000
const MIN_CHUNK_BYTES = 3000

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

type AudioCapture = {
  stream: MediaStream
  source: 'system' | 'microphone'
}

function isLikelyInternalMic(label: string): boolean {
  const lower = label.toLowerCase()
  return (
    lower.includes('internal') ||
    lower.includes('array') ||
    lower.includes('built-in') ||
    lower.includes('built in') ||
    lower.includes('laptop') ||
    (lower.includes('realtek') && !lower.includes('usb')) ||
    lower.includes('intel smart sound')
  )
}

function isPreferredExternalMic(label: string): boolean {
  const lower = label.toLowerCase()
  return (
    lower.includes('headset') ||
    lower.includes('headphone') ||
    lower.includes('usb') ||
    lower.includes('external') ||
    lower.includes('bluetooth') ||
    lower.includes('airpods') ||
    lower.includes('webcam') ||
    lower.includes('logitech') ||
    lower.includes('jabra') ||
    lower.includes('corsair') ||
    lower.includes('hyperx')
  )
}

async function ensureMicPermission(): Promise<void> {
  const probe = await navigator.mediaDevices.getUserMedia({ audio: true })
  probe.getTracks().forEach((track) => track.stop())
}

async function pickActiveMicrophoneDeviceId(): Promise<string | undefined> {
  try {
    await ensureMicPermission()
  } catch {
    return undefined
  }

  const devices = await navigator.mediaDevices.enumerateDevices()
  const mics = devices.filter((device) => device.kind === 'audioinput' && device.deviceId)

  if (mics.length === 0) return undefined

  for (const preferredId of ['communications', 'default']) {
    const match = mics.find((device) => device.deviceId === preferredId)
    if (match) return match.deviceId
  }

  const labeled = mics.filter((device) => device.label)
  const externalPreferred = labeled.find(
    (device) => isPreferredExternalMic(device.label) && !isLikelyInternalMic(device.label)
  )
  if (externalPreferred) return externalPreferred.deviceId

  const nonInternal = labeled.filter((device) => !isLikelyInternalMic(device.label))
  if (nonInternal.length === 1) return nonInternal[0].deviceId
  if (nonInternal.length > 1) {
    const best = nonInternal.find((device) => isPreferredExternalMic(device.label))
    return (best ?? nonInternal[0]).deviceId
  }

  return undefined
}

async function acquireSystemAudioCapture(): Promise<AudioCapture | null> {
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
    // System loopback unavailable.
  }
  return null
}

async function acquireMicrophoneCapture(
  requireMic: boolean,
  skipInternalWhenOptional = false
): Promise<AudioCapture | null> {
  const deviceId = await pickActiveMicrophoneDeviceId()

  if (!deviceId && !requireMic) {
    return null
  }

  if (skipInternalWhenOptional && deviceId) {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const selected = devices.find((device) => device.deviceId === deviceId)
    if (selected?.label && isLikelyInternalMic(selected.label)) {
      return null
    }
  }

  const constraints: MediaStreamConstraints = {
    audio: deviceId
      ? {
          deviceId: { exact: deviceId },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      : {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
  }

  try {
    const micStream = await navigator.mediaDevices.getUserMedia(constraints)
    return { stream: micStream, source: 'microphone' }
  } catch {
    if (!requireMic) return null
    throw new Error('No usable microphone found.')
  }
}

async function acquireDualAudioCaptures(): Promise<AudioCapture[]> {
  const captures: AudioCapture[] = []

  const systemCapture = await acquireSystemAudioCapture()
  if (systemCapture) captures.push(systemCapture)

  const micCapture = await acquireMicrophoneCapture(!systemCapture, Boolean(systemCapture))
  if (micCapture) captures.push(micCapture)

  if (captures.length === 0) {
    throw new Error('No audio input available. Allow screen audio and/or a headset microphone.')
  }

  return captures
}

export function useMicRecording(): void {
  const activeRef = useRef(false)
  const capturesRef = useRef<AudioCapture[]>([])
  const loopsRef = useRef<Promise<void>[]>([])

  useEffect(() => {
    const releaseStreams = (): void => {
      for (const capture of capturesRef.current) {
        capture.stream.getTracks().forEach((track) => track.stop())
      }
      capturesRef.current = []
    }

    const submitBlob = async (
      blob: Blob,
      mimeType: string,
      source: 'system' | 'microphone'
    ): Promise<void> => {
      if (blob.size < MIN_CHUNK_BYTES) return
      const base64 = await blobToBase64(blob)
      await window.api.recording.submitChunk(base64, mimeType, source)
    }

    const runSegmentLoop = async (
      stream: MediaStream,
      mimeType: string,
      source: 'system' | 'microphone'
    ): Promise<void> => {
      while (activeRef.current) {
        const blob = await recordSegment(stream, mimeType, SEGMENT_MS)
        if (!activeRef.current) {
          await submitBlob(blob, mimeType, source)
          break
        }
        await submitBlob(blob, mimeType, source)
      }
    }

    const start = async (): Promise<void> => {
      if (activeRef.current) return

      const captures = await acquireDualAudioCaptures()
      const mimeType = pickMimeType()
      capturesRef.current = captures
      activeRef.current = true

      const sources = captures.map((capture) => capture.source)
      const combined: 'system' | 'microphone' | 'both' =
        sources.includes('system') && sources.includes('microphone')
          ? 'both'
          : sources.includes('system')
            ? 'system'
            : 'microphone'

      void window.api.recording.setSource(combined)

      loopsRef.current = captures.map((capture) =>
        runSegmentLoop(capture.stream, mimeType, capture.source)
      )
    }

    const stop = async (): Promise<void> => {
      if (!activeRef.current) return
      activeRef.current = false
      await Promise.all(loopsRef.current)
      loopsRef.current = []
      releaseStreams()
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
      releaseStreams()
    }
  }, [])
}
