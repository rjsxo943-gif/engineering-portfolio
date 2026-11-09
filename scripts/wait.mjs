const url=process.env.SITE_ORIGIN||'http://127.0.0.1:4173/engineering-portfolio/';
let ready=false;
for(let n=0;n<40;n++){
 try{if((await fetch(url)).ok){ready=true;break;}}catch{}
 await new Promise(r=>setTimeout(r,500));
}
if(!ready)throw new Error('Preview failed readiness: '+url);
