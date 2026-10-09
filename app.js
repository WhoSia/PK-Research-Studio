import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

const PRESEAL = 'https://app.notion.com/p/3f4ef561cf9281a08752db1731b23788';
const nodes = [
  { id:'memory', ko:'기억', en:'MEMORY', x:190,y:160, note:'지금 떠올릴 수 없는 기억도 자아와 관계가 남는지 묻습니다.', question:'기억이 떠오르지 않아도 내 기억이라고 할 수 있을까요?' },
  { id:'perspective', ko:'관점', en:'PERSPECTIVE', x:440,y:120, note:'보는 위치가 달라지면 같은 사건을 나누는 방식도 달라질 수 있습니다.', question:'관점이 바뀌어도 그대로 남는 것은 무엇일까요?' },
  { id:'event', ko:'사건', en:'EVENT', x:680,y:210, note:'어디부터 어디까지를 한 사건으로 볼지 묻는 G2.19의 주제입니다.', question:'사건의 경계는 누가 정할까요?' },
  { id:'timeline', ko:'시간선', en:'TIMELINE', x:720,y:435, note:'시간이 흐른 뒤 과거 사건을 다시 설명할 때 생기는 변화를 살펴봅니다.', question:'나중의 설명이 과거 사건의 의미를 바꿀까요?' },
  { id:'freedom', ko:'자유성', en:'FREEDOM', x:470,y:485, note:'정의할 수 있는 것과 절대적이라고 부르는 것 사이의 관계를 살펴봅니다.', question:'정의하기 어렵다는 이유만으로 자유롭다고 할 수 있을까요?' },
  { id:'absolute', ko:'절대성', en:'ABSOLUTE', x:245,y:435, note:'G2.21에서는 규칙을 그 규칙 자신에게 적용했을 때의 충돌을 따로 다룹니다.', question:'규칙이 자기 자신에게도 적용될까요?' },
  { id:'existence', ko:'실존', en:'EXISTENCE', x:78,y:320, note:'형식 모델이 실제 존재에 대해 어디까지 말할 수 있는지 묻습니다.', question:'모델이 안정적이면 존재에 대한 결론도 나올까요?' },
  { id:'self', ko:'자아', en:'SELF', x:450,y:305, note:'기억, 관점, 사건, 시간의 관계가 모이는 질문입니다. 자아가 무엇인지는 여기서 확정하지 않습니다.', question:'이 관계들이 달라져도 같은 자아라고 할 수 있을까요?' }
];
const edges = [
  {a:'memory',b:'self',type:'관계 가설',note:'기억에 접근하지 못할 때도 자아와의 관계가 남는지 묻습니다.',view:'relations'},
  {a:'perspective',b:'self',type:'관계 가설',note:'관점이 달라지면 자아를 설명하는 방식도 달라질 수 있습니다.',view:'relations'},
  {a:'event',b:'self',type:'경계 문제',note:'사건을 어디서 나누느냐에 따라 자기 이야기가 달라지는지 살펴봅니다.',view:'relations'},
  {a:'timeline',b:'event',type:'시간 관계',note:'지금의 설명이 과거 사건의 분류에 영향을 주는지 묻습니다.',view:'relations'},
  {a:'freedom',b:'absolute',type:'긴장',note:'자유와 절대성의 관계는 아직 정리되지 않았습니다.',view:'tensions'},
  {a:'absolute',b:'self',type:'자기 적용',note:'G2.21은 규칙의 자기 적용과 별도로 둔 절대 전제를 구분합니다.',view:'tensions'},
  {a:'existence',b:'self',type:'권한 경계',note:'형식 모델만으로 실존에 관한 결론을 낼 수는 없습니다.',view:'tensions'},
  {a:'memory',b:'timeline',type:'계보',note:'잊힌 기억과 시간에 따른 자기 관계를 함께 살펴봅니다.',view:'lineage'},
  {a:'perspective',b:'event',type:'계보',note:'G2.19에서 관점과 사건 경계를 함께 다뤘습니다.',view:'lineage'},
  {a:'event',b:'absolute',type:'계보',note:'G2.19의 사건 연구와 G2.21의 규칙 검토를 잇는 질문입니다.',view:'lineage'}
];
const branches = [
  ['B0','기준선','절대 전제를 넣지 않습니다. 다른 분기에서 생기는 충돌과 비교하기 위한 기준입니다.'],
  ['B1','고정 규칙 · 수리 없음','규칙을 그대로 두고 충돌을 고치지 않습니다.'],
  ['B2','고정 규칙 · 구조 변경','규칙은 유지하되 문맥이나 구조를 바꿀 수 있습니다.'],
  ['B3','보조 규칙 추가','규칙을 유지하면서 보조 규칙을 더할 수 있습니다.'],
  ['B4','절대 약속의 대상 변경','절대적 약속은 남기되 그 대상을 바꿀 수 있습니다. 원래 규칙을 사실상 철회하면 위반으로 기록합니다.'],
  ['B5','분기 병렬 보존','B1–B4를 함께 보되 하나의 결과로 합치지 않습니다.'],
  ['B6','외래 입력 추가','B5에 기하 경계 g, 무관한 기록 표지 h, 이름표 j를 추가합니다.']
];
let graphView='relations', selected=[], activeEdge=null, branchIndex=0, member=null, session=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function renderGraph(){
  const svg=$('thought-graph');
  const shown=edges.filter(e=>e.view===graphView || (graphView==='relations'&&e.a==='absolute'&&e.b==='self'));
  svg.innerHTML=`<ellipse class="source-boundary" cx="450" cy="300" rx="412" ry="264"/><text class="source-label" x="65" y="52">SOURCE BOUNDARY · 원문은 별도 보관</text>`+
    shown.map((e,i)=>{const a=nodes.find(n=>n.id===e.a),b=nodes.find(n=>n.id===e.b);const on=activeEdge===edges.indexOf(e)?' active':'';return `<g data-edge="${i}" tabindex="0" role="button" aria-label="${a.ko}와 ${b.ko} 관계 보기"><line class="graph-edge${on}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/><line class="graph-hit" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/></g>`}).join('')+
    nodes.map(n=>`<g class="graph-node${selected.includes(n.id)?' active':''}" data-node="${n.id}" tabindex="0" role="button" aria-label="${n.ko} 개념 보기"><circle cx="${n.x}" cy="${n.y}" r="8"/><text x="${n.x}" y="${n.y-22}">${n.ko}</text><text class="node-sub" x="${n.x}" y="${n.y+31}">${n.en}</text></g>`).join('');
  svg.querySelectorAll('[data-node]').forEach(el=>{const fire=()=>selectNode(el.dataset.node);el.addEventListener('click',fire);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fire()}})});
  svg.querySelectorAll('[data-edge]').forEach(el=>{const fire=()=>selectEdge(shown[Number(el.dataset.edge)]);el.addEventListener('click',fire);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fire()}})});
  $('graph-list').innerHTML=nodes.map(n=>`<button data-index-node="${n.id}">${n.ko}</button>`).join('');
  $('graph-list').querySelectorAll('button').forEach(el=>el.addEventListener('click',()=>selectNode(el.dataset.indexNode)));
}
function selectNode(id){const n=nodes.find(x=>x.id===id);activeEdge=null;selected=selected.filter(x=>x!==id);selected.push(id);if(selected.length>2)selected.shift();$('inspector').innerHTML=`<h3>${n.ko}</h3><p class="inspector-kicker">${n.en} / ACTIVE DERIVATIVE</p><p>${n.note}</p><p><strong>남은 질문</strong><br>${n.question}</p><p class="inspector-provenance">연구진의 해석입니다. 성준의 원문 인용은 아닙니다.</p><a class="inspector-link" href="${PRESEAL}" target="_blank" rel="noopener noreferrer">관련 연구 기록 ↗</a>`;updateCompare();renderGraph()}
function selectEdge(e){activeEdge=edges.indexOf(e);const a=nodes.find(n=>n.id===e.a),b=nodes.find(n=>n.id===e.b);$('inspector').innerHTML=`<h3>${a.ko} ↔ ${b.ko}</h3><p class="inspector-kicker">${e.type} / ACTIVE DERIVATIVE</p><p>${e.note}</p><p class="inspector-provenance">이 연결은 연구진의 가설입니다. 성준의 동의나 실험 결과를 뜻하지 않습니다.</p><a class="inspector-link" href="${PRESEAL}" target="_blank" rel="noopener noreferrer">관련 연구 기록 ↗</a>`;renderGraph()}
function updateCompare(){const c=$('compare-content');if(selected.length<2){c.textContent='두 개념을 차례로 선택하세요.';return}const [a,b]=selected.map(id=>nodes.find(n=>n.id===id));c.innerHTML=`<strong>${a.ko} ↔ ${b.ko}</strong><p>${a.question}<br>${b.question}</p>`}
document.querySelectorAll('.seg').forEach(b=>b.addEventListener('click',()=>{graphView=b.dataset.view;activeEdge=null;document.querySelectorAll('.seg').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderGraph()}));
$('reset-graph').addEventListener('click',()=>{selected=[];activeEdge=null;$('inspector').innerHTML='<p class="inspector-placeholder">개념이나 연결선을 선택하세요.</p>';updateCompare();renderGraph()});
renderGraph();

function renderBranches(){ $('branch-tabs').innerHTML=branches.map((b,i)=>`<button class="branch-button${i===branchIndex?' active':''}" data-branch="${i}" aria-pressed="${i===branchIndex}">${b[0]} <span>${b[1]}</span></button>`).join('');$('branch-tabs').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{branchIndex=Number(b.dataset.branch);renderBranches()}));const b=branches[branchIndex];$('branch-id').textContent=b[0];$('branch-title').textContent=b[1];$('branch-description').textContent=b[2]}
renderBranches();
$('download-config').addEventListener('click',()=>{const b=branches[branchIndex],payload={kind:'PROSPECTIVE_CONFIGURATION_ONLY',research_head:'P&K-G2.21',branch:b[0],branch_meaning:b[1],self_mode:document.querySelector('input[name="self-mode"]:checked').value,ordered_tokens:['d','a','r','u','e'],alien_tokens:b[0]==='B6'?['g','h','j']:[],bounds:{rounds_per_branch:12,auxiliary_rules:8,subbranches:16,transitions_per_regime:128},implementation_hash:null,execution_receipt:null,result:null,source:PRESEAL};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`pk-${b[0].toLowerCase()}-prospective.json`;a.click();URL.revokeObjectURL(url)});

const authStatus=$('auth-status'), authForm=$('auth-form'), feedbackForm=$('feedback-form'), history=$('feedback-history');
function setStatus(message){authStatus.textContent=message}
function saveSession(value){session=value;if(value)sessionStorage.setItem('pk_session',JSON.stringify(value));else sessionStorage.removeItem('pk_session')}
async function api(path,{method='GET',body=null,token=null,headers={}}={}){const r=await fetch(`${SUPABASE_URL}${path}`,{method,headers:{apikey:SUPABASE_PUBLISHABLE_KEY,...(token?{Authorization:`Bearer ${token}`}:{}) ,...(body?{'Content-Type':'application/json'}:{}),...headers},body:body?JSON.stringify(body):undefined});const raw=await r.text();let data;try{data=raw?JSON.parse(raw):null}catch{data=raw}if(!r.ok)throw new Error(data?.msg||data?.message||data?.error_description||`요청 오류 (${r.status})`);return data}
async function activeToken(){if(!session)return null;if(session.expires_at&&Date.now()/1000>session.expires_at-60){try{const s=await api('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}});saveSession({...s,expires_at:Math.floor(Date.now()/1000)+s.expires_in})}catch{saveSession(null);return null}}return session.access_token}
async function loadDesk(){authForm.hidden=false;feedbackForm.hidden=true;history.hidden=true;$('logout').hidden=true;let token=await activeToken();if(!token){setStatus('초대받은 계정으로 로그인하면 의견을 남길 수 있습니다.');return}try{const user=await api('/auth/v1/user',{token});const rows=await api(`/rest/v1/app_members?select=user_id,role&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,{token});member=rows?.[0]||null;$('logout').hidden=false;if(!member){setStatus('로그인됐습니다. 아직 참여 권한은 등록되지 않았습니다.');authForm.hidden=true;return}setStatus(`${user.email} · ${member.role==='reviewer'?'검토자':'참여자'} 로그인`);authForm.hidden=true;feedbackForm.hidden=false;history.hidden=false;$('member-role').textContent=member.role==='reviewer'?'REVIEWER':'PARTICIPANT';await loadFeedback(user.id,token)}catch(e){setStatus(`접근을 확인하지 못했습니다: ${e.message}`);authForm.hidden=false}}
async function loadFeedback(userId,token){try{const reviewer=member?.role==='reviewer';$('feedback-history').querySelector('h3').textContent=reviewer?'검토 대기열':'내 제출 기록';const filter=reviewer?'':`&author_uid=eq.${encodeURIComponent(userId)}`;const rows=await api(`/rest/v1/feedback?select=id,kind,body,status,created_at,author_uid,target_ref${filter}&order=created_at.desc&limit=50`,{token});const list=$('feedback-list');list.replaceChildren();if(!rows.length){const li=document.createElement('li');li.textContent='제출된 의견이 없습니다.';list.append(li);return}for(const item of rows){const li=document.createElement('li'),tag=document.createElement('b'),p=document.createElement('p');tag.textContent=`${item.status} · ${new Date(item.created_at).toLocaleString('ko-KR')}${reviewer&&item.author_uid!==userId?' · 다른 참여자':''}`;p.textContent=`${item.kind}${item.target_ref?' / '+item.target_ref:''}\n${item.body}`;li.append(tag,p);if(reviewer){const select=document.createElement('select');select.setAttribute('aria-label','검토 상태 변경');for(const status of ['SUBMITTED FEEDBACK','UNDER REVIEW','REVIEWED']){const option=document.createElement('option');option.value=status;option.textContent=status;option.selected=item.status===status;select.append(option)}select.addEventListener('change',async()=>{try{await api(`/rest/v1/feedback?id=eq.${encodeURIComponent(item.id)}`,{method:'PATCH',token,headers:{Prefer:'return=minimal'},body:{status:select.value}});await loadFeedback(userId,token)}catch(e){$('feedback-message').textContent=`상태 변경 실패: ${e.message}`}});li.append(select)}list.append(li)}}catch(e){$('feedback-list').textContent=`기록을 읽지 못했습니다: ${e.message}`}}
authForm.addEventListener('submit',async e=>{e.preventDefault();const email=$('email').value.trim();if(!email)return;try{await api('/auth/v1/otp',{method:'POST',body:{email,create_user:true},headers:{'Redirect-To':location.origin+location.pathname}});setStatus('로그인 링크를 보냈습니다. 메일의 링크를 열어주세요.')}catch(err){setStatus(`로그인 링크를 보내지 못했습니다: ${err.message}`)}});
$('logout').addEventListener('click',async()=>{const token=await activeToken();if(token)try{await api('/auth/v1/logout',{method:'POST',token})}catch{}saveSession(null);member=null;await loadDesk()});
$('preview-button').addEventListener('click',()=>{const body=$('feedback-body').value.trim(),target=$('feedback-target').value.trim();const p=$('feedback-preview');p.textContent=`유형: ${$('feedback-kind').selectedOptions[0].textContent}\n대상: ${target||'미지정'}\n\n${body||'(의견을 입력하세요)'}\n\n상태: SUBMITTED FEEDBACK · 검토 전`;p.hidden=false});
feedbackForm.addEventListener('submit',async e=>{e.preventDefault();const msg=$('feedback-message'),body=$('feedback-body').value.trim();if(!member||body.length<10||!$('feedback-consent').checked){msg.textContent='의견과 동의 항목을 확인해 주세요.';return}const token=await activeToken();if(!token){msg.textContent='로그인이 만료되었습니다. 다시 로그인해 주세요.';return}try{const user=await api('/auth/v1/user',{token});const rows=await api('/rest/v1/feedback?select=id,created_at,status',{method:'POST',token,headers:{Prefer:'return=representation'},body:{author_uid:user.id,kind:$('feedback-kind').value,target_ref:$('feedback-target').value.trim()||null,body,consent:true}});if(!rows?.[0]?.id)throw new Error('저장 영수증이 반환되지 않았습니다.');msg.textContent=`저장 완료 · ${rows[0].status} · 영수증 ${rows[0].id}`;feedbackForm.reset();$('feedback-preview').hidden=true;await loadFeedback(user.id,token)}catch(err){msg.textContent=`제출 실패: ${err.message}`}});

async function initAuth(){const hash=new URLSearchParams(location.hash.slice(1));if(hash.has('access_token')){const expires=Number(hash.get('expires_in')||3600);saveSession({access_token:hash.get('access_token'),refresh_token:hash.get('refresh_token'),expires_at:Math.floor(Date.now()/1000)+expires});history.replaceState(null,'',location.pathname+location.search+'#desk')}else{try{const saved=JSON.parse(sessionStorage.getItem('pk_session')||'null');if(saved?.access_token)session=saved}catch{}}await loadDesk()}
initAuth();
