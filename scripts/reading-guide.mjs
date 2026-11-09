import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
const data=JSON.parse(fs.readFileSync('src/content/portfolio.json','utf8'));
const guide=JSON.parse(fs.readFileSync('src/content/repository.json','utf8'));
const {site,media,links}=YAML.parse(fs.readFileSync('portfolio.config.yaml','utf8'));
const projects=new Map(data.projects.map(p=>[p.id,p]));
const doc=id=>`docs/experience/${id}.md`;
const bullet=xs=>xs.map(x=>`- ${x}`).join('\n');
const cell=s=>s.replace(/\|/g,'\\|').replaceAll('\n',' ');
const pdf=`public/${site.pdf}`;
const repo=site.repository_url;
const raw=repo.replace('https://github.com/','https://raw.githubusercontent.com/')+'/main/';
const out=new Map();
let md=`# ${guide.title}\n\n**${guide.subtitle}**\n\n${guide.intro}\n\n`;
md+=`**[종합 포트폴리오 PDF · 9쪽](${pdf})** · [PDF 원본 다운로드](${raw+pdf}) · [전체 경험 상세](docs/experience/README.md)\n\n`;
md+='## 핵심 경험\n\n';
for(const h of guide.highlights)md+=`**[${h.title}](${doc(h.project)})**<br>\n${h.text}\n\n`;
md+='## 프로젝트\n\n| 프로젝트 | 본인 역할 | 상태¹ |\n|---|---|---|\n';
for(const e of guide.entries.slice(0,4)){const p=projects.get(e.id);md+=`| [${e.label}](${doc(e.id)}) | ${cell(e.focus)} | ${cell(p.status)} |\n`;}
md+='\n### RF 탐지 시스템 화면\n\n';
const dash=media['rf-dashboard'];
md+=`[![${dash.alt}](public/${dash.path})](${doc('rf-drone')})\n\n`;
md+=`<sub>[RF 프로젝트 공개 원본](${dash.source}). 왼쪽은 scan·precision UI 데모, 오른쪽은 RF 신호 확인 화면입니다. 거리 표시는 실험적 구간 정보입니다.</sub>\n\n`;
md+='## 교육 · 현장 · 조직 운영\n\n';
for(const e of guide.entries.slice(4)){const p=projects.get(e.id);md+=`**[${e.label}](${doc(e.id)})** · ${p.status}<br>\n${e.focus}.\n\n`;}
md+='## 기술 경험\n\n| 경험 수준 | 도구·기술 |\n|---|---|\n';
for(const s of data.skills.slice(0,3))md+=`| ${s.level} | ${cell(s.items)} |\n`;
md+='\n## 자료 안내\n\n';
md+=`- **PDF 구성:** 1쪽 소개 / 2–3쪽 RF·팀 포스터 / 4쪽 시계 / 5쪽 K2 / 6쪽 교육 / 7쪽 분실물 / 8쪽 현장 / 9쪽 학생회\n- GitHub PDF 미리보기에서 일부만 보이면 [원본 PDF를 다운로드](${raw+pdf})해 전체 9쪽을 확인할 수 있습니다.\n- **저장소 QR:** [PNG · 인쇄용](${`public/${site.repository_qr_png}`}) / [SVG · 벡터](${`public/${site.repository_qr_svg}`}). 이 GitHub 포트폴리오의 메인 페이지로 연결됩니다.\n\n`;
md+=`¹ 경험·진행 상태 기준: **${site.as_of.replaceAll('-','.')}**. 완료·진행·교육 실습을 구분하며, 개인 수행과 팀 결과는 각 상세 문서에 정리했습니다. RF 오탐 수치는 Gain별 판단 기준의 동일 데이터 비교로, RawNoiseGate·voting 실험과 별개입니다.\n\n`;
md+='<details>\n<summary>사이트 개발·유지보수</summary>\n\n[개발 환경](docs/development.md) · [콘텐츠·사진 관리](docs/maintenance.md) · [배포](docs/deployment.md)\n\n</details>\n';
out.set('README.md',md);
let index='# 경험 상세 안내\n\n[포트폴리오 처음으로](../../README.md) · [종합 PDF](../../'+pdf+')\n\n프로젝트별로 **개인 역할 → 문제·대응·결과 → 팀 범위 → 확인된 한계**를 정리했습니다.\n\n| 경험 | 주요 확인 내용 | PDF 위치 |\n|---|---|---|\n';
for(const e of guide.entries)index+=`| [${e.label}](${e.id}.md) | ${cell(e.focus)} | ${e.pdf} |\n`;
index+=`\n기록 기준: ${site.as_of}. 진행 중·교육 실습·미확인 항목은 완료 실적으로 합산하지 않았습니다.\n`;
out.set('docs/experience/README.md',index);
for(const [i,e]of guide.entries.entries()){
 const p=projects.get(e.id);
 let text=`[포트폴리오 처음으로](../../README.md) · [전체 경험](README.md) · [종합 PDF · ${e.pdf}](../../${pdf})\n\n# ${p.short}\n\n**${p.status}** · ${p.period}\n\n${p.summary}\n\n## 본인 역할\n\n${bullet(p.mine)}\n\n## 문제 해결과 확인 결과\n\n`;
 for(const c of p.cases)text+=`### ${c.problem}\n\n- **대응:** ${c.action}\n- **결과·현재 상태:** ${c.result}\n\n`;
 if(p.pipeline){text+='## 시스템 처리 흐름\n\n```mermaid\nflowchart LR\n';for(const [j,step]of p.pipeline.entries()){text+=`  S${j}["${step}"]\n`;if(j>0)text+=`  S${j-1} --> S${j}\n`;}text+='```\n\n';}
 text+=`## 팀·조직의 범위\n\n${e.scope || p.team}\n\n## 범위와 한계\n\n${e.limits || p.limit}\n\n`;
 if(e.id==='rf-drone'){
  text+=`## 공개 화면과 자료\n\n![${dash.alt}](../../public/${dash.path})\n\n[화면 원본](${dash.source}) · 왼쪽 scan·precision UI 데모 / 오른쪽 RF 신호 확인 화면\n\n`;
  text+='<details>\n<summary>졸업작품 팀 포스터</summary>\n\n';
  text+=`[![${media.poster.alt}](../../public/${media.poster.path})](${media.poster.source})\n\n팀 전체 결과이며, 본인 역할은 위 개인 수행 범위에 명시했습니다.\n\n</details>\n\n`;
 }
 const supplied=p.media.filter(id=>fs.existsSync('public/'+media[id].path));
 if(supplied.length){text+='## 관련 사진\n\n';for(const id of supplied)text+=`![${media[id].alt}](../../public/${media[id].path})\n\n`;}
 if(p.links.length)text+='## 관련 링크\n\n'+bullet(p.links.map(([key,label])=>`[${label}](${links[key]})`))+'\n\n';
 text+=`**사용·학습 기술:** ${p.tags.join(' · ')}\n\n---\n\n기록 기준 ${site.as_of}. `;
 const prev=guide.entries[i-1],next=guide.entries[i+1];
 text+=[prev?`[← ${prev.label}](${prev.id}.md)`:null,next?`[${next.label} →](${next.id}.md)`:null].filter(Boolean).join(' · ')+'\n';
 out.set(doc(e.id),text);
}
const check=process.argv.includes('--check');
for(const [file,text]of out){
 if(check){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==text)throw Error(`${file} is stale: npm run docs`);}
 else{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);}
}
console.log(`${check?'Verified':'Generated'} README + ${guide.entries.length} experience pages + reading index from public data.`);
