import OpenAI from 'openai'

let _client: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set. Check .env.local.')
  }
  _client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return _client
}

export const MODELS = {
  judge: 'gpt-5.5',
  imageGen: 'gpt-image-2',
} as const
