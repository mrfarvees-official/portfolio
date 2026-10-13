import assert from "node:assert/strict";
import { writeFile,unlink } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const base="http://localhost:3100";
const testName=`browser-check-${Date.now()}`;
const connection=await mysql.createConnection(process.env.DATABASE_URL);
const target=await (await fetch("http://localhost:9223/json/new?about:blank",{method:"PUT"})).json();
const socket=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
let id=0;
const requests=new Map();
socket.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id){const request=requests.get(msg.id);requests.delete(msg.id);if(msg.error)request.reject(new Error(msg.error.message));else request.resolve(msg.result);}};
function send(method,params={}){return new Promise((resolve,reject)=>{const key=++id;requests.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}));});}
async function evaluate(expression){const result=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);return result.result.value;}
async function until(expression){for(let i=0;i<120;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,150));}const status=await evaluate("Array.from(document.querySelectorAll('[role=status]')).map(x=>x.textContent).join(' | ')");throw new Error(`Timed out: ${expression}; status: ${status}`);}
async function navigate(route){
  const marker=`nav-${Date.now()}-${Math.random()}`;
  await evaluate(`window.__navigationMarker=${JSON.stringify(marker)}`);
  await send("Page.navigate",{url:base+route});
  await until(`window.__navigationMarker !== ${JSON.stringify(marker)} && document.readyState === 'complete' && location.pathname + location.search === ${JSON.stringify(route)}`);
  await evaluate("document.fonts.ready.then(()=>true)");
}
async function screenshot(name){const {data}=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:true});await writeFile(path.join(process.cwd(),".next",name),Buffer.from(data,"base64"));}
try{
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate("/");
  const apiProjectCount=await evaluate("(async()=>((await (await fetch('/api/projects')).json()).projects.length))()");
  const apiProgressCount=await evaluate("(async()=>((await (await fetch('/api/projects')).json()).projects.filter(project=>project.inProgress).length))()");
  await until(`document.querySelectorAll('.timeline-row').length === ${apiProjectCount}`);
  assert.equal(await evaluate("document.querySelectorAll('.project-card').length"),apiProjectCount,"Cards and the project API must use the same published projects");
  assert.equal(await evaluate("document.querySelectorAll('.project-card .badge-progress').length"),apiProgressCount,"In-progress cards must use the special badge");
  assert.equal(await evaluate("document.querySelectorAll('.timeline-status').length"),apiProgressCount,"About must show API project statuses");
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true);
  await screenshot("portfolio-desktop.png");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await screenshot("portfolio-mobile.png");
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true,"Home overflows on mobile");
  await navigate("/work/peopleops");
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true,"Case study overflows on mobile");
  assert.equal(await evaluate("Array.from(document.querySelectorAll('.contents a')).every(a=>document.getElementById(a.hash.slice(1)))"),true,"Contents links must resolve");
  await screenshot("case-study-mobile.png");
  await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await screenshot("case-study-desktop.png");
  await navigate("/admin/login");
  await evaluate(`document.querySelector('[name=password]').value=${JSON.stringify(process.env.ADMIN_PASSWORD)};document.querySelector('.login-panel form').requestSubmit();true`);
  await until("location.pathname === '/admin/projects' && !!document.querySelector('.admin-nav')");
  assert.ok(await evaluate("document.querySelectorAll('.editor [name=inProgress]').length > 0"),"Project editors must expose the in-progress checkbox");
  await screenshot("admin-projects.png");
  await navigate("/admin/notes");
  await evaluate(`(()=>{const f=Array.from(document.querySelectorAll('.editor form')).find(f=>f.querySelector('[name=id]').value==='0');const set=(n,v)=>f.querySelector('[name='+n+']').value=v;set('title','Browser verification draft');set('slug',${JSON.stringify(testName)});set('body',${JSON.stringify("## Browser verification\n\nTemporary verification content.")});f.requestSubmit();return true;})()`);
  await until("Array.from(document.querySelectorAll('[role=status]')).some(x=>x.textContent.includes('Saved.'))");
  let [rows]=await connection.execute("SELECT id,published,body FROM notes WHERE slug=?",[testName]);
  assert.equal(rows.length,1);assert.equal(rows[0].published,0);assert.match(rows[0].body,/Temporary verification/);
  const draft = await (await fetch(`${base}/notes/${testName}`)).text();
  assert.ok(!draft.includes("Temporary verification content."),"Draft body must remain private (streamed not-found responses may use HTTP 200)");
  await navigate("/admin/notes");
  await evaluate(`(()=>{const f=Array.from(document.querySelectorAll('.editor form')).find(f=>f.querySelector('[name=slug]').value===${JSON.stringify(testName)});f.closest('details').open=true;f.querySelector('[name=published]').checked=true;f.requestSubmit();return true;})()`);
  await until("Array.from(document.querySelectorAll('[role=status]')).some(x=>x.textContent.includes('Saved.'))");
  assert.ok((await (await fetch(`${base}/notes/${testName}`)).text()).includes("Temporary verification content."),"Publishing must expose the saved body");
  await navigate("/admin/media");
  const hasCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  const verifyLiveCloudinary = process.env.VERIFY_CLOUDINARY_UPLOAD === "1";
  await evaluate(`(()=>{const f=document.querySelector('.editor form');f.querySelector('[name=name]').value=${JSON.stringify(testName)};f.querySelector('[name=alt]').value='Temporary upload verification image';if(${verifyLiveCloudinary || !hasCloudinary}){const bytes=Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),c=>c.charCodeAt(0));const transfer=new DataTransfer();transfer.items.add(new File([bytes],'check.gif',{type:'image/gif'}));f.querySelector('[name=file]').files=transfer.files;}else{f.querySelector('[name=src]').value='https://res.cloudinary.com/demo/image/upload/sample.jpg';}f.requestSubmit();return true;})()`);
  if (!hasCloudinary) {
    await until("Array.from(document.querySelectorAll('[role=status]')).some(x=>x.textContent.includes('Configure CLOUDINARY'))");
    await evaluate(`(()=>{const f=document.querySelector('.editor form');f.querySelector('[name=name]').value=${JSON.stringify(testName)};f.querySelector('[name=alt]').value='Temporary upload verification image';f.querySelector('[name=file]').value='';f.querySelector('[name=src]').value='https://res.cloudinary.com/demo/image/upload/sample.jpg';f.requestSubmit();return true;})()`);
  }
  await until("Array.from(document.querySelectorAll('[role=status]')).some(x=>x.textContent.includes('Added '))");
  [rows]=await connection.execute("SELECT src,provider,public_id,asset_id FROM media WHERE name=?",[testName]);
  assert.equal(rows.length,1);assert.equal(rows[0].provider,'cloudinary');assert.ok(rows[0].src.startsWith('https://res.cloudinary.com/'));
  if (verifyLiveCloudinary) { assert.ok(rows[0].public_id);assert.ok(rows[0].asset_id);const image=await fetch(rows[0].src);assert.equal(image.status,200); }
  await navigate("/admin/settings");
  assert.equal(await evaluate("document.querySelectorAll('.editor').length"),8);
  // Exercise section CRUD on a dedicated disposable project, never on real content.
  await connection.execute("INSERT INTO projects (slug,title,published,case_body,sort) VALUES (?,?,true,?,100000)",[testName,"Browser verification project","Legacy body must not return"]);
  await navigate(`/admin/project-content?project=${testName}`);
  await evaluate(`(()=>{const f=document.querySelector('[data-section-id=new]');const set=(n,v)=>f.querySelector('[name='+n+']').value=v;set('title','Browser check section');set('body',${JSON.stringify(testName)});set('imageSrc','/images/case-dashboard.svg');set('imageAlt','Dashboard verification image');set('sort','20');f.requestSubmit();return true;})()`);
  await until("Array.from(document.querySelectorAll('[role=status]')).some(x=>x.textContent.includes('Section added.')) || document.querySelectorAll('[data-remove-section]').length === 1");
  let [sections]=await connection.execute("SELECT s.* FROM project_sections s JOIN projects p ON p.id=s.project_id WHERE p.slug=?",[testName]);
  assert.equal(sections.length,1);assert.equal(sections[0].published,1);const firstSection=sections[0].id;
  let html=await (await fetch(`${base}/work/${testName}`)).text();assert.ok(html.includes(testName));assert.ok(html.includes('alt="Dashboard verification image"'));
  await navigate(`/admin/project-content?project=${testName}`);
  await evaluate(`(()=>{const f=document.querySelector('[data-section-id=new]');f.querySelector('[name=title]').value='Earlier section';f.querySelector('[name=body]').value='Earlier content';f.querySelector('[name=sort]').value='10';f.requestSubmit();return true;})()`);
  await until("document.querySelectorAll('[data-remove-section]').length === 2");
  html=await (await fetch(`${base}/work/${testName}`)).text();assert.ok(html.indexOf('Earlier section')<html.indexOf('Browser check section'));
  await navigate(`/admin/project-content?project=${testName}`);
  await evaluate(`(()=>{const f=document.querySelector('[data-section-id="${firstSection}"]');f.closest('details').open=true;f.querySelector('[name=title]').value='Updated test section';f.querySelector('[name=published]').checked=false;f.requestSubmit();return true;})()`);
  await until("Array.from(document.querySelectorAll('[role=status]')).some(x=>x.textContent.includes('Section updated.'))");
  html=await (await fetch(`${base}/work/${testName}`)).text();assert.ok(!html.includes('Updated test section'),"Hidden sections must be excluded");
  [sections]=await connection.execute("SELECT s.id FROM project_sections s JOIN projects p ON p.id=s.project_id WHERE p.slug=?",[testName]);
  for(const section of sections){
    await navigate(`/admin/project-content?project=${testName}`);
    await evaluate(`(()=>{const f=document.querySelector('[data-remove-section="${section.id}"]');f.closest('details').open=true;window.confirm=()=>true;f.requestSubmit();return true;})()`);
    await until(`!document.querySelector('[data-remove-section="${section.id}"]')`);
  }
  html=await (await fetch(`${base}/work/${testName}`)).text();assert.ok(!html.includes('Legacy body must not return'),"Removing the last section must not revive the old body");
  const [remaining]=await connection.execute("SELECT s.id FROM project_sections s JOIN projects p ON p.id=s.project_id WHERE p.slug=?",[testName]);assert.equal(remaining.length,0);
  console.log("PASS: desktop/mobile layout, article anchors, login, publishing, uploads, settings and case-study section create/edit/reorder/hide/remove.");
}finally{
  const [uploads]=await connection.execute("SELECT src,public_id FROM media WHERE name=?",[testName]);
  for(const upload of uploads){
    if(upload.public_id){const api=await import('../src/features/media/cloudinary-api.ts');await api.rollbackUpload(upload.public_id,api.cloudinaryConfig(process.env));}
    if(/^\/media\/[0-9a-f-]{36}\.png$/.test(upload.src))await unlink(path.join(process.cwd(),".data","uploads",path.basename(upload.src))).catch(()=>{});
  }
  await connection.execute("DELETE FROM media WHERE name=?",[testName]);
  await connection.execute("DELETE FROM notes WHERE slug=?",[testName]);
  await connection.execute("DELETE FROM projects WHERE slug=?",[testName]);
  await connection.end();
  socket.close();
  await fetch(`http://localhost:9223/json/close/${target.id}`);
}
