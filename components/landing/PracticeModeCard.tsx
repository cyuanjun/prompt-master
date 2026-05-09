'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { SketchCard } from '@/components/primitives/SketchCard'

export function PracticeModeCard() {
  const router = useRouter()

  return (
    <SketchCard
      color="#fffdf7"
      rotate={-0.25}
      role="button"
      tabIndex={0}
      aria-label="Practice Mode — Solo practice and learn"
      onClick={() => router.push('/play')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          router.push('/play')
        }
      }}
      className="landing-paper-card paper-thick-card min-h-[72px] cursor-pointer p-3 transition-transform hover:-rotate-1 focus:outline-none focus-visible:-rotate-1 sm:min-h-[88px] sm:p-4"
    >
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex flex-col">
          <span
            className="font-label text-ink"
            style={{ fontSize: 'clamp(1.4rem, 6vw, 2rem)' }}
          >
            Practice Mode
          </span>
          <span
            className="font-label text-[var(--muted)]"
            style={{ fontSize: 'clamp(0.85rem, 3.4vw, 1rem)' }}
          >
            Solo practice &amp; learn
          </span>
        </div>
        <ArrowRight className="doodle-icon h-6 w-6 flex-shrink-0 text-ink sm:h-7 sm:w-7" />
      </div>
    </SketchCard>
  )
}
