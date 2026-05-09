# PromptMaster — Build Plan

## Overview

**Product:** PromptMaster — a competitive AI prompting game  
**Tagline:** Learn what's possible. Master how to achieve it.  
**Deadline:** 24 hours  
**Team:** Solo, fullstack  
**Stack:** Next.js App Router · Tailwind · Supabase · OpenAI

---

## Theme & Aesthetic

Inspired by a sketchbook / whiteboard aesthetic. Not pixel-matched — channeling the vibe.

**The 4 things that make it feel right:**
- Uneven border-radius on cards — `border-radius: 2px 8px 4px 10px`
- Slight rotations on sticky elements — `rotate(-1deg)` or `rotate(0.5deg)`
- Purple `#7C3AED` for primary actions, amber `#F59E0B` for highlights and scores
- Rough box-shadow — `3px 3px 0 #000` not soft drop shadows

**Core reusable primitive:**
```tsx
export function SketchCard({ children, rotate = 0, color = 'white' }) {
  return (
    <div style={{
      background: color,
      border: '2px solid #1a1a1a',
      borderRadius: '2px 10px 4px 8px',
      boxShadow: '3px 3px 0 #1a1a1a',
      transform: `rotate(${rotate}deg)`,
      padding: '1rem',
    }}>
      {children}
    </div>
  )
}
```

Use `color="#fef9c3"` (sticky yellow) for score and improved prompt cards. Use `rotate={-1}` on feedback cards.

---

## AI Models

| Task | Model |
|---|---|
| Generate target image | `gpt-image-2` |
| Generate user's image | `gpt-image-2` |
| Judge + score + improved prompt | `gpt-5.5` |

**Image generation note:** `gpt-image-2` returns base64, not a URL. Always decode and upload to Supabase Storage before saving to DB. Never store raw base64 in Postgres.

```ts
const base64 = response.data[0].b64_json
const buffer = Buffer.from(base64, 'base64')
await supabase.storage.from('images').upload(`${id}.png`, buffer)
```

**Leave thinking mode off** on `gpt-image-2` — you want speed, not maximum fidelity.

**Vercel function timeout** — image generation and judging can take 10–20s. Set in `vercel.json`:
```json
{
  "functions": {
    "app/api/**": { "maxDuration": 60 }
  }
}
```

---

## User Flow

### Split point — landing page
User arrives → chooses **Practice** (solo) or **Battle** (multiplayer).  
A "How to play" popup is also available from landing.

### Practice path
Landing → Challenge → Generating → Results → Between rounds → (loop or game over)

### Battle path
Landing → Battle entry → Join room / Create room → Room lobby → Challenge → Generating → Results → Between rounds → (loop or game over)

### Convergence point
Both paths merge at the **Challenge screen** and share all screens from there onwards.  
Battle adds: round indicator, player submit count, leaderboard, reveal sequence.

### Between rounds — timer logic
```ts
if (currentRound < totalRounds) {
  // auto-advance after 5s, skip button available
  setTimeout(() => advanceToNextRound(), 5000)
} else {
  // last round — explicit exit only, no auto-advance
  showGameOver()
}
```

---

## Screens

| # | Screen | Type | Route |
|---|---|---|---|
| 1 | Landing | Page | `/` |
| 2 | How to play | Popup | overlay on `/` |
| 3 | Join room | Page | `/join` |
| 4 | Room lobby | Page | `/room/[code]` |
| 5 | Challenge | State | `/play` — `gameState: challenge` |
| 6 | Generating | State | `/play` — `gameState: generating` |
| 7 | Results + feedback | State | `/play` — `gameState: results` |
| 8 | Between rounds / game over | State | `/play` — `gameState: between-rounds \| game-over` |

Screens 5–8 are one route (`/play`) driven by a `gameState` machine.

---

## Game State Machine

```ts
type Mode = 'practice' | 'battle'

type GameState =
  | 'challenge'
  | 'generating'
  | 'results'
  | 'between-rounds'
  | 'game-over'

type AppState = {
  mode: Mode
  gameState: GameState
  round: { current: number; total: number }
  session: { challengeId: string; targetImageUrl: string; theme: string }
  attempt: {
    attemptId: string
    prompt: string
    generatedImageUrl: string
    score: number
    feedback: Feedback
  } | null
}
```

Provide this via `GameStateProvider` context. No prop drilling — every component reads from context.

---

## Components

### Priority 1 — build first (solo loop)

| Component | Description |
|---|---|
| `SketchCard` | Base card primitive — uneven radius, rough shadow, optional rotate + color |
| `SketchButton` | Primary + secondary variants, rough shadow, solid border |
| `GameStateProvider` | Context holding full AppState |
| `TargetImageCard` | Target image + theme label, sketch border |
| `PromptInput` | Textarea + char count + tip + submit button |
| `GeneratingSpinner` | Dashed circle animation, cycles progress copy |
| `LockedPrompt` | User's submitted prompt shown read-only during generating |
| `ImageComparison` | Target vs result side by side |
| `ScoreRing` | Animated count-up to final score |
| `ScoreBreakdown` | 5 metric bars — style, composition, lighting, details, atmosphere |
| `FeedbackCard` | What worked + what to improve lists |
| `ImprovedPromptCard` | AI suggested prompt, amber sticky note, copy button |

### Priority 2 — after solo loop works

| Component | Description |
|---|---|
| `AutoAdvanceTimer` | 5s countdown bar, skip button, auto-fires next round |
| `GameOver` | Final scores, winner, play again / back to landing |
| `HeroSection` | Tagline, concept, example image teaser |
| `HowItWorks` | 3-step explainer inline on landing |
| `HowToPlayModal` | Popup, rules + example, got it CTA |
| `ModeCTAs` | Practice + Battle buttons |

### Priority 3 — battle

| Component | Description |
|---|---|
| `RoundIndicator` | Round 2/5 + countdown timer bar |
| `PlayerSubmitCount` | X/Y players submitted live |
| `WaitingForPlayers` | Waiting on others copy during generating |
| `Leaderboard` | All players ranked by score |
| `RevealSequence` | Animated low → high score reveal, winner crown (post-MVP) |
| `RoomCodeInput` | Code entry + name input + join button |
| `RoomCodeDisplay` | Large code + QR code for sharing |
| `PlayerList` | Live list, host badge, waiting indicator |

---

## Data Model

### Practice tables

**`challenges`**
```sql
id              uuid primary key default gen_random_uuid()
theme           text
target_prompt   text        -- hidden from user
target_image_url text
created_at      timestamptz default now()
```

**`attempts`**
```sql
id                   uuid primary key default gen_random_uuid()
challenge_id         uuid references challenges(id)
player_id            uuid references players(id)  -- null for solo
prompt               text
generated_image_url  text
score                int2
feedback             jsonb
created_at           timestamptz default now()
```

### Battle tables

**`rooms`**
```sql
id             uuid primary key default gen_random_uuid()
code           text unique  -- 6-char nanoid, indexed
status         text         -- waiting | active | finished
total_rounds   int2
current_round  int2
created_at     timestamptz default now()
```

**`players`**
```sql
id        uuid primary key default gen_random_uuid()
room_id   uuid references rooms(id)
name      text
is_host   bool default false
joined_at timestamptz default now()
```

**`rounds`**
```sql
id            uuid primary key default gen_random_uuid()
room_id       uuid references rooms(id)
challenge_id  uuid references challenges(id)
round_number  int2
status        text  -- active | judging | complete
started_at    timestamptz
```

### feedback jsonb shape
```ts
type Feedback = {
  breakdown: {
    style: number        // max 20
    composition: number  // max 20
    lighting: number     // max 20
    details: number      // max 20
    atmosphere: number   // max 20
  }
  what_worked: string[]
  what_to_improve: string[]
  improved_prompt: string
}
```

`score` is stored as a separate column on `attempts` for easy sorting/querying. `feedback` is stored as jsonb so the shape can evolve without schema migrations.

### Realtime subscriptions needed
- `rooms` — watch `status` change `waiting → active` to push all players into challenge
- `players` — watch inserts to update lobby player list live
- `rounds` — watch `status` change `active → complete` to trigger results reveal
- `attempts` — watch inserts filtered by `room_id` to update X/Y submitted count

---

## API Routes

### Practice — P1

**`POST /api/challenge/create`**
```ts
// Request
{ theme: string }

// Response
{ challengeId: string, targetImageUrl: string, theme: string }

// Pipeline
// gpt-5.5 generates hidden target prompt
// → gpt-image-2 generates target image
// → decode base64 → upload to Supabase Storage
// → insert into challenges table
```

**`POST /api/attempt/submit`**
```ts
// Request
{ challengeId: string, prompt: string, playerId?: string }

// Response
{ attemptId: string, generatedImageUrl: string }

// Pipeline
// gpt-image-2 generates image from user prompt
// → decode base64 → upload to Supabase Storage
// → insert into attempts table (playerId null for solo)
```

**`POST /api/attempt/judge`**
```ts
// Request
{ attemptId: string }

// Response
{ score, breakdown, what_worked, what_to_improve, improved_prompt }

// Pipeline
// fetch attempt + challenge from DB
// → send targetImageUrl + generatedImageUrl + prompt to gpt-5.5
// → validate response with Zod
// → update attempts row with score + feedback
// → return feedback
```

**Solo call sequence:**
```
POST /api/challenge/create  → challengeId + targetImageUrl
POST /api/attempt/submit    → attemptId + generatedImageUrl
POST /api/attempt/judge     → score + feedback
```

### Battle — P3

**`POST /api/room/create`**
```ts
// Request
{ hostName: string, totalRounds: number }
// Response
{ roomId, roomCode, playerId }
```

**`POST /api/room/join`**
```ts
// Request
{ roomCode: string, playerName: string }
// Response
{ roomId, playerId, totalRounds, players: Player[] }
// Error if room not found or status !== 'waiting'
```

**`GET /api/room/[code]`**
```ts
// Response
{ roomId, status, totalRounds, currentRound, players: Player[] }
// Used for initial lobby load only — Realtime takes over after
```

**`POST /api/room/start`**
```ts
// Request
{ roomId: string, playerId: string }
// Response
{ roundId, challengeId, targetImageUrl }
// Validates playerId is host → creates first round → updates room status → Realtime broadcasts
```

**`POST /api/round/next`**
```ts
// Request
{ roomId: string, playerId: string }
// Response
{ roundId, challengeId, targetImageUrl, isLastRound: boolean }
// Host only — increments currentRound → new round + challenge → Realtime pushes to all players
```

---

## Judge Prompt

> **Note:** Test this manually in the OpenAI playground with a real target image and a weak attempt before wiring into code. Verify scores feel right and feedback is specific. 15 minutes here saves an hour of debugging.

```ts
// lib/prompts.ts
export function buildJudgePrompt(userPrompt: string) {
  return `You are an expert AI image judge for a prompting game called PromptMaster.

You will receive:
1. A TARGET IMAGE — the image the player was trying to recreate
2. A PLAYER IMAGE — the image generated from the player's prompt
3. The PLAYER'S PROMPT — the exact text they submitted

Your job is to score how well the player's image recreates the target.

SCORING RULES:
Score each category out of its maximum. Be honest — do not inflate scores.
A perfect recreation scores 95-100. Most good attempts score 60-80.

Categories:
- style (max 20): art style, rendering technique, overall aesthetic
- composition (max 20): layout, framing, subject placement
- lighting (max 20): light sources, shadows, time of day, mood
- details (max 20): specific objects, textures, fine elements
- atmosphere (max 20): mood, feeling, color temperature, vibe

FEEDBACK RULES:
- what_worked: 2–3 specific things the player got right. Be concrete, not generic.
- what_to_improve: 2–3 specific things that are missing or wrong. Reference exact details from the target image.
- improved_prompt: Rewrite the player's prompt to better capture the target. Keep their intent but add the missing elements. Max 2 sentences.

RESPONSE FORMAT:
Respond ONLY with a valid JSON object. No markdown, no explanation, no preamble.
Use exactly these keys: score, breakdown, what_worked, what_to_improve, improved_prompt.

PLAYER PROMPT: "${userPrompt}"`
}
```

**Zod validation:**
```ts
// lib/validators.ts
import { z } from 'zod'

export const FeedbackSchema = z.object({
  score: z.number().int().min(0).max(100),
  breakdown: z.object({
    style: z.number().int().min(0).max(20),
    composition: z.number().int().min(0).max(20),
    lighting: z.number().int().min(0).max(20),
    details: z.number().int().min(0).max(20),
    atmosphere: z.number().int().min(0).max(20),
  }),
  what_worked: z.array(z.string()).min(1).max(4),
  what_to_improve: z.array(z.string()).min(1).max(4),
  improved_prompt: z.string().min(10),
})

export type Feedback = z.infer<typeof FeedbackSchema>
```

**Safe parse with demo fallback:**
```ts
const raw = response.choices[0].message.content ?? ''
const cleaned = raw.replace(/```json|```/g, '').trim()

let feedback: Feedback
try {
  feedback = FeedbackSchema.parse(JSON.parse(cleaned))
} catch {
  feedback = DEMO_FEEDBACK
}
```

---

## Demo Mode

Add to `.env.local`:
```
NEXT_PUBLIC_DEMO_MODE=true
```

Every API route checks this first:
```ts
if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  return Response.json(DEMO_FIXTURES.challenge)
}
```

Pre-generate 5–10 target images manually and store as static assets. Only wire live generation once the UI loop is solid.

---

## Build Order

| Phase | What | Priority |
|---|---|---|
| 1 | Repo setup · env · Supabase schema | Before anything |
| 2 | `SketchCard` · `SketchButton` · `GameStateProvider` | P1 primitives |
| 3 | `/play` — all states with mock data | P1 solo loop |
| 4 | Wire `/api/challenge/create` + `/api/attempt/submit` + `/api/attempt/judge` | P1 AI loop |
| 5 | Connect frontend to API, loading states, error → demo fallback | P1 wiring |
| 6 | Landing page + how to play popup | P2 |
| 7 | `AutoAdvanceTimer` + `GameOver` | P2 |
| 8 | Battle: `/join` + `/room/[code]` + battle API routes | P3 |
| 9 | Battle indicators on `/play` + Realtime subscriptions | P3 |
| 10 | Polish · animations · deploy to Vercel | Final |

---

## Folder Structure

```
app/
├── page.tsx                     -- landing
├── join/page.tsx                -- join room
├── room/[code]/page.tsx         -- room lobby
├── play/page.tsx                -- game (all states)
├── api/
│   ├── challenge/create/route.ts
│   ├── attempt/submit/route.ts
│   ├── attempt/judge/route.ts
│   ├── room/create/route.ts
│   ├── room/join/route.ts
│   ├── room/[code]/route.ts
│   ├── room/start/route.ts
│   └── round/next/route.ts
components/
├── primitives/
│   ├── SketchCard.tsx
│   └── SketchButton.tsx
├── game/
│   ├── GameStateProvider.tsx
│   ├── TargetImageCard.tsx
│   ├── PromptInput.tsx
│   ├── GeneratingSpinner.tsx
│   ├── LockedPrompt.tsx
│   ├── ImageComparison.tsx
│   ├── ScoreRing.tsx
│   ├── ScoreBreakdown.tsx
│   ├── FeedbackCard.tsx
│   ├── ImprovedPromptCard.tsx
│   ├── AutoAdvanceTimer.tsx
│   └── GameOver.tsx
├── landing/
│   ├── HeroSection.tsx
│   ├── HowItWorks.tsx
│   ├── HowToPlayModal.tsx
│   └── ModeCTAs.tsx
└── battle/
    ├── RoundIndicator.tsx
    ├── PlayerSubmitCount.tsx
    ├── WaitingForPlayers.tsx
    ├── Leaderboard.tsx
    ├── RevealSequence.tsx
    ├── RoomCodeInput.tsx
    ├── RoomCodeDisplay.tsx
    └── PlayerList.tsx
lib/
├── supabase.ts
├── openai.ts
├── prompts.ts      -- buildJudgePrompt()
├── validators.ts   -- FeedbackSchema + Feedback type
├── fixtures.ts     -- DEMO_FEEDBACK + DEMO_FIXTURES
└── room-code.ts    -- nanoid 6-char generator
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_DEMO_MODE=true
```
