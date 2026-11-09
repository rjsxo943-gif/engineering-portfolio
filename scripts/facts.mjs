import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('src/content/portfolio.json','utf8'));
const sources={
 'rf-drone':'사용자 RF 경험 기록(비공개), 공개 README·개인 기여 문서·최종 검증 문서',
 'digital-clock':'사용자 제공 공개 마스터 초안 §2.2 (상세 경험 원본·계측 로그 미제공)',
 'smart-factory':'사용자 제공 공개 마스터 초안 §2.3 (최종 구현·시연 미확인)',
 'lost-found':'사용자 제공 공개 마스터 초안 §2.4 (2026-11-09 자기보고)',
 'bootcamp':'사용자 교육 경험 기록(비공개, 2026-10-17), 공개 마스터 초안 §3',
 'field-work':'사용자 현장 경험 기록·경력 PDF(비공개), 공개 마스터 초안 §5',
 'student-council':'사용자 학생회 경험 기록(비공개), 공개 마스터 초안 §4'
};
const escape=s=>s.replace(/\|/g,'\\|').replace(/\n/g,' ');
let out=`# 공개 사실성 검토표\n\n기준일: 2026-11-09. 공개 문안의 사실 주장 단위로 확인 근거와 귀속을 기록합니다. 비공개 원본은 저장소 밖에서 대조했으며 원본 문서·재무 증빙을 공개하지 않습니다. 자기보고에 근거한 항목은 독립 실증을 의미하지 않습니다.\n\n## 공개 RF 출처\n\n- [README](https://github.com/rjsxo943-gif/rf-drone-detection-capstone/blob/main/README.md)\n- [최종 검증](https://github.com/rjsxo943-gif/rf-drone-detection-capstone/blob/main/docs/results/final_validation_summary.md)\n- [개인 기여·프로젝트 스토리](https://github.com/rjsxo943-gif/rf-drone-detection-capstone/blob/main/docs/interview/project_story.md)\n- [팀 포스터](https://github.com/rjsxo943-gif/rf-drone-detection-capstone/blob/main/assets/graduation_poster.png)\n\n원본 포스터는 공개된 팀 성과입니다. 로컬 WebP는 다운로드 원본의 크기·압축 변환본이며 다른 사진으로 대체하지 않았습니다.\n\n## 주장별 검토\n\n| ID | 공개 문장·주장 | 귀속 | 상태 | 근거·확인 수준 |\n|---|---|---|---|---|\n`;
for(const p of data.projects){
 let n=0;
 const fields=[['기간',p.period],['범위 요약',p.summary],['팀·조직',p.team],...p.mine.map(x=>['본인',x]),...p.cases.flatMap(x=>[['문제',x.problem],['본인 행동',x.action],['기록상 결과',x.result]]),['한계·미확인',p.limit]];
 for(const [kind,text]of fields){
  // Split full sentences, retaining numerical/technical text without rewriting claims.
  for(const sentence of text.split(/(?<=[.!?])\s+(?=[가-힣A-Z])/u)){
   n++;let source=sources[p.id];
   if(sentence.includes('300건'))source='사용자 RF 경험 기록 §5.3: 동일 외부 데이터 1,800개, Gain-aware threshold 비교. RawNoiseGate·voting 효과로 귀속 금지';
   out+=`| ${p.id}-${String(n).padStart(2,'0')} | ${escape(sentence)} | ${kind} | ${p.status} | ${source} |\n`;
  }
 }
}
out+=`\n## 공통 검토와 유보\n\n- 프로필의 이름·전자공학 표기는 사용자 경력 PDF와 공개 마스터 초안에 근거합니다. 전화·이메일·연락처는 제공되지 않아 만들지 않았습니다.\n- 기술 목록은 각 프로젝트의 태그·기여에 근거하며 직접 사용 / 진행 중 / 교육 실습 / 예정·미확인으로 구분했습니다. Qwen·OCR·DB·LangGraph는 팀 기술이며 개인 전부 구현으로 표시하지 않았습니다.\n- 시계의 상세 원본이 없으므로 마스터 문안 이상으로 정량 성과를 확장하지 않았습니다.\n- HMI·유압은 이전 경험 기록에 있으나 최신 직접 설명과 상세 검증은 추가 확인입니다. Factory I/O·OpenVINO를 사용 완료로 기재하지 않았습니다.\n- RF 최종 런타임은 공개 최신 README의 Top5 vote·동일 주파수 재검증 구조를 우선했습니다. 경험 기록의 과거 temporal voting 실험과 구분합니다.\n- RF 팀 인원은 확인 필요로 생략했습니다. 안테나 설계·제작은 팀 범위이며 개인 기여 목록에 넣지 않았습니다.\n- 아성설비 근무 연도는 기록 충돌로 유보했습니다. K2 완료 수준과 분실물 최종 반환도 유보했습니다.\n- 학생회 감사 중징계 없음은 원본 경험 기록의 진술입니다. 일부 양식 수정·중위권 평가를 함께 적고 무결점 감사로 과장하지 않았습니다. 향후 엑셀 관리 개선은 계획입니다.\n- 공개 URL은 null이며 QR_PENDING입니다. URL·배포·스캔 완료를 주장하지 않았습니다.\n`;
fs.writeFileSync('docs/fact_check.md',out);
console.log('Fact-check rows generated from public copy');
