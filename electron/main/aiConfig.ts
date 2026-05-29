export type AiConfig = {
  apiKey: string
  fastModel: string
  deepModel: string
  apiBaseUrl: string
  whisperModel: string
}

const DEFAULT_MODELS = {
  fastModel: 'gpt-4o-mini',
  deepModel: 'gpt-4.1',
  apiBaseUrl: 'https://api.openai.com/v1',
  whisperModel: 'whisper-1'
} as const

export function getAiConfig(): AiConfig {
  const apiKey = process.env.OPENAI_API_KEY?.trim() ?? ''
  if (!apiKey) {
    throw new Error(
      'OpenAI API key is not configured. Add OPENAI_API_KEY to the project .env file (see .env.example).'
    )
  }

  return {
    apiKey,
    ...DEFAULT_MODELS
  }
}
