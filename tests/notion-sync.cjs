const assert=require('node:assert/strict');
const handler=require('../api/notion-sync.js');
const ROOT='3c7ef561cf92812bbe45d3a58caf04c0';
const CHILD='3f4ef561cf92812da6b6c843cec80d20';
const previous={token:process.env.NOTION_TOKEN,key:process.env.SUPABASE_PUBLISHABLE_KEY};
function response(){return{statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(body){this.body=body;return this}};}
async function run(){
  const original=global.fetch;
  try{
    process.env.SUPABASE_PUBLISHABLE_KEY='test-public-key';delete process.env.NOTION_TOKEN;
    let res=response();await handler({method:'POST',headers:{authorization:'Bearer test'},body:{pageId:CHILD}},res);assert.equal(res.statusCode,503);
    process.env.NOTION_TOKEN='test-server-secret';let stored;
    global.fetch=async(url,options)=>{
      const parsed=new URL(url),pathname=parsed.pathname;
      const ok=body=>({ok:true,status:200,json:async()=>body});
      if(pathname==='/auth/v1/user')return ok({id:'reviewer'});
      if(pathname==='/rest/v1/app_members')return ok([{role:'reviewer'}]);
      if(pathname==='/v1/pages/'+CHILD)return ok({parent:{type:'page_id',page_id:ROOT},last_edited_time:'2026-10-10T00:00:00.000Z',properties:{title:{type:'title',title:[{plain_text:'FROZEN SOURCE — Synthetic test'}]}}});
      if(pathname==='/v1/blocks/'+CHILD+'/children')return ok({results:[{type:'paragraph',paragraph:{rich_text:[{plain_text:'TEST ONLY'}]},has_children:false}],has_more:false});
      if(pathname==='/rest/v1/library_versions'){stored=JSON.parse(options.body);return ok([{id:'version'}]);}
      throw new Error('Unexpected request '+url);
    };
    res=response();await handler({method:'POST',headers:{authorization:'Bearer test'},body:{pageId:CHILD}},res);
    assert.equal(res.statusCode,200);assert.equal(stored.body,'TEST ONLY');assert.equal(stored.provenance,'FROZEN SOURCE');assert.equal(stored.source_id,CHILD);
    global.fetch=async(url,options)=>{const pathname=new URL(url).pathname;if(pathname==='/auth/v1/user')return{ok:true,json:async()=>({id:'outsider'})};if(pathname==='/rest/v1/app_members')return{ok:true,json:async()=>([])};throw new Error('Notion should not be called for outsider');};
    res=response();await handler({method:'POST',headers:{authorization:'Bearer test'},body:{pageId:CHILD}},res);assert.equal(res.statusCode,403);
    console.log('PASS: importer refuses missing secret and non-reviewer; copies an in-tree source page privately');
  }finally{global.fetch=original;for(const [name,value] of Object.entries({NOTION_TOKEN:previous.token,SUPABASE_PUBLISHABLE_KEY:previous.key})){if(value===undefined)delete process.env[name];else process.env[name]=value;}}
}
run().catch(e=>{console.error(e);process.exitCode=1});
