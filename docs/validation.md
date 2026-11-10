# 2026-11-10 GitHub 저장소 후속 점검 (배포 상태와 내부 링크)

연결된 GitHub 저장소의 `main` HEAD는 `b5984cfd5136b1209d6964cf50b9e133bacbb79f`입니다. 원격 Actions 조회에서 Pages 실행은 최초 실패 1건(2026-11-09)만 확인되며, 이후 커밋들은 `[skip ci]`로 인해 배포 재실행 내역이 없습니다. 홈페이지 HTTP 200과 Pages 실제 배포는 **확인되지 않았습니다**. 따라서 `site.public_url=null`, `qr_status=QR_PENDING` 상태를 유지합니다.

GitHub에서 README와 `docs/experience/`의 Markdown 9개 및 원격 Git 트리를 조회해 로컬 상대경로 링크 62개를 대조한 결과 **누락 대상 0개**였습니다. 같은 검사를 빌드 때 반복하도록 `scripts/check-links.mjs`를 추가하고 `npm run build`에 연결했습니다. 이는 기존 저장소 상태에 대한 원격 정적 점검이며, 추가한 빌드 단계와 Pages workflow를 원격 CI에서 실행해 통과한 결과는 아직 아닙니다.

Pages workflow는 저장소 소유자가 Settings → Pages에서 Source를 GitHub Actions로 활성화했는지 먼저 확인하도록 변경했습니다. 설정이 없으면 안내와 함께 실패하며 QR을 조기 발행하지 않습니다. 전체 절차는 [배포 문서](deployment.md)에 있습니다.

---

# 미제공 사진 공개 표시 개선

2026-11-09: 공개 웹·PDF에서 미제공 사진과 빈 갤러리를 생략했습니다. 실제 RF 공개 화면은 원래 야외 사진과 구분해 수록했고 기존 포스터는 유지했습니다. PDF를 9쪽으로 재생성하고 전체 페이지 넘침 검사를 통과했습니다.

빌드와 375/768/1440px 브라우저 검사에서 사진 준비 중·원본 미제공 안내가 표시되지 않으며, RF 공개 화면이 정상 출력되는 것을 확인했습니다. 사진 6장 누락은 빌드 경고·관리 문서에서 계속 추적합니다.

아래는 이전 검증 기록입니다.

# GitHub 포트폴리오 구성 개선 검증

2026-11-09: README를 핵심 경험 요약·프로젝트 탐색표·RF 공개 화면·PDF 목차·QR 다운로드로 재구성했습니다. 공개 콘텐츠에서 7개 경험 상세 문서와 읽기 안내를 생성했습니다.

- `npm run build`: 콘텐츠·문서 동기화·TypeScript·Vite 빌드 통과.
- `npm test`: 375/768/1440px에서 기존 7개 섹션·PDF·포스터·접근성·콘솔 검사 통과.
- README와 경험 문서 9개에서 로컬 링크 62개 대상 파일 확인.
- 저장소 QR PNG 디코딩 결과가 `https://github.com/rjsxo943-gif/engineering-portfolio`와 일치. PNG/SVG는 이전 스캔 검증한 원본과 바이트 일치 확인.
- RF 화면은 원본 공개 저장소의 `assets/dashboard_scan_precision.png`를 변경 없이 수록. 왼쪽 UI 데모와 오른쪽 신호 화면을 구분하고 출처 표기. 누락 실물 사진을 대체하지 않음.
- 홈페이지 QR 상태는 별도 QR_PENDING 유지. 저장소 QR과 구분.
- 사진 6장·기존 내용 확인 사항·Pages 최초 활성화 제한은 이전 기록과 같음.

아래는 이전 단계의 검증 기록입니다.

# 최신 GitHub 업로드·배포 상태

2026-11-09 사용자 공개 업로드 승인 후 `rjsxo943-gif/engineering-portfolio` main에 커밋 `2ef7d43abc582c7e9f94695e9ccdb86d87066133` push 성공. 비공개 원본 제외, PDF 포함 32개 파일 업로드. GitHub 이메일 보호 정책에 맞춰 커밋 이메일은 noreply로 사용했습니다.

[Pages 실행 #1](https://github.com/rjsxo943-gif/engineering-portfolio/actions/runs/42573129730)은 빌드 후 Pages 최초 활성화에서 실패했습니다: `Create Pages site failed. Error: Resource not accessible by integration`. 저장소 소유자가 Settings → Pages → Source: GitHub Actions를 선택한 뒤 Deploy workflow를 수동 재실행해야 합니다.

현재 클라우드에서 api.github.com과 rjsxo943-gif.github.io 접근도 제한되어 해당 도메인 추가를 환경 설정 초안에 저장했습니다. 저장소 push 성공과 홈페이지 공개·QR 성공을 구분합니다. 실제 공개 URL은 아직 null, QR_PENDING입니다.

아래는 배포 승인 이전 로컬 검증 기록입니다. 승인 대기라는 문장은 당시의 상태이며 현재는 위 최신 기록을 우선합니다.

# 로컬 검증 결과

검증일: 2026-11-09. 대상: `/workspace/engineering-portfolio`. 공개 배포를 수행하지 않은 현재 인스턴스의 결과입니다.

| 점검 | 결과 |
|---|---|
| AGENTS.md | 기존 작업 공간과 첨부 자료에 없음 |
| 입력 검토 | 시작 안내 → CODEX_PROMPT → 설정 → 마스터 초안 → 비공개 경험 MD·PDF 순으로 검토. 지정 RF 공개 문서 3개·포스터도 확보·검토 |
| npm ci | lockfile 기반 재설치 성공. `.npmrc`로 쓰기 가능한 프로젝트 내부 캐시 지정 |
| 도구 | Node 24.22.1, npm 11.9.0, Vite 8.3.6, TypeScript 5.9.3, YAML 2.9.1, 시스템 Chromium |
| npm run build | 콘텐츠 검사·TypeScript·프로덕션 빌드 통과 |
| 개발 서버 | Vite dev에서 7개 섹션 렌더링·pageerror 없음 |
| 브라우저 | Chromium 375 / 768 / 1440px 통과 |
| 기능 | 7개 필수 섹션, 내부 anchor, 포스터 열기·이미지 디코드, PDF 다운로드 200 및 PDF 시그니처 통과 |
| 레이아웃 | 세 화면 너비 모두 가로 넘침 없음. 모바일·PC 첫 화면과 PDF RF 페이지 육안 확인 |
| 접근성 | axe-core WCAG 2A·2AA·2.1AA 자동 검사에서 3개 화면 너비 모두 위반 0건. 수동 스크린리더 전체 검증은 미실행 |
| 콘솔 | 세 화면 너비 모두 console error·pageerror 0건 |
| PDF | A4 9쪽 생성. 모든 페이지 콘텐츠가 하단 footer와 겹치지 않음. 포스터 전용 페이지 포함 |
| PDF 내용 | RF·시계·K2·분실물·부트캠프·학생회·NCT·아성설비·대유기전 및 QR_PENDING 확인 |
| 사진 | 미제공 6장, 명시적 경고·안내 영역 표시. 깨진 이미지 요청 없음 |
| RF 포스터 | 지정 GitHub 공개 원본 다운로드, WebP 변환본 수록 및 출처 링크. 팀 성과 표기 유지 |
| 외부 링크 | YAML links 5개 모두 HTTP 200. RF 원본 문서·포스터도 직접 읽기 성공 |
| 개인정보 경계 | ZIP·경험 원본·원본 PDF는 체크아웃 밖 보존. public/dist 및 PDF에서 private_sources·내부 원본 경로·비공개 현장명 유출 검사 통과 |
| 산출물 일치 | dist 다운로드 PDF와 public PDF 바이트 일치 |
| 의존성 | npm audit 전체 개발 의존성 포함 0건. 최초 Vite/YAML 권고는 수정 버전으로 갱신 후 해소 |
| QR 사전 차단 | URL 없는 npm run qr가 예상 exit 2로 QR_PENDING 안내. PNG/SVG 생성 없음 |
| 실제 QR 생성·스캔 | 미실행. 실제 홈 URL 확정·HTTPS 검증·사용자 배포 승인 전이기 때문 |
| GitHub Actions | validate 및 수동 Pages workflow 작성. GitHub 원격 실행은 미실행 |
| GitHub 생성·push·Pages | 모두 미실행. 사용자 승인 대기 |

## 수정 후 재검증한 문제

- 초기 TypeScript 빌드의 Node 타입·Disposable 타입 누락: Node 타입과 lib 추가 후 빌드 성공.
- PDF 첫 버전 포스터 설명의 footer 겹침: 인쇄 포스터 크기 조정, 교육/K2를 분리한 9쪽 구성으로 수정 후 전체 페이지 넘침 검사 통과.
- 첫 브라우저 실행 favicon 404: 로컬 SVG favicon 추가 후 콘솔 오류 0건.
- 지연 로딩 포스터를 디코드 전에 검사하던 테스트: 실제 이미지 decode 완료를 기다리도록 수정 후 통과.
- Vite/YAML 의존성 보안 권고: Vite 8.3.6·YAML 2.9.1로 갱신 후 lockfile 재설치·빌드·PDF·브라우저 전체 재검증.

## 로컬 증거 파일

`.artifacts/browser-results.json`, `pdf-layout.json`, `privacy-pdf-result.json`, `dev-result.json`, `external-links.json`, `dependency-audit.json`과 화면 너비별 스크린샷이 있습니다. `.artifacts/`는 Git 및 배포 제외 대상입니다. 현재 자료에 없는 사진은 생성·대체하지 않았습니다.

실제 홈페이지 접속, Pages 원격 실행, QR 성공 경로·실제 URL 스캔, 스마트폰 인쇄물 스캔은 아직 검증하지 않았습니다. 배포 전 PDF는 QR 대기 안내를 포함한 버전입니다. 확인이 필요한 사실·사진은 `missing-materials.md`에서 별도 관리합니다.
