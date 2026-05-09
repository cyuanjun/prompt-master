import { NextResponse } from 'next/server'
import { buildDemoId, isDemoMode, pickRandomScenario } from '@/lib/fixtures'

export async function POST() {
  if (isDemoMode()) {
    // Delay matches the LoadingView checklist animation (4 steps × 350ms ≈ 1400ms).
    await new Promise((r) => setTimeout(r, 1500))

    const scenario = pickRandomScenario()
    return NextResponse.json({
      challengeId: buildDemoId(scenario.key),
      targetImageUrl: scenario.targetImageUrl,
      theme: scenario.theme,
    })
  }

  // Live path — wired up in Step 3.
  return NextResponse.json(
    { error: 'Live mode not yet implemented. Set NEXT_PUBLIC_DEMO_MODE=true.' },
    { status: 501 },
  )
}
