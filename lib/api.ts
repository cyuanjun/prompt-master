import type { Challenge, Feedback } from './types'

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${url} → ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export type CreateChallengeResponse = Challenge

export function createChallenge(): Promise<CreateChallengeResponse> {
  return postJson<CreateChallengeResponse>('/api/challenge/create', {})
}

export type SubmitAttemptResponse = {
  attemptId: string
  generatedImageUrl: string
}

export function submitAttempt(input: {
  challengeId: string
  prompt: string
}): Promise<SubmitAttemptResponse> {
  return postJson<SubmitAttemptResponse>('/api/attempt/submit', input)
}

export type JudgeAttemptResponse = Feedback

export function judgeAttempt(input: {
  attemptId: string
}): Promise<JudgeAttemptResponse> {
  return postJson<JudgeAttemptResponse>('/api/attempt/judge', input)
}
