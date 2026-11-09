# 유지보수

README와 `docs/experience/`는 공개 JSON/YAML에서 생성합니다. 문안은 `src/content/portfolio.json`, README 요약·순서·PDF 안내는 `src/content/repository.json`, 링크·사진 경로는 `portfolio.config.yaml`에서 수정하고 `npm run docs`로 반영하세요. `npm run docs:check`는 생성 문서와 데이터의 불일치를 검사하며 빌드에도 포함됩니다. 생성된 Markdown을 직접 수정하면 다음 생성 때 덮어써집니다.

저장소 QR은 `site.repository_url`을 가리키며, 홈페이지 QR의 `site.public_url`·`qr_status`와 구분합니다. 이번에 수록한 저장소 QR은 PNG/SVG 스캔을 검증한 파일입니다.

- 문안·프로젝트 순서·기여·상태·태그는 `src/content/portfolio.json`에서 수정합니다. `mine`은 개인 수행, `team`은 팀 범위, `limit`는 미확인 사항과 한계입니다. 개인 역할을 팀 기술 목록으로 확장하지 않습니다.
- 사진·링크는 `portfolio.config.yaml`에서 관리합니다. `public/public_assets/`에 검토된 복제본만 넣습니다. 얼굴·현장명·위치·동/층·연락처를 복제본에서 마스킹하고 EXIF 메타데이터도 제거합니다. 원본을 덮어쓰지 않습니다.
- 기준일 `site.as_of`, 각 프로젝트의 시점 문장을 함께 갱신합니다. 시간 경과를 근거로 상태를 자동 완료 처리하지 않습니다. AI 분실물 프로젝트의 예정 종료일은 완료일이 아닙니다.
- `npm run check` 경고는 현재 누락 사진을 알려줍니다. 공개 웹·PDF에서는 미제공 사진과 빈 갤러리를 표시하지 않습니다. 경고는 개발 환경에서만 확인하며 사진 확보 여부는 누락 자료 문서에서 관리합니다.
- 내용 수정 후 `npm run build` → preview → `npm run pdf` → `npm run build` → `npm test`를 실행합니다. PDF는 내용과 별도로 재생성해야 갱신됩니다. 9쪽 footer 겹침 검사가 실패하면 내용을 삭제·축소해 사실을 누락하기보다 페이지 구성·개수를 조정하고 표지 목차·테스트도 함께 변경합니다.
- `.artifacts/`의 스크린샷과 레이아웃 보고서는 로컬 검증 산출물이며 Pages에 포함되지 않습니다.
- PDF 다운로드는 생성된 파일을 제공합니다. 일반 웹의 브라우저 인쇄 대신 `인쇄용 보기` 또는 생성 PDF를 사용합니다.
- `site.public_url`은 실제 배포 확인 후 QR 도구가 설정합니다. 주소를 바꾸지 않는 한 QR을 재발급할 필요가 없습니다. 사진·내용만 변경하면 URL과 QR을 유지합니다.
- 공개 데이터나 원본을 LLM으로 확장할 때 수치·기술·기간을 추정하지 않습니다. `docs/fact_check.md`와 미확인 목록을 함께 관리합니다.
