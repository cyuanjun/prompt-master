import { generateImage, generateTargetPrompt } from './openai'
import { getServerClient, uploadImage } from './supabase'
import { THEMES, pickRandomTheme } from './themes'

/** How far back we look to dedupe themes. The further back, the more diverse
 *  the rotation feels, but eventually all themes are "used" and we recycle. */
const RECENT_THEMES_WINDOW = 20

/**
 * Picks a theme that hasn't been used in the last RECENT_THEMES_WINDOW
 * challenges. Falls back to a random pick if all themes have been used
 * recently.
 */
async function pickFreshTheme(): Promise<string> {
  const supabase = getServerClient()
  const { data: recent } = await supabase
    .from('challenges')
    .select('theme')
    .order('created_at', { ascending: false })
    .limit(RECENT_THEMES_WINDOW)

  const usedSet = new Set((recent ?? []).map((r) => r.theme as string))
  const unused = THEMES.filter((t) => !usedSet.has(t))

  if (unused.length === 0) return pickRandomTheme()
  return unused[Math.floor(Math.random() * unused.length)]
}

export type ChallengeRow = {
  id: string
  theme: string
  target_image_url: string
}

/**
 * Generates a challenge end-to-end (gpt-5.5 prompt → gpt-image-1 → upload →
 * insert) and returns the new row. The row is inserted as **unclaimed**
 * (claimed_at IS NULL) so it's ready for the queue.
 */
export async function generateAndStoreChallenge(): Promise<ChallengeRow> {
  const theme = await pickFreshTheme()
  const targetPrompt = await generateTargetPrompt(theme)
  const buffer = await generateImage(targetPrompt)

  const supabase = getServerClient()

  const { data: row, error: insertError } = await supabase
    .from('challenges')
    .insert({
      theme,
      target_prompt: targetPrompt,
      target_image_url: '', // filled in after the upload
    })
    .select('id')
    .single()
  if (insertError || !row) {
    throw new Error(insertError?.message ?? 'Failed to insert challenge')
  }

  const targetImageUrl = await uploadImage(buffer, `challenges/${row.id}.png`)

  const { error: updateError } = await supabase
    .from('challenges')
    .update({ target_image_url: targetImageUrl })
    .eq('id', row.id)
  if (updateError) {
    throw new Error(updateError.message)
  }

  return { id: row.id, theme, target_image_url: targetImageUrl }
}

/**
 * Atomically claims the oldest unclaimed, fully-generated challenge.
 * Returns null if none are available.
 *
 * Race-safe: the UPDATE includes `is('claimed_at', null)` so two concurrent
 * callers can't claim the same row. The loser sees no row and falls back.
 */
export async function tryClaimFromQueue(): Promise<ChallengeRow | null> {
  const supabase = getServerClient()

  // Find a candidate.
  const { data: candidate } = await supabase
    .from('challenges')
    .select('id, theme, target_image_url')
    .is('claimed_at', null)
    .neq('target_image_url', '') // skip rows mid-upload
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!candidate) return null

  // Try to claim it. The is('claimed_at', null) guard makes this race-safe.
  const { data: claimed } = await supabase
    .from('challenges')
    .update({ claimed_at: new Date().toISOString() })
    .eq('id', candidate.id)
    .is('claimed_at', null)
    .select('id, theme, target_image_url')
    .maybeSingle()

  return claimed ?? null
}

/** Marks a freshly-generated challenge as claimed. Used when we generate
 *  inline (queue empty path) — the row was just created unclaimed. */
export async function markClaimed(id: string): Promise<void> {
  const supabase = getServerClient()
  await supabase
    .from('challenges')
    .update({ claimed_at: new Date().toISOString() })
    .eq('id', id)
}

/**
 * Generates exactly one new challenge in the background. Designed to be called
 * from `after()` so it runs after the response is sent. The route calls this
 * after every successful claim — one consumed, one generated, queue stays
 * at steady state.
 */
export async function refillOne(): Promise<void> {
  try {
    await generateAndStoreChallenge()
  } catch (err) {
    console.error('background refill failed:', err)
  }
}
