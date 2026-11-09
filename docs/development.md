# 개발 환경과 파일 구성

이 문서는 포트폴리오 사이트를 수정·검증하는 개발자를 위한 안내입니다.

## 시작

Node.js 24와 npm을 사용합니다. 기존 체크아웃 `/workspace/engineering-portfolio`에서 작업하세요. 클라우드 작업은 이미 격리되어 있으므로 별도 Git worktree를 만들 필요가 없습니다.

```bash
npm ci
npm run dev
```

기본 base는 `/engineering-portfolio/`입니다. 개발 서버에서 이 경로를 열어 확인합니다. 빌드 및 검증:

```bash
npm run build
npm run preview -- --port 4173 --strictPort
# 다른 터미널, 같은 저장소 디렉터리에서
npm run pdf
npm run build  # 방금 만든 PDF를 dist에 반영
npm test
```

`npm run pdf`와 브라우저 테스트는 Chromium 및 한국어 글꼴이 필요합니다. 현재 클라우드에는 `/usr/bin/chromium`과 Noto CJK가 준비되어 있습니다. 다른 머신에서는 `npx playwright install --with-deps chromium` 후 `CHROMIUM_PATH`에 설치된 실행 경로를 지정합니다. `scripts/browser.mjs`가 경로를 읽습니다. `SITE_ORIGIN`으로 내부 검증용 서버 주소를 변경할 수 있습니다.

## 파일 구성과 편집

| 파일 | 용도 |
|---|---|
| `portfolio.config.yaml` | 공개 사이트 설정, 링크, 사진 경로, 실제 배포 URL·QR 상태 |
| `src/content/repository.json` | README 소개·요약·상세 문서 순서 |
| `src/content/portfolio.json` | 공개용 문안, 개인·팀 역할, 상태, 기술 수준, 표시 순서 |
| `src/main.ts`, `src/style.css` | 웹·9쪽 보고서 화면 및 인쇄 스타일 |
| `public/public_assets/` | 공개 검토를 마친 사진과 RF 공개 포스터 복제본 |
| `public/downloads/engineering-portfolio.pdf` | 생성된 9쪽 제출용 PDF |
| `scripts/` | 콘텐츠 검사, PDF·QR 생성, 서버 대기 |
| `tests/browser.mjs` | 모바일·태블릿·PC 기능 검증 |
| `docs/` | 사실 검토, 누락 목록, 검증·배포 기록, 유지보수 |

사진이 없는 항목은 공개 웹·PDF에서 생략합니다. 누락 파일은 빌드 경고와 관리 문서에서 확인할 수 있습니다. 사진 추가 후 **다시 빌드하고 PDF를 재생성**하면 YAML 경로의 실제 파일이 반영됩니다. 컴포넌트를 수정할 필요가 없습니다. 생성형 이미지나 스톡사진은 사용하지 않았습니다.

## 개인정보 경계

경험 원본·첨부 ZIP·원본 경력 PDF는 저장소 **밖** `/workspace/handoff`, `/workspace/attachments`에 남겼습니다. 사이트는 검토된 JSON/YAML과 `public/`만 사용합니다. `private_sources/`는 Git 제외 대상이며 빌드에서도 읽지 않습니다. `.gitignore`는 강제 추가(`git add -f`)나 이미 추적된 파일을 막지 못하므로 공개 전 파일 목록 확인이 필요합니다. 원본·재무 증빙·계좌·개인 연락처·현장명은 올리지 않습니다.

RF 포스터는 사용자 지정 공개 GitHub 원본을 내려받아 웹용 WebP 복제본으로 수록했습니다. 원본은 변경하지 않았으며 저자 표기·팀 전체 결과를 유지합니다. 출처는 YAML 및 화면에 연결했습니다. RF 포스터의 안테나 성과를 개인 기여로 주장하지 않습니다.


[유지보수](maintenance.md) · [배포 절차와 상태](deployment.md) · [검증 기록](validation.md)

## GitHub 문서 갱신

`npm run docs`로 README와 7개 경험 상세 문서를 생성하고 `npm run docs:check`로 동기화를 검사합니다. 공개 콘텐츠만 읽으며 비공개 원본을 문서에 복사하지 않습니다.
