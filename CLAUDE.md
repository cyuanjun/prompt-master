@AGENTS.md

# PromptMaster — project context

A competitive AI prompting game. Player sees a target image, writes a prompt to recreate it blind, AI judges similarity. See [plan.md](plan.md) for the full original spec and [README.md](README.md) for setup + current build status.

**Live deploy:** [prompt-battle-arena.vercel.app](https://prompt-battle-arena.vercel.app/)

## Stack
- Next.js 16 App Router + TypeScript + Tailwind v4
- Supabase (Postgres + Storage)
- OpenAI:
  - `gpt-5.5` for target prompt generation + vision judging — uses `OPENAI_API_KEY`
  - `gpt-image-2` for image generation — uses `OPENAI_IMAGE_API_KEY` if set, else falls back to `OPENAI_API_KEY`. The split exists so a sponsor / image-only org key can power image gen while the main key handles text.
- Zod for AI JSON validation

## Conventions

**Demo mode default in fresh clones.** `NEXT_PUBLIC_DEMO_MODE=true` makes every API route return fixtures from [lib/fixtures.ts](lib/fixtures.ts) (5 hand-drawn SVG scenarios). Always check `isDemoMode()` first in API handlers.

**Live mode is wired for solo play.** All three API routes have working live paths. Live and demo share the same response contracts so the UI is identical.

**Multiplayer not built but architecture-ready.** `player_id` is nullable on `attempts`, game state has `mode: 'practice' | 'battle'`. Don't refactor away these hooks.

**Images live in Supabase Storage**, not in Postgres. `gpt-image-2` returns base64 — decode, upload via `uploadImage()` in [lib/supabase.ts](lib/supabase.ts), save the public URL.

**Vision judge sends images inline as base64.** OpenAI's URL fetcher has tight timeouts that fail intermittently against Supabase Storage. [lib/openai.ts](lib/openai.ts) `judgeImages()` pre-fetches on our server and inlines as `data:image/png;base64,...`.

**Challenge queue with auto-refill.** Migration `0002` added `claimed_at` to `challenges`. [lib/challenge.ts](lib/challenge.ts):
- `tryClaimFromQueue()` — atomic `UPDATE WHERE claimed_at IS NULL`, race-safe.
- `refillOne()` — generates one new challenge in the background.
- Called via `after()` in [app/api/challenge/create/route.ts](app/api/challenge/create/route.ts) after every claim. Steady-state queue size stays at whatever it started at.

**Theme dedup.** `pickFreshTheme()` in [lib/challenge.ts](lib/challenge.ts) queries last 20 challenges, prefers themes not in the recent set. Cycles through all 30 themes before recycling.

**Hint = the actual `target_prompt`, not an AI rewrite.** Judge's `improved_prompt` field is overridden server-side in [app/api/attempt/judge/route.ts](app/api/attempt/judge/route.ts) with the prompt that actually generated the target. Running the hint reliably recreates the target. (TODO logged: stop asking the judge for `improved_prompt` to save tokens — see [memory/](.).)

**Judge is a prompt-writing coach, not an image critic.** Feedback fields:
- `what_worked`: specific phrases from the player's prompt that landed (quotes their words).
- `what_to_improve`: specific words to add or swap (quotes their text).
- `prompting_tips`: GENERIC transferable lessons not tied to this round (e.g. "name lighting explicitly", "specific adjectives beat generic nouns").
- See [lib/prompts.ts](lib/prompts.ts) `buildJudgePrompt` for full calibration with GOOD/BAD examples.

**No silent fallbacks on judge failure.** Earlier code fell back to `DEMO_FEEDBACK` when the judge errored, which masked bugs. Now the route returns 502 with the raw response, the client dispatches `JUDGE_FAILED`, and the results screen shows a red error card with the message. Failures are visible.

**Sketchbook aesthetic** — uneven `border-radius`, slight `rotate()`, rough `box-shadow: 3px 3px 0 #000`. Built on `SketchCard` and `SketchButton` primitives. Purple `#7C3AED` primary, amber `#F59E0B` highlights, sticky-yellow `#fef9c3` for the hint, light blue `#dbeafe` for prompting tips, mint/rose for what-worked/what-to-improve.

## State machine

`/play` route handles `idle` / `challenge` / `results` states. `/play/generating` is its own route for the generating phase (URL reflects game phase; bounces back to `/play` if visited without an active generation).

```
idle → challenge → /play/generating → results
                                         ├─ "Play again"  → challenge (same challengeId)
                                         └─ "Next round"  → idle (claims new from queue)
```

60s timer on `challenge`. On expiry: auto-submit if non-empty, else `forfeit: true`.

The generating page checklist is **phase-driven**, not clock-driven:
- Submit phase (no `generatedImageUrl` yet): cycles steps "Reading prompt" → "Rendering image" with the last pulsing.
- Judge phase (`generatedImageUrl` set): cycles "Comparing to target" → "Scoring".

`SketchButton` has a 140ms click delay so the press animation is visible even when the click triggers an unmount. Built into the primitive — all sketch buttons get it for free.

## API contract

- `POST /api/challenge/create` → `{ challengeId, targetImageUrl, theme }`. Tries queue first, falls back to inline generation. Triggers background refill via `after()`.
- `POST /api/attempt/submit` → `{ attemptId, generatedImageUrl }`. Body: `{ challengeId, prompt, playerId? }`.
- `POST /api/attempt/judge` → `{ score, breakdown, what_worked, what_to_improve, improved_prompt, prompting_tips }`. Body: `{ attemptId }`. Returns 502 on Zod parse failure or OpenAI errors with the raw payload for debugging.

These shapes are stable — UI was built against fixtures first.

## Database schema

```sql
challenges (
  id uuid pk, theme text, target_prompt text,
  target_image_url text, claimed_at timestamptz,  -- queue marker
  created_at timestamptz
)

attempts (
  id uuid pk, challenge_id uuid fk, player_id uuid null,
  prompt text, generated_image_url text,
  score smallint, feedback jsonb, forfeit bool,
  created_at timestamptz
)
```

Storage: `images` bucket, public read, server-side service-role uploads only.

## What's done vs not

✅ Live AI single-player end-to-end, deployed, queue + auto-refill working, prompt-coaching judge calibrated, theme dedup, separate image API key supported.

🚧 Not done: multi-round score totals + game-over flow; multiplayer rooms/lobby/realtime; mobile layout polish; landing copy revision.

See README.md "Build status" table for the full list.
