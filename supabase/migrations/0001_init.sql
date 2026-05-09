-- PromptMaster initial schema
-- Run via: supabase db push, or paste into Supabase SQL editor.

-- =========================================================================
-- Tables
-- =========================================================================

create table if not exists challenges (
  id                uuid primary key default gen_random_uuid(),
  theme             text not null,
  target_prompt     text not null,
  target_image_url  text not null,
  created_at        timestamptz not null default now()
);

create table if not exists attempts (
  id                   uuid primary key default gen_random_uuid(),
  challenge_id         uuid not null references challenges(id) on delete cascade,
  player_id            uuid,
  prompt               text not null,
  generated_image_url  text,
  score                smallint,
  feedback             jsonb,
  forfeit              boolean not null default false,
  created_at           timestamptz not null default now()
);

create index if not exists attempts_challenge_id_idx on attempts(challenge_id);
create index if not exists attempts_score_idx on attempts(score desc) where score is not null;

-- =========================================================================
-- Storage bucket for generated images
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Public read for the images bucket
drop policy if exists "Public read images" on storage.objects;
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'images');

-- Server-side uploads only (we use service role on the server, which bypasses RLS).
-- No insert policy = clients cannot upload directly. Tighten further later if needed.
