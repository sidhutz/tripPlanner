-- Paste this into the Supabase SQL Editor to check whether the migration has
-- been applied. Expect 4 tables and 2 functions.

select 'table' as kind, table_name as name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('travellers', 'trips', 'preferences', 'contact_messages')

union all

select 'function' as kind, routine_name as name
from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('submit_trip', 'submit_contact_message')

order by kind, name;

-- Confirm the anon role can call the submit functions (needed when no
-- service-role key is configured). Expect two rows with has_execute = true.
select
  p.proname as function_name,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_has_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('submit_trip', 'submit_contact_message');

-- Confirm RLS is on for every table. Expect rls_enabled = true for all four.
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('travellers', 'trips', 'preferences', 'contact_messages')
order by relname;

-- Most recent submissions, to confirm data is arriving.
select t.created_at, tr.name, tr.email, t.number_of_days, t.total_travellers, t.budget
from public.trips t
join public.travellers tr on tr.id = t.traveller_id
order by t.created_at desc
limit 10;

select created_at, name, email, subject
from public.contact_messages
order by created_at desc
limit 10;
