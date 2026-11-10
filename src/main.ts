import YAML from 'yaml';
import rawConfig from '../portfolio.config.yaml?raw';
import content from './content/portfolio.json';
import './style.css';
import './portfolio.css';

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
 if(!available.has(m.path)) return '';
 return `<figure class="photo ${poster?'poster':''}"><a href="${report ? (site.public_url ? site.public_url+m.path : m.source || config.links.rf) : base+m.path}" target="_blank" rel="noopener" aria-label="${esc(m.alt)} 확대 (새 탭)"><img src="${base+m.path}" alt="${esc(m.alt)}" loading="lazy" ${poster?'width="2400" height="3393"':''}></a><figcaption>${esc(m.alt)}${m.source?` · ${ext(m.source,'공개 원본')}`:''}</figcaption></figure>`;
}
function detail(p:Project,compact=false){
 const visibleMedia=p.media.filter(id=>available.has(config.media[id].path));
 return `<article id="${p.id}" class="project ${compact?'compact':''}"><header class="project-head"><div><p class="eyebrow">${p.number} / ${esc(p.category)}</p><h3>${compact?esc(p.short):lines(p.title)}</h3></div><div><span class="badge ${statusClass(p)}">${esc(p.status)}</span><p class="period">${esc(p.period)}</p></div></header><p class="project-summary">${esc(p.summary)}</p><div class="contributions"><section><h4>프로젝트·조직의 범위</h4><p>${esc(p.team)}</p></section><section><h4>본인이 직접 수행한 일</h4>${list(p.mine)}</section></div>${p.pipeline?`<ol class="pipeline" aria-label="RF 시스템 처리 흐름">${p.pipeline.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}<div class="cases">${p.cases.map(c=>`<section><h4>${esc(c.problem)}</h4><p>${esc(c.action)}</p><p class="result">${esc(c.result)}</p></section>`).join('')}</div><aside class="limit"><strong>범위와 한계</strong><p>${esc(p.limit)}</p></aside>${visibleMedia.length?`<div class="gallery">${visibleMedia.map(id=>media(id)).join('')}</div>`:''}<div class="project-foot"><ul class="tags">${p.tags.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="links">${p.links.map(([id,label])=>ext(config.links[id],label)).join('')}</div></div>${p.id==='rf-drone'&&!compact?`<details class="poster-detail"><summary>졸업작품 팀 포스터 보기 <span>공개 원본 · 클릭하여 확대</span></summary>${media('poster',true)}<p class="caption">안테나를 포함한 팀 전체 결과입니다. 개인 기여 범위는 위 항목을 기준으로 확인해 주세요.</p></details>`:''}</article>`;
}
function skills(){return `<div class="skills">${content.skills.map(s=>`<section><h3>${esc(s.level)}</h3><p>${esc(s.items)}</p></section>`).join('')}</div>`;}
function qr(){return site.qr_status==='VERIFIED'&&site.public_url&&available.has(site.qr_svg)?`<figure class="qr"><img src="${base+site.qr_svg}" alt="종합 포트폴리오 홈페이지로 연결되는 QR 코드"><figcaption>${esc(site.public_url)}</figcaption></figure>`:`<div class="qr-pending"><span class="eyebrow">QR_PENDING</span><p>홈페이지 공개 후 연결됩니다.</p><small>실제 주소의 접속·스캔 검증을 마친 뒤 제공합니다.</small></div>`;}

const arrow = '<span aria-hidden="true">↗</span>';
const highlights:Record<string,{label:string;value:string;note:string}[]>={
 'rf-drone':[{label:'검증 데이터',value:'1,800',note:'다른 날짜에 수집한 외부 데이터'},{label:'오탐 변화',value:'300 → 12',note:'동일 데이터 · Gain별 판단 기준 비교'}],
 'digital-clock':[{label:'직접 구현',value:'TTL / CMOS',note:'논리회로 설계부터 배선·납땜까지'},{label:'문제 해결',value:'분리 → 검증',note:'IC 단독시험 후 공급전류·기능 재확인'}],
 'smart-factory':[{label:'참여 파트',value:'Vision AI',note:'탑뷰 영상의 부품 누락·위치 검사'},{label:'연계 범위',value:'PLC ↔ PC',note:'검사 신호 인터페이스 정의 참여'}],
 'lost-found':[{label:'비전 처리',value:'YOLO + ArUco',note:'탑뷰 검출과 좌표 변환'},{label:'로봇 연계',value:'SO-101',note:'좌표 보정·집기 연계 진행 중'}],
 'bootcamp':[{label:'제어 실습',value:'PLC · Robot',note:'래더·인터록·로봇 티칭'},{label:'통신 실습',value:'Start / Done',note:'PLC–로봇 핸드셰이크 학습'}],
 'field-work':[{label:'작업 환경',value:'전기 · 설비 · 내장',note:'현장에서 설치·복구·자재 관리 참여'},{label:'작업의 기본',value:'안전과 협업',note:'선임 작업자·다른 공종과 함께 시공'}],
 'student-council':[{label:'연간 관리 예산',value:'약 2,200만 원',note:'학생회 예산·수입·지출·증빙 관리'},{label:'주요 행사',value:'8개',note:'재정 기록과 결재·검토 절차 운영'}]
};
const shortTitles:Record<string,string>={'rf-drone':'RF 드론 탐지·방향 추정','digital-clock':'TTL/CMOS 디지털 시계','smart-factory':'K2 스마트팩토리','lost-found':'AI 분실물 관제탑','bootcamp':'제어·로봇 교육 실습','field-work':'전기·설비·내장 현장','student-council':'학생회 재정 운영'};
const teasers:Record<string,string>={'rf-drone':'수신부터 판단, 방향 추정과 실시간 화면까지.','digital-clock':'시뮬레이션을 실물로, 이상 증상을 측정으로.','smart-factory':'비전 검사와 공정 사이의 신호를 정의하다.','lost-found':'검출한 위치를 로봇의 좌표로 연결하다.'};
function projectVisual(x:Project){
 if(x.id==='rf-drone')return `<img src="${base+config.media['rf-dashboard'].path}" alt="RF 탐지 프로젝트의 공개 대시보드 화면" loading="lazy">`;
 const marks:Record<string,string>={
  'digital-clock':'<span class="clock-digits">12<span>:</span>59<span>:</span>59</span><span class="visual-sub">COUNTER → CARRY → DISPLAY</span>',
  'smart-factory':'<span class="station-flow"><i>ST1<small>조립</small></i><b>→</b><i>ST2<small>검사</small></i><b>→</b><i>ST3<small>최종 검사</small></i></span><span class="visual-sub">TEAM PROCESS / VISION INSPECTION</span>',
  'lost-found':'<span class="coordinate-mark"><i></i><b>VISION <span>→</span> ROBOT</b><small>x, y → coordinate transform</small></span><span class="visual-sub">DETECTION / CALIBRATION / PICK</span>'};
 return `<div class="diagram-visual ${x.id}" aria-hidden="true">${marks[x.id]||''}</div>`;
}
function webProject(x:Project){return `<article id="${x.id}" class="project work-entry"><div class="entry-number">${x.number}<span> / 07</span></div><div class="entry-content"><header class="project-head"><div><p class="eyebrow">${esc(x.category)}</p><h3>${esc(shortTitles[x.id])}</h3></div><div><span class="badge ${statusClass(x)}">${esc(x.status)}</span><p class="period">${esc(x.period)}</p></div></header><p class="project-summary">${esc(x.summary)}</p><div class="entry-metrics">${highlights[x.id].map(h=>`<div><span>${esc(h.label)}</span><strong>${esc(h.value)}</strong><small>${esc(h.note)}</small></div>`).join('')}</div><section class="my-role"><h4>직접 맡은 일</h4>${list(x.mine)}</section><details class="project-deep" ${x.id==='rf-drone'?'open':''}><summary><span>문제 해결 과정과 자료</span><span class="detail-toggle" aria-hidden="true">+</span></summary><div class="deep-content">${x.pipeline?`<ol class="pipeline" aria-label="RF 시스템 처리 흐름">${x.pipeline.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}<div class="cases">${x.cases.map((c,i)=>`<section><span class="case-number">CASE 0${i+1}</span><h4>${esc(c.problem)}</h4><p>${esc(c.action)}</p><p class="result">${esc(c.result)}</p></section>`).join('')}</div>${x.media.some(id=>available.has(config.media[id].path))?`<div class="gallery">${x.media.filter(id=>available.has(config.media[id].path)).map(id=>media(id)).join('')}</div>`:''}<div class="scope-note"><h4>팀과 본인의 참여 범위</h4><p>${esc(x.team)}</p><h4>검증 범위와 남은 과제</h4><p>${esc(x.limit)}</p></div>${x.id==='rf-drone'?`<details class="poster-detail"><summary>졸업작품 팀 포스터 보기 ${arrow}</summary>${media('poster',true)}<p class="caption">안테나를 포함한 팀 전체 결과입니다. 개인 기여는 위 ‘직접 맡은 일’을 기준으로 확인해 주세요.</p></details>`:''}</div></details><div class="project-foot"><ul class="tags">${x.tags.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="links">${x.links.map(([id,label])=>ext(config.links[id],label)).join('')}</div></div></div></article>`;}

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
 reportPage('09','학생회 운영 · 기록과 협업',detail(p[6],true)+`<p class="caption">모든 진행 상태는 ${esc(site.as_of)} 자료 기준입니다.</p>`);
}else{
 document.body.classList.add('portfolio');
 app.innerHTML=`<a class="skip" href="#main">본문으로 건너뛰기</a>
 <header class="site-header"><a class="identity" href="#" aria-label="김건태 포트폴리오 처음으로"><span class="monogram" aria-hidden="true">KG<span>·</span></span><span>${esc(site.name)}<small>ENGINEERING PORTFOLIO</small></span></a><nav aria-label="주 메뉴"><a href="#work">프로젝트</a><a href="#experience">실무·교육</a><a href="#skills">기술 역량</a><a class="header-pdf" href="#documents">포트폴리오 PDF ${arrow}</a></nav></header>
 <main id="main"><section class="intro-stage"><div class="hero-topline"><span><i></i> ELECTRONICS · SYSTEMS · FIELD</span><span>PORTFOLIO / 2026</span></div><div class="intro-grid"><div class="intro-copy"><p class="hero-kicker">측정으로 이해하고, 구현으로 확인합니다.</p><h1>회로에서 신호까지,<br><em>동작으로 답합니다.</em></h1><p class="hero-description">전자공학을 바탕으로 회로를 만들고 RF 신호를 분석합니다.<br>현장에서 익힌 실행력을 제어·비전 AI 프로젝트로 이어가고 있습니다.</p><div class="hero-actions"><a class="button" href="#work">프로젝트 살펴보기 <span aria-hidden="true">↓</span></a><a class="hero-secondary" href="${base+site.pdf}" download>포트폴리오 PDF ${arrow}</a></div><div class="hero-signature"><span>김건태</span><span>HARDWARE ↔ SOFTWARE</span></div></div><a class="hero-system" href="#rf-drone" aria-label="대표 프로젝트 RF 드론 탐지·방향 추정 보기"><div class="system-top"><span><i></i> SELECTED PROJECT 01</span><span>RF / SDR</span></div><div class="system-frame"><img src="${base+config.media['rf-dashboard'].path}" alt="RF 드론 탐지 프로젝트 공개 화면: scan·precision UI와 신호 확인 화면" fetchpriority="high"></div><div class="system-bottom"><span>수신 → 판단 → 방향 추정</span><b>프로젝트 보기 ${arrow}</b></div></a></div><div class="hero-baseline"><span>실물 회로 구현</span><span>RF 신호처리</span><span>제어·비전 연계</span><span>현장 협업</span></div></section>
 <div class="evidence-strip"><div><span class="mini-label">RF / 검증 데이터</span><strong>1,800<small>개</small></strong><p>다른 날짜에 수집한 외부 데이터</p></div><div><span class="mini-label">RF / 오탐 비교</span><strong>300 <span>→</span> 12<small>건</small></strong><p>동일 데이터 · Gain별 판단 기준 비교</p></div><div><span class="mini-label">OPERATIONS / 연간 예산</span><strong>2,200<small>만 원 · 약</small></strong><p>학생회 예산·증빙 기록 관리</p></div></div>
 <section id="work" class="work-section"><header class="section-heading"><div><p class="eyebrow">01 / SELECTED WORK</p><h2>만들고, 확인한 것들<span>.</span></h2></div><p>회로 구현에서 신호처리, 비전과 로봇까지.<br>직접 맡은 일과 문제 해결 과정을 소개합니다.</p></header><div class="project-index">${p.slice(0,4).map(x=>`<a class="project-preview" href="#${x.id}"><div class="preview-visual">${projectVisual(x)}<span class="preview-number">${x.number}</span></div><div class="preview-copy"><span class="badge ${statusClass(x)}">${esc(x.status)}</span><h3>${esc(shortTitles[x.id])} ${arrow}</h3><p>${esc(teasers[x.id])}</p><span class="preview-category">${esc(x.category)}</span></div></a>`).join('')}</div><div class="work-details">${p.slice(0,4).map(x=>webProject(x)).join('')}</div></section>
 <section id="experience" class="work-section experience-section"><header class="section-heading"><div><p class="eyebrow">02 / EXPERIENCE</p><h2>현장에서 배운 기본<span>.</span></h2></div><p>장치를 다루는 일, 사람과 함께하는 일.<br>교육·시공·조직 운영에서 경험을 쌓았습니다.</p></header>${p.slice(4).map(x=>webProject(x)).join('')}</section>
 <section id="skills" class="work-section skill-section"><header class="section-heading"><div><p class="eyebrow">03 / TOOLKIT</p><h2>경험으로 쌓은 도구들<span>.</span></h2></div><p>직접 사용한 기술과 학습 중인 기술을 구분했습니다.</p></header><div class="toolkit">${content.skills.map((s,i)=>`<section><span class="toolkit-number">0${i+1}</span><div><h3>${esc(s.level)}</h3><ul>${s.items.split(' · ').map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div></section>`).join('')}</div></section>
 <section id="documents" class="download-section"><div class="download-copy"><p class="eyebrow">04 / THE COMPLETE STORY</p><h2>경험을 한 권에<br>담았습니다.</h2><p>프로젝트의 역할과 검증 과정, 교육과 현장 경험을<br>9쪽의 포트폴리오로 살펴보세요.</p><div class="hero-actions"><a class="button" href="${base+site.pdf}" download>포트폴리오 PDF 다운로드 <span aria-hidden="true">↓</span></a><a class="text-link" href="?print=1" target="_blank" rel="noopener">인쇄용 보기 ${arrow}</a></div></div><div class="document-cover" aria-hidden="true"><div class="cover-top">KIM GEONTAE<span>2026</span></div><div class="cover-title">ENGINEERING<br>PORTFOLIO<span>회로 · 신호 · 시스템 · 현장</span></div><div class="cover-bottom"><span>SELECTED WORK<br>& EXPERIENCE</span><span>01 — 09</span></div></div><div class="document-qr">${qr()}</div></section></main>
 <footer class="site-footer"><a class="identity" href="#"><span class="monogram" aria-hidden="true">KG<span>·</span></span><span>${esc(site.name)}<small>ENGINEERING PORTFOLIO</small></span></a><div>${ext(site.github,'GitHub')}<a href="#work">프로젝트로 돌아가기 ↑</a></div><p>경험·진행 상태 기준 ${esc(site.as_of)}<br>프로젝트별 개인 기여와 검증 범위는 상세 항목에 정리했습니다.</p></footer>`;
}
