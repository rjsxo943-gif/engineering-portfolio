import fs from 'node:fs';
import assert from 'node:assert/strict';
import {browser,origin} from './browser.mjs';
fs.mkdirSync('.artifacts',{recursive:true});fs.mkdirSync('public/downloads',{recursive:true});
const b=await browser();
try{
 const page=await b.newPage({viewport:{width:1100,height:1100}});
 await page.goto(origin+'?print=1',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode();})));
 assert.equal(await page.locator('.report-page').count(),9);
 const overflow=await page.locator('.report-page').evaluateAll(pages=>pages.map((p,i)=>{
  const footer=p.querySelector('.report-footer').getBoundingClientRect();
  const children=[...p.children].filter(x=>!x.matches('.report-header,.report-footer'));
  const max=Math.max(...children.map(x=>x.getBoundingClientRect().bottom));
  return {page:i+1,overlap:max>footer.top-8,contentBottom:max-p.getBoundingClientRect().top,footerTop:footer.top-p.getBoundingClientRect().top};
 }));
 fs.writeFileSync('.artifacts/pdf-layout.json',JSON.stringify(overflow,null,2));
 assert(!overflow.some(p=>p.overlap),'PDF content overlaps footer: '+JSON.stringify(overflow));
 await page.pdf({path:'public/downloads/engineering-portfolio.pdf',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false});
 console.log('PDF generated: public/downloads/engineering-portfolio.pdf (9 A4 pages)');
}finally{await b.close();}
