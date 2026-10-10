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
박성준의 질문은 조화가 서로 다른 현실을 만들 수 있는지, 비판에서 생긴 조화도 다시 비판받을 수 있는지에 닿아 있었다. 아래 정리는 연구진의 해석이다.
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
박성준의 ‘양자성’은 철학적 작업 용어다. 양자물리학의 주장으로 읽지 않는다. 여기서 자아의 실체가 발견된 것도 아니다.`
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
연구진은 박성준의 발언에서 출발해 규칙이 자기 자신에도 적용되는 경우와 그렇지 않은 경우를 나누었다. B0부터 B6까지의 분기는 규칙을 그대로 두거나, 구조를 바꾸거나, 보조 규칙을 더하거나, 여러 해석을 병렬로 두는 식으로 비교한다. 분기와 공식은 박성준의 원문이 아니라 연구진의 형식화다.
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
    id: 'g222-p1-rival-semantics', source_id: '3f4ef561-cf92-814f-9535-f0b4e364352d', revision: '2026-10-09T21:40:11.129Z',
    title: 'G2.22-P1 · Kripke·Yablo·AGM 경쟁 설계 법정', concept: 'G2.22 Kripke Yablo AGM 진리 의미론 역설 믿음 수정 반례',
    body: `## 무엇을 비교했나
연구진은 Kripke(1975)의 부분적 진리 의미론, Yablo(1993)의 무한 문장열 역설, Alchourrón·Gärdenfors·Makinson(1985)의 믿음 철회·수정 연산을 G2.22 실험 설계의 경쟁 설명으로 대조했다. 이는 세 이론이 동일한 결론을 지지한다는 뜻이 아니다.
## 서로 다른 반례
Kripke의 고정점 논의는 자기 적용이 곧바로 끝없는 규칙 추가를 강제한다는 주장을 공격한다. Yablo의 역설은 직접 자기지시를 제거해도 고전적 무한 문장열에서는 문제가 남을 수 있음을 보여주지만, 유한 절단을 같은 것으로 취급할 수 없다. AGM은 충돌 뒤 가정의 철회와 수정이 가능한 대안을 제시한다.
## 앞으로 검증할 것
고전적 이가 의미론, 부분적 진리, 무한·유한 문장 의존성, 믿음 수정 연산, 이력 의존성을 독립적으로 바꾸어 보아야 한다. G2.22는 현재 경쟁 설계 감사 단계이며 실제 시뮬레이션은 수행되지 않았다.
## 해석과 공개의 경계
이는 연구진이 작성한 공개용 파생 요약이다. 박성준의 원문, 사적인 대화, 승인되지 않은 해석 적합성 판단, 논문 PDF 원문을 포함하지 않는다. 개별 논문의 모든 증명을 완전 검증한 보고서가 아니며 박성준의 철학이 세 이론 중 어느 하나와 일치한다고 주장하지 않는다.`
  },
  {
    id: 'paper-parfit-1971', paper: 'parfit-1971', title: '읽은 논문 · Parfit (1971), Personal Identity', concept: '논문 자아 동일성 연속성 Parfit',
    body: `## 읽은 범위
연구 기록에는 원본 PDF를 열어 앞부분을 확인한 것으로 적혀 있다. 개인 동일성이 언제나 결정적인 답을 가져야 하는지와, 살아남는 데 중요한 관계가 무엇인지를 구분하는 대목을 읽기 접점으로 삼았다.
## P&K에서의 역할
자아의 숫자상 동일성과 심리적 연속성을 같은 질문으로 뭉개지 않도록 하는 비교 자료다. 박성준이 Parfit의 입장을 따른다고 결론내리지는 않는다. 이 글은 논문 전문이 아니라 P&K의 읽기 기록이다.`
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
모순이 생길 때 규칙을 끝없이 덧붙이는 것만이 유일한 길인지 시험하는 반대 기준이다. 가정을 철회하거나 수정하는 추론 체계도 비교해야 한다. 그렇다고 이 시스템이 박성준의 경험적 자아를 모형화한다고 볼 수는 없다. 이 글은 논문 전문이 아니라 P&K의 읽기 기록이다.`
  },
  {
    id: 'paper-massimi-2022', paper: 'massimi-2022', title: '읽은 자료 · Massimi (2022), Perspectival Realism', concept: '논문 읽은 자료 관점 실재론 Massimi',
    body: `## 읽은 범위
연구 기록에는 출판사 PDF의 앞부분과 일부 추출 구간만 확인한 것으로 적혀 있다. 전체 이론을 읽었다고 주장할 수 없는 상태다.
## P&K에서의 역할
‘관점에 따라 다르다’는 말이 곧 ‘마음대로 정한다’는 뜻인지 다시 묻게 하는 잠정적 비교 자료다. 특정 장의 논증을 P&K의 근거로 쓰는 일은 아직 보류한다. 이 글은 책 전문이 아니라 P&K의 제한된 읽기 기록이다.`
  }
  ,{
    id:'g223-jurisdiction',source_id:'3f5ef561cf92813baffad6ac3d7d39f9',revision:'2026-10-10T08:30:00Z',
    title:'G2.23 실험 A · 자기 적용 가능성과 진리값 구분',concept:'G2.23 자기 적용 적용 여부 관할 중간 상태 미정 판단',
    body:`## 질문
규칙을 자기 자신에게 적용할 수 있는지의 문제와, 적용 뒤 참인지 거짓인지는 다른 문제다.
## 경쟁 조건
ON은 자기 적용을 허용한다. OFF는 적용 범위 밖이다. UNRESOLVED는 적용 자격이 정해지지 않았다는 뜻이며 제3의 진리값과 같지 않다.
## 반증 설계
같은 문장과 논리 체계에서 적용 관할만 변경해 결과를 비교한다. 적용 불가를 거짓 판정으로 세지 않는다.
## 현재 상태
연구진의 합성 실험 설계만 준비됐다. 저자 해석 검증과 본실험은 아직 수행되지 않았다.`
  },{
    id:'g223-expression',source_id:'3f5ef561cf92813baffad6ac3d7d39f9',revision:'2026-10-10T08:30:00Z',
    title:'G2.23 실험 B · 표현은 기록인가 개입인가',concept:'G2.23 표현 관점 사고 개입 단순 보고 숨은 상태 인과',
    body:`## 질문
어떤 생각을 표현하는 행동이 이미 있던 관점을 보고하는가, 아니면 이후 판단을 변화시키는가?
## 경쟁 조건
REPORT 모형은 관점을 그대로 두고 진술만 기록한다. INTERVENTION 모형은 같은 관점에서 표현 행위가 후속 상태를 바꿀 수 있다. HIDDEN-STATE 모형은 보이지 않는 이전 이력만으로 같은 변화를 설명한다.
## 반증 설계
현재 발화가 같은 경우에도 이후 관점과 판단이 달라지는지 비교하고, 숨은 상태의 대체 설명을 반드시 포함한다.
## 현재 상태
인과 효과의 실제 관측은 없다. 특정 개인이나 작품 속 대상의 상호작용을 주장하지 않는다.`
  },{
    id:'g223-inverse',source_id:'3f5ef561cf92813baffad6ac3d7d39f9',revision:'2026-10-10T08:30:00Z',
    title:'G2.23 실험 C · 표상 역추적의 식별 가능성',concept:'G2.23 역문제 표상 식별성 관측 동등성 추가 질문',
    body:`## 질문
나중의 판단과 표현만으로 그것을 만든 과거의 내적 과정을 하나로 복원할 수 있을까?
## 경쟁 조건
서로 다른 잠재 상태가 같은 관측을 낼 수 있으면 역문제의 해는 집합으로 남는다. 독립적인 추가 관측으로 그 집합이 줄어드는지 검증한다.
## 최소 반례
잠재 상태 0과 2는 관측값을 2로 나눈 나머지로 정의하면 둘 다 0이다. 추가 관측이 없으면 둘 중 하나를 특정할 수 없다.
## 현재 상태
이는 수학적 설계 반례이지 실제 내적 경험을 측정한 결과가 아니다.`
  }
  ,{
    id:'g224-frontier',source_id:'3f5ef561cf9281328e06e98a86a9e425',revision:'g224-curated-v1-20261010',
    title:'G2.24 · 타인을 인식했다는 말의 증거는 무엇인가',concept:'G2.24 타자 인식 표상 상호작용 근거 원형 구분',
    body:`## 출발 질문
나에게 중요한 경험이 상대의 행위와 연결되어 있다는 진술은 그 자체로 의미가 있다. 그러나 내가 상대를 어떻게 표상하는지, 상대가 실제로 어떤 말을 했는지, 상대가 나를 어떻게 이해하는지, 두 사람이 서로 영향을 주었는지는 서로 다른 명제다.
## 구분해야 할 세 종류의 인식
① 나는 상대를 인식한다. ② 상대의 표현이나 행동이 나에게 실제로 영향을 준다. ③ 상대 역시 나를 인식하고 자기 판단을 바꾼다. 첫째는 주체의 경험적 진술이고, 둘째는 인과적 식별 문제이며, 셋째는 상대의 독립된 증거와 해석 권한 문제다.
## 바꿀 수 있는 연구 결론
상대의 독립된 표현이 없으면 인식의 상호성을 확정하지 않는다. 반대로 처음에 나 혼자 표상했다고 해서 실제 상호 영향 가능성까지 부정하지 않는다. 어느 설명이 살아남는지 기록할 뿐 저자의 실존론을 판정하지 않는다.
## 공개 상태
G2.24는 경쟁 가설 설계 단계이다. 사적 원문, 동의 없는 상호 인식 판정, 실제 사람 대상 확률 추정은 공개하지 않는다.`
  },{
    id:'g224-causal',source_id:'3f5ef561cf9281328e06e98a86a9e425',revision:'g224-curated-v1-20261010',
    title:'G2.24 · 투사·환경·단방향 영향·상호 영향의 경쟁 법정',concept:'G2.24 방향성 인과 상호성 표상 공통 원인 homophily',
    body:`## 대립하는 설명
H0: 한 사람의 내적 표상만 변했다. H1: 두 사람에게 같은 환경이 작용했다. H2: 한 사람의 표현이 다른 사람의 이후 관측에 영향을 주었다. H3: 양방향 영향과 시간적 되먹임이 있다. 여기에 원래 닮은 사람들이 가까워지는 선택 효과와 기록되지 않은 이력이 추가 경쟁자로 남는다.
## 관측동등성 반례
공통 원인 U가 0 또는 1이라고 하자. 모형 A는 X_A=U, X_B=U이고, 모형 B는 X_A=U, X_B=X_A이다. 자연 상태에서는 둘 다 (0,0)과 (1,1)을 관측하므로 같은 모양의 행동만으로 방향성 영향을 식별하지 못한다. 수학적으로 A의 표현만 바꾸고 U=0을 고정한다면 B의 결과는 두 모형에서 0 또는 1로 갈리지만, 실제 인간에게 그런 독립 개입이 가능한지는 미확인이다.
## 무엇이 반증인가
상대의 독립된 표현, 시차, 공통 환경과 이전의 유사성을 먼저 기록하고, 사전 합의된 관측 조건에서 어떤 설명이 제외되는지 심사한다. 단순 공감이나 시간 순서만으로 인과를 확정하지 않는다. 방향이 한쪽에서 관측되었다고 반대쪽 영향이 있었다거나 없었다고 추정하지 않는다.
## 현재 판정
표시된 반례는 작은 합성 수학 모형이다. 실제 상호 영향이나 자아의 변화가 실험으로 확인된 것은 아니다.`
  },{
    id:'g224-recognition',source_id:'3f5ef561cf9281328e06e98a86a9e425',revision:'g224-curated-v1-20261010',
    title:'G2.24 · 상호 인식의 권한과 독립 관측 기준',concept:'G2.24 누가 누구를 인식하는가 주체 권한 상호인식 검증',
    body:`## 서로 다른 판단 권한
내가 어떤 대상을 의미 있게 경험했다는 진술은 그 경험을 한 주체에게 속한다. 상대가 나를 이해했다고 주장하려면 상대의 표현·행동·수정이력 또는 상대의 독립적인 확인이 추가로 필요하다. 연구자가 둘 중 누구의 생각도 대신 확정할 수 없다.
## 세 단계의 검증 문턱
1단계: 한 주체가 타인을 어떻게 표상했는지 기록한다. 2단계: 상대가 실제로 행한 표현과 그 맥락을 별도 출처로 확인한다. 3단계: 양쪽이 의미와 상호작용을 어떻게 이해하는지 서로 수정할 수 있는 절차를 마련한다. 단계 사이의 이동은 자동이 아니다.
## 반대 가능성
진심 어린 인식이 표현되지 않았을 가능성과, 응답해 보이는 행위가 단순 관습일 가능성을 함께 고려한다. 상대의 침묵·부재나 기록 누락은 한 방향으로만 해석하지 않는다.
## 현재 판정
이는 공개용 방법 설계이며, 실제 참여자의 마음이나 상호 인정 여부에 대한 조사·결론이 아니다.`
  },{
    id:'g224-probability',source_id:'3f5ef561cf9281328e06e98a86a9e425',revision:'g224-curated-v1-20261010',
    title:'G2.24 · 관계의 확률을 말하기 전에 정의할 것',concept:'G2.24 확률 조건부 사건 관측 빈도 관계 가능성 비식별',
    body:`## 확률의 문장에는 분모가 필요하다
'서로를 인식할 확률'은 아직 정의된 통계량이 아니다. 먼저 사건을 정해야 한다. 예를 들어 동의한 대화에서 어떤 표현 뒤 24시간 안에 상대가 독립된 반응을 남기는 사건을 정의할 수 있다. 이것도 마음속 인식 자체를 뜻하지는 않는다.
## 최소 구성 요소
관측 단위(대화·사람·시점), 시간 창, 누락·무응답 처리, 공통 환경, 관측 권한, 반복 가능한 표본, 측정 오차, 조건부 사건의 분모를 사전에 선언해야 한다. P(반응|표현)는 인과효과 P(반응|do(표현))와 일반적으로 같지 않다.
## 두 가지 다른 가능성
'가능하다'라는 철학적 판단, 주관적 확신, 관측된 상대 반응의 빈도는 서로 다른 층위다. 숫자가 없더라도 철학적 질문은 성립한다. 자료가 없으면 수치를 만들어내지 않는 것이 정당한 연구 결과다.
## 상태
G2.24에서 사람 사이의 확률 추정이나 실제 데이터 수집은 하지 않았다. 여기에 숫자나 효과 크기를 싣지 않는다.`
  },{
    id:'g224-evidence',source_id:'3f5ef561cf9281328e06e98a86a9e425',revision:'g224-curated-v1-20261010',
    title:'G2.24 · 연구 증거 지도와 앞선 세대의 실제 상태',concept:'G2.24 연구 윤리 증거 단계 역사 NO RUN 실험 설계',
    body:`## 세대와 증거는 같은 축이 아니다
G2.21은 B0–B6 본실험이 아직 실행되지 않은 Preseal 계약이다. G2.22는 의미론적 충돌에 들어간 추가 전제를 반례로 분리했다. G2.23은 환경과 표현의 인과 경쟁을 작은 합성 모형으로 교차검증하고 형식적으로 봉인했지만 실제 개인의 인과효과를 측정한 것은 아니다. G2.24는 타자 인식과 사회적 상호 영향을 다루기 위한 설계 단계다.
## 공개할 수 있는 자료
연구진이 독자적으로 작성한 질문 구조, 경쟁 설명, 최소 반례, 독해 깊이, 미검증 상태를 공개한다. 개인 원문, 사적인 체험, 검토되지 않은 심리 해석, 원문 PDF의 무단 재게시와 연구 참여자의 계정 식별자는 공개하지 않는다.
## 무엇이 향후 종료 조건인가
같은 관측을 설명하는 경쟁자가 명확하게 열거되고, 필요한 자료와 저자 확인이 충족되며, 별도의 검증기에서도 계산이 맞고, 반례가 실제로 주장 범위를 바꾸는 경우에만 해당 결론을 폐쇄한다. 설명만 길다고 연구가 완료되지 않는다.
## 상태
공개 기록의 판본과 승인 해시는 GitHub에서 점검한다. 원문 해석 권한과 실험의 실제 실행 여부는 공개 페이지가 대신 승인하지 않는다.`
  },{
    id:'paper-g224-manski-1993',paper:'g224-manski-1993',
    title:'경쟁 문헌 · Manski (1993), Reflection Problem',concept:'G2.24 Manski reflection problem 사회적 효과 식별 그룹 인과',
    body:`## 확인한 자료
Manski, Charles F. (1993). Identification of Endogenous Social Effects: The Reflection Problem. Review of Economic Studies, 60(3), 531–542. DOI: https://doi.org/10.2307/2298123 . 출판사 초록 및 서지정보 확인. 논문 전체 증명 감사는 아직 하지 않았다.
## 문헌의 문제
집단의 평균 행동과 구성원의 행동이 서로 얽힌 상황에서는 관찰된 유사성만으로 누가 누구에게 영향을 주는지 판단하기 어렵다. 비교할 집단의 구성 및 직접적 환경 효과에 관한 구조적 가정이 식별의 열쇠가 된다.
## P&K의 사용 범위
두 사람의 관점 변화가 일치하는 것과 실제로 서로 영향을 주는 것은 다른 명제다. 이 논문은 사회적 인과를 공격하는 경쟁 지식이지 개인 경험을 부정하거나 원저자의 철학을 대체하는 권위가 아니다.
## 제한
초록 수준의 독해 노트다. 전체 논문, 인물 관계, 실험 결과, 사람의 내적 경험을 직접 검증했다고 주장하지 않는다.`
  },{
    id:'paper-g224-shalizi-thomas-2011',paper:'g224-shalizi-thomas-2011',
    title:'경쟁 문헌 · Shalizi–Thomas (2011), Homophily vs Contagion',concept:'G2.24 homophily social contagion selection influence causal identification',
    body:`## 확인한 자료
Shalizi, Cosma R. & Thomas, Andrew C. (2011). Homophily and Contagion Are Generically Confounded in Observational Social Network Studies. Sociological Methods & Research, 40(2), 211–239. DOI: https://doi.org/10.1177/0049124111404820 . 공개 초록 및 초반부를 확인했다.
## 경쟁 가설
닮은 사람끼리 관계를 맺는 선택 효과, 서로의 행동이 옮아가는 영향 효과, 공통 원인의 효과는 관측 자료에서 혼동될 수 있다. 방향이 달라 보이는 통계적 관련성만으로 사회적 전염의 인과를 증명할 수 없다.
## G2.24에서의 반박 기능
'함께 변했다'라는 기록을 상호 영향으로 해석하려면 먼저 누가 누구와 왜 관계를 맺었는지, 같은 환경을 겪었는지를 살펴야 한다. 다른 원인을 제시하는 것은 상호작용의 가능성을 금지하는 일이 아니다.
## 제한
논문의 모든 정리와 가정을 독립 재증명한 것은 아니다. 본문·그림·PDF를 복제하지 않는 연구진의 독자적 독해 요약이다.`
  }
];

const literatureId = '3f4ef561-cf92-814e-94f2-f3e446376382';
const g224LiteratureId = '3f5ef561cf92817681baf4cfb87a7b05';
const bibliography = {
  'parfit-1971': {author:'Parfit',year:1971,exact_title:'Personal Identity',doi:null,version:'원본 PDF 확인 · 판본 세부 정보 확인 전',read_status:'원본 PDF 앞부분 확인',original_claim:'개인 동일성의 결정 가능성과 생존에서 중요한 관계를 구분한다.',our_interpretation:'P&K의 자아 동일성 질문에서 수적 동일성과 심리적 연속성을 분리해 비교한다.',limitations:'전체 논문 독해를 이 기록만으로 주장하지 않는다.',park_relation:'박성준의 발언이나 동의로 귀속하지 않는다.',license:'공개 재배포 권한 확인 전 · PDF 미배포'},
  'khalidi-2010': {author:'Khalidi',year:2010,exact_title:'Interactive Kinds',doi:null,version:'원본 PDF 확인 · 판본 세부 정보 확인 전',read_status:'초록·도입부 확인',original_claim:'개념적 분류와 분류 대상 사이의 되먹임을 논의한다.',our_interpretation:'분류의 변화와 세계의 변화를 구분하는 비교축으로 사용한다.',limitations:'전체 논문 독해 또는 모든 분류의 세계 창조를 주장하지 않는다.',park_relation:'박성준의 원문이 아니라 외부 비교 자료다.',license:'공개 재배포 권한 확인 전 · PDF 미배포'},
  'doyle-1979': {author:'Doyle',year:1979,exact_title:'A Truth Maintenance System',doi:null,version:'원본 PDF 확인 · 판본 세부 정보 확인 전',read_status:'원본 PDF의 가정·정당화·수정 논의 확인',original_claim:'가정과 정당화의 의존 관계를 관리하고 믿음을 수정하는 체계를 제시한다.',our_interpretation:'모순 뒤 보조 규칙만 계속 더해야 한다는 예상의 반대 기준으로 사용한다.',limitations:'이 체계를 박성준의 경험적 자아 모형으로 간주하지 않는다.',park_relation:'박성준의 발언이나 승인으로 귀속하지 않는다.',license:'공개 재배포 권한 확인 전 · PDF 미배포'},
  'massimi-2022': {author:'Massimi',year:2022,exact_title:'Perspectival Realism',doi:null,version:'출판사 PDF 일부 확인 · 판본 세부 정보 확인 전',read_status:'앞부분·일부 추출 구간만 확인 · 전체 이론 독해 전',original_claim:'관점과 실재에 관한 논의를 전개한다. 정확한 장별 논증은 이 기록에서 주장하지 않는다.',our_interpretation:'관점 의존성을 자의성과 곧바로 같게 두지 않기 위한 잠정적 비교 자료다.',limitations:'전체 독해 전이므로 특정 장의 논증을 P&K의 근거로 삼지 않는다.',park_relation:'박성준의 입장으로 귀속하지 않는다.',license:'공개 재배포 권한 확인 전 · PDF 미배포'},
  'g224-manski-1993': {author:'Charles F. Manski',year:1993,exact_title:'Identification of Endogenous Social Effects: The Reflection Problem',doi:'10.2307/2298123',version:'Review of Economic Studies 60(3), 531–542 · 서지정보 확인',read_status:'출판사 초록 및 서지정보 확인 · 전체 논증 미검증',original_claim:'관측된 집단 행동만으로 내생적 사회 효과를 식별하기 어려울 수 있으며 준거 집단에 관한 추가 가정이 중요하다.',our_interpretation:'두 사람의 유사성과 실제 상호 영향은 다른 가설이다.',limitations:'문헌 초록 중심 독해 · 모든 정리 재증명 아님 · 사람의 내적 경험 모델 아님',park_relation:'개인 발언이 아니라 경쟁 문헌',license:'서지와 연구진 자체 요약만 배포 · PDF 미배포'},
  'g224-shalizi-thomas-2011': {author:'Cosma R. Shalizi; Andrew C. Thomas',year:2011,exact_title:'Homophily and Contagion Are Generically Confounded in Observational Social Network Studies',doi:'10.1177/0049124111404820',version:'Sociological Methods & Research 40(2), 211–239 · 서지정보 확인',read_status:'공개 초록·초반 자료 확인 · 전체 증명 미검증',original_claim:'관계 선택의 동질성, 사회적 전염, 공통 원인 사이의 혼동 때문에 관측 네트워크만으로 인과를 식별하기 어렵다.',our_interpretation:'상대와 함께 변했다는 기록에는 선택·공통 환경이라는 반례가 남는다.',limitations:'모든 경험에 적용되는 불가능 정리가 아니며 모든 정리를 독립 증명한 것이 아님',park_relation:'개인 발언이 아니라 경쟁 문헌',license:'서지와 연구진 자체 요약만 배포 · PDF 미배포'}
};
const records = entries.map(entry => {
  const g224Paper = Boolean(entry.paper && entry.id.startsWith('paper-g224-'));
  const paperPageId = g224Paper ? g224LiteratureId : literatureId;
  const source_id = entry.paper ? `${paperPageId}:${entry.paper}` : /^(g223-|g224-)/.test(entry.id) ? `${entry.source_id}:${entry.id}` : entry.source_id;
  const pageId = entry.paper ? paperPageId : entry.source_id;
  // The G2.24 revision is a release-specific curated snapshot identifier, not a simulated Notion edit timestamp.
  const source_revision = entry.paper ? (g224Paper ? 'g224-literature-curation-v1-20261010' : '2026-10-09T18:17:57.380Z') : entry.revision;
  return {
    id: entry.id, source_kind: entry.paper ? 'notion-curated-paper-note' : 'notion-curated', source_id,
    source_revision, source_url: `https://app.notion.com/p/${pageId.replace(/-/g, '')}`,
    title: entry.title, concept: entry.concept, provenance: 'ACTIVE DERIVATIVE', body: entry.body,
    content_hash: crypto.createHash('sha256').update(entry.body, 'utf8').digest('hex'),
    imported_at: '2026-10-10',
    publication_approved_by: entry.id.startsWith('g224-') || entry.id.startsWith('paper-g224-') ? 'project owner · 2026-10-10 requested selective high-quality public research expansion' : entry.id === 'g222-p1-rival-semantics' ? 'project owner · 2026-10-10 instruction for selective P1 research-summary publication' : 'project owner · 2026-10-10 research-record category approval',
    publication_approved_at: '2026-10-10',
    ...(entry.paper ? {bibliography: bibliography[entry.paper]} : {})
  };
});
fs.writeFileSync(path.join(__dirname, '..', 'content', 'public', 'records.json'), JSON.stringify({schema_version: 1, records}, null, 2) + '\n');
console.log(`Built ${records.length} public reading notes`);
