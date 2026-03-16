-- Run this in the Supabase SQL Editor to create the event_registrations table.
-- Dashboard: https://app.supabase.com → Your project → SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),

  full_name text not null,
  phone text not null,
  email text,
  community text not null,

  is_producer boolean not null default false,
  is_student boolean not null default false,
  is_visitor boolean not null default false,
  works_in_org boolean not null default false,
  interested_in_agroecology boolean not null default false,

  wants_to_sell boolean not null default false,
  products_to_sell text,
  needs_table boolean not null default false,
  brings_table boolean not null default false,

  bringing_seeds boolean not null default false,
  seed_types text,

  interest_compost boolean not null default false,
  interest_networking boolean not null default false,
  interest_seeds boolean not null default false,
  interest_future_events boolean not null default false,

  consent_given boolean not null default false
);

-- Optional: enable Row Level Security (RLS) and allow anonymous inserts for the form
alter table public.event_registrations enable row level security;

create policy "Allow anonymous insert for event registration"
  on public.event_registrations
  for insert
  to anon
  with check (true);

-- Optional: restrict reads to authenticated users only (e.g. your CRM)
-- create policy "Allow authenticated read"
--   on public.event_registrations
--   for select
--   to authenticated
--   using (true);
