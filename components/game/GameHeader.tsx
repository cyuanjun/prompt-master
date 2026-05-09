'use client'

import { ArrowLeft, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'

type GameHeaderProps = {
  currentRound: number
  totalRounds: number
  timeLeft: string
}

export function GameHeader({
  currentRound,
  totalRounds,
  timeLeft,
}: GameHeaderProps) {
  const router = useRouter()

  return (
    <header className="relative z-10">
      <div className="grid grid-cols-[76px_1fr_76px] items-center gap-1">
        <button
          type="button"
          aria-label="Go back to home"
          onClick={() => router.push('/')}
          className={cn(
            'paper-icon-button flex h-9 w-9 items-center justify-center text-ink',
            'transition-transform hover:-rotate-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
          )}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex justify-center">
          <div className="round-paper-label relative flex items-center justify-center px-3 pb-0.5 pt-0">
            <span
              className="font-label whitespace-nowrap text-ink"
              style={{ fontSize: 'clamp(0.82rem, 3.25vw, 0.96rem)' }}
            >
              ROUND {currentRound} / {totalRounds}
            </span>
          </div>
        </div>

        <div className="font-label flex items-center justify-end gap-1 tabular-nums text-[#d64d45]">
          <Clock className="h-4 w-4" />
          <span className="text-sm sm:text-base">{timeLeft}</span>
        </div>
      </div>
    </header>
  )
}
