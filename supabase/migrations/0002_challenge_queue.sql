-- Challenge queue: pre-generate challenges and serve them up instantly to players.
-- An unclaimed challenge has claimed_at IS NULL.
-- /api/challenge/create atomically claims the oldest unclaimed challenge,
-- then triggers a background refill so the queue stays topped up.

alter table challenges
  add column if not exists claimed_at timestamptz;

-- Partial index for fast "find an unclaimed challenge" queries.
create index if not exists challenges_unclaimed_idx
  on challenges(created_at)
  where claimed_at is null;
