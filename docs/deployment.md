# GitHub 배포 상태와 재배포

2026-11-09 사용자로부터 공개 업로드·배포 승인을 받았습니다. 신규 portfolio 저장소 생성 API가 차단되어, 연결된 빈 저장소 `rjsxo943-gif/engineering-portfolio`를 배포 대상으로 사용합니다.

- 대상 저장소: https://github.com/rjsxo943-gif/engineering-portfolio
- Pages 목표 경로: `/engineering-portfolio/`
- URL은 실제 HTTPS 200 확인 후 YAML `site.public_url`에 기록합니다.
- main 브랜치 push 또는 Pages workflow 수동 실행으로 배포합니다. configure-pages가 Pages 활성화를 요청합니다. GitHub 권한 정책이 이를 제한하면 저장소 Settings → Pages → GitHub Actions를 선택해야 합니다.

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
