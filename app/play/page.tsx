'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SketchButton } from '@/components/primitives/SketchButton'
import { SketchCard } from '@/components/primitives/SketchCard'
import { FeedbackCard } from '@/components/game/FeedbackCard'
import { useGameState } from '@/components/game/GameStateProvider'
import { ImageComparison } from '@/components/game/ImageComparison'
import { ImprovedPromptCard } from '@/components/game/ImprovedPromptCard'
import { PromptInput } from '@/components/game/PromptInput'
import { ScoreBreakdown } from '@/components/game/ScoreBreakdown'
import { ScoreRing } from '@/components/game/ScoreRing'
import { TargetImageCard } from '@/components/game/TargetImageCard'
import { Timer } from '@/components/game/Timer'

const CHALLENGE_SECONDS = 60

export default function PlayPage() {
  const { state } = useGameState()
  const router = useRouter()

  // If we ever land on /play while a generation is in-flight (e.g. browser
  // back-button), bounce to the dedicated generating route.
  useEffect(() => {
    if (state.gameState === 'generating') {
      router.replace('/play/generating')
    }
  }, [state.gameState, router])

  return (
    <div className="min-h-screen w-full px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-5xl mx-auto">
        <Header />
        <div className="mt-8">
          {state.gameState === 'idle' && <LoadingView />}
          {state.gameState === 'challenge' && state.challenge && (
            <ChallengeView />
          )}
          {state.gameState === 'results' && <ResultsView />}
        </div>
      </div>
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

const LOADING_STEPS = [
  'Booting up the engine…',
  'Picking a scene…',
  'Generating your target…',
  'Setting up the round…',
]

const LOADING_STEP_INTERVAL_MS = 350

function LoadingView() {
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    setVisibleCount(1)
    const interval = setInterval(() => {
      setVisibleCount((c) => Math.min(c + 1, LOADING_STEPS.length))
    }, LOADING_STEP_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  const activeIdx = visibleCount - 1

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        marginTop: '1.5rem',
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
          animation: 'load-pulse 2s ease-in-out infinite',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#7c3aed',
            border: '2px solid #1a1a1a',
            animation: 'load-pulse-inner 2s ease-in-out infinite',
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
          preparing your challenge
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
          Warming up. I&apos;ll have something good for you in a sec.
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
        {LOADING_STEPS.slice(0, visibleCount).map((step, i) => {
          const done = i < activeIdx
          return (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                animation: 'load-step-in 350ms ease-out',
              }}
            >
              <LoadingCheckBox done={done} />
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
              animation: `load-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes load-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.05); }
        }
        @keyframes load-pulse-inner {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(0.8); opacity: 0.75; }
        }
        @keyframes load-step-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes load-dot {
          0%, 80%, 100% { opacity: 0.35; transform: scale(0.85); }
          40%           { opacity: 1;    transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

function LoadingCheckBox({ done }: { done: boolean }) {
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

function ChallengeView() {
  const { state, submitPrompt, forfeit } = useGameState()
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!state.challenge) return null

  const startSubmit = (value: string) => {
    if (submitting) return
    setSubmitting(true)
    router.replace('/play/generating')
    void submitPrompt(value)
  }

  const handleExpire = () => {
    if (submitting) return
    if (prompt.trim().length > 0) {
      startSubmit(prompt)
    } else {
      forfeit()
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#1a1a1a',
              margin: 0,
            }}
          >
            Recreate this image
          </h2>
          <Timer
            durationSeconds={CHALLENGE_SECONDS}
            onExpire={handleExpire}
            resetKey={state.challenge.challengeId}
          />
        </div>
        <TargetImageCard
          imageUrl={state.challenge.targetImageUrl}
          theme={state.challenge.theme}
        />
      </div>

      <div className="flex flex-col gap-4">
        <SketchCard rotate={0.5} altRadius>
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={startSubmit}
            disabled={submitting}
          />
        </SketchCard>
      </div>
    </div>
  )
}

function ResultsView() {
  const { state, replayCurrentChallenge, nextChallenge } = useGameState()
  const [showHint, setShowHint] = useState(false)

  if (!state.challenge || !state.attempt) return null

  const { feedback, forfeit, generatedImageUrl, score } = state.attempt

  return (
    <div className="flex flex-col gap-6">
      <ImageComparison
        targetUrl={state.challenge.targetImageUrl}
        generatedUrl={generatedImageUrl}
        forfeit={forfeit}
      />

      {forfeit ? (
        <SketchCard color="#fecdd3" rotate={-0.5}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1a1a1a',
              margin: 0,
              marginBottom: '0.5rem',
            }}
          >
            Round forfeited
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#1a1a1a', margin: 0 }}>
            No prompt was submitted before the timer expired. Try again?
          </p>
        </SketchCard>
      ) : (
        feedback && (
          <>
            <SketchCard>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <ScoreRing score={score ?? 0} />
                <div className="flex-1 w-full">
                  <ScoreBreakdown breakdown={feedback.breakdown} />
                </div>
              </div>
            </SketchCard>

            <FeedbackCard
              whatWorked={feedback.what_worked}
              whatToImprove={feedback.what_to_improve}
            />

            {showHint ? (
              <div className="flex flex-col gap-2">
                <ImprovedPromptCard prompt={feedback.improved_prompt} />
                <div className="flex justify-center">
                  <SketchButton
                    variant="secondary"
                    onClick={() => setShowHint(false)}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
                  >
                    ↑ Hide hint
                  </SketchButton>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <SketchButton
                  variant="amber"
                  onClick={() => setShowHint(true)}
                >
                  ✎ Show hint (improved prompt)
                </SketchButton>
              </div>
            )}
          </>
        )
      )}

      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <SketchButton
          variant="secondary"
          onClick={replayCurrentChallenge}
        >
          ↻ Play again (same image)
        </SketchButton>
        <SketchButton
          variant="primary"
          onClick={() => void nextChallenge()}
        >
          Next round →
        </SketchButton>
      </div>
    </div>
  )
}
