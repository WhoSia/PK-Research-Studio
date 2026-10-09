'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const path=require('node:path');
test('local HTTP exposes the approved source atlas but not server/private code',{timeout:12000},async()=>{
  const server=spawn(process.execPath,[path.join(__dirname,'..','scripts','serve.cjs')],{
    cwd:path.join(__dirname,'..'),stdio:['ignore','pipe','pipe']});
  try {
    await new Promise((resolve,reject)=>{
      let done=false;
      const timer=setTimeout(()=>finish(new Error('Local server startup timeout')),6000);
      function finish(error){if(done)return;done=true;clearTimeout(timer);error?reject(error):resolve();}
      server.stdout.on('data',buf=>{if(buf.toString().includes('Local preview:'))finish();});
      server.on('error',finish);
      server.on('exit',code=>finish(new Error('Local preview quit with '+code)));
    });
    const base='http://127.0.0.1:4173';
    for(const [url,type,marker] of [
      ['/','text/html','id="reading-trails"'],
      ['/workspace.js','text/javascript','filterResearchRecords'],
      ['/atlas-utils.mjs','text/javascript','readingDepth'],
      ['/content/public/records.json','application/json','schema_version']
    ]){
      const response=await fetch(base+url);
      assert.equal(response.status,200,url);
      assert.ok((response.headers.get('content-type')||'').startsWith(type),url);
      assert.ok((await response.text()).includes(marker),url);
    }
    for(const url of ['/api/notion-sync.js','/lib/publication-policy.cjs',
      '/scripts/serve.cjs','/README.md','/private/invites']){
      const response=await fetch(base+url);
      assert.equal(response.status,404,'private path exposed: '+url);
    }
  } finally {
    if(server.exitCode===null){
      const ended=once(server,'exit');server.kill();await ended;
    }
  }
});
