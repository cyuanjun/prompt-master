# PromptMaster

A competitive AI prompting game. You're shown a target image. You write a prompt to recreate it — blind. AI judges how close you got and tells you why.

**Tagline:** Learn what's possible. Master how to achieve it.

**Live:** [prompt-battle-arena.vercel.app](https://prompt-battle-arena.vercel.app/)

> Solo (practice) ships first. Multiplayer (battle) is wired into the architecture from day one and will follow.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind v4 |
| Database + Storage | Supabase (Postgres + Storage) |
| Image generation | OpenAI `gpt-image-2` (separate API key supported) |
| Judging | OpenAI `gpt-5.5` (vision) |
| Validation | Zod |
| Hosting | Vercel |

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Set up environment

Copy the example env:

```bash
cp .env.example .env.local
```

For a first run **you don't need to fill anything in** — `NEXT_PUBLIC_DEMO_MODE=true` is the default, and demo mode returns fixture data from every API route. You can build and test the entire UI without Supabase or OpenAI.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo mode vs live mode

The app has two modes, controlled by `NEXT_PUBLIC_DEMO_MODE` in [.env.local](.env.local):

| Mode | When `NEXT_PUBLIC_DEMO_MODE` is | What happens |
|---|---|---|
| **Demo** (default) | `true` | API routes return fixtures from [lib/fixtures.ts](lib/fixtures.ts). 5 pre-drawn SVG scenarios cycle randomly. No Supabase, no OpenAI calls, no spend. |
| **Live** | `false` | Real `gpt-image-2` generation, real `gpt-5.5` vision judging. Real Supabase reads/writes. ~$0.08 per round. |

You can build the entire game loop in demo mode. Flip to live once you've added your keys.

---

## Going live — full setup

### Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. **Settings → API** — copy the Project URL, the publishable / anon key, and the secret / service-role key into [.env.local](.env.local).
3. Run **both** SQL migrations in order in **SQL Editor**:
   - [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) — creates `challenges`, `attempts` tables + `images` storage bucket.
   - [supabase/migrations/0002_challenge_queue.sql](supabase/migrations/0002_challenge_queue.sql) — adds `claimed_at` column for the queue.
4. Confirm under **Storage** → an `images` bucket exists with PUBLIC status.
5. Confirm under **Table Editor** → both `challenges` and `attempts` tables exist.

### OpenAI

You can use **one key for everything**, or split into two keys (e.g. when a sponsor or different org provides image-only access):

- `OPENAI_API_KEY` — used for `gpt-5.5` (target prompt generation + vision judging).
- `OPENAI_IMAGE_API_KEY` (optional) — separate key used only for `gpt-image-2`. Falls back to `OPENAI_API_KEY` if unset.

Note: `gpt-image-2` requires **organization verification** (Settings → Organization → Verifications). If your org isn't verified, you'll get 403s on image gen. Verification can take from minutes to days.

### Flip the switch

```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=false
```

**Restart the dev server** (Ctrl+C → `npm run dev`). Live AI is now active.

---

## Project structure

```
app/
├── page.tsx                          -- landing
├── icon.svg                          -- favicon (sketch P)
├── play/
│   ├── layout.tsx                    -- wraps in GameStateProvider
│   ├── page.tsx                      -- challenge + results state machine
│   └── generating/page.tsx           -- "thinking" page (phase-based progression)
└── api/
    ├── challenge/create/             -- claim from queue OR generate (gpt-5.5 → gpt-image-2 → upload)
    ├── attempt/submit/               -- gpt-image-2 renders user's prompt → upload
    └── attempt/judge/                -- gpt-5.5 vision compares (base64 inline) → score + feedback

components/
├── primitives/
│   ├── SketchCard.tsx                -- uneven radius, rough shadow, optional rotate
│   └── SketchButton.tsx              -- press animation, 140ms click delay
└── game/
    ├── GameStateProvider.tsx         -- reducer + actions, /play layout-scoped context
    ├── TargetImageCard.tsx
    ├── PromptInput.tsx               -- textarea + char count (150 max) + submit
    ├── Timer.tsx                     -- 60s countdown, auto-fires onExpire from commit phase
    ├── LockedPrompt.tsx
    ├── ImageComparison.tsx
    ├── ScoreRing.tsx                 -- animated count-up, color tier by score
    ├── ScoreBreakdown.tsx            -- 5 metric bars
    ├── FeedbackCard.tsx              -- specific "what worked" / "what to improve"
    ├── PromptingTipsCard.tsx         -- generic transferable lessons (light blue)
    └── ImprovedPromptCard.tsx        -- the actual target_prompt, behind hint button

lib/
├── supabase.ts                       -- browser + server clients, uploadImage helper
├── openai.ts                         -- two clients (judge + image), MODELS constant
├── prompts.ts                        -- buildTargetPrompt, buildJudgePrompt
├── validators.ts                     -- FeedbackSchema (Zod) + Feedback type
├── fixtures.ts                       -- 5 demo scenarios + isDemoMode()
├── themes.ts                         -- 30 random themes + pickRandomTheme()
├── challenge.ts                      -- queue claim + generate + auto-refill helpers
├── api.ts                            -- client-side fetch wrappers
└── types.ts                          -- AppState, GameState, Challenge, Attempt

supabase/
└── migrations/
    ├── 0001_init.sql                 -- challenges, attempts, images bucket
    └── 0002_challenge_queue.sql      -- claimed_at column for queue

public/
└── demo/                             -- 5 hand-drawn SVG target/attempt pairs for demo mode
```

---

## Build status

| Phase | What | Status |
|---|---|---|
| 1 | Foundation: scaffold + deps + schema + lib skeletons | ✅ Done |
| 2 | Sketch primitives + `/play` state machine on demo data | ✅ Done |
| 3 | Wire live API routes (challenge / submit / judge) with real OpenAI + Supabase | ✅ Done |
| 4 | Landing page + thinking screens + hint reveal | ✅ Done |
| 5 | Image queue + auto-refill so rounds load instantly | ✅ Done |
| 6 | Theme dedup across recent challenges | ✅ Done |
| 7 | Prompt-coaching judge (not image critique) + generic prompting tips | ✅ Done |
| 8 | Multi-round score / game-over flow | 🚧 Not built (single round only) |
| 9 | Multiplayer (battle): rooms, lobby, realtime | 🚧 Not built (architecture-ready) |
| 10 | Polish (mobile layout, copy, aesthetic) | 🚧 Ongoing |

---

## Game flow (solo / live mode)

```
landing → /play
            ├─ idle           "Booting up the engine…" thinking screen
            ├─ challenge      target image + prompt input + 60s timer
            └─ /play/generating
                              "Reading prompt → Rendering image → Comparing → Scoring"
                              checklist progresses with real API phases
            └─ results        target vs your image side-by-side
                              score (0-100), 5-metric breakdown
                              "what worked" + "what to improve"
                              prompting tips (generic lessons)
                              "Reveal the prompt" button → the actual target_prompt
                  ├─ "Play again"  → retry SAME image
                  └─ "Next round"  → claim from queue (instant)
```

**Timer:** 60s on challenge. On expiry, auto-submit if non-empty; mark forfeit if empty.

---

## Image queue

`/api/challenge/create` reads from a pre-generated pool instead of generating on demand. Trade-off: the first round after a long pause may be slow (~30s) if the pool is empty; subsequent rounds are instant.

| Behavior | Detail |
|---|---|
| Read | `tryClaimFromQueue()` does an atomic `UPDATE WHERE claimed_at IS NULL` — race-safe with concurrent players. |
| Refill | After every successful claim, `after()` triggers `refillOne()` to generate a replacement in the background. Steady-state queue size = whatever you started with. |
| Empty pool | Falls back to inline generation (~30s). Marks the new row claimed and triggers refill. |
| Theme dedup | `pickFreshTheme()` queries the last 20 challenges and prefers themes not in the recent set. Cycles through all 30 themes before recycling. |

---

## Judging philosophy

The judge ([lib/prompts.ts](lib/prompts.ts)) is calibrated as a **prompt-writing coach**, not an image-similarity critic. Every line of feedback references words the player used or could have used — never just visual differences caused by image-gen variance.

| Field | Purpose |
|---|---|
| `score` 0-100 | Overall prompt quality. Anchored: 90+ = captures all key subjects, 75-89 = solid with gaps, 60-74 = right ballpark, <40 = wrong subject. |
| `breakdown` (5 × 0-20) | Style, composition, lighting, details, atmosphere. Sum equals score. |
| `what_worked` (array of strings) | Specific phrases from the player's prompt that landed. Quotes their words. |
| `what_to_improve` (array of strings) | Specific words to add or swap. Quotes the player's actual text. |
| `improved_prompt` (string) | **The actual `target_prompt` we used to generate the image** — overridden server-side from the AI's rewrite for reliability. |
| `prompting_tips` (array of strings) | Generic transferable principles ("specific adjectives beat generic nouns", "name lighting explicitly", etc.) not tied to this round. |

---

## Multiplayer (future, but architected for)

The data model and state machine include hooks for multiplayer from day one:

- `mode: 'practice' | 'battle'` in [lib/types.ts](lib/types.ts)
- `player_id` is nullable on `attempts` (`null` = solo)
- `room_id` will be nullable on `rounds` when added

Adding multiplayer means adding routes (`/api/room/*`, `/api/round/*`) and components, not refactoring existing code.

---

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # ESLint
```

---

## Notes

- **`gpt-image-2` returns base64**, not a URL. Always decode and upload to Supabase Storage before saving to DB. Never store raw base64 in Postgres. The [lib/supabase.ts](lib/supabase.ts) `uploadImage()` helper handles this.
- **Vision judge sends images inline as base64**, not as URLs. Pre-fetched on the server in [lib/openai.ts](lib/openai.ts) `judgeImages()` because OpenAI's URL fetcher has tight timeouts that intermittently fail against Supabase Storage.
- **Vercel function timeout** is 60s for API routes (set in [vercel.json](vercel.json)). Image generation typically takes 25-30s; judging takes 15-20s.
- **AI JSON parsing** is wrapped in Zod (`FeedbackSchema`). On parse failure, the server returns a `502` with the raw response and details — failures are surfaced in the UI, not silently masked.
- **Demo mode + live mode share the same API contracts.** UI was built against fixtures first, then live AI was wired without changing the client.
