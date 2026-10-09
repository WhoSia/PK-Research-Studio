const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json'};
const reviewer='00000000-0000-4000-8000-000000000011',participant='00000000-0000-4000-8000-000000000012';
const questionId='00000000-0000-4000-8000-000000000021';
const state={questions:[],answers:[]};
function routeFor(user,role){return async route=>{
  const request=route.request(),url=new URL(request.url()),pathname=url.pathname,method=request.method();
  if(url.hostname==='pk.local'){
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'missing'});
    return route.fulfill({status:200,contentType:mime[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});
  }
  const done=(data,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  if(pathname==='/auth/v1/user')return done({id:user,email:role+'@example.invalid'});
  if(pathname==='/rest/v1/app_members')return done([{user_id:user,role}]);
  if(pathname==='/rest/v1/questions'){
    if(method==='POST'){const q={...JSON.parse(request.postData()),id:questionId,created_at:new Date().toISOString()};state.questions.push(q);return done([q],201);}
    return done(state.questions);
  }
  if(pathname==='/rest/v1/answer_revisions'){
    if(method==='POST'){const a={...JSON.parse(request.postData()),id:crypto.randomUUID(),created_at:new Date().toISOString()};state.answers.push(a);return done([a],201);}
    return done(state.answers);
  }
  if(pathname==='/rest/v1/library_versions'||pathname==='/rest/v1/library_publications')return done([]);
  return done({});
};}
async function signedInPage(browser,user,role){
  const context=await browser.newContext();
  await context.addInitScript(()=>sessionStorage.setItem('pk_session',JSON.stringify({access_token:'test',expires_at:9999999999})));
  const page=await context.newPage();await page.route('**/*',routeFor(user,role));await page.goto('https://pk.local/');return {page,context};
}

async function run(){
  const browser=await chromium.launch({headless:true,executablePath:process.env.PK_BROWSER_BIN||undefined});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>{
      const url=new URL(route.request().url());
      if(url.hostname==='pk.local'){
        const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
        if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'missing'});
        return route.fulfill({status:200,contentType:mime[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});
      }
      if(url.pathname==='/rest/v1/library_versions'||url.pathname==='/rest/v1/library_publications')return route.fulfill({status:200,contentType:'application/json',body:'[]'});
      return route.fulfill({status:200,body:''});
    });
    await page.goto('https://pk.local/');
    await page.getByRole('heading',{name:'질문과 답변'}).waitFor();
    await page.getByText('10개의 기록').waitFor();
    await page.locator('#record-filter').selectOption('paper');
    await page.getByText('4개의 기록').waitFor();
    await page.getByRole('button',{name:/Parfit \(1971\)/}).click();
    await page.getByRole('heading',{name:/Parfit \(1971\)/}).waitFor();
    await page.getByText('원본 PDF 앞부분 확인').waitFor();
    assert.ok((await page.locator('#record-reader').getByText('논문 전문이 아니라 P&K의 읽기 기록이다.').count())>=1);
    await page.getByRole('button',{name:'닫기 ×'}).click();
    await page.locator('#record-filter').selectOption('');
    await page.getByRole('button',{name:'기억 개념 보기'}).click();
    await page.getByRole('button',{name:'관련 기록 읽기'}).click();
    assert.equal(new URL(page.url()).hash,'#records');
    assert.equal(await page.locator('#record-search').inputValue(),'기억');
    assert.equal(await page.locator('#question-list').textContent().then(s=>s.includes('참여자끼리 봅니다')),true);
    assert.equal(errors.length,0,'browser errors: '+errors.join(' | '));
    await page.screenshot({path:path.join(root,'artifacts','workspace-mobile.png'),fullPage:true});
    await page.setViewportSize({width:1440,height:900});
    await page.screenshot({path:path.join(root,'artifacts','workspace-desktop.png'),fullPage:true});
    const reviewerView=await signedInPage(browser,reviewer,'reviewer');
    await reviewerView.page.getByRole('button',{name:'질문 올리기 +'}).click();
    await reviewerView.page.locator('#question-title').fill('기억을 잊어도 내 기억일까?');
    await reviewerView.page.locator('#question-body').fill('지금 떠올릴 수 없는 기억과 자아의 관계를 묻습니다.');
    await reviewerView.page.locator('#question-concept').selectOption('기억');
    await reviewerView.page.locator('#new-question-form button[type=submit]').click();
    await reviewerView.page.getByRole('heading',{name:'기억을 잊어도 내 기억일까?'}).waitFor();
    assert.equal(state.questions.length,1);
    await reviewerView.context.close();
    const participantView=await signedInPage(browser,participant,'participant');
    await participantView.page.getByRole('button',{name:/기억을 잊어도 내 기억일까/}).click();
    await participantView.page.locator('#answer-editor').fill('지금 접근할 수 없어도 내 경험이라는 관계가 남는다고 생각합니다.');
    await participantView.page.getByRole('button',{name:'답변 저장'}).click();
    await participantView.page.getByRole('button',{name:'박성준의 답변 모아 읽기'}).click();
    await participantView.page.locator('#question-list .answer-body').getByText('지금 접근할 수 없어도 내 경험이라는 관계가 남는다고 생각합니다.').waitFor();
    assert.equal(state.answers.length,1);
    await participantView.page.getByRole('button',{name:'질문과 수정 이력 보기'}).click();
    await participantView.page.locator('#answer-editor').fill('기억이 떠오르지 않아도 그 기억과 맺은 관계가 내게 남을 수 있습니다.');
    await participantView.page.getByRole('button',{name:'답변 저장'}).click();
    await participantView.page.getByText('수정 이력 2개').waitFor();
    assert.equal(state.answers.length,2);
    assert.equal(state.answers[1].revision,2);
    await participantView.context.close();
    console.log('PASS: anonymous page, graph hit target, record navigation, mobile and desktop rendering');
    console.log('PASS: reviewer question post, participant answer save and revision, answer reading view');
  }finally{await browser.close();}
}
fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});run().catch(e=>{console.error(e);process.exitCode=1});
