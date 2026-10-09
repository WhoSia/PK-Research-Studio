-- P&K Platform 0.1. Execute once on the dedicated Supabase project.
-- Invited emails live only in the database. Never commit participant addresses.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.invites (
  email text primary key,
  role text not null check (role in ('participant','reviewer')),
  created_at timestamptz not null default now()
);
revoke all on private.invites from public, anon, authenticated;

create table if not exists public.app_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('participant','reviewer')),
  created_at timestamptz not null default now()
);
alter table public.app_members enable row level security;
revoke all on public.app_members from public, anon, authenticated;
grant select on public.app_members to authenticated;
create policy "members see own role" on public.app_members
  for select to authenticated using ((select auth.uid()) = user_id);

create or replace function private.enroll_invited_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare invited_role text;
begin
  select role into invited_role from private.invites where lower(email) = lower(new.email);
  if invited_role is not null then
    insert into public.app_members(user_id,role) values (new.id,invited_role)
    on conflict (user_id) do update set role = excluded.role;
  end if;
  return new;
end;
$$;
revoke all on function private.enroll_invited_user() from public, anon, authenticated;
drop trigger if exists pk_enroll_invited_user on auth.users;
create trigger pk_enroll_invited_user after insert on auth.users
  for each row execute function private.enroll_invited_user();

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  author_uid uuid not null references auth.users(id) on delete restrict,
  kind text not null check (kind in ('objection','concept','model_error','experiment_condition','source_note','other')),
  target_ref text check (target_ref is null or char_length(target_ref) between 1 and 160),
  body text not null check (char_length(body) between 10 and 8000),
  consent boolean not null check (consent is true),
  status text not null default 'SUBMITTED FEEDBACK' check (status in ('SUBMITTED FEEDBACK','UNDER REVIEW','REVIEWED')),
  created_at timestamptz not null default now()
);
create index if not exists feedback_author_created_idx on public.feedback(author_uid,created_at desc);
alter table public.feedback enable row level security;
revoke all on public.feedback from public, anon, authenticated;
grant select, insert on public.feedback to authenticated;
grant update(status) on public.feedback to authenticated;

create policy "members read own or reviewer reads all" on public.feedback
  for select to authenticated using (
    exists (select 1 from public.app_members m
      where m.user_id = (select auth.uid())
      and (m.role = 'reviewer' or feedback.author_uid = m.user_id))
  );
create policy "members submit own feedback" on public.feedback
  for insert to authenticated with check (
    author_uid = (select auth.uid()) and status = 'SUBMITTED FEEDBACK'
    and exists (select 1 from public.app_members m where m.user_id = (select auth.uid()))
  );
create policy "reviewer changes review status" on public.feedback
  for update to authenticated using (
    exists (select 1 from public.app_members m
      where m.user_id = (select auth.uid()) and m.role = 'reviewer')
  ) with check (
    exists (select 1 from public.app_members m
      where m.user_id = (select auth.uid()) and m.role = 'reviewer')
  );

-- After the owner provides account addresses, add each address through the
-- Supabase SQL editor or an authorized connector call (never through Git).
-- insert into private.invites(email,role) values ('email@example.com','participant');
-- insert into public.app_members(user_id,role)
--   select id,'participant' from auth.users where lower(email)=lower('email@example.com')
--   on conflict(user_id) do update set role=excluded.role;
