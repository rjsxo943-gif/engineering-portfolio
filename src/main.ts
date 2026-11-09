import YAML from 'yaml';
import rawConfig from '../portfolio.config.yaml?raw';
import content from './content/portfolio.json';
import './style.css';

type Project = typeof content.projects[number];
type Media = {path:string;alt:string;source?:string};
const config = YAML.parse(rawConfig) as {site:{title:string;name:string;subtitle:string;as_of:string;public_url:string|null;qr_status:string;pdf:string;qr_svg:string;qr_png:string;github:string};media:Record<string,Media>;links:Record<string,string>};
const {site} = config;
const base = import.meta.env.BASE_URL;
const available = new Set(Object.keys(import.meta.glob('/public/**/*')).map(p => p.replace('/public/','')));
const esc = (s:string) => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const lines = (s:string) => esc(s).replace(/\n/g,'<br>');
const list = (a:string[]) => `<ul>${a.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
const ext = (url:string,label:string) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (새 탭)</span></a>`;
const statusClass = (p:Project) => p.status.includes('진행')||p.status.includes('실습')?'progress':p.status.includes('확인')?'verify':'done';
function media(id:string,poster=false){
 const m=config.media[id];
 if(!available.has(m.path)) return `<figure class="missing"><div aria-hidden="true">＋</div><figcaption>${esc(m.alt)}<span>사진 준비 중 · 원본 미제공</span></figcaption></figure>`;
 return `<figure class="photo ${poster?'poster':''}"><a href="${report ? (site.public_url ? site.public_url+m.path : config.media.poster.source || config.links.rf) : base+m.path}" target="_blank" rel="noopener" aria-label="${esc(m.alt)} 확대 (새 탭)"><img src="${base+m.path}" alt="${esc(m.alt)}" loading="lazy" ${poster?'width="2400" height="3393"':''}></a><figcaption>${esc(m.alt)}${m.source?` · ${ext(m.source,'공개 원본')}`:''}</figcaption></figure>`;
}
function detail(p:Project,compact=false){
 return `<article id="${p.id}" class="project ${compact?'compact':''}"><header class="project-head"><div><p class="eyebrow">${p.number} / ${esc(p.category)}</p><h3>${compact?esc(p.short):lines(p.title)}</h3></div><div><span class="badge ${statusClass(p)}">${esc(p.status)}</span><p class="period">${esc(p.period)}</p></div></header><p class="project-summary">${esc(p.summary)}</p><div class="contributions"><section><h4>프로젝트·조직의 범위</h4><p>${esc(p.team)}</p></section><section><h4>본인이 직접 수행한 일</h4>${list(p.mine)}</section></div>${p.pipeline?`<ol class="pipeline" aria-label="RF 시스템 처리 흐름">${p.pipeline.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}<div class="cases">${p.cases.map(c=>`<section><h4>${esc(c.problem)}</h4><p>${esc(c.action)}</p><p class="result">${esc(c.result)}</p></section>`).join('')}</div><aside class="limit"><strong>범위와 한계</strong><p>${esc(p.limit)}</p></aside>${p.media.length?`<div class="gallery">${p.media.map(id=>media(id)).join('')}</div>`:''}<div class="project-foot"><ul class="tags">${p.tags.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="links">${p.links.map(([id,label])=>ext(config.links[id],label)).join('')}</div></div>${p.id==='rf-drone'&&!compact?`<details class="poster-detail"><summary>졸업작품 팀 포스터 보기 <span>공개 원본 · 클릭하여 확대</span></summary>${media('poster',true)}<p class="caption">안테나를 포함한 팀 전체 결과입니다. 개인 기여 범위는 위 항목을 기준으로 확인해 주세요.</p></details>`:''}</article>`;
}
function skills(){return `<div class="skills">${content.skills.map(s=>`<section><h3>${esc(s.level)}</h3><p>${esc(s.items)}</p></section>`).join('')}</div>`;}
function qr(){return site.qr_status==='VERIFIED'&&site.public_url&&available.has(site.qr_svg)?`<figure class="qr"><img src="${base+site.qr_svg}" alt="종합 포트폴리오 홈페이지로 연결되는 QR 코드"><figcaption>${esc(site.public_url)}</figcaption></figure>`:`<div class="qr-pending"><span class="eyebrow">QR_PENDING</span><p>홈페이지 공개 후 연결됩니다.</p><small>실제 주소의 접속·스캔 검증을 마친 뒤 제공합니다.</small></div>`;}
const report=new URLSearchParams(location.search).has('print');
function reportPage(number:string,title:string,html:string,cls=''){return `<section class="report-page ${cls}"><header class="report-header"><span>${esc(site.name)} · ENGINEERING PORTFOLIO</span><span>${esc(site.as_of)}</span></header><h2>${esc(title)}</h2>${html}<footer class="report-footer"><span>개인 기여 · 팀 범위 · 상태 구분</span><span>${number} / 09</span></footer></section>`;}
const p=content.projects;
const app=document.querySelector<HTMLDivElement>('#app')!;
if(report){
 document.body.classList.add('report');
 app.innerHTML=reportPage('01','전자공학에서 현장과 시스템으로',`<p class="eyebrow">${esc(content.profile.eyebrow)}</p><h1>${lines(content.profile.headline)}</h1><p class="intro">${esc(content.profile.intro)}</p><p>${esc(site.subtitle)}</p><div class="report-index">${p.map(x=>`<p><b>${x.number} ${esc(x.short)}</b><span>${esc(x.status)}</span></p>`).join('')}</div><h3>기술 경험의 수준</h3>${skills()}${qr()}`)+
 reportPage('02','RF 드론 탐지 · 개인 기여와 검증',detail(p[0],true))+
 reportPage('03','RF 졸업작품 · 팀 포스터',`${media('poster',true)}<p class="caption">공개 팀 원본을 축소 수록했습니다. 안테나 설계·제작을 포함한 전체 결과이며 개인 기여와 구분합니다. 웹사이트의 원본 링크에서 확대할 수 있습니다.</p>`,'poster-page')+
 reportPage('04','TTL/CMOS 디지털 시계',detail(p[1],true))+
 reportPage('05','K2 스마트팩토리 · 교육 내 팀 프로젝트',detail(p[2],true))+
 reportPage('06','Intel 부트캠프 · 교육 및 실습',detail(p[4],true))+
 reportPage('07','AI 분실물 관제탑',detail(p[3],true))+
 reportPage('08','전기·설비·내장 현장 실무',detail(p[5],true))+
 reportPage('09','학생회 운영 · 기록과 협업',detail(p[6],true)+`<p class="caption">모든 진행 상태는 ${esc(site.as_of)} 자료 기준입니다. 사진 원본 미제공 항목은 안내로 표시했고, 비공개 경험 원본과 재무 증빙은 수록하지 않았습니다.</p>`);
}else{
 app.innerHTML=`<a class="skip" href="#main">본문으로 건너뛰기</a><header class="topbar"><a class="brand" href="#" aria-label="포트폴리오 처음으로"><span class="brand-symbol" aria-hidden="true">K<span>G</span></span><span>${esc(site.name)}<small>ENGINEERING PORTFOLIO</small></span></a><nav aria-label="주 메뉴"><a href="#work">프로젝트</a><a href="#experience">실무·교육</a><a href="#skills">기술 역량</a><a class="nav-download" href="#documents">PDF · QR <span aria-hidden="true">↗</span></a></nav></header>
 <main id="main"><section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="live-dot"></span>${esc(content.profile.eyebrow)}</p><h1>${lines(content.profile.headline)}</h1><p class="intro">${esc(content.profile.intro)}</p><div class="hero-actions"><a class="button" href="#work">주요 프로젝트 살펴보기 <span aria-hidden="true">↓</span></a><a class="text-link" href="#documents">종합 PDF 다운로드 ↗</a></div><p class="as-of">기록 기준 ${esc(site.as_of)} <span>·</span> ${esc(site.subtitle)}</p></div><aside class="hero-note"><p class="eyebrow">HOW I WORK</p><div class="process-mark" aria-hidden="true"><span>INPUT</span><i></i><b>측정<br>분석<br>검증</b><i></i><span>SYSTEM</span></div><h2>동작하는 결과와<br>설명 가능한 과정.</h2><p>실물 구현에서 출발해,<br>이상 조건을 나누고 근거를 남깁니다.</p><div class="note-bottom">HARDWARE ↔ SOFTWARE</div></aside></section>
 <div class="domains">${content.profile.principles.map((s,i)=>`<div><span>0${i+1}</span><h2>${esc(s)}</h2></div>`).join('')}</div>
 <section id="work" class="section"><header class="section-heading"><div><p class="eyebrow">SELECTED WORK / 01—04</p><h2>주요 프로젝트</h2></div><p>무엇을 만들었는지, 어떤 일을 직접 했는지.<br>결과와 한계를 함께 정리했습니다.</p></header><div class="project-index">${p.slice(0,4).map(x=>`<a href="#${x.id}"><span class="index-number">${x.number}</span><span class="badge ${statusClass(x)}">${esc(x.status)}</span><h3>${esc(x.short)}</h3><p>${esc(x.category)}</p><span class="index-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>${p.slice(0,4).map(x=>detail(x)).join('')}</section>
 <section id="experience" class="section"><header class="section-heading"><div><p class="eyebrow">EXPERIENCE / 05—07</p><h2>기술을 둘러싼 경험</h2></div><p>교육, 현장, 조직 운영.<br>서로 다른 환경에서 익힌 실행의 기본입니다.</p></header>${p.slice(4).map(x=>detail(x)).join('')}</section>
 <section id="skills" class="section"><header class="section-heading"><div><p class="eyebrow">TOOLS & PRACTICE</p><h2>기술 경험의 수준</h2></div><p>사용 경험과 학습·예정 기술을 구분합니다.</p></header>${skills()}</section>
 <section id="documents" class="documents section"><div><p class="eyebrow">TAKE A CLOSER LOOK</p><h2>한 권으로 보는<br>종합 포트폴리오</h2><p>프로젝트, 교육, 현장과 조직 운영 경험을<br>제출용 PDF에 함께 담았습니다.</p><div class="hero-actions"><a class="button" href="${base+site.pdf}" download>종합 PDF 다운로드 <span aria-hidden="true">↓</span></a><a class="text-link" href="?print=1" target="_blank" rel="noopener">인쇄용 보기 ↗</a></div><div class="links">${ext(site.github,'GitHub 프로필')}</div></div>${qr()}</section></main>
 <footer class="footer"><span>${esc(site.name)} · ENGINEERING PORTFOLIO</span><span>자료 기준 ${esc(site.as_of)} · 사실과 기여를 명확하게.</span><a href="#">맨 위로 ↑</a></footer>`;
}
