import {comparePerspectives, identifiedCauses} from './g224-model.mjs';
// An accessible mathematical illustration, never a source-author or human test.
const root=document.getElementById('g224-lab');
if(root){
  const output=root.querySelector('#g224-results');
  const counts=root.querySelector('#g224-identification');
  const state={mode:'observe',environment:0};
  function show(){
    root.querySelectorAll('[data-g224-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.g224Mode===state.mode)));
    root.querySelectorAll('[data-g224-environment]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.g224Environment)===state.environment)));
    const r=comparePerspectives(state);
    output.replaceChildren();
    for(const [title,key,detail] of [
      ['공통 환경 모형','commonCause','공유된 조건이 두 관측을 함께 결정'],
      ['방향성 영향 모형','directedInfluence','A의 표현이 B의 다음 관측에 작용'],
    ]){
      const article=document.createElement('article');
      article.className='frontier-result';
      const label=document.createElement('span');label.className='frontier-result-name';label.textContent=title;
      const value=document.createElement('strong');value.textContent=String(r[key]);
      const desc=document.createElement('small');desc.textContent=detail;
      article.append(label,value,desc);output.append(article);
    }
    const natural=[{environment:0,mode:'observe',observed:0},{environment:1,mode:'observe',observed:1}];
    const observations=state.mode==='intervene'?
      [...natural,{environment:state.environment,mode:state.mode,observed:r.directedInfluence}]:natural;
    const survivors=identifiedCauses(observations);
    counts.textContent=state.mode==='observe'
      ?'자연 관찰 두 사례로는 두 모형이 모두 남습니다. 원인을 식별할 수 없습니다.'
      :'합성 개입에서 예측이 갈립니다. 방향성 모형의 예측을 가상 관측값으로 놓았을 때에만 이 작은 모형 집합에서 방향성 모형이 남습니다. 실제 사람의 관측값은 아닙니다.';
    root.querySelector('#g224-case').textContent=`환경 E=${r.environment} · 표현 X_A=${r.expression} · ${state.mode==='observe'?'자연 관찰':'가상 개입'} · 후보 ${survivors.length}/2`;
  }
  root.querySelectorAll('[data-g224-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.g224Mode;show();}));
  root.querySelectorAll('[data-g224-environment]').forEach(b=>b.addEventListener('click',()=>{state.environment=Number(b.dataset.g224Environment);show();}));
  show();
}
