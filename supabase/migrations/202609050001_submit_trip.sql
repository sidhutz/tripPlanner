-- Banaras Explorer — trip planner + contact form schema
-- Safe to run more than once (idempotent).
--
-- Security model:
--   * RLS is ON for every table and NO policies are created, so neither the
--     anon nor the authenticated role can read or write these tables directly.
--   * All writes go through `security definer` functions, which bypass RLS.
--   * EXECUTE on those functions is granted to anon / authenticated / service_role,
--     so the app works with either the publishable (anon) key or the service key.

-- ---------------------------------------------------------------- extensions
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------- tables
create table if not exists public.travellers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  country text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  traveller_id uuid not null references public.travellers(id) on delete cascade,
  arrival_date date not null,
  departure_date date not null,
  number_of_days integer not null check (number_of_days > 0),
  adults integer not null check (adults > 0),
  children integer not null default 0 check (children >= 0),
  total_travellers integer not null check (total_travellers > 0),
  budget numeric check (budget >= 0),
  currency text not null default 'INR',
  accommodation_preference text not null,
  transport_preference text not null,
  additional_requirements text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (departure_date > arrival_date)
);

create table if not exists public.preferences (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null unique references public.trips(id) on delete cascade,
  temples boolean not null default false,
  ghats boolean not null default false,
  ganga_aarti boolean not null default false,
  spirituality boolean not null default false,
  history boolean not null default false,
  culture boolean not null default false,
  food boolean not null default false,
  shopping boolean not null default false,
  photography boolean not null default false,
  family boolean not null default false,
  nightlife boolean not null default false,
  sarnath boolean not null default false,
  nearby_destinations boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ indexes
create index if not exists travellers_email_idx on public.travellers (email);
create index if not exists trips_traveller_id_idx on public.trips (traveller_id);
create index if not exists trips_created_at_idx on public.trips (created_at desc);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------- RLS
alter table public.travellers enable row level security;
alter table public.trips enable row level security;
alter table public.preferences enable row level security;
alter table public.contact_messages enable row level security;

-- No direct table access for API roles; the functions below are the only path in.
revoke all on table public.travellers from anon, authenticated;
revoke all on table public.trips from anon, authenticated;
revoke all on table public.preferences from anon, authenticated;
revoke all on table public.contact_messages from anon, authenticated;

-- ------------------------------------------------------- submit_trip(jsonb)
create or replace function public.submit_trip(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_traveller_id uuid := gen_random_uuid();
  new_trip_id      uuid := gen_random_uuid();
  prefs            jsonb := coalesce(payload -> 'preferences', '{}'::jsonb);
  arrival          date  := (payload ->> 'arrival_date')::date;
  departure        date  := (payload ->> 'departure_date')::date;
  adult_count      integer := coalesce((payload ->> 'adults')::integer, 1);
  child_count      integer := coalesce((payload ->> 'children')::integer, 0);
  bool_of          boolean;
begin
  -- Defensive server-side validation (the API validates too).
  if coalesce(btrim(payload ->> 'name'), '') = '' then
    raise exception 'name is required';
  end if;
  if coalesce(btrim(payload ->> 'email'), '') = '' then
    raise exception 'email is required';
  end if;
  if departure <= arrival then
    raise exception 'departure_date must be after arrival_date';
  end if;

  insert into travellers (id, name, email, phone, country, city)
  values (
    new_traveller_id,
    btrim(payload ->> 'name'),
    lower(btrim(payload ->> 'email')),
    nullif(btrim(coalesce(payload ->> 'phone', '')), ''),
    nullif(btrim(coalesce(payload ->> 'country', '')), ''),
    nullif(btrim(coalesce(payload ->> 'city', '')), '')
  );

  insert into trips (
    id, traveller_id, arrival_date, departure_date, number_of_days,
    adults, children, total_travellers, budget,
    accommodation_preference, transport_preference, additional_requirements
  )
  values (
    new_trip_id,
    new_traveller_id,
    arrival,
    departure,
    (departure - arrival),
    adult_count,
    child_count,
    adult_count + child_count,
    nullif(payload ->> 'budget', '')::numeric,
    coalesce(nullif(btrim(coalesce(payload ->> 'accommodation_preference', '')), ''), 'Hotel'),
    coalesce(nullif(btrim(coalesce(payload ->> 'transport_preference', '')), ''), 'Auto / Cab'),
    nullif(btrim(coalesce(payload ->> 'additional_requirements', '')), '')
  );

  insert into preferences (
    id, trip_id, temples, ghats, ganga_aarti, spirituality, history, culture,
    food, shopping, photography, family, nightlife, sarnath, nearby_destinations
  )
  values (
    gen_random_uuid(),
    new_trip_id,
    coalesce((prefs ->> 'temples')::boolean, false),
    coalesce((prefs ->> 'ghats')::boolean, false),
    coalesce((prefs ->> 'ganga_aarti')::boolean, false),
    coalesce((prefs ->> 'spirituality')::boolean, false),
    coalesce((prefs ->> 'history')::boolean, false),
    coalesce((prefs ->> 'culture')::boolean, false),
    coalesce((prefs ->> 'food')::boolean, false),
    coalesce((prefs ->> 'shopping')::boolean, false),
    coalesce((prefs ->> 'photography')::boolean, false),
    coalesce((prefs ->> 'family')::boolean, false),
    coalesce((prefs ->> 'nightlife')::boolean, false),
    coalesce((prefs ->> 'sarnath')::boolean, false),
    coalesce((prefs ->> 'nearby_destinations')::boolean, false)
  );

  return new_trip_id;
end;
$$;

-- --------------------------------------------- submit_contact_message(jsonb)
create or replace function public.submit_contact_message(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_message_id uuid := gen_random_uuid();
begin
  if coalesce(btrim(payload ->> 'name'), '') = '' then
    raise exception 'name is required';
  end if;
  if coalesce(btrim(payload ->> 'email'), '') = '' then
    raise exception 'email is required';
  end if;
  if coalesce(btrim(payload ->> 'message'), '') = '' then
    raise exception 'message is required';
  end if;

  insert into contact_messages (id, name, email, phone, subject, message)
  values (
    new_message_id,
    btrim(payload ->> 'name'),
    lower(btrim(payload ->> 'email')),
    nullif(btrim(coalesce(payload ->> 'phone', '')), ''),
    nullif(btrim(coalesce(payload ->> 'subject', '')), ''),
    btrim(payload ->> 'message')
  );

  return new_message_id;
end;
$$;

-- --------------------------------------------------------------- privileges
-- Only the two submit functions are callable by the public API roles.
revoke all on function public.submit_trip(jsonb) from public;
revoke all on function public.submit_contact_message(jsonb) from public;

grant execute on function public.submit_trip(jsonb) to anon, authenticated, service_role;
grant execute on function public.submit_contact_message(jsonb) to anon, authenticated, service_role;
