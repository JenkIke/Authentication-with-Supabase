-- Supabase setup for this app.
-- Run in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: tables/policies/triggers are recreated only if missing,
-- and sample rows are inserted only into empty tables.

-------------------------------------------------------------------------------
-- 1. PUBLIC data: `instruments`
--    Anyone (signed in or not) can read. Shown on the Home and Sign-up screens.
--    Used by: src/hooks/use-public-instruments.ts
-------------------------------------------------------------------------------
create table if not exists public.instruments (
  id bigint generated always as identity primary key,
  name text not null
);

alter table public.instruments enable row level security;
grant select on public.instruments to anon, authenticated;

drop policy if exists "Anyone can read instruments" on public.instruments;
create policy "Anyone can read instruments" on public.instruments
  for select to anon, authenticated
  using (true);

insert into public.instruments (name)
select v.name
from (values ('Guitar'), ('Piano'), ('Drums'), ('Violin')) as v(name)
where not exists (select 1 from public.instruments);

-------------------------------------------------------------------------------
-- 2. PROTECTED data: `lessons`
--    Only signed-in users can read (RLS). Rendered as a list on the Profile screen.
--    Signed-out requests get zero rows back.
--    Used by: src/hooks/use-protected-lessons.ts
-------------------------------------------------------------------------------
create table if not exists public.lessons (
  id bigint generated always as identity primary key,
  title text not null,
  instrument text not null,
  level text not null
);

alter table public.lessons enable row level security;
revoke all on public.lessons from anon;
grant select on public.lessons to authenticated;

drop policy if exists "Signed-in users can read lessons" on public.lessons;
create policy "Signed-in users can read lessons" on public.lessons
  for select to authenticated
  using (true);

insert into public.lessons (title, instrument, level)
select v.title, v.instrument, v.level
from (values
  ('Open chords in 15 minutes', 'Guitar', 'Beginner'),
  ('Reading the treble clef',   'Piano',  'Beginner'),
  ('Paradiddle speed drills',   'Drums',  'Intermediate'),
  ('Developing a warm vibrato', 'Violin', 'Advanced')
) as v(title, instrument, level)
where not exists (select 1 from public.lessons);

-------------------------------------------------------------------------------
-- 3. PROTECTED per-user data: `profiles`
--    Each signed-in user can read only their own row.
--    Used by: src/app/profile.tsx
-------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  favourite_instrument text
);

alter table public.profiles enable row level security;
grant select on public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

-- Create a profile row automatically when someone signs up,
-- using the username entered on the Sign-up form.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
