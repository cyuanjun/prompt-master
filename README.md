# PromptMaster

A competitive AI prompting game. You're shown a target image. You write a prompt to recreate it — blind. AI judges how close you got and tells you why.

**Tagline:** Learn what's possible. Master how to achieve it.

> Solo (practice) ships first. Multiplayer (battle) is wired into the architecture from day one and will follow.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind v4 |
| Database + Storage | Supabase (Postgres + Storage) |
| Image generation | OpenAI `gpt-image-2` |
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

Copy the example env and fill in what you need:

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
| **Demo** (default) | `true` | API routes return fixtures from [lib/fixtures.ts](lib/fixtures.ts). No Supabase, no OpenAI calls, no spend. Use this while building UI. |
| **Live** | `false` | Real OpenAI image generation + judging. Real Supabase reads/writes. Costs ~$0.04 per image. |

**You can build the entire game loop in demo mode.** Only flip to `live` once the UI is solid and you've added your keys.

---

## Going live — when you're ready

Once you've finished UI work in demo mode, set up Supabase and OpenAI:

### Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is plenty).
2. Get your project URL + anon key + service role key from **Settings → API** and paste into [.env.local](.env.local).
3. Run the schema migration:
   - **Easy:** open the Supabase SQL editor, paste the contents of [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql), click run.
   - **CLI:** `supabase db push` if you've linked the project.
4. Confirm the `images` bucket exists under **Storage** (the migration creates it).

### OpenAI

1. Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and paste into [.env.local](.env.local).
2. Make sure your account has access to `gpt-image-2` and `gpt-5.5` (released April 2026 — most accounts do).

### Flip the switch

```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=false
```

Restart the dev server. Real AI is now live.

---

## Project structure

```
app/
├── page.tsx                     -- landing
├── play/page.tsx                -- game (state machine)
└── api/
    ├── challenge/create/        -- gpt-5.5 writes hidden prompt → gpt-image-2 renders target
    ├── attempt/submit/          -- gpt-image-2 renders user's prompt
    └── attempt/judge/           -- gpt-5.5 vision compares both → score + feedback

components/
├── primitives/                  -- SketchCard, SketchButton (sketchbook aesthetic)
├── game/                        -- TargetImageCard, PromptInput, ScoreRing, etc
├── landing/                     -- HeroSection, HowToPlayModal, ModeCTAs
└── battle/                      -- (future) RoomCodeInput, Leaderboard, etc

lib/
├── supabase.ts                  -- browser + server clients, uploadImage helper
├── openai.ts                    -- singleton client + MODELS constant
├── prompts.ts                   -- buildTargetPrompt, buildJudgePrompt
├── validators.ts                -- FeedbackSchema (Zod) + Feedback type
├── fixtures.ts                  -- DEMO_FIXTURES + isDemoMode()
└── themes.ts                    -- 30 random themes + pickRandomTheme()

supabase/
└── migrations/
    └── 0001_init.sql            -- challenges, attempts, images bucket
```

---

## Build order

| Phase | What | Status |
|---|---|---|
| 1 | Foundation: scaffold + deps + schema + lib skeletons | ✅ Done |
| 2 | Sketch primitives + `/play` state machine with demo data | Next |
| 3 | Wire live API routes (challenge / submit / judge) | After |
| 4 | Landing page + how-to-play modal | After |
| 5 | Multi-round + game-over flow | After |
| 6 | Multiplayer (battle): rooms, lobby, realtime | After MVP |
| 7 | Polish + deploy to Vercel | Final |

---

## Game flow (solo)

```
landing → /play
            └─ challenge   (target image + prompt input + 60s timer)
            └─ generating  (show user their locked prompt + spinner)
            └─ results     (target vs generated side-by-side, score, feedback)
                  ├─ "Play again"  → retry SAME image (refine your prompt)
                  └─ "Next round"  → new challenge
```

**Timer:** 60s on the challenge state. On expiry — if textbox is non-empty, auto-submit. If empty, mark forfeit and skip generation.

---

## Multiplayer (future, but architected for)

The data model and state machine include hooks for multiplayer from day one:

- `mode: 'practice' | 'battle'` in game state
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
- **Vercel function timeout** is 60s for API routes (set in [vercel.json](vercel.json)). Image generation can take 10–20s.
- **AI JSON parsing** is wrapped in Zod with a fallback to `DEMO_FEEDBACK` — if the model returns malformed JSON, the user still gets a score.
