import OpenAI from 'openai'
import { buildJudgePrompt, buildTargetPrompt } from './prompts'

let _client: OpenAI | null = null
let _imageClient: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set. Check .env.local.')
  }
  _client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return _client
}

/**
 * Separate client for image generation. Uses OPENAI_IMAGE_API_KEY when set
 * (e.g. a sponsor-provided key with gpt-image-2 access), otherwise falls back
 * to the main OPENAI_API_KEY.
 */
function getImageOpenAI(): OpenAI {
  const imageKey = process.env.OPENAI_IMAGE_API_KEY
  if (imageKey) {
    _imageClient ??= new OpenAI({ apiKey: imageKey })
    return _imageClient
  }
  return getOpenAI()
}

export const MODELS = {
  judge: 'gpt-5.5',
  imageGen: 'gpt-image-2',
} as const

/**
 * Generates a hidden, detailed image-gen prompt from a theme.
 * The user never sees this — the judge uses it (via the rendered image)
 * as the ground truth.
 */
export async function generateTargetPrompt(theme: string): Promise<string> {
  const openai = getOpenAI()
  const response = await openai.chat.completions.create({
    model: MODELS.judge,
    messages: [{ role: 'user', content: buildTargetPrompt(theme) }],
  })
  const text = response.choices[0]?.message?.content?.trim()
  if (!text) {
    throw new Error('Empty target prompt from gpt-5.5')
  }
  return text
}

type ImageQuality = 'low' | 'medium' | 'high' | 'auto'

/**
 * Generates an image from a prompt and returns it as a PNG buffer.
 * gpt-image-2 returns base64 in `b64_json`; we decode here.
 *
 * Quality default is `low` — ~3-4x faster than medium and much cheaper
 * (~$0.008 vs $0.032/image), at the cost of less fine detail. Fine for
 * concept-level comparison; pass `quality: 'medium'` if you need crisper
 * detail on target images.
 */
export async function generateImage(
  prompt: string,
  opts: { quality?: ImageQuality } = {},
): Promise<Buffer> {
  const openai = getImageOpenAI()
  const response = await openai.images.generate({
    model: MODELS.imageGen,
    prompt,
    size: '1024x1024',
    quality: opts.quality ?? 'low',
    n: 1,
  })

  const b64 = response.data?.[0]?.b64_json
  if (!b64) {
    throw new Error('gpt-image-2 returned no image data')
  }
  return Buffer.from(b64, 'base64')
}

/**
 * Fetches an image URL and converts it to a base64 data URL. We pre-fetch on
 * our server so the OpenAI vision request doesn't depend on OpenAI's URL
 * downloader (which has tight timeouts and has been failing intermittently
 * against Supabase Storage public URLs).
 */
async function fetchAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch image ${url}: ${res.status}`)
  }
  const contentType = res.headers.get('content-type') ?? 'image/png'
  const buf = Buffer.from(await res.arrayBuffer())
  return `data:${contentType};base64,${buf.toString('base64')}`
}

/**
 * Sends both images + the user's prompt to gpt-5.5 vision and returns the
 * raw JSON string. Caller is responsible for parsing + Zod-validating.
 */
export async function judgeImages(args: {
  targetImageUrl: string
  generatedImageUrl: string
  userPrompt: string
}): Promise<string> {
  const openai = getOpenAI()

  const [targetDataUrl, generatedDataUrl] = await Promise.all([
    fetchAsDataUrl(args.targetImageUrl),
    fetchAsDataUrl(args.generatedImageUrl),
  ])

  const response = await openai.chat.completions.create({
    model: MODELS.judge,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: buildJudgePrompt(args.userPrompt) },
          {
            type: 'image_url',
            image_url: { url: targetDataUrl, detail: 'high' },
          },
          {
            type: 'image_url',
            image_url: { url: generatedDataUrl, detail: 'high' },
          },
        ],
      },
    ],
  })
  return response.choices[0]?.message?.content ?? ''
}
