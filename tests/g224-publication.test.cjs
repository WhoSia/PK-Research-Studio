'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const records=JSON.parse(fs.readFileSync(path.join(root,'content/public/records.json'),'utf8')).records;
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('G2.24 expansion has exact seven curated additions and no duplicate source IDs',()=>{
 assert.equal(records.length,21);
 const g224=records.filter(x=>x.id.startsWith('g224-')||x.id.startsWith('paper-g224-'));
 assert.equal(g224.length,7);
 assert.equal(new Set(records.map(x=>x.source_id)).size,21);
 assert.ok(g224.every(x=>x.provenance==='ACTIVE DERIVATIVE'&&x.publication_approved_by));
 assert.equal(g224.filter(x=>x.source_kind==='notion-curated-paper-note').length,2);
});
test('rival literature has explicit DOI and limited reading scope',()=>{
 for(const id of ['paper-g224-manski-1993','paper-g224-shalizi-thomas-2011']){
  const r=records.find(x=>x.id===id);
  assert.ok(r?.bibliography?.doi);
  assert.match(r.bibliography.read_status,/미검증/);
  assert.match(r.bibliography.license,/PDF 미배포/);
 }
});
test('G2.24 public layout separates human evidence and formal illustration',()=>{
 assert.match(html,/id="frontier"/);
 assert.match(html,/id="g224-lab"/);
 assert.match(html,/G2\.24 · 경쟁 가설 설계/);
 assert.match(html,/G2\.21 B0–B6 · NO RUN/);
 assert.match(html,/사람 대상 실험 아님/);
 assert.doesNotMatch(html,/@naver\.com|seongjunbag576@/);
});
test('new fifth comparison remains source-withheld and provenance-bound',async()=>{
 const {rivalCase,RIVAL_CASES}=await import('../rival-model.mjs');
 const r=rivalCase('other-minds',records);
 assert.ok(r);
 assert.equal(RIVAL_CASES.length,5);
 assert.equal(r.competitors.length,2);
 assert.match(r.objection.body,/공통 원인/);
 assert.equal(r.source.status,'WITHHELD');
 assert.ok(!('quote' in r.source));
});
