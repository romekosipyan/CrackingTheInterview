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

function resolveOpenAiApiKey(): string {
  const bundled =
    typeof __KRAKEN_OPENAI_API_KEY__ === 'string' ? __KRAKEN_OPENAI_API_KEY__.trim() : ''
  if (bundled) return bundled

  return process.env.OPENAI_API_KEY?.trim() ?? ''
}

export function getAiConfig(): AiConfig {
  const apiKey = resolveOpenAiApiKey()
  if (!apiKey) {
    throw new Error(
      'OpenAI API key is not configured in this build. Rebuild the installer with OPENAI_API_KEY set in the project .env file (npm run dist).'
    )
  }

  return {
    apiKey,
    ...DEFAULT_MODELS
  }
}
