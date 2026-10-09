-- Platform 0.2: fail-closed publication custody. No existing publication rows expected.
alter table public.library_publications
  add column if not exists approved_source_revision text not null default '',
  add column if not exists steward_publication_approval boolean not null default false,
  add column if not exists author_publication_consent boolean not null default false,
  add column if not exists approved_by uuid references auth.users(id),
  add column if not exists approval_recorded_at timestamptz;

create or replace function private.enforce_library_publication_custody()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v record;
begin
  select source_id,source_revision,provenance,source_kind into v
  from public.library_versions where id = new.version_id;
  if not found or v.source_id is distinct from new.source_id then
    raise exception 'PUBLICATION_VERSION_SOURCE_MISMATCH' using errcode='23514';
  end if;
  if new.steward_publication_approval is distinct from true
    or new.approved_by is null
    or new.approval_recorded_at is null
    or new.approved_source_revision is distinct from v.source_revision then
    raise exception 'PUBLICATION_APPROVAL_INCOMPLETE' using errcode='23514';
  end if;
  if v.provenance in ('FROZEN SOURCE','SUBMITTED FEEDBACK')
    and new.author_publication_consent is distinct from true then
    raise exception 'AUTHOR_PUBLICATION_CONSENT_REQUIRED' using errcode='23514';
  end if;
  if v.provenance not in ('FROZEN SOURCE','SUBMITTED FEEDBACK','ACTIVE DERIVATIVE','HOLD','EXPERIMENT') then
    raise exception 'UNRECOGNIZED_PUBLICATION_PROVENANCE' using errcode='23514';
  end if;
  if v.provenance = 'EXPERIMENT' then
    raise exception 'EXPERIMENT_PUBLICATION_REQUIRES_VERIFIED_EXECUTION_RECEIPT' using errcode='23514';
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_library_publication_custody() from public, anon, authenticated;
drop trigger if exists pk_publication_custody_guard on public.library_publications;
create trigger pk_publication_custody_guard
before insert or update on public.library_publications
for each row execute function private.enforce_library_publication_custody();
