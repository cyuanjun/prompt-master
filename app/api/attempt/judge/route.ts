import { NextResponse } from 'next/server'
import {
  DEMO_FEEDBACK,
  getScenarioByKey,
  isDemoMode,
  parseDemoId,
} from '@/lib/fixtures'
import { judgeImages } from '@/lib/openai'
import { getServerClient } from '@/lib/supabase'
import { FeedbackSchema, type Feedback } from '@/lib/validators'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { attemptId?: string }

  if (!body.attemptId) {
    return NextResponse.json(
      { error: 'attemptId is required' },
      { status: 400 },
    )
  }

  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 900))
    const scenarioKey = parseDemoId(body.attemptId)
    const scenario = scenarioKey ? getScenarioByKey(scenarioKey) : null
    return NextResponse.json(scenario?.feedback ?? DEMO_FEEDBACK)
  }

  try {
    const supabase = getServerClient()

    const { data: attempt, error: fetchError } = await supabase
      .from('attempts')
      .select('id, prompt, generated_image_url, challenge_id')
      .eq('id', body.attemptId)
      .single()
    if (fetchError || !attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 },
      )
    }

    const { data: challenge, error: chErr } = await supabase
      .from('challenges')
      .select('target_image_url, target_prompt')
      .eq('id', attempt.challenge_id)
      .single()
    if (chErr || !challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 },
      )
    }

    const raw = await judgeImages({
      targetImageUrl: challenge.target_image_url,
      generatedImageUrl: attempt.generated_image_url,
      userPrompt: attempt.prompt,
    })

    let parsed: Feedback
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim()
      parsed = FeedbackSchema.parse(JSON.parse(cleaned))
    } catch (parseErr) {
      console.error('Judge response parse failed:', parseErr, '\nraw:', raw)
      return NextResponse.json(
        {
          error: 'Judge response failed validation',
          detail: parseErr instanceof Error ? parseErr.message : String(parseErr),
          raw,
        },
        { status: 502 },
      )
    }

    // Override the AI's "rewrite" with the actual prompt that generated the
    // target image. This way the hint is the literal recipe — running it
    // recreates the target (modulo image-gen variance) instead of producing
    // a different interpretation.
    const feedback: Feedback = {
      ...parsed,
      improved_prompt: challenge.target_prompt,
    }

    await supabase
      .from('attempts')
      .update({ score: feedback.score, feedback })
      .eq('id', body.attemptId)

    return NextResponse.json(feedback)
  } catch (err) {
    console.error('attempt/judge live failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Judge failed' },
      { status: 502 },
    )
  }
}
