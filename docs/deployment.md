# GitHub 배포 상태와 재배포

2026-11-09 사용자로부터 공개 업로드·배포 승인을 받았습니다. 신규 portfolio 저장소 생성 API가 차단되어, 연결된 빈 저장소 `rjsxo943-gif/engineering-portfolio`를 배포 대상으로 사용합니다.

- 대상 저장소: https://github.com/rjsxo943-gif/engineering-portfolio
- Pages 목표 경로: `/engineering-portfolio/`
- URL은 실제 HTTPS 200 확인 후 YAML `site.public_url`에 기록합니다.
- main 브랜치 push 또는 Pages workflow 수동 실행으로 배포합니다. configure-pages가 Pages 활성화를 요청합니다. GitHub 권한 정책이 이를 제한하면 저장소 Settings → Pages → GitHub Actions를 선택해야 합니다.

## 2026-11-10 확인된 차단 요인과 소유자 조치

2026-11-10 원격 저장소의 최근 Actions 목록을 확인한 결과, Pages 실행 기록은 2026-11-09의 최초 실패 1건뿐입니다. 이후 3개 업데이트 커밋의 메시지에 `[skip ci]`가 포함되어 새 배포 실행이 생성되지 않았습니다. **저장소에 코드가 있다는 것과 공개 사이트가 열리는 것은 별개입니다.**

소유자 계정으로 다음 순서를 진행합니다.

1. [Settings → Pages](https://github.com/rjsxo943-gif/engineering-portfolio/settings/pages)를 열고 **Build and deployment → Source: GitHub Actions**로 설정합니다. 기존에 같은 옵션이 선택되어 있다면 그대로 둡니다.
2. [Deploy portfolio to GitHub Pages](https://github.com/rjsxo943-gif/engineering-portfolio/actions/workflows/pages.yml)에서 **Run workflow → main → Run workflow**를 실행합니다. `main`에 일반 커밋이 push되어도 실행됩니다. 배포를 원하는 변경에는 `[skip ci]`를 사용하지 않습니다.
3. 빌드와 배포가 모두 성공했는지 확인하고, `https://rjsxo943-gif.github.io/engineering-portfolio/`에서 실제 페이지가 열리는지 확인합니다. URL이 예상 주소라는 사실만으로 공개 성공 처리하지 않습니다.
4. 웹 접속·제목·PDF 다운로드가 정상임을 확인한 다음 아래 QR 발급 절차를 진행합니다.

배포 workflow는 활성화되어 있지 않은 Pages를 권한 없이 만들려고 시도하지 않고, 설정이 없는 경우 명확한 오류 메시지를 남기도록 수정했습니다. 이 변경 자체로 Pages가 자동 활성화되지는 않습니다.

## 로컬 검증 후 업로드

```bash
npm ci
npm run build
npm run preview -- --port 4173 --strictPort
# 다른 터미널
npm run pdf
npm run build
npm test
git status --short
# 공개용 파일만 명시적으로 추가하고 변경 목록을 검토
git push origin HEAD:main
```

## 실제 배포 후 QR

실제 홈페이지 HTTPS 200 확인 후에만 다음을 수행합니다.

```bash
npm run qr -- --url https://rjsxo943-gif.github.io/engineering-portfolio/
npm run build
npm run pdf
npm run build
npm test
```

QR은 홈페이지 제목·도착 URL·HTTP 200을 확인한 다음 1200px PNG와 SVG를 생성하며 두 형식의 스캔 일치를 검사합니다. 생성한 YAML·이미지·PDF를 commit/push하여 재배포합니다. URL은 RF GitHub가 아닌 종합 포트폴리오 홈입니다. 비공개 경험 원본·ZIP·증빙은 업로드하지 않습니다.

## 첫 원격 실행 결과

main 업로드 성공 후 [실행 #1](https://github.com/rjsxo943-gif/engineering-portfolio/actions/runs/42573129730)에서 Pages 활성화 권한 부족(`Resource not accessible by integration`)을 확인했습니다. [Pages 설정](https://github.com/rjsxo943-gif/engineering-portfolio/settings/pages)에서 Source를 GitHub Actions로 선택한 뒤 [배포 workflow](https://github.com/rjsxo943-gif/engineering-portfolio/actions/workflows/pages.yml)의 Run workflow를 실행하면 됩니다.
