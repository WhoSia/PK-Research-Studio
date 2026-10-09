'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {publicationDecision} = require('../lib/publication-policy.cjs');
const approved = {provenance:'ACTIVE DERIVATIVE',visibility:'public',publication_approved_by:'reviewer',publication_approved_at:'2026-01-01',version:'r1',approved_version:'r1'};
test('reviewed derivative can publish',()=>assert.equal(publicationDecision(approved).allowed,true));
test('private is private regardless of approval',()=>assert.equal(publicationDecision({...approved,visibility:'private'}).reason,'NOT_PUBLIC'));
test('stale version is blocked',()=>assert.equal(publicationDecision({...approved,version:'r2'}).reason,'APPROVAL_MISSING_OR_STALE'));
test('feedback requires separate consent',()=>assert.equal(publicationDecision({...approved,provenance:'SUBMITTED FEEDBACK'}).reason,'AUTHOR_AND_STEWARD_REQUIRED'));
test('source needs author and steward',()=>{
  assert.equal(publicationDecision({...approved,provenance:'FROZEN SOURCE',author_publication_consent:true}).allowed,false);
  assert.equal(publicationDecision({...approved,provenance:'FROZEN SOURCE',author_publication_consent:true,steward_publication_approval:true}).allowed,true);
});
test('withdrawal wins over prior approval',()=>assert.equal(publicationDecision({...approved,withdrawn_at:'2026-10-10'}).reason,'WITHDRAWN'));
test('unverified simulation cannot publish',()=>assert.equal(publicationDecision({...approved,provenance:'EXPERIMENT'}).reason,'UNVERIFIED_EXPERIMENT'));
test('bibliography PDF bytes need rights proof',()=>assert.equal(publicationDecision({...approved,provenance:'BIBLIOGRAPHY',includes_pdf_bytes:true}).reason,'COPYRIGHT_HOLD'));
test('undefined authority fails closed',()=>assert.equal(publicationDecision({...approved,provenance:'UNKNOWN'}).allowed,false));

test('Seoul date-only approval accepted during corresponding local day',()=>assert.equal(publicationDecision({...approved,publication_approved_at:'2026-10-10'},{now:'2026-10-09T19:00:00.000Z'}).allowed,true));
test('future Seoul date-only approval rejected',()=>assert.equal(publicationDecision({...approved,publication_approved_at:'2026-10-11'},{now:'2026-10-09T19:00:00.000Z'}).reason,'INVALID_APPROVAL_DATE'));
test('future approval timestamp rejected regardless of zone',()=>assert.equal(publicationDecision({...approved,publication_approved_at:'2026-10-10T09:00:00+09:00'},{now:'2026-10-09T19:00:00.000Z'}).reason,'INVALID_APPROVAL_DATE'));
