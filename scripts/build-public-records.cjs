const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// These are newly written reading notes, not copies of private Notion pages or paper PDFs.
// The owner approved publication of research records, theory notes and paper reading notes
// on 2026-10-10. Questions, answers and Park's raw source are deliberately excluded.
const entries = [
  {
    id: 'lineage-1-regulation-residue',
    source_id: '3c7ef561-cf92-813e-a46f-e26ab1a7ace1', revision: '2026-08-25T06:47:45.236Z',
    title: '연구 계보 I · 조화, 규정, 잔여', concept: '조화 규정 잔여 관계',
    body: `## 어디서 시작했나
성준의 질문은 조화가 서로 다른 현실을 만들 수 있는지, 비판에서 생긴 조화도 다시 비판받을 수 있는지에 닿아 있었다. 아래 정리는 연구진의 해석이다.
## 지금 남은 생각
고정된 규칙 자체가 문제라는 결론은 나오지 않았다. 한 규칙이 자기 범위를 넘어 모든 것을 끝까지 설명한다고 주장할 때 문제가 생긴다. ‘잔여’도 영원히 남는 어떤 물건이 아니라, 특정 규정과의 관계에서 생기는 자리로 다룬다.
## 아직 열린 부분
침묵이 어떤 숨은 진리를 증명하는 것은 아니다. 연구 상태: 파생 형식화 통과, 새로움 판단은 보류.`
  },
  {
    id: 'lineage-2-self-path-cut',
    source_id: '3c7ef561-cf92-81a7-8830-e9114b20d460', revision: '2026-08-25T06:47:45.236Z',
    title: '연구 계보 II · 자아, 경로, 가위', concept: '자아 양자성 기억 시간선 가위',
    body: `## 같은 끝에 도착해도
현재 상태가 같더라도 거기까지 온 경로가 다르면 같은 자아인지 다시 물어야 한다. 연구진은 상태, 지나온 경로, 동일성을 판단하는 규칙을 분리해 보았다.
## ‘가위’가 자르는 것
기억이나 서사를 자르는 일과 과거의 사건 자체를 없애는 일은 다르다. 연구 기록은 기억, 인과적 영향, 시간 순서, 자르는 절차의 역사까지 네 층을 구분한다.
## 해석의 한계
성준의 ‘양자성’은 철학적 작업 용어다. 양자물리학의 주장으로 읽지 않는다. 여기서 자아의 실체가 발견된 것도 아니다.`
  },
  {
    id: 'lineage-3-self-description',
    source_id: '3c7ef561-cf92-816c-b709-fc854fecaaf5', revision: '2026-08-25T06:47:45.236Z',
    title: '연구 계보 III · 자신을 설명하면 달라질까', concept: '자아 서사 기억 자기 설명 고정점',
    body: `## 설명도 사건이 될 수 있다
자신을 설명하는 말이 이후의 기억이나 행동에 영향을 줄 수 있다. 연구진은 이 가능성을 ‘자기 설명의 반응성’으로 다룬다.
## 반례가 바꾼 결론
자기 설명이 되풀이된다고 반드시 끝없는 불안정이 생기지는 않는다. 수렴하는 간단한 모형도 만들 수 있다. 그래서 ‘자기 설명만으로 필연적 비폐쇄성이 나온다’는 주장은 폐기했다.
## 남은 질문
이야기가 달라지는 것, 기능적 자기조직이 달라지는 것, 실제로 경험하는 자아가 달라지는 것은 각각 다른 주장이다. 현재 모형은 의식이나 자아의 실재를 증명하지 않는다.`
  },
  {
    id: 'lineage-4-perspective',
    source_id: '3c7ef561-cf92-81fc-9823-fa9b2bb2aabe', revision: '2026-08-25T07:50:17.989Z',
    title: '연구 계보 IV · 관점이 바뀌어도 남는 것', concept: '관점 자아 관계 시간선 상대성',
    body: `## 관점 차이 다음의 질문
사람마다 자아를 다르게 본다는 말만으로는 부족하다. 관점 사이를 어떻게 옮겨 가는지, 옮긴 뒤에도 무엇을 비교할 수 있는지를 연구진이 묻는다. 물리학의 상대성 이론을 마음에 그대로 적용하는 주장은 아니다.
## 경로를 기록하는 이유
두 경로가 같은 곳에 도착해도 남기는 흔적은 다를 수 있다. 다만 숨은 상태나 시간에 따른 변화가 그 차이를 설명할 수도 있다. 그런 설명을 먼저 시험해야 한다.
## 보류
관점 변환의 규칙 자체가 바뀐다는 ‘메타 상대성’은 아직 인정된 결과가 아니다. 사회적 관계에 관한 논의도 하나의 집단 의식이 존재한다는 뜻은 아니다.`
  },
  {
    id: 'g221-preseal',
    source_id: '3f4ef561-cf92-81a0-8752-db1731b23788', revision: '2026-10-09T17:22:01.078Z',
    title: 'G2.21 · 절대 규칙과 모순을 시험하기 전', concept: 'G2.21 절대성 자유성 규칙 모순 시뮬레이션',
    body: `## 무엇을 준비했나
연구진은 성준의 발언에서 출발해 규칙이 자기 자신에도 적용되는 경우와 그렇지 않은 경우를 나누었다. B0부터 B6까지의 분기는 규칙을 그대로 두거나, 구조를 바꾸거나, 보조 규칙을 더하거나, 여러 해석을 병렬로 두는 식으로 비교한다. 분기와 공식은 성준의 원문이 아니라 연구진의 형식화다.
## 왜 아직 결과가 없나
자기 적용 조건에서 생기는 충돌은 모형에 넣은 전제에서 따라온다. 세계에 대한 발견으로 발표할 수 없다. 실행 코드, 해시, 입력과 검증 절차도 아직 고정되지 않았다.
## 현재 상태
의미 설계 사전 검토 통과. 구현 고정은 보류. 시뮬레이션 실행 0건. 모순이 반드시 무한한 규칙 추가를 부른다는 결론도 없다.`
  },
  {
    id: 'g222-design-audit',
    source_id: '3f4ef561-cf92-8132-927f-ea64661fb00b', revision: '2026-10-09T17:55:22.487Z',
    title: 'G2.22 설계 메모 · 어떤 전제가 모순을 만드는가', concept: 'G2.22 G2.21 모순 절대성 실험 설계',
    body: `## 모순을 세는 대신
G2.21의 자기 적용 충돌은 정의와 전제를 함께 넣으면 곧바로 나온다. G2.22 설계 메모는 어떤 전제를 빼거나 바꾸면 충돌이 사라지는지, 다른 논리 체계에서는 충돌이 살아남는지를 비교하자고 제안한다.
## 함께 놓을 설명들
규칙이 자기 자신을 가리키는가, 대상과 규칙을 분리할 수 있는가, 모순을 허용하는 체계가 안정될 수 있는가, ‘절대’가 외부의 진리인지 개인의 약속인지가 서로 다른 질문이다.
## 상태
이것은 실행 전 설계 감사다. G2.21이 현재 과학적 단계이며 GATE-59의 구현 사전 절차와 실험은 아직 끝나지 않았다.`
  },
  {
    id: 'paper-parfit-1971', paper: 'parfit-1971', title: '읽은 논문 · Parfit (1971), Personal Identity', concept: '논문 자아 동일성 연속성 Parfit',
    body: `## 읽은 범위
연구 기록에는 원본 PDF를 열어 앞부분을 확인한 것으로 적혀 있다. 개인 동일성이 언제나 결정적인 답을 가져야 하는지와, 살아남는 데 중요한 관계가 무엇인지를 구분하는 대목을 읽기 접점으로 삼았다.
## P&K에서의 역할
자아의 숫자상 동일성과 심리적 연속성을 같은 질문으로 뭉개지 않도록 하는 비교 자료다. 성준이 Parfit의 입장을 따른다고 결론내리지는 않는다. 이 글은 논문 전문이 아니라 P&K의 읽기 기록이다.`
  },
  {
    id: 'paper-khalidi-2010', paper: 'khalidi-2010', title: '읽은 논문 · Khalidi (2010), Interactive Kinds', concept: '논문 분류 상호작용 관점 Khalidi',
    body: `## 읽은 범위
연구 기록에는 원본 PDF의 초록과 도입부를 확인한 것으로 적혀 있다. 개념적 분류가 분류 대상과 다시 상호작용할 수 있다는 논의를 읽었다.
## P&K에서의 역할
사건을 어떻게 분류하느냐와 분류 이후 실제로 무엇이 달라졌느냐를 나눠 묻는 데 쓴다. 분류가 영향을 준다는 사실만으로 모든 것이 관찰자에 의해 만들어진다고 말할 수는 없다. 이 글은 논문 전문이 아니라 P&K의 읽기 기록이다.`
  },
  {
    id: 'paper-doyle-1979', paper: 'doyle-1979', title: '읽은 논문 · Doyle (1979), A Truth Maintenance System', concept: '논문 믿음 수정 규칙 모순 Doyle',
    body: `## 읽은 범위
연구 기록에는 원본 PDF를 열어 가정과 정당화, 믿음 수정, 대안을 다루는 부분을 확인한 것으로 적혀 있다.
## P&K에서의 역할
모순이 생길 때 규칙을 끝없이 덧붙이는 것만이 유일한 길인지 시험하는 반대 기준이다. 가정을 철회하거나 수정하는 추론 체계도 비교해야 한다. 그렇다고 이 시스템이 성준의 경험적 자아를 모형화한다고 볼 수는 없다. 이 글은 논문 전문이 아니라 P&K의 읽기 기록이다.`
  },
  {
    id: 'paper-massimi-2022', paper: 'massimi-2022', title: '읽은 자료 · Massimi (2022), Perspectival Realism', concept: '논문 읽은 자료 관점 실재론 Massimi',
    body: `## 읽은 범위
연구 기록에는 출판사 PDF의 앞부분과 일부 추출 구간만 확인한 것으로 적혀 있다. 전체 이론을 읽었다고 주장할 수 없는 상태다.
## P&K에서의 역할
‘관점에 따라 다르다’는 말이 곧 ‘마음대로 정한다’는 뜻인지 다시 묻게 하는 잠정적 비교 자료다. 특정 장의 논증을 P&K의 근거로 쓰는 일은 아직 보류한다. 이 글은 책 전문이 아니라 P&K의 제한된 읽기 기록이다.`
  }
];

const literatureId = '3f4ef561-cf92-814e-94f2-f3e446376382';
const bibliography = {
  'parfit-1971': {author:'Parfit',year:1971,exact_title:'Personal Identity',doi:null,version:'원본 PDF 확인 · 판본 세부 정보 확인 전',read_status:'원본 PDF 앞부분 확인',original_claim:'개인 동일성의 결정 가능성과 생존에서 중요한 관계를 구분한다.',our_interpretation:'P&K의 자아 동일성 질문에서 수적 동일성과 심리적 연속성을 분리해 비교한다.',limitations:'전체 논문 독해를 이 기록만으로 주장하지 않는다.',park_relation:'성준의 발언이나 동의로 귀속하지 않는다.',license:'공개 재배포 권한 확인 전 · PDF 미배포'},
  'khalidi-2010': {author:'Khalidi',year:2010,exact_title:'Interactive Kinds',doi:null,version:'원본 PDF 확인 · 판본 세부 정보 확인 전',read_status:'초록·도입부 확인',original_claim:'개념적 분류와 분류 대상 사이의 되먹임을 논의한다.',our_interpretation:'분류의 변화와 세계의 변화를 구분하는 비교축으로 사용한다.',limitations:'전체 논문 독해 또는 모든 분류의 세계 창조를 주장하지 않는다.',park_relation:'성준의 원문이 아니라 외부 비교 자료다.',license:'공개 재배포 권한 확인 전 · PDF 미배포'},
  'doyle-1979': {author:'Doyle',year:1979,exact_title:'A Truth Maintenance System',doi:null,version:'원본 PDF 확인 · 판본 세부 정보 확인 전',read_status:'원본 PDF의 가정·정당화·수정 논의 확인',original_claim:'가정과 정당화의 의존 관계를 관리하고 믿음을 수정하는 체계를 제시한다.',our_interpretation:'모순 뒤 보조 규칙만 계속 더해야 한다는 예상의 반대 기준으로 사용한다.',limitations:'이 체계를 성준의 경험적 자아 모형으로 간주하지 않는다.',park_relation:'성준의 발언이나 승인으로 귀속하지 않는다.',license:'공개 재배포 권한 확인 전 · PDF 미배포'},
  'massimi-2022': {author:'Massimi',year:2022,exact_title:'Perspectival Realism',doi:null,version:'출판사 PDF 일부 확인 · 판본 세부 정보 확인 전',read_status:'앞부분·일부 추출 구간만 확인 · 전체 이론 독해 전',original_claim:'관점과 실재에 관한 논의를 전개한다. 정확한 장별 논증은 이 기록에서 주장하지 않는다.',our_interpretation:'관점 의존성을 자의성과 곧바로 같게 두지 않기 위한 잠정적 비교 자료다.',limitations:'전체 독해 전이므로 특정 장의 논증을 P&K의 근거로 삼지 않는다.',park_relation:'성준의 입장으로 귀속하지 않는다.',license:'공개 재배포 권한 확인 전 · PDF 미배포'}
};
const records = entries.map(entry => {
  const source_id = entry.paper ? `${literatureId}:${entry.paper}` : entry.source_id;
  const pageId = entry.paper ? literatureId : entry.source_id;
  const source_revision = entry.paper ? '2026-10-09T18:17:57.380Z' : entry.revision;
  return {
    id: entry.id, source_kind: entry.paper ? 'notion-curated-paper-note' : 'notion-curated', source_id,
    source_revision, source_url: `https://app.notion.com/p/${pageId.replace(/-/g, '')}`,
    title: entry.title, concept: entry.concept, provenance: 'ACTIVE DERIVATIVE', body: entry.body,
    content_hash: crypto.createHash('sha256').update(entry.body, 'utf8').digest('hex'),
    imported_at: '2026-10-10',
    publication_approved_by: 'project owner · 2026-10-10 research-record category approval',
    publication_approved_at: '2026-10-10',
    ...(entry.paper ? {bibliography: bibliography[entry.paper]} : {})
  };
});
fs.writeFileSync(path.join(__dirname, '..', 'content', 'public', 'records.json'), JSON.stringify({schema_version: 1, records}, null, 2) + '\n');
console.log(`Built ${records.length} public reading notes`);
