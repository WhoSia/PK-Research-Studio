-- Transaction-only fixtures: no test accounts or content survive this test.
begin;
insert into auth.users(id,email) values
 ('00000000-0000-4000-8000-000000000011','pk-reviewer-test@example.invalid'),
 ('00000000-0000-4000-8000-000000000012','pk-participant-test@example.invalid'),
 ('00000000-0000-4000-8000-000000000013','pk-outsider-test@example.invalid');
insert into public.app_members(user_id,role) values
 ('00000000-0000-4000-8000-000000000011','reviewer'),
 ('00000000-0000-4000-8000-000000000012','participant');
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000011',true);
insert into public.questions(id,author_uid,title,body,concept) values('00000000-0000-4000-8000-000000000021',auth.uid(),'SYNTHETIC test question','Not Park source. Test only.','기억');
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000012',true);
insert into public.answer_revisions(id,question_id,author_uid,revision,body) values('00000000-0000-4000-8000-000000000031','00000000-0000-4000-8000-000000000021',auth.uid(),1,'SYNTHETIC first answer');
insert into public.answer_revisions(question_id,author_uid,revision,body) values('00000000-0000-4000-8000-000000000021',auth.uid(),2,'SYNTHETIC revised answer');
do $$ begin
 begin
  insert into public.answer_revisions(question_id,author_uid,revision,body) values('00000000-0000-4000-8000-000000000021',auth.uid(),2,'stale write');
  raise exception 'FAIL: stale revision accepted';
 exception when serialization_failure then null; end;
 begin
  update public.answer_revisions set body='overwrite';
  raise exception 'FAIL: immutable answer updated';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.questions(author_uid,title,body) values(auth.uid(),'Unauthorized','No');
  raise exception 'FAIL: participant posted question';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000013',true);
do $$ begin
 if exists(select 1 from public.questions) or exists(select 1 from public.answer_revisions) or exists(select 1 from public.library_versions) then raise exception 'FAIL: outsider reads private data'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000011',true);
insert into public.library_versions(id,source_id,source_revision,source_kind,title,body,provenance) values('00000000-0000-4000-8000-000000000041','ignored','00000000-0000-4000-8000-000000000031','answer','ignored','forged text','FROZEN SOURCE');
do $$ begin
 if not exists(select 1 from public.library_versions where id='00000000-0000-4000-8000-000000000041' and provenance='SUBMITTED FEEDBACK' and body like '%SYNTHETIC first answer' and length(content_hash)=64) then raise exception 'FAIL: published answer provenance not enforced'; end if;
end $$;
-- Platform 0.2 publication guard requires explicit exact-version reviewer approval and source consent.
insert into public.library_publications(source_id,version_id,approved_source_revision,steward_publication_approval,author_publication_consent,approved_by,approval_recorded_at)
select source_id,id,source_revision,true,true,auth.uid(),now() from public.library_versions where id='00000000-0000-4000-8000-000000000041';
set local role anon;
do $$ begin
 if (select count(*) from public.library_versions)<>1 then raise exception 'FAIL: public version visibility'; end if;
 begin
  perform * from public.answer_revisions;
  raise exception 'FAIL: anonymous reads private answers';
 exception when insufficient_privilege then null; end;
 begin
  delete from public.library_publications;
  raise exception 'FAIL: anonymous changes publication';
 exception when insufficient_privilege then null; end;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000011',true);
delete from public.library_publications where version_id='00000000-0000-4000-8000-000000000041';
set local role anon;
do $$ begin
 if exists(select 1 from public.library_versions) then raise exception 'FAIL: withdrawn content remains readable'; end if;
end $$;
rollback;
