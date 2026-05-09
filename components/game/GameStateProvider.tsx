'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { createChallenge, judgeAttempt, submitAttempt } from '@/lib/api'
import type { AppState, Challenge, Feedback } from '@/lib/types'

const INITIAL_STATE: AppState = {
  mode: 'practice',
  gameState: 'idle',
  round: { current: 1, total: 1 },
  challenge: null,
  attempt: null,
  error: null,
}

type Action =
  | { type: 'CHALLENGE_LOAD_START' }
  | { type: 'CHALLENGE_LOADED'; challenge: Challenge }
  | { type: 'SUBMIT_START'; prompt: string }
  | { type: 'SUBMIT_DONE'; attemptId: string; generatedImageUrl: string }
  | { type: 'JUDGE_DONE'; feedback: Feedback }
  | { type: 'FORFEIT_AND_RESULTS' }
  | { type: 'JUDGE_FAILED'; error: string }
  | { type: 'REPLAY_SAME' }
  | { type: 'NEXT_CHALLENGE' }
  | { type: 'ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'CHALLENGE_LOAD_START':
      return { ...state, gameState: 'idle', error: null }

    case 'CHALLENGE_LOADED':
      return {
        ...state,
        gameState: 'challenge',
        challenge: action.challenge,
        attempt: null,
        error: null,
      }

    case 'SUBMIT_START':
      return {
        ...state,
        gameState: 'generating',
        attempt: {
          attemptId: null,
          prompt: action.prompt,
          generatedImageUrl: null,
          forfeit: false,
          score: null,
          feedback: null,
        },
      }

    case 'SUBMIT_DONE':
      if (!state.attempt) return state
      return {
        ...state,
        attempt: {
          ...state.attempt,
          attemptId: action.attemptId,
          generatedImageUrl: action.generatedImageUrl,
        },
      }

    case 'JUDGE_DONE':
      if (!state.attempt) return state
      return {
        ...state,
        gameState: 'results',
        attempt: {
          ...state.attempt,
          score: action.feedback.score,
          feedback: action.feedback,
        },
      }

    case 'FORFEIT_AND_RESULTS':
      return {
        ...state,
        gameState: 'results',
        attempt: {
          attemptId: null,
          prompt: '',
          generatedImageUrl: null,
          forfeit: true,
          score: 0,
          feedback: null,
        },
      }

    case 'JUDGE_FAILED':
      // Move to results with whatever attempt we have, no feedback,
      // and an error string the UI can display.
      return {
        ...state,
        gameState: 'results',
        error: action.error,
      }

    case 'REPLAY_SAME':
      return {
        ...state,
        gameState: 'challenge',
        attempt: null,
        error: null,
      }

    case 'NEXT_CHALLENGE':
      return {
        ...state,
        gameState: 'idle',
        challenge: null,
        attempt: null,
        error: null,
      }

    case 'ERROR':
      return { ...state, error: action.error }

    case 'CLEAR_ERROR':
      return { ...state, error: null }

    default:
      return state
  }
}

type GameStateContextValue = {
  state: AppState
  startNewChallenge: () => Promise<void>
  submitPrompt: (prompt: string) => Promise<void>
  forfeit: () => void
  replayCurrentChallenge: () => void
  nextChallenge: () => Promise<void>
}

const GameStateContext = createContext<GameStateContextValue | null>(null)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const stateRef = useRef(state)
  stateRef.current = state

  // Guard against double-fire in React 18 strict mode for the initial fetch.
  const initialLoadFiredRef = useRef(false)

  const startNewChallenge = useCallback(async () => {
    dispatch({ type: 'CHALLENGE_LOAD_START' })
    try {
      const challenge = await createChallenge()
      dispatch({ type: 'CHALLENGE_LOADED', challenge })
    } catch (err) {
      dispatch({
        type: 'ERROR',
        error: err instanceof Error ? err.message : 'Failed to load challenge',
      })
    }
  }, [])

  const submitPrompt = useCallback(async (prompt: string) => {
    const challenge = stateRef.current.challenge
    if (!challenge) return

    const trimmed = prompt.trim()
    if (!trimmed) {
      dispatch({ type: 'FORFEIT_AND_RESULTS' })
      return
    }

    dispatch({ type: 'SUBMIT_START', prompt: trimmed })
    try {
      const submission = await submitAttempt({
        challengeId: challenge.challengeId,
        prompt: trimmed,
      })
      dispatch({
        type: 'SUBMIT_DONE',
        attemptId: submission.attemptId,
        generatedImageUrl: submission.generatedImageUrl,
      })
      const feedback = await judgeAttempt({ attemptId: submission.attemptId })
      dispatch({ type: 'JUDGE_DONE', feedback })
    } catch (err) {
      console.error('submit/judge failed:', err)
      const message = err instanceof Error ? err.message : String(err)
      dispatch({ type: 'JUDGE_FAILED', error: message })
    }
  }, [])

  const forfeit = useCallback(() => {
    dispatch({ type: 'FORFEIT_AND_RESULTS' })
  }, [])

  const replayCurrentChallenge = useCallback(() => {
    dispatch({ type: 'REPLAY_SAME' })
  }, [])

  const nextChallenge = useCallback(async () => {
    dispatch({ type: 'NEXT_CHALLENGE' })
    await startNewChallenge()
  }, [startNewChallenge])

  // Auto-fetch the first challenge when the provider mounts.
  useEffect(() => {
    if (initialLoadFiredRef.current) return
    initialLoadFiredRef.current = true
    void startNewChallenge()
  }, [startNewChallenge])

  const value = useMemo<GameStateContextValue>(
    () => ({
      state,
      startNewChallenge,
      submitPrompt,
      forfeit,
      replayCurrentChallenge,
      nextChallenge,
    }),
    [
      state,
      startNewChallenge,
      submitPrompt,
      forfeit,
      replayCurrentChallenge,
      nextChallenge,
    ],
  )

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState(): GameStateContextValue {
  const ctx = useContext(GameStateContext)
  if (!ctx) {
    throw new Error('useGameState must be used inside <GameStateProvider>')
  }
  return ctx
}
