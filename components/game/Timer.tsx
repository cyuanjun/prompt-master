'use client'

import { useEffect, useRef, useState } from 'react'

type TimerProps = {
  durationSeconds: number
  onExpire: () => void
  /** Bumping this value resets the timer. */
  resetKey?: string | number
}

export function Timer({ durationSeconds, onExpire, resetKey }: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  // Tick the timer down. Pure decrement — no side effects in the updater.
  useEffect(() => {
    expiredRef.current = false
    setRemaining(durationSeconds)

    const interval = setInterval(() => {
      setRemaining((prev) => (prev <= 0 ? 0 : prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [durationSeconds, resetKey])

  // Fire onExpire exactly once when remaining hits 0. Runs in commit phase,
  // so it's safe to dispatch into other components from here.
  useEffect(() => {
    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true
      onExpireRef.current()
    }
  }, [remaining])

  const pct = Math.max(0, (remaining / durationSeconds) * 100)
  const seconds = Math.max(0, remaining)
  const isLow = seconds <= 10
  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60

  return (
    <div className="flex items-center gap-3">
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: isLow ? '#dc2626' : '#1a1a1a',
          minWidth: '3.5rem',
        }}
      >
        {mm}:{ss.toString().padStart(2, '0')}
      </div>
      <div
        style={{
          width: '120px',
          height: '10px',
          background: '#ffffff',
          border: '2px solid #1a1a1a',
          borderRadius: '6px 2px 4px 8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: isLow ? '#dc2626' : '#7c3aed',
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  )
}
