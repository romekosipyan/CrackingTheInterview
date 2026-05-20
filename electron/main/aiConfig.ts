export type AiConfig = {
  apiKey: string
  fastModel: string
  deepModel: string
  apiBaseUrl: string
  whisperModel: string
}

const INTERNAL_AI_CONFIG: AiConfig = {
  apiKey: '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',
  fastModel: 'gpt-4o-mini',
  deepModel: 'gpt-4.1',
  apiBaseUrl: 'https://api.openai.com/v1',
  whisperModel: 'whisper-1'
}

export function getAiConfig(): AiConfig {
  const envKey = process.env.OPENAI_API_KEY?.trim()
  return {
    ...INTERNAL_AI_CONFIG,
    apiKey: envKey || INTERNAL_AI_CONFIG.apiKey
  }
}
