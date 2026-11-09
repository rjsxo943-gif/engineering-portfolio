import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import axe from 'axe-core';
const cfg=YAML.parse(fs.readFileSync('portfolio.config.yaml','utf8'));
const expectedMissing=Object.entries(cfg.media).filter(([id,m])=>id!=='poster'&&!fs.existsSync('public/'+m.path)).length;
import {browser,origin} from '../scripts/browser.mjs';
const b=await browser();const results=[];
try{
 for(const width of [375,768,1440]){
  const page=await b.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(origin,{waitUntil:'networkidle'});
  assert.equal(await page.locator('article.project').count(),7);
  for(const id of ['rf-drone','digital-clock','smart-factory','lost-found','bootcamp','field-work','student-council'])assert.equal(await page.locator('#'+id).count(),1);
  assert.equal(await page.locator('.missing').count(),expectedMissing);
  assert.equal(await page.locator('.qr-pending').count(),cfg.site.qr_status==='QR_PENDING'?1:0);
  assert.equal(await page.locator('#lost-found .badge').innerText(),'진행 중');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow '+width);
  for(const link of await page.locator('a[href^="#"]').evaluateAll(els=>els.map(x=>x.getAttribute('href')).filter(x=>x.length>1)))assert(await page.locator(link).count()>0,'Broken anchor '+link);
  await page.locator('.poster-detail summary').click();
  await page.locator('.poster img').evaluate(async el=>{el.loading='eager';await el.decode();});
  assert.equal(await page.locator('.poster img').evaluate(el=>el.complete&&el.naturalWidth>0),true);
  for(const link of await page.locator('a[download]').evaluateAll(els=>els.map(x=>x.href))){const r=await page.request.get(link);assert.equal(r.status(),200);assert((await r.body()).subarray(0,4).toString()==='%PDF');}
  await page.addScriptTag({content:axe.source});
  const accessibility=await page.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  assert.deepEqual(accessibility.violations.map(v=>({id:v.id,description:v.description,nodes:v.nodes.map(n=>n.target)})),[],'Accessibility violations');
  await page.keyboard.press('Control+Home');
  await page.screenshot({path:`.artifacts/site-${width}.png`,fullPage:true});
  assert.deepEqual(errors,[],'Browser errors');
  results.push({width,projects:7,missingPhotos:expectedMissing,accessibilityViolations:0,horizontalOverflow:false,consoleErrors:errors});
  await page.close();
 }
 // Existing photos appear from the registry without editing components; verify via interception-free build file inventory.
 const page=await b.newPage();await page.goto(origin+'?print=1',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.report-page').count(),9);
 assert.equal(await page.locator('img[src*="qr"]').count(),cfg.site.qr_status==='QR_PENDING'?0:1);
 fs.writeFileSync('.artifacts/browser-results.json',JSON.stringify(results,null,2));
 console.log('PASS: 375/768/1440px, 7 sections, anchors, poster, PDF download, no browser errors; 9-page report; no premature QR');
}finally{await b.close();}
