// Pure, browser-safe helpers shared with Node regression tests.
// Authorization belongs to the server/database. Callers pass records they are allowed to view.
export const RESEARCH_TRAILS=Object.freeze([
  Object.freeze({id:'identity',label:'자아 · 기억',query:'자아'}),
  Object.freeze({id:'perspective',label:'관점 · 사건',query:'관점'}),
  Object.freeze({id:'rule',label:'절대성 · 규칙',query:'절대'}),
  Object.freeze({id:'preseal',label:'G2.21',query:'G2.21'}),
  Object.freeze({id:'other-minds',label:'G2.24 · 타자 인식',query:'G2.24'}),
]);
export function atlasSearchText(record) {
  const b=record?.bibliography||{};
  return [record?.title,record?.body,record?.concept,record?.provenance,
    b.author,b.year,b.exact_title,b.doi,b.version,b.read_status,
    b.original_claim,b.our_interpretation,b.limitations,b.park_relation]
    .filter(x=>x!=null).join(' ').toLocaleLowerCase();
}
export function filterResearchRecords(records, {query='',kind=''}={}) {
  const q=String(query).trim().toLocaleLowerCase();
  return [...records].filter(r=>
    (!kind||(kind==='paper'?r.source_kind==='notion-curated-paper-note':
      kind==='theory'?r.source_kind==='notion-curated':r.provenance===kind))
    &&atlasSearchText(r).includes(q)
  ).sort((a,b)=>Number(a.source_kind==='notion-curated-paper-note')-
    Number(b.source_kind==='notion-curated-paper-note'));
}
export function readingDepth(record) {
  if(record?.source_kind!=='notion-curated-paper-note'||!record.bibliography)return null;
  const b=record.bibliography;
  return {scope:b.read_status||'읽은 범위 미기록',
    limit:b.limitations||'검증 범위 확인 필요',
    origin:'연구진의 공개 승인 독해 노트 · 논문 원문이 아님'};
}
