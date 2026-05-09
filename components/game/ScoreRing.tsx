'use client'

import { useEffect, useState } from 'react'

function colorFor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#fb923c'
  return '#dc2626'
}

export function ScoreRing({ score }: { score: number }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    setShown(0)
    let raf = 0
    const start = performance.now()
    const duration = 900
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(eased * score))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [score])

  const color = colorFor(score)
  const circumference = 2 * Math.PI * 56
  const dashOffset = circumference - (shown / 100) * circumference

  return (
    <div
      style={{
        position: 'relative',
        width: '140px',
        height: '140px',
      }}
    >
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r="56"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r="56"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#1a1a1a',
            lineHeight: 1,
          }}
        >
          {shown}
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            color: '#737373',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '0.25rem',
          }}
        >
          out of 100
        </span>
      </div>
    </div>
  )
}
