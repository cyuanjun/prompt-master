import { after, NextResponse } from 'next/server'
import {
  generateAndStoreChallenge,
  markClaimed,
  refillOne,
  tryClaimFromQueue,
} from '@/lib/challenge'
import { buildDemoId, isDemoMode, pickRandomScenario } from '@/lib/fixtures'

export async function POST() {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 1500))
    const scenario = pickRandomScenario()
    return NextResponse.json({
      challengeId: buildDemoId(scenario.key),
      targetImageUrl: scenario.targetImageUrl,
      theme: scenario.theme,
    })
  }

  try {
    // Fast path: pull from the pre-generated queue.
    const claimed = await tryClaimFromQueue()

    if (claimed) {
      // Top up the queue in the background — runs after response is sent.
      after(refillOne)

      return NextResponse.json({
        challengeId: claimed.id,
        targetImageUrl: claimed.target_image_url,
        theme: claimed.theme,
      })
    }

    // Slow path: queue is empty. Generate inline (~30s) and use it.
    const fresh = await generateAndStoreChallenge()
    await markClaimed(fresh.id)

    // Top up so the next round is fast.
    after(refillOne)

    return NextResponse.json({
      challengeId: fresh.id,
      targetImageUrl: fresh.target_image_url,
      theme: fresh.theme,
    })
  } catch (err) {
    console.error('challenge/create live failed:', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Challenge creation failed',
      },
      { status: 500 },
    )
  }
}
