import { NextResponse } from 'next/server'
import {
  DEMO_FEEDBACK,
  getScenarioByKey,
  isDemoMode,
  parseDemoId,
} from '@/lib/fixtures'

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

  return NextResponse.json(
    { error: 'Live mode not yet implemented. Set NEXT_PUBLIC_DEMO_MODE=true.' },
    { status: 501 },
  )
}
