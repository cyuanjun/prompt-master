'use client'

import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { SketchCard } from '@/components/primitives/SketchCard'
import { SketchButton } from '@/components/primitives/SketchButton'

export function JoinGameCard() {
  const [pin, setPin] = React.useState('')

  const handleChange = (value: string) => {
    const next = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6)
    setPin(next)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pin.length !== 6) return
    // Multiplayer not built yet — placeholder. Wire up to /room/[pin] when battle lands.
  }

  const isValid = pin.length === 6

  return (
    <SketchCard
      color="#fffdf7"
      rotate={0.35}
      className="landing-paper-card paper-thick-card p-3 sm:p-4"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5 sm:gap-3.5"
      >
        <label
          htmlFor="game-pin"
          className="font-label uppercase tracking-wide text-ink"
          style={{ fontSize: 'clamp(0.95rem, 4vw, 1.25rem)' }}
        >
          Game PIN
        </label>
        <input
          id="game-pin"
          name="game-pin"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={6}
          value={pin}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="ABC123"
          aria-label="Game PIN"
          className="paper-input font-label block w-full max-w-full px-3 py-2 text-center uppercase tracking-[0.32em] text-ink placeholder:text-[#aaa18f] focus:outline-none focus:ring-2 focus:ring-[rgba(128,98,207,0.32)] sm:py-2.5"
          style={{ fontSize: 'clamp(1.1rem, 5vw, 1.5rem)' }}
        />
        <SketchButton
          type="submit"
          variant="primary"
          icon={<ArrowRight className="doodle-icon h-5 w-5" />}
          disabled={!isValid}
          className="landing-action-button join-action-button w-full"
        >
          Join (soon)
        </SketchButton>
      </form>
    </SketchCard>
  )
}
