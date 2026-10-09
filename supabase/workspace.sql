-- Additive workspace schema. Imported versions and answer revisions are immutable.
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  author_uid uuid not null references auth.users(id),
  title text not null check (char_length(title) between 3 and 200),
  body text not null check (char_length(body) between 1 and 16000),
  concept text not null default '',
  created_at timestamptz not null default now()
);
create table public.answer_revisions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id),
  author_uid uuid not null references auth.users(id),
  revision integer not null check (revision > 0),
  body text not null check (char_length(body) between 1 and 24000),
  created_at timestamptz not null default now(),
  unique(question_id, author_uid, revision)
);
create index answer_author_idx on public.answer_revisions(author_uid);
create table public.library_versions (
  id uuid primary key default gen_random_uuid(),
  source_id text not null,
  source_revision text not null,
  source_kind text not null check (source_kind in ('notion','answer')),
  title text not null,
  body text not null,
  provenance text not null check (provenance in ('FROZEN SOURCE','ACTIVE DERIVATIVE','HOLD','EXPERIMENT','SUBMITTED FEEDBACK')),
  concept text not null default '',
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  content_hash text not null,
  unique(source_id,source_revision)
);
create table public.library_publications (
  source_id text primary key,
  version_id uuid not null unique references public.library_versions(id),
  published_at timestamptz not null default now()
);
alter table public.questions enable row level security;
alter table public.answer_revisions enable row level security;
alter table public.library_versions enable row level security;
alter table public.library_publications enable row level security;
revoke all on public.questions,public.answer_revisions,public.library_versions,public.library_publications from public,anon,authenticated;
grant select,insert on public.questions,public.answer_revisions to authenticated;
grant select on public.library_versions,public.library_publications to anon,authenticated;
grant insert on public.library_versions to authenticated;
grant insert,update,delete on public.library_publications to authenticated;
create policy "members read questions" on public.questions for select to authenticated using (exists(select 1 from public.app_members where user_id=(select auth.uid())));
create policy "reviewer posts questions" on public.questions for insert to authenticated with check (author_uid=(select auth.uid()) and exists(select 1 from public.app_members where user_id=(select auth.uid()) and role='reviewer'));
create policy "members read answers" on public.answer_revisions for select to authenticated using (exists(select 1 from public.app_members where user_id=(select auth.uid())));
create policy "participant writes own revision" on public.answer_revisions for insert to authenticated with check (author_uid=(select auth.uid()) and exists(select 1 from public.app_members where user_id=(select auth.uid()) and role='participant'));
create policy "read published versions" on public.library_versions for select to anon,authenticated using (exists(select 1 from public.library_publications where version_id=library_versions.id));
create policy "reviewer reads imported versions" on public.library_versions for select to authenticated using (exists(select 1 from public.app_members where user_id=(select auth.uid()) and role='reviewer'));
create policy "reviewer imports versions" on public.library_versions for insert to authenticated with check (exists(select 1 from public.app_members where user_id=(select auth.uid()) and role='reviewer'));
create policy "read publications" on public.library_publications for select to anon,authenticated using (true);
create policy "reviewer publishes" on public.library_publications for insert to authenticated with check (exists(select 1 from public.app_members where user_id=(select auth.uid()) and role='reviewer'));
create policy "reviewer updates publication" on public.library_publications for update to authenticated using (exists(select 1 from public.app_members where user_id=(select auth.uid()) and role='reviewer')) with check (exists(select 1 from public.app_members where user_id=(select auth.uid()) and role='reviewer'));
create policy "reviewer withdraws publication" on public.library_publications for delete to authenticated using (exists(select 1 from public.app_members where user_id=(select auth.uid()) and role='reviewer'));

-- Serialize revision numbers without giving clients UPDATE access to source text.
create function private.check_answer_revision() returns trigger language plpgsql set search_path='' as $$
declare latest integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.question_id::text || new.author_uid::text,0));
  select coalesce(max(revision),0) into latest from public.answer_revisions where question_id=new.question_id and author_uid=new.author_uid;
  if new.revision <> latest+1 then raise exception '답변이 다른 창에서 수정되었습니다. 최신 답변을 확인해 주세요.' using errcode='40001'; end if;
  return new;
end $$;
revoke all on function private.check_answer_revision() from public,anon,authenticated;
create trigger check_answer_revision before insert on public.answer_revisions for each row execute function private.check_answer_revision();

-- An answer publication always copies the actual immutable reply, never client prose.
create function private.check_library_version() returns trigger language plpgsql set search_path='' as $$
declare a public.answer_revisions; q public.questions;
begin
  if new.source_kind='answer' then
    select * into strict a from public.answer_revisions where id=new.source_revision::uuid;
    select * into strict q from public.questions where id=a.question_id;
    new.source_id := 'answer:' || a.question_id::text || ':' || a.author_uid::text;
    new.title := q.title;
    new.body := '질문' || E'\n' || q.body || E'\n\n답변\n' || a.body;
    new.provenance := 'SUBMITTED FEEDBACK';
    new.concept := q.concept;
    new.source_updated_at := a.created_at;
  end if;
  new.content_hash := encode(sha256(convert_to(new.body,'UTF8')),'hex');
  return new;
end $$;
revoke all on function private.check_library_version() from public,anon,authenticated;
create trigger check_library_version before insert on public.library_versions for each row execute function private.check_library_version();
create function private.check_publication() returns trigger language plpgsql set search_path='' as $$
begin
  if not exists(select 1 from public.library_versions where id=new.version_id and source_id=new.source_id) then raise exception '기록과 버전이 일치하지 않습니다.'; end if;
  new.published_at:=now();
  return new;
end $$;
revoke all on function private.check_publication() from public,anon,authenticated;
create trigger check_publication before insert or update on public.library_publications for each row execute function private.check_publication();
