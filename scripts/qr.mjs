import fs from 'node:fs';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {PNG} from 'pngjs';
const args=process.argv.slice(2),arg=args.indexOf('--url');
if(arg<0){console.error('QR_PENDING: 배포 승인 및 실제 HTTPS 홈페이지 확인 후 npm run qr -- --url <홈페이지URL>');process.exit(2);}
const target=new URL(args[arg+1]);
assert.equal(target.protocol,'https:');
assert(!target.search&&!target.hash&&!target.username&&!target.password);
// Only this portfolio home, never the RF project or an arbitrary URL.
assert.equal(target.hostname,'rjsxo943-gif.github.io');
assert.equal(target.pathname,'/engineering-portfolio/');
const config=YAML.parse(fs.readFileSync('portfolio.config.yaml','utf8'));
const response=await fetch(target,{redirect:'follow',signal:AbortSignal.timeout(30000)});
assert.equal(response.status,200,'Homepage must return HTTP 200');
assert.equal(new URL(response.url).href,target.href,'Unexpected redirect target');
const html=await response.text();
assert(html.includes('김건태 | Engineering Portfolio'),'Deployed page identity mismatch');
const options={errorCorrectionLevel:'H',margin:4,width:1200,color:{dark:'#172b36',light:'#ffffff'}};
const png=await QRCode.toBuffer(target.href,options);
const decodedPNG=PNG.sync.read(png);
const scan=jsQR(new Uint8ClampedArray(decodedPNG.data),decodedPNG.width,decodedPNG.height);
assert.equal(scan?.data,target.href,'QR PNG scan mismatch');
const svg=await QRCode.toString(target.href,{...options,type:'svg'});
// Independently rasterize the SVG in Chromium, then scan that representation too.
const {browser}=await import('./browser.mjs');const b=await browser();
try{
 const page=await b.newPage({viewport:{width:1200,height:1200},deviceScaleFactor:1});
 await page.setContent(`<style>body{margin:0}svg{width:1200px;height:1200px}</style>${svg}`);
 const raster=PNG.sync.read(await page.screenshot());
 assert.equal(jsQR(new Uint8ClampedArray(raster.data),raster.width,raster.height)?.data,target.href,'QR SVG scan mismatch');
}finally{await b.close();}
fs.mkdirSync('public/downloads',{recursive:true});
fs.writeFileSync('public/'+config.site.qr_png,png);fs.writeFileSync('public/'+config.site.qr_svg,svg);
config.site.public_url=target.href;config.site.qr_status='VERIFIED';
fs.writeFileSync('portfolio.config.yaml',YAML.stringify(config));
fs.mkdirSync('.artifacts',{recursive:true});
fs.writeFileSync('.artifacts/qr-verification.json',JSON.stringify({url:target.href,httpStatus:response.status,decodedPNG:scan.data,svgScan:'matched',width:1200,verifiedAt:new Date().toISOString()},null,2));
console.log('QR VERIFIED: HTTPS 200, homepage identity, PNG + SVG scans match:',target.href);
