'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SketchCard } from '@/components/primitives/SketchCard'
import { useGameState } from '@/components/game/GameStateProvider'

const STEPS = [
  'Reading your prompt…',
  'Rendering your image…',
  'Comparing to the target…',
  'Scoring your attempt…',
]

const STEP_INTERVAL_MS = 600

export default function GeneratingPage() {
  const router = useRouter()
  const { state } = useGameState()
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    if (state.gameState === 'generating') return
    router.replace('/play')
  }, [state.gameState, router])

  useEffect(() => {
    if (state.gameState !== 'generating') {
      setVisibleCount(1)
      return
    }
    const interval = setInterval(() => {
      setVisibleCount((c) => Math.min(c + 1, STEPS.length))
    }, STEP_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [state.gameState])

  if (state.gameState !== 'generating' || !state.challenge) {
    return null
  }

  const userPrompt = state.attempt?.prompt
  const activeIdx = visibleCount - 1
  const quote = userPrompt
    ? `“${userPrompt}” — let's see if it lands.`
    : "Hmm. Let's see what you came up with."

  return (
    <div className="min-h-screen w-full px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-3xl mx-auto">
        <Header />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '2.5rem',
          }}
        >
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '3px solid #1a1a1a',
              boxShadow: '4px 4px 0 #1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'gen-pulse 2s ease-in-out infinite',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#7c3aed',
                border: '2px solid #1a1a1a',
                animation: 'gen-pulse-inner 2s ease-in-out infinite',
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#1a1a1a',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              PromptMaster
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-mono), ui-monospace, monospace',
                color: '#7c3aed',
                fontSize: '0.85rem',
                margin: 0,
                marginTop: '0.35rem',
              }}
            >
              {state.challenge.theme}
            </p>
          </div>

          <SketchCard
            color="#fef9c3"
            rotate={-1}
            style={{ maxWidth: '480px', width: '100%' }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono), ui-monospace, monospace',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#7c3aed',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              PromptMaster says
            </div>
            <p
              style={{
                fontSize: '1rem',
                color: '#1a1a1a',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {quote}
            </p>
          </SketchCard>

          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              maxWidth: '480px',
              width: '100%',
            }}
          >
            {STEPS.slice(0, visibleCount).map((step, i) => {
              const done = i < activeIdx
              return (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    animation: 'gen-step-in 350ms ease-out',
                  }}
                >
                  <CheckBox done={done} />
                  <span
                    style={{
                      fontSize: '0.95rem',
                      color: '#1a1a1a',
                      opacity: done ? 0.55 : 1,
                      fontWeight: done ? 400 : 500,
                      transition: 'opacity 250ms ease',
                    }}
                  >
                    {step}
                  </span>
                </li>
              )
            })}
          </ul>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '0.25rem',
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  border: '1.5px solid #1a1a1a',
                  animation: `gen-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gen-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.05); }
        }
        @keyframes gen-pulse-inner {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(0.8); opacity: 0.75; }
        }
        @keyframes gen-step-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gen-dot {
          0%, 80%, 100% { opacity: 0.35; transform: scale(0.85); }
          40%           { opacity: 1;    transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <Link
        href="/"
        style={{
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#1a1a1a',
          textDecoration: 'none',
        }}
      >
        ← PromptMaster
      </Link>
      <span
        style={{
          fontSize: '0.75rem',
          color: '#737373',
          fontStyle: 'italic',
        }}
      >
        Solo · Practice
      </span>
    </header>
  )
}

function CheckBox({ done }: { done: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        width: '22px',
        height: '22px',
        borderRadius: '6px 2px 5px 3px',
        border: '2px solid #1a1a1a',
        background: done ? '#7c3aed' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 250ms ease',
      }}
    >
      {done && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l5 5L20 7"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}
