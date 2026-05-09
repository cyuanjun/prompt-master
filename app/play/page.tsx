'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SketchButton } from '@/components/primitives/SketchButton'
import { SketchCard } from '@/components/primitives/SketchCard'
import { FeedbackCard } from '@/components/game/FeedbackCard'
import { GameHeader } from '@/components/game/GameHeader'
import { useGameState } from '@/components/game/GameStateProvider'
import { ImageComparison } from '@/components/game/ImageComparison'
import { ImprovedPromptCard } from '@/components/game/ImprovedPromptCard'
import { LockedPrompt } from '@/components/game/LockedPrompt'
import { PromptingTipsCard } from '@/components/game/PromptingTipsCard'
import { PromptInput } from '@/components/game/PromptInput'
import { RecreateNote } from '@/components/game/RecreateNote'
import { ScoreBreakdown } from '@/components/game/ScoreBreakdown'
import { ScoreRing } from '@/components/game/ScoreRing'
import { TargetImageCard } from '@/components/game/TargetImageCard'

const CHALLENGE_SECONDS = 60

function useCountdown(
  durationSeconds: number,
  onExpire: () => void,
  resetKey: string | number,
) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    expiredRef.current = false
    setRemaining(durationSeconds)
    const interval = setInterval(() => {
      setRemaining((prev) => (prev <= 0 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [durationSeconds, resetKey])

  useEffect(() => {
    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true
      onExpireRef.current()
    }
  }, [remaining])

  return remaining
}

function formatTime(seconds: number) {
  const safe = Math.max(0, seconds)
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

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

  // ChallengeView renders its own paper-screen + GameHeader. Idle (LoadingView)
  // and results screens use the simpler outer wrapper with no header (they're
  // transient between challenges).
  if (state.gameState === 'challenge' && state.challenge) {
    return <ChallengeView />
  }

  return (
    <div className="paper-screen min-h-[100dvh] w-full px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-5xl mx-auto">
        {state.gameState === 'idle' && <LoadingView />}
        {state.gameState === 'results' && <ResultsView />}
      </div>
    </div>
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
        className="px-5 py-4"
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

  const remaining = useCountdown(
    CHALLENGE_SECONDS,
    handleExpire,
    state.challenge?.challengeId ?? 'no-challenge',
  )

  if (!state.challenge) return null

  return (
    <main className="paper-screen flex min-h-[100svh] justify-center overflow-hidden px-4 py-3 sm:px-6 sm:py-5">
      <section className="relative mx-auto flex w-full max-w-[390px] flex-col items-stretch gap-2.5 sm:max-w-[410px] sm:gap-3">
        <GameHeader
          currentRound={state.round.current}
          totalRounds={state.round.total}
          timeLeft={formatTime(remaining)}
        />

        <div className="relative mx-auto text-center text-ink">
          <h1
            className="font-label relative inline-block"
            style={{ fontSize: 'clamp(1.42rem, 6vw, 1.78rem)' }}
          >
            Your Challenge
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-1 right-0 h-[3px]"
              style={{
                background: 'var(--purple)',
                borderRadius: 999,
                transform: 'rotate(-1.5deg) skewX(-8deg)',
              }}
            />
          </h1>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute -right-7 top-0 h-5 w-5 rotate-12 text-[var(--purple)]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          >
            <path d="M12 3l2.39 5.32L20 9.27l-4.2 3.86L17 19l-5-2.94L7 19l1.2-5.87L4 9.27l5.61-.95L12 3z" />
          </svg>
        </div>

        <TargetImageCard
          imageUrl={state.challenge.targetImageUrl}
          theme={state.challenge.theme}
        />
        <RecreateNote />
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={startSubmit}
          disabled={submitting || remaining <= 0}
          isSubmitting={submitting}
          maxLength={150}
          tip={
            remaining <= 0
              ? 'Time is up. This round is closed.'
              : 'Tip: Think about lighting, atmosphere, composition, details!'
          }
        />
      </section>
    </main>
  )
}

function ResultsView() {
  const { state, replayCurrentChallenge, nextChallenge } = useGameState()
  const [showHint, setShowHint] = useState(false)

  if (!state.challenge || !state.attempt) return null

  const { feedback, forfeit, generatedImageUrl, score } = state.attempt
  const judgeFailed = !forfeit && !feedback

  return (
    <div className="flex flex-col gap-6">
      <ImageComparison
        targetUrl={state.challenge.targetImageUrl}
        generatedUrl={generatedImageUrl}
        forfeit={forfeit}
      />

      {state.attempt.prompt && (
        <LockedPrompt
          prompt={state.attempt.prompt}
          label="✏️ Your prompt"
        />
      )}

      {forfeit ? (
        <SketchCard color="#fecdd3" rotate={-0.5} className="p-4">
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
      ) : judgeFailed ? (
        <SketchCard color="#fecdd3" rotate={-0.5} className="p-4">
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#dc2626',
              margin: 0,
              marginBottom: '0.5rem',
            }}
          >
            ⚠ Judge failed — no score available
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#1a1a1a', margin: 0 }}>
            The AI judge couldn&apos;t score this round. This is a bug — check the
            browser console + dev server logs for details.
          </p>
          {state.error && (
            <pre
              style={{
                marginTop: '0.6rem',
                fontFamily: 'var(--font-mono), ui-monospace, monospace',
                fontSize: '0.75rem',
                color: '#7f1d1d',
                background: '#fff',
                border: '1px solid #1a1a1a',
                borderRadius: '4px',
                padding: '0.5rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {state.error}
            </pre>
          )}
        </SketchCard>
      ) : (
        feedback && (
          <>
            <SketchCard className="p-4">
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

            <PromptingTipsCard tips={feedback.prompting_tips} />

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
                  ✎ Reveal the prompt that made it
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
