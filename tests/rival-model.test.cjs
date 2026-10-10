'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const load=()=>import('../rival-model.mjs');
const records=JSON.parse(fs.readFileSync(path.join(__dirname,'..','content/public/records.json'),'utf8')).records;
test('every declared rival case resolves only to approved records',async()=>{
  const {RIVAL_CASES,rivalCase}=await load();
  for(const c of RIVAL_CASES){
    const r=rivalCase(c.id,records);assert.ok(r,c.id);
    for(const item of [r.anchor,...r.competitors,r.objection.record,...r.genealogy])
      assert.equal(item.provenance,'ACTIVE DERIVATIVE');
    assert.equal(r.source.status,'WITHHELD');
    assert.equal(r.revision.status,'NOT_VERIFIED');
  }
});
test('neither original utterances nor private Notion snapshots appear in the source slot',async()=>{
  const {rivalCase}=await load();
  const r=rivalCase('absolute',records);
  assert.match(r.source.text,/원문.*표시하지/);
  assert.ok(!('quote' in r.source));
});
test('unapproved and missing dependency both suppress a comparison',async()=>{
  const {rivalCase}=await load();
  assert.equal(rivalCase('absolute',records.filter(x=>x.id!=='paper-doyle-1979')),null);
  const withheld=records.map(x=>x.id==='g221-preseal'?{...x,provenance:'HOLD'}:x);
  assert.equal(rivalCase('absolute',withheld),null);
});
test('counterexample extracts existing approved section without inventing text',async()=>{
  const {rivalCase,approvedSection}=await load();
  const r=rivalCase('self-description',records);
  assert.ok(r.objection.body);
  assert.equal(r.objection.body,approvedSection(r.objection.record,'반례가 바꾼 결론'));
  assert.match(r.objection.body,/수렴하는 간단한 모형/);
});
test('metadata is genealogy, not an edit or approval log',async()=>{
  const {rivalCase}=await load();
  const r=rivalCase('identity',records);
  assert.equal(r.genealogy.length,2);
  assert.ok(r.genealogy.every(x=>x.source_revision));
  assert.match(r.revision.text,/수정 이력.*뜻하지/);
});
test('competitors are curated reading notes rather than source-paper bytes',async()=>{
  const {RIVAL_CASES,rivalCase}=await load();
  for(const c of RIVAL_CASES){
    const x=rivalCase(c.id,records);
    assert.ok(x.competitors.every(p=>p.source_kind==='notion-curated-paper-note'));
    assert.ok(x.competitors.every(p=>p.bibliography?.read_status));
  }
});
test('unknown case and hostile non-approved manifest fail closed',async()=>{
  const {rivalCase}=await load();
  assert.equal(rivalCase('__not_a_real_case__',records),null);
  assert.equal(rivalCase('identity',[{...records[1],provenance:'SUBMITTED FEEDBACK'}]),null);
});
test('website wiring exposes five-lane comparison but leaves manifest unchanged',()=>{
  const root=path.join(__dirname,'..');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const js=fs.readFileSync(path.join(root,'workspace.js'),'utf8');
  assert.match(html,/id="rival-atlas"/);
  assert.match(html,/id="rival-choices"/);
  assert.match(js,/rivalCase\(activeRivalId,publicRecords\)/);
  assert.match(js,/function renderRivalAtlas/);
  assert.equal(records.length,21);assert.equal(records.filter(r=>r.id==='g222-p1-rival-semantics').length,1);
});
