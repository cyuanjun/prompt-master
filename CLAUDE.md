@AGENTS.md

# PromptMaster — project context

A competitive AI prompting game. Player sees a target image, writes a prompt to recreate it blind, AI judges similarity. See [plan.md](plan.md) for the full original spec and [README.md](README.md) for setup.

## Stack
- Next.js 15 App Router + TypeScript + Tailwind v4
- Supabase (Postgres + Storage)
- OpenAI: `gpt-5.5` (judge + target prompt gen) and `gpt-image-2` (image gen) — both released April 2026, both real
- Zod for AI JSON validation

## Conventions
- **Demo mode is the default.** `NEXT_PUBLIC_DEMO_MODE=true` makes every API route return fixtures from [lib/fixtures.ts](lib/fixtures.ts). Always check `isDemoMode()` first in API handlers before doing real AI calls.
- **Multiplayer is not built yet but the architecture is ready for it.** `player_id` is nullable on `attempts`, game state has `mode: 'practice' | 'battle'`. Don't refactor away these hooks.
- **Images live in Supabase Storage**, not in Postgres. `gpt-image-2` returns base64 — decode, upload via `uploadImage()` in [lib/supabase.ts](lib/supabase.ts), save the public URL.
- **AI JSON responses are validated with Zod** (`FeedbackSchema` in [lib/validators.ts](lib/validators.ts)) with a fallback to `DEMO_FEEDBACK` on parse failure. Never trust raw model output.
- **Sketchbook aesthetic** — uneven `border-radius`, slight `rotate()`, rough `box-shadow: 3px 3px 0 #000`. Built on the `SketchCard` primitive (not yet built — Step 2). Purple `#7C3AED` primary, amber `#F59E0B` highlights, sticky-yellow `#fef9c3` for score/feedback cards.

## State machine (`/play` route)
```
challenge → generating → results
                            ├─ "Play again"  → challenge (same challengeId)
                            └─ "Next round"  → challenge (new challengeId)
```
60s timer on `challenge`. Auto-submit if non-empty on expiry, else `forfeit: true`.

## API contract
- `POST /api/challenge/create` → `{ challengeId, targetImageUrl, theme }`
- `POST /api/attempt/submit` → `{ attemptId, generatedImageUrl }`
- `POST /api/attempt/judge` → `{ score, breakdown, what_worked, what_to_improve, improved_prompt }`

These shapes are stable — UI was built against them via fixtures first.

## Build status
Phase 1 (foundation) is complete. Phase 2 is sketch primitives + `/play` state machine with mocked data. See README.md "Build order" table.
