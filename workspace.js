const $ = id => document.getElementById(id);
const el = (tag, text, className) => { const n=document.createElement(tag); if(text!==undefined)n.textContent=text; if(className)n.className=className; return n; };
const date = value => new Date(value).toLocaleDateString('ko-KR');
const labels={'FROZEN SOURCE':'원문 보관 문서','ACTIVE DERIVATIVE':'연구진의 해석','SUBMITTED FEEDBACK':'새 답변 · 검토 전','HOLD':'남은 문제','EXPERIMENT':'실험 기록'};

export function createWorkspace({api,activeToken,getMember}) {
  let questions=[], replies=[], records=[], publications=[], selectedQuestion=null, mode='questions', generation=0;
  let draftDirty=false;
  const member=()=>getMember();
  const request=async(path,options={})=>api('/rest/v1/'+path,{...options,token:await activeToken()});
  const latest=()=>[...new Map([...replies].sort((a,b)=>a.revision-b.revision).map(a=>[a.question_id+':'+a.author_uid,a])).values()];
  const button=(text,fn,cls='workspace-button')=>{const b=el('button',text,cls);b.type='button';b.addEventListener('click',fn);return b;};
  function notice(text){$('workspace-message').textContent=text;}
  function permitLeave(){return !draftDirty||window.confirm('아직 저장하지 않은 답변이 있습니다. 이동할까요?');}
  window.addEventListener('beforeunload',e=>{if(draftDirty){e.preventDefault();e.returnValue='';}});
  function matches(text){return text.toLocaleLowerCase().includes($('question-search').value.trim().toLocaleLowerCase());}
  function renderQuestions(){
    const list=$('question-list');list.replaceChildren();
    document.querySelectorAll('[data-workspace-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.workspaceView===mode)));
    $('question-filter').closest('label').hidden=mode==='answers';
    const filter=$('question-filter').value;
    const answered=new Set(replies.map(a=>a.question_id));
    const rows=questions.filter(q=>matches(q.title+' '+q.body+' '+q.concept+' '+replies.filter(a=>a.question_id===q.id).map(a=>a.body).join(' '))&&(!filter||(filter==='waiting'?!answered.has(q.id):answered.has(q.id))));
    if(!member()&&mode==='questions'){list.append(el('p','질문과 작성 중인 답변은 참여자끼리 봅니다. 공개된 답변은 아래 연구 기록에서 읽을 수 있습니다.','empty-note'));return;}
    if(mode==='answers'){
      const answers=latest().filter(a=>{const q=questions.find(q=>q.id===a.question_id);return q&&matches(q.title+' '+q.concept+' '+a.body);}).sort((a,b)=>b.created_at.localeCompare(a.created_at));
      const sourceRecords=[...new Map([...records].reverse().filter(r=>r.provenance==='FROZEN SOURCE'&&r.source_kind==='notion').map(r=>[r.source_id,r])).values()].filter(r=>matches(r.title+' '+r.body));
      if(!answers.length&&!sourceRecords.length)list.append(el('p','아직 읽을 수 있는 답변이 없습니다. 답변을 저장하거나 원문 보관 문서를 공개하면 여기에 모입니다.','empty-note'));
      for(const a of answers){const q=questions.find(q=>q.id===a.question_id),article=el('article',undefined,'answer-sheet');article.append(el('span',`${date(a.created_at)} · 수정 ${a.revision} · 검토 전`,'micro'),el('h3',q.title),el('p',q.body,'question-context'),el('p',a.body,'answer-body'),button('질문과 수정 이력 보기 →',()=>openQuestion(q.id)));list.append(article);}
      for(const r of sourceRecords){const article=el('article',undefined,'answer-sheet');article.append(el('span','원문 보관 문서 · '+date(r.imported_at),'micro'),el('h3',r.title));const body=el('div',undefined,'archived-answer');renderText(body,r.body);article.append(body,button('출처와 버전 보기 →',()=>openRecord(r.id)));list.append(article);}
    } else {
      if(!rows.length)list.append(el('p',questions.length?'조건에 맞는 질문이 없습니다.':'아직 올라온 질문이 없습니다. 우준 님이 첫 질문을 올리면 여기서 답변을 이어갑니다.','empty-note'));
      for(const q of rows){const b=button('',()=>openQuestion(q.id),'question-row');b.append(el('span',answered.has(q.id)?'답변 있음':'답변 기다리는 중','micro'),el('strong',q.title),el('span',`${q.concept||'자유 질문'} · ${date(q.created_at)}`,'row-meta'),el('span','↗','row-arrow'));list.append(b);}
    }
    $('question-count').textContent=mode==='answers'?`${list.querySelectorAll('.answer-sheet').length}개의 읽을거리`:`${questions.length}개의 질문`;
  }
  function openQuestion(id){
    if(!permitLeave())return;draftDirty=false;selectedQuestion=id;
    const q=questions.find(x=>x.id===id);if(!q)return;
    const panel=$('question-detail');panel.hidden=false;panel.replaceChildren();panel.append(button('← 목록으로',()=>{if(!permitLeave())return;draftDirty=false;panel.hidden=true;$('question-list').hidden=false;selectedQuestion=null;}));
    panel.append(el('span',`${q.concept||'자유 질문'} · ${date(q.created_at)}`,'detail-meta'),el('h3',q.title),el('p',q.body,'question-body'));
    const answers=latest().filter(a=>a.question_id===id);
    for(const a of answers){const article=el('article',undefined,'answer-sheet');article.append(el('span',`답변 · ${date(a.created_at)} · 수정 ${a.revision}`,'micro'),el('p',a.body,'answer-body'));const versions=replies.filter(x=>x.question_id===id&&x.author_uid===a.author_uid).sort((x,y)=>y.revision-x.revision);const details=el('details'),summary=el('summary',`수정 이력 ${versions.length}개`);details.append(summary);for(const v of versions){details.append(el('h4',`수정 ${v.revision} · ${date(v.created_at)}`),el('p',v.body,'answer-body'));}article.append(details);
      if(member()?.role==='reviewer')article.append(button('이 답변을 공개 검토 목록에 넣기',async()=>{try{await request('library_versions',{method:'POST',headers:{Prefer:'return=representation'},body:{source_kind:'answer',source_id:'answer:'+a.question_id+':'+a.author_uid,source_revision:a.id,title:q.title,body:a.body,provenance:'SUBMITTED FEEDBACK'}});notice('비공개 기록으로 옮겼습니다. 연구 기록에서 내용을 확인한 뒤 공개할 수 있습니다.');await loadRecords();}catch(e){notice('옮기지 못했습니다. 이미 옮긴 답변인지 확인해 주세요. '+e.message);}}));
      panel.append(article);
    }
    if(!answers.length)panel.append(el('p','아직 답변이 없습니다.','empty-note'));
    if(member()?.role==='participant'){
      const own=answers.find(a=>a.author_uid===member().user_id),form=el('form',undefined,'workspace-form');
      const label=el('label',own?'답변 고치기':'내 답변');label.htmlFor='answer-editor';const input=el('textarea');input.id='answer-editor';input.rows=9;input.required=true;input.maxLength=24000;input.value=own?.body||'';input.placeholder='생각을 그대로 적어주세요. 나중에 고쳐도 이전 답변은 남습니다.';input.addEventListener('input',()=>draftDirty=true);
      const submit=el('button','답변 저장','submit-button');submit.type='submit';const status=el('p');status.setAttribute('role','status');
      form.append(label,input,el('small','저장하면 연구 참여자가 읽을 수 있습니다. 공개 여부는 우준 님이 따로 정합니다.'),submit,status);
      form.addEventListener('submit',async e=>{e.preventDefault();if(!input.value.trim())return;submit.disabled=true;try{await request('answer_revisions',{method:'POST',body:{question_id:id,author_uid:member().user_id,revision:(own?.revision||0)+1,body:input.value.trim()}});draftDirty=false;await loadPrivate();openQuestion(id);notice('답변을 저장했습니다.');}catch(err){status.textContent='저장하지 못했습니다. 작성한 내용은 이 칸에 남아 있습니다. '+err.message;}finally{submit.disabled=false;}});panel.append(form);
    }
    $('question-list').hidden=true;panel.focus();
  }
  async function loadPrivate(){
    if(!member()){questions=[];replies=[];return;}
    const ticket=generation;
    const [q,a]=await Promise.all([request('questions?select=*&order=created_at.desc&limit=500'),request('answer_revisions?select=*&order=created_at.desc&limit=2000')]);
    if(ticket===generation){questions=q;replies=a;}
  }
  async function loadRecords(){
    const ticket=generation;
    const [r,p]=await Promise.all([request('library_versions?select=*&order=imported_at.desc&limit=1000'),request('library_publications?select=*')]);
    if(ticket===generation){records=r;publications=p;renderRecords();if(mode==='answers')renderQuestions();}
  }
  function renderRecords(){
    const box=$('record-list');box.replaceChildren();const query=$('record-search').value.trim().toLocaleLowerCase(),kind=$('record-filter').value;
    const latestVersions=[...new Map([...records].reverse().map(r=>[r.source_id,r])).values()];
    const filtered=latestVersions.filter(r=>(!kind||r.provenance===kind)&&(r.title+' '+r.body+' '+r.concept).toLocaleLowerCase().includes(query));
    $('record-count').textContent=`${filtered.length}개의 기록`;
    if(!filtered.length)box.append(el('p',records.length?'조건에 맞는 기록이 없습니다.':'아직 공개한 기록이 없습니다. 공개로 지정한 글부터 이곳에 쌓입니다.','empty-note'));
    for(const r of filtered){const pub=publications.find(p=>p.source_id===r.source_id);const b=button('',()=>openRecord(r.id),'record-row');b.append(el('span',labels[r.provenance]||r.provenance,'micro'),el('strong',r.title),el('span',member()?.role==='reviewer'?(pub?.version_id===r.id?'공개 중':pub?'새 버전 · 공개 전':'비공개'):'읽기 →','row-meta'));box.append(b);}
  }
  function renderText(container,text){
    // Only known Notion wrappers are removed. Code blocks keep their exact text.
    const parts=text.split(/(^```[^\n]*\n[\s\S]*?^```\s*$)/gm);
    for(const part of parts){
      if(part.startsWith('```')){const pre=el('pre',part.replace(/^```[^\n]*\n/,'').replace(/\n```\s*$/,''),'source-code');container.append(pre);continue;}
      const readable=part.replace(/<br\s*\/?\s*>/g,'\n').replace(/<mention-page[^>]*>(.*?)<\/mention-page>/g,'$1').replace(/<mention-page[^>]*\/>/g,'[관련 기록]').replace(/<page[^>]*>(.*?)<\/page>/g,'$1').replace(/<\/?(?:callout|columns|column|table|tr|td|details|summary|tabs|tab)[^>]*>/g,'');
      for(const line of readable.split('\n')){if(!line.trim())continue;const heading=line.match(/^(#{1,4})\s+(.+)/);container.append(el(heading?'h4':'p',heading?heading[2]:line));}
    }
  }
  function openRecord(id){
    const r=records.find(x=>x.id===id);if(!r)return;const dialog=$('record-reader');$('reader-title').textContent=r.title;const content=$('reader-content');content.replaceChildren();content.append(el('p',`${labels[r.provenance]} · 가져온 날짜 ${date(r.imported_at)}`,'detail-meta'));renderText(content,r.body);
    const custody=el('details'),summary=el('summary','출처와 버전');custody.append(summary,el('p',`분류: ${r.provenance}`),el('p',`가져온 버전: ${r.source_revision}`),el('p',`보관된 본문 SHA-256: ${r.content_hash}`,'hash'));const raw=el('details');raw.append(el('summary','가져온 원문 형식 그대로 보기'),el('pre',r.body,'source-code'));custody.append(raw);content.append(custody);
    const actions=$('reader-actions');actions.replaceChildren();if(member()?.role==='reviewer'){
      const pub=publications.find(p=>p.source_id===r.source_id);
      actions.append(button(pub?.version_id===r.id?'공개 중':'이 버전을 공개',async()=>{if(!window.confirm('이 기록의 본문 전체를 누구나 읽을 수 있게 공개할까요?'))return;try{await request('library_publications?on_conflict=source_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates'},body:{source_id:r.source_id,version_id:r.id}});await loadRecords();openRecord(id);}catch(e){notice('공개하지 못했습니다. '+e.message);}}));actions.firstChild.disabled=pub?.version_id===r.id;
      if(pub)actions.append(button('공개 내리기',async()=>{try{await request('library_publications?source_id=eq.'+encodeURIComponent(r.source_id),{method:'DELETE'});await loadRecords();openRecord(id);}catch(e){notice(e.message);}}));
      const versions=records.filter(v=>v.source_id===r.source_id);if(versions.length>1){const select=el('select');select.setAttribute('aria-label','기록 버전');for(const v of versions){const o=el('option',`${date(v.imported_at)} · ${v.id===pub?.version_id?'공개본':'보관본'}`);o.value=v.id;o.selected=v.id===id;select.append(o);}select.addEventListener('change',()=>openRecord(select.value));actions.append(select);}
    }
    if(!dialog.open)dialog.showModal();
  }
  $('reader-close').addEventListener('click',()=>$('record-reader').close());
  document.querySelectorAll('.preseal-record-link').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();workspaceSearch('G2.21');}));
  function workspaceSearch(term){$('record-search').value=term;$('record-filter').value='';renderRecords();location.hash='records';$('record-search').focus();}
  $('question-search').addEventListener('input',renderQuestions);$('question-filter').addEventListener('change',renderQuestions);
  $('record-search').addEventListener('input',renderRecords);$('record-filter').addEventListener('change',renderRecords);
  document.querySelectorAll('[data-workspace-view]').forEach(b=>b.addEventListener('click',()=>{if(!permitLeave())return;draftDirty=false;mode=b.dataset.workspaceView;$('question-detail').hidden=true;$('question-list').hidden=false;renderQuestions();}));
  $('new-question-toggle').addEventListener('click',()=>{$('new-question-form').hidden=!$('new-question-form').hidden;if(!$('new-question-form').hidden)$('question-title').focus();});
  $('new-question-form').addEventListener('submit',async e=>{e.preventDefault();const submit=e.currentTarget.querySelector('[type=submit]');submit.disabled=true;try{const rows=await request('questions',{method:'POST',headers:{Prefer:'return=representation'},body:{author_uid:member().user_id,title:$('question-title').value.trim(),body:$('question-body').value.trim(),concept:$('question-concept').value}});e.target.reset();e.target.hidden=true;await loadPrivate();renderQuestions();openQuestion(rows[0].id);notice('질문을 올렸습니다.');}catch(err){notice('질문을 올리지 못했습니다. '+err.message);}finally{submit.disabled=false;}});
  $('refresh-records').addEventListener('click',async()=>{try{await loadRecords();$('record-status').textContent='웹에 저장된 기록을 다시 읽었습니다.';}catch(e){$('record-status').textContent='기록을 읽지 못했습니다. '+e.message;}});
  $('notion-import-form').addEventListener('submit',async e=>{e.preventDefault();const submit=e.currentTarget.querySelector('button');submit.disabled=true;try{const response=await fetch('/api/notion-sync',{method:'POST',headers:{Authorization:'Bearer '+await activeToken(),'Content-Type':'application/json'},body:JSON.stringify({pageId:$('notion-page').value.trim()})});const result=await response.json();if(!response.ok)throw new Error(result.message||'가져오지 못했습니다.');await loadRecords();$('record-status').textContent='새 버전을 비공개로 가져왔습니다. 본문을 확인한 뒤 공개해 주세요.';}catch(err){$('record-status').textContent=err.message;}finally{submit.disabled=false;}});
  return {
    async refresh(){const ticket=++generation;$('question-detail').hidden=true;$('question-list').hidden=false;questions=[];replies=[];records=[];publications=[];if($('record-reader').open)$('record-reader').close();$('reader-content').replaceChildren();$('reader-actions').replaceChildren();$('question-detail').replaceChildren();renderQuestions();renderRecords();$('new-question-toggle').hidden=member()?.role!=='reviewer';$('new-question-form').hidden=true;$('notion-import').hidden=member()?.role!=='reviewer';try{await loadPrivate();if(ticket!==generation)return;renderQuestions();await loadRecords();}catch(e){if(ticket===generation)notice('기록을 불러오지 못했습니다. 새로고침해 다시 시도해 주세요. '+e.message);}},
    findRecords:workspaceSearch,
    askAbout(concept){$('question-concept').value=concept;location.hash='questions';if(member()?.role==='reviewer'){$('new-question-form').hidden=false;$('question-title').focus();}else notice('질문 작성은 우준 님 계정에서 할 수 있습니다. 성준 님은 올라온 질문에 답변을 남길 수 있습니다.');}
  };
}
