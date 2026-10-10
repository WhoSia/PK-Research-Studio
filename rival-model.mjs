// Rival-Model Atlas: navigation among already approved derivative records only.
// This map creates NO new source quotations, approvals, publications or scientific results.
export const RIVAL_CASES=Object.freeze([
  Object.freeze({id:'self-description',question:'자기 설명은 반드시 끝없는 불안정을 낳는가?',
    anchor:'lineage-3-self-description',papers:['paper-doyle-1979'],
    objection:{record:'lineage-3-self-description',heading:'반례가 바꾼 결론'},
    trail:['lineage-2-self-path-cut','lineage-3-self-description']}),
  Object.freeze({id:'identity',question:'기억과 경로가 달라져도 같은 자아인가?',
    anchor:'lineage-2-self-path-cut',papers:['paper-parfit-1971'],
    objection:{record:'lineage-2-self-path-cut',heading:'‘가위’가 자르는 것'},
    trail:['lineage-2-self-path-cut','lineage-3-self-description']}),
  Object.freeze({id:'perspective',question:'관점의 변화는 세계의 변화를 뜻하는가?',
    anchor:'lineage-4-perspective',papers:['paper-khalidi-2010','paper-massimi-2022'],
    objection:{record:'lineage-4-perspective',heading:'경로를 기록하는 이유'},
    trail:['lineage-1-regulation-residue','lineage-4-perspective']}),
  Object.freeze({id:'other-minds',question:'함께 변했다면 정말 서로 영향을 준 것인가?',
    anchor:'g224-causal',papers:['paper-g224-manski-1993','paper-g224-shalizi-thomas-2011'],
    objection:{record:'g224-causal',heading:'관측동등성 반례'},
    trail:['g223-expression','g224-frontier']}),
  Object.freeze({id:'absolute',question:'절대 규칙의 자기 적용 충돌은 무엇을 증명하는가?',
    anchor:'g221-preseal',papers:['paper-doyle-1979'],
    objection:{record:'g222-design-audit',heading:'모순을 세는 대신'},
    trail:['g221-preseal','g222-design-audit']})
]);
export function approvedIndex(manifestRecords) {
  const records=(Array.isArray(manifestRecords)?manifestRecords:[])
    .filter(r=>r?.provenance==='ACTIVE DERIVATIVE'&&r.id&&typeof r.body==='string');
  return new Map(records.map(r=>[r.id,r]));
}
export function approvedSection(record,heading) {
  const sections=String(record?.body||'').split(/(?=^## )/m);
  const found=sections.find(s=>s.split('\n',1)[0].trim()===`## ${heading}`);
  if(!found)return null;
  return found.replace(/^## [^\n]*\n?/,'').trim()||null;
}
export function rivalCase(caseId,manifestRecords) {
  const config=RIVAL_CASES.find(r=>r.id===caseId);
  if(!config)return null;
  const index=approvedIndex(manifestRecords);
  const needed=[config.anchor,...config.papers,config.objection.record,...config.trail];
  if(needed.some(id=>!index.has(id)))return null; // fail closed on absent/unapproved records
  const anchor=index.get(config.anchor), objection=index.get(config.objection.record);
  if(config.papers.some(id=>index.get(id).source_kind!=='notion-curated-paper-note'))return null;
  const extracted=approvedSection(objection,config.objection.heading);
  return {
    id:config.id,question:config.question,anchor,competitors:config.papers.map(id=>index.get(id)),
    objection:{record:objection,heading:config.objection.heading,body:extracted,
      evidenceLevel:extracted?'공개 연구 노트의 반례·제한':'독립 반례 미확인'},
    genealogy:config.trail.map(id=>index.get(id)),
    source:{status:'WITHHELD',text:'성준의 원문은 공개 승인을 확인할 수 없어 표시하지 않습니다. 아래는 연구진의 공개 승인된 파생 요약입니다.'},
    revision:{status:'NOT_VERIFIED',text:'아래는 관련 공개 기록의 계보와 출처 판본 식별자입니다. 실제 문장별 수정 이력이나 참여자 승인 내역을 뜻하지 않습니다.'}
  };
}
