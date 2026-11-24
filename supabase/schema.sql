-- RoboWheels x 2026 NSTW Evaluation Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor -> New Query

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Anonymous',
  language text not null check (language in ('english', 'tagalog', 'bisaya')),
  q1 integer not null check (q1 between 1 and 5),
  q2 integer not null check (q2 between 1 and 5),
  q3 integer not null check (q3 between 1 and 5),
  q4 integer not null check (q4 between 1 and 5),
  q5 integer not null check (q5 between 1 and 5),
  q6 boolean not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.evaluations enable row level security;

-- Allow anyone at the booth to submit an evaluation
create policy "Allow public inserts"
  on public.evaluations
  for insert
  to anon, authenticated
  with check (true);

-- Allow reading evaluations for the Records Dashboard & CSV Export
create policy "Allow public reads"
  on public.evaluations
  for select
  to anon, authenticated
  using (true);

-- Helpful index for sorting newest evaluations first
create index if not exists evaluations_created_at_idx
  on public.evaluations (created_at desc);
