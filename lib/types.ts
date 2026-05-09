import type { Feedback } from './validators'

export type { Feedback }

export type Mode = 'practice' | 'battle'

export type GameState =
  | 'idle'
  | 'challenge'
  | 'generating'
  | 'results'
  | 'between-rounds'
  | 'game-over'

export type Challenge = {
  challengeId: string
  targetImageUrl: string
  theme: string
}

export type Attempt = {
  attemptId: string | null
  prompt: string
  generatedImageUrl: string | null
  forfeit: boolean
  score: number | null
  feedback: Feedback | null
}

export type Round = {
  current: number
  total: number
}

export type AppState = {
  mode: Mode
  gameState: GameState
  round: Round
  challenge: Challenge | null
  attempt: Attempt | null
  error: string | null
}
