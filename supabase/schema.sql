-- Welcome to Miami Tech — submissions table
-- Run this in the Supabase SQL Editor for your "Welcome to Miami Tech" project.

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  social text not null,          -- LinkedIn or Instagram
  chat_type text not null check (chat_type in ('virtual', 'in_person')),
  preferred_times text,
  notes text,
  amount integer not null,        -- cents (10000 = $100, 15000 = $150)
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid')),
  stripe_session_id text
);

create index if not exists submissions_email_idx on public.submissions (email);
create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

-- Row Level Security: lock the table down. All writes/reads happen server-side
-- with the service_role key (which bypasses RLS), so no public policies needed.
alter table public.submissions enable row level security;
