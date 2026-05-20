import { getWhisperLanguageCode } from '../../../shared/types'
import { getAiConfig } from '../aiConfig'

type TranscriptionResponse = {
  text?: string
}

const WHISPER_HALLUCINATION_MARKERS = [
  '谢谢',
  '感谢',
  '订阅',
  '点赞',
  '字幕',
  'Amara',
  '社群',
  '提供',
  '請不吝',
  '打赏',
  '明镜',
  '点点',
  '栏目'
]

const NOISE_TRANSCRIPT_PATTERNS = [
  /\b(jet|engine|fan|whoosh|static|hum|hiss|wind|noise|silence|music|applause)\b/i,
  /thank you for watching/i,
  /please subscribe/i,
  /^\s*\[.*\]\s*$/i,
  /^[\s.,!?-]+$/,
  /^(uh+|um+|hmm+|ah+)\s*$/i
]

function isLikelyNoiseTranscript(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return true
  if (trimmed.length < 3) return true
  if (NOISE_TRANSCRIPT_PATTERNS.some((pattern) => pattern.test(trimmed))) return true
  return false
}

function isLikelyHallucination(text: string, languageCode: string | undefined): boolean {
  const trimmed = text.trim()
  if (!trimmed) return true

  if (isLikelyNoiseTranscript(trimmed)) return true

  if (WHISPER_HALLUCINATION_MARKERS.some((marker) => trimmed.includes(marker))) {
    return true
  }

  if (languageCode && !languageCode.startsWith('zh') && !languageCode.startsWith('ja') && languageCode !== 'ko') {
    const cjkChars = trimmed.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g)?.length ?? 0
    if (cjkChars > 0 && cjkChars / trimmed.length >= 0.3) {
      return true
    }
  }

  return false
}

export async function transcribeAudio(
  audio: Buffer,
  mimeType: string,
  interviewLanguage?: string
): Promise<string> {
  const settings = getAiConfig()
  if (!settings.apiKey) {
    throw new Error('OpenAI API key is not configured.')
  }

  const languageCode = interviewLanguage ? getWhisperLanguageCode(interviewLanguage) : undefined
  const extension = mimeType.includes('webm') ? 'webm' : mimeType.includes('wav') ? 'wav' : 'mp4'
  const blob = new Blob([audio], { type: mimeType })
  const form = new FormData()
  form.append('file', blob, `audio.${extension}`)
  form.append('model', settings.whisperModel)
  form.append('response_format', 'json')
  form.append('temperature', '0')

  if (languageCode) {
    form.append('language', languageCode)
  }

  if (interviewLanguage) {
    form.append('prompt', `Coding interview conversation in ${interviewLanguage}.`)
  }

  const response = await fetch(`${settings.apiBaseUrl}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`
    },
    body: form
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Transcription failed (${response.status}): ${body}`)
  }

  const payload = (await response.json()) as TranscriptionResponse
  const text = payload.text?.trim() ?? ''

  if (isLikelyHallucination(text, languageCode)) {
    return ''
  }

  return text
}
