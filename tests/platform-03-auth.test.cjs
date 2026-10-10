'use strict';
const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const config=fs.readFileSync(path.join(root,'config.js'),'utf8');
test('two-person UI requests private user-selected credentials',()=>{
 a.match(html,/id="password"[^>]+type="password"|type="password" id="password"/);
 a.match(html,/minlength="12"/);
 a.match(html,/id="register-account"/);
 a.doesNotMatch(html,/로그인 링크 받기/);
});
test('auth uses Supabase password exchange and verification without hardcoded identity',()=>{
 a.match(app,/grant_type=password/);
 a.match(app,/\/auth\/v1\/signup/);
 a.match(app,/\$\('password'\)\.value=''/);
 a.doesNotMatch(app,/grant_type=password[^\n]*kimwoujun@/);
 a.doesNotMatch(app,/seongjunbag576@/);
 a.doesNotMatch(config,/service_role|sb_secret_/);
});
test('the web build must not bundle personal email allowlist or plaintext passwords',()=>{
 for(const src of [html,app,config]){
  a.doesNotMatch(src,/@naver\.com|@gmail\.com/i);
  a.doesNotMatch(src,/PASSWORD\s*=|password\s*:\s*['"][^'"]+['"]/);
 }
});
