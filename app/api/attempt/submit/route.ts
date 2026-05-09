import { NextResponse } from 'next/server'
import {
  DEMO_SCENARIOS,
  buildDemoId,
  getScenarioByKey,
  isDemoMode,
  parseDemoId,
} from '@/lib/fixtures'
import { generateImage } from '@/lib/openai'
import { getServerClient, uploadImage } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    challengeId?: string
    prompt?: string
    playerId?: string
  }

  if (!body.challengeId || !body.prompt) {
    return NextResponse.json(
      { error: 'challengeId and prompt are required' },
      { status: 400 },
    )
  }

  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 1500))
    const scenarioKey = parseDemoId(body.challengeId)
    const scenario =
      (scenarioKey && getScenarioByKey(scenarioKey)) || DEMO_SCENARIOS[0]
    return NextResponse.json({
      attemptId: buildDemoId(scenario.key),
      generatedImageUrl: scenario.attemptImageUrl,
    })
  }

  try {
    const supabase = getServerClient()

    const { data: challenge, error: fetchError } = await supabase
      .from('challenges')
      .select('id')
      .eq('id', body.challengeId)
      .single()
    if (fetchError || !challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 },
      )
    }

    const buffer = await generateImage(body.prompt)

    const { data: row, error: insertError } = await supabase
      .from('attempts')
      .insert({
        challenge_id: body.challengeId,
        player_id: body.playerId ?? null,
        prompt: body.prompt,
        generated_image_url: '',
      })
      .select('id')
      .single()
    if (insertError || !row) {
      throw new Error(insertError?.message ?? 'Failed to insert attempt')
    }

    const generatedImageUrl = await uploadImage(
      buffer,
      `attempts/${row.id}.png`,
    )

    const { error: updateError } = await supabase
      .from('attempts')
      .update({ generated_image_url: generatedImageUrl })
      .eq('id', row.id)
    if (updateError) {
      throw new Error(updateError.message)
    }

    return NextResponse.json({
      attemptId: row.id,
      generatedImageUrl,
    })
  } catch (err) {
    console.error('attempt/submit live failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Submit failed' },
      { status: 500 },
    )
  }
}
