'use strict';
// Local-only HTTP fixture for the site's public static surface.
// Never serve the repo indiscriminately: private source and server code are excluded.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const allowed=new Map([
  ['/','index.html'],['/index.html','index.html'],
  ['/app.js','app.js'],['/config.js','config.js'],
  ['/workspace.js','workspace.js'],['/atlas-utils.mjs','atlas-utils.mjs'],
  ['/rival-model.mjs','rival-model.mjs'],
  ['/g224-model.mjs','g224-model.mjs'],['/g224-frontier.mjs','g224-frontier.mjs'],
  ['/styles.css','styles.css'],['/workspace.css','workspace.css'],
  ['/content/public/records.json','content/public/records.json']
]);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8'};
http.createServer((req,res)=>{
  let requested;
  try{requested=new URL(req.url,'http://localhost').pathname;}catch{res.writeHead(400);return res.end();}
  if(!['GET','HEAD'].includes(req.method)||!allowed.has(requested)){
    res.writeHead(404,{'Cache-Control':'no-store'});return res.end();
  }
  const file=path.join(root,allowed.get(requested));
  fs.readFile(file,(err,body)=>{
    if(err){res.writeHead(404);return res.end();}
    res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store',
      'X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:body);
  });
}).listen(4173,'127.0.0.1',()=>process.stdout.write('Local preview: http://127.0.0.1:4173\n'));
