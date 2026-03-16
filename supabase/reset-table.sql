-- Usa este script si recibes error 400 al enviar el formulario.
-- Recrea la tabla event_registrations con la estructura correcta.
-- Ejecuta en: Supabase → SQL Editor

drop table if exists public.event_registrations;

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
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

alter table public.event_registrations enable row level security;

create policy "Allow anonymous insert for event registration"
  on public.event_registrations
  for insert
  to anon
  with check (true);
