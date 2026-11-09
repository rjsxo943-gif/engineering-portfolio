import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import YAML from 'yaml';
const cfg=YAML.parse(fs.readFileSync('portfolio.config.yaml','utf8'));
const data=JSON.parse(fs.readFileSync('src/content/portfolio.json','utf8'));
const ids=new Set();
for(const p of data.projects){assert(!ids.has(p.id));ids.add(p.id);assert(p.mine.length&&p.team&&p.limit&&p.status);for(const [id] of p.links)assert(cfg.links[id]);for(const id of p.media)assert(cfg.media[id]);}
assert.equal(ids.size,7);
for(const [name,url] of Object.entries(cfg.links))assert(new URL(url).protocol==='https:',name);
const missing=[];
for(const [id,m] of Object.entries(cfg.media)){
 assert(m.alt&&m.path&&!m.path.includes('..')&&!path.isAbsolute(m.path));
 if(!fs.existsSync('public/'+m.path)){missing.push(m.path);console.warn('MISSING_MEDIA:',m.path);}
}
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const f of files('public'))assert(!/private_sources|\.md$|\.zip$|\.env|현장_실무/.test(f),'Private artifact: '+f);
if(cfg.site.qr_status==='QR_PENDING'){
 assert.equal(cfg.site.public_url,null);
 for(const f of [cfg.site.qr_png,cfg.site.qr_svg])assert(!fs.existsSync('public/'+f),'Pending QR must not exist');
}else{assert.equal(cfg.site.qr_status,'VERIFIED');assert(cfg.site.public_url);for(const f of [cfg.site.qr_png,cfg.site.qr_svg])assert(fs.existsSync('public/'+f));}
console.log(`Content OK: ${ids.size} sections; ${missing.length} declared missing photos; QR ${cfg.site.qr_status}`);
