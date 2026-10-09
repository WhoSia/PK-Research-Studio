// Vercel server-only endpoint. NOTION_TOKEN is never sent to the browser.
const ROOT='3c7ef561cf92812bbe45d3a58caf04c0';
const normalize=s=>s.replace(/-/g,'');
const json=(res,status,message)=>res.status(status).json(typeof message==='string'?{message}:message);
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,405,'POST 요청이 필요합니다.');}
  const base=process.env.SUPABASE_URL||'https://ugqovaxzrjvqouieaqet.supabase.co';
  const key=process.env.SUPABASE_PUBLISHABLE_KEY;
  if(!key||!process.env.NOTION_TOKEN)return json(res,503,'서버용 Notion 연결이 아직 설정되지 않았습니다. 현재 기록은 연결 도구로 가져올 수 있습니다.');
  const authorization=req.headers.authorization||'';
  if(!authorization.startsWith('Bearer '))return json(res,401,'로그인이 필요합니다.');
  const headers={apikey:key,Authorization:authorization,'Content-Type':'application/json'};
  try{
    const userResponse=await fetch(base+'/auth/v1/user',{headers,signal:AbortSignal.timeout(10000)});if(!userResponse.ok)return json(res,401,'로그인이 만료되었습니다.');
    const user=await userResponse.json();const roles=await fetch(base+'/rest/v1/app_members?user_id=eq.'+encodeURIComponent(user.id)+'&select=role',{headers,signal:AbortSignal.timeout(10000)});const members=await roles.json();if(!roles.ok||members[0]?.role!=='reviewer')return json(res,403,'관리자만 가져올 수 있습니다.');
    const raw=typeof req.body==='string'?JSON.parse(req.body):req.body;
    const match=String(raw?.pageId||'').match(/([0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:[/?#]|$)/i);if(!match)return json(res,400,'Notion 페이지 주소를 확인해 주세요.');
    const pageId=normalize(match[1]);let calls=0;
    async function notion(path){if(++calls>70)throw new Error('페이지가 너무 큽니다. 작은 페이지 단위로 가져와 주세요.');const r=await fetch('https://api.notion.com/v1/'+path,{headers:{Authorization:'Bearer '+process.env.NOTION_TOKEN,'Notion-Version':'2022-06-28'},signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error('Notion에서 읽지 못했습니다. 연결 권한과 페이지 주소를 확인해 주세요.');return r.json();}
    const page=await notion('pages/'+pageId);let ancestor=page;let belongs=pageId===ROOT;
    for(let i=0;i<20&&!belongs;i++){const parent=ancestor.parent;if(parent?.type!=='page_id')break;if(normalize(parent.page_id)===ROOT){belongs=true;break;}ancestor=await notion('pages/'+parent.page_id);}
    if(!belongs)return json(res,403,'P&K 연구실 아래의 페이지만 가져올 수 있습니다.');
    const title=Object.values(page.properties||{}).find(p=>p.type==='title')?.title?.map(t=>t.plain_text).join('')||'제목 없음';
    async function blocks(id,depth=0){if(depth>12)throw new Error('문서가 너무 깊어 전체 내용을 가져올 수 없습니다.');let cursor,lines=[];do{const data=await notion('blocks/'+id+'/children?page_size=100'+(cursor?'&start_cursor='+encodeURIComponent(cursor):''));for(const block of data.results){const type=block.type,payload=block[type],text=payload?.rich_text?.map(t=>t.plain_text).join('')||'';
      if(['paragraph','heading_1','heading_2','heading_3','bulleted_list_item','numbered_list_item','quote','callout','toggle','to_do','code','table_row'].includes(type)){const prefix=type.startsWith('heading_')?'#'.repeat(Number(type.slice(-1)))+' ':type==='quote'?'> ':'';lines.push(prefix+(type==='table_row'?payload.cells.map(c=>c.map(t=>t.plain_text).join('')).join(' | '):text));}
      else if(type==='child_page')lines.push('[하위 기록: '+payload.title+']');else if(type==='divider')lines.push('---');else if(!['table','column','column_list'].includes(type))throw new Error('지원하지 않는 블록이 있어 가져오기를 중단했습니다: '+type);
      if(block.has_children&&type!=='child_page')lines.push(await blocks(block.id,depth+1));}cursor=data.has_more?data.next_cursor:null;}while(cursor);return lines.join('\n\n');}
    const body=await blocks(pageId);const after=await notion('pages/'+pageId);if(after.last_edited_time!==page.last_edited_time)return json(res,409,'가져오는 동안 원문이 바뀌었습니다. 다시 시도해 주세요.');
    const provenance=/^(?:🧊\s*)?FROZEN SOURCE\b/.test(title)?'FROZEN SOURCE':'ACTIVE DERIVATIVE';
    const response=await fetch(base+'/rest/v1/library_versions',{method:'POST',headers:{...headers,Prefer:'return=representation'},body:JSON.stringify({source_id:pageId,source_revision:page.last_edited_time+':notion-api-v1',source_kind:'notion',title,body,provenance,source_updated_at:page.last_edited_time}),signal:AbortSignal.timeout(10000)});
    if(response.status===409)return json(res,409,'이미 가져온 버전입니다.');if(!response.ok)return json(res,502,'기록을 저장하지 못했습니다.');return json(res,200,{message:'비공개 버전을 가져왔습니다.'});
  }catch(e){return json(res,502,e.message||'가져오지 못했습니다.');}
};
