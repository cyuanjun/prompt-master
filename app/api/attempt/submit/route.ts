import { NextResponse } from 'next/server'
import {
  DEMO_SCENARIOS,
  buildDemoId,
  getScenarioByKey,
  isDemoMode,
  parseDemoId,
} from '@/lib/fixtures'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    challengeId?: string
    prompt?: string
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

  return NextResponse.json(
    { error: 'Live mode not yet implemented. Set NEXT_PUBLIC_DEMO_MODE=true.' },
    { status: 501 },
  )
}
