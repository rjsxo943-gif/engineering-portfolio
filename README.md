# 김건태 | 엔지니어링 포트폴리오

**전자공학 · 회로 구현 · RF 신호처리 · 자동화·비전 AI**

전자공학을 바탕으로 실물 회로를 구현하고, SDR 신호 수집부터 판단·방향 추정·시각화까지 연결했습니다. 전기·설비 시공 현장에서 작업의 기본을 익혔으며, 현재는 PLC·로봇 교육과 비전 AI 팀 프로젝트로 경험을 확장하고 있습니다.

**[종합 포트폴리오 PDF 보기 · 9쪽](public/downloads/engineering-portfolio.pdf)** · [PDF 다운로드](https://raw.githubusercontent.com/rjsxo943-gif/engineering-portfolio/main/public/downloads/engineering-portfolio.pdf) · [RF 졸업작품 상세](https://github.com/rjsxo943-gif/rf-drone-detection-capstone)

## 주요 프로젝트

### 01. SDR 기반 RF 드론 탐지 및 방향 추정

**졸업작품 완료 · 2026.03–2026.06**

Pluto+ SDR의 2채널 IQ 신호로 드론 관련 RF activity를 탐지하고, 위상차 기반 신호 도래 방향(AoA)을 추정한 프로젝트입니다.

- **본인 기여:** IQ 수신·전처리, Gain·위상 보정, STFT·CNN 추론, 후보 검증, AoA·coherence 검증, OpenCV 실시간 화면 통합 및 야외 시험
- **문제 해결:** 별도 날짜에 수집한 외부 데이터 1,800개를 Gain별로 분석하고 판단 기준을 조정해, **동일 데이터 재평가에서 오탐 300건 → 12건**으로 감소
- **팀 결과:** 안테나 하드웨어와 수신·소프트웨어를 결합한 RF 탐지 계층 prototype 구현. 안테나 설계·제작은 위 개인 기여 범위와 구분

Gain별 기준의 오탐 개선은 RawNoiseGate·voting 실험과 별도 비교입니다. 거리 출력은 정밀 측정이 아닌 실험적 구간 표시이며, 다양한 환경에서의 일반화·장시간 운용은 추가 검증 과제입니다.

[프로젝트 README](https://github.com/rjsxo943-gif/rf-drone-detection-capstone) · [최종 시스템 검증](https://github.com/rjsxo943-gif/rf-drone-detection-capstone/blob/main/docs/results/final_validation_summary.md) · [팀 포스터](https://github.com/rjsxo943-gif/rf-drone-detection-capstone/blob/main/assets/graduation_poster.png)

### 02. TTL/CMOS 다기능 디지털 시계

**완료 · 2025.11–2025.12**

시·분·초 카운터, AM/PM·알람·입력 제어 회로를 설계하고 Proteus 시뮬레이션, 만능기판 배선·납땜과 시험을 수행했습니다.

- **전환 오류 진단:** 59분 → 00분 전환 시 시 카운터가 중복 증가하는 현상을 계측하고, 자리올림 펄스·글리치와 RC 시정수를 확인해 대응
- **과전류 진단:** 전원 차단 후 도통시험·IC 분리 및 단독시험으로 손상 소자를 확인·교체하고, 공급전류와 주요 기능 재검증

### 03. K2 스마트팩토리 비전 검사

**교육 내 팀 프로젝트 · 2026.09–2026.10 · 최종 완료 수준 확인 중**

PLC·로봇·컨베이어 기반 조립·검사 공정을 구성하는 팀 프로젝트에서 **비전·AI 검출 파트**에 참여했습니다. 최종 검사 탑뷰 영상의 부품 누락·위치 확인을 위한 YOLO 활용 검토·개발과 검사 신호 인터페이스 정의에 참여했습니다. 전체 공정 구축을 개인 성과로 표시하지 않으며, 최종 시연·검출 성능은 확인 전입니다.

### 04. AI 분실물 관제탑

**진행 중 · 2026.11.02 시작**

팀은 이미지 등록 → 특징·OCR 추출 → 후보 검색 → 직원 확인 → SO-101 로봇 반환을 연결하는 실험적 서비스를 목표로 합니다.

- **본인 담당:** YOLO 탑뷰 검출, ArUco·호모그래피 좌표 변환, 비전 특징 매칭 및 로봇 좌표 보정·집기 연계
- **현재 수행:** 비전 어댑터·테스트와 Qwen 연계 진단 수행, 관제탑–로봇의 위치·자세 명령 연계 진행

최종 반환 서비스의 통합 완성·실증은 아직 완료되지 않았습니다.

[팀 저장소](https://github.com/agentops-lostfound/ai-lostfound-tower)

## 교육 · 현장 · 조직 운영

**Intel Edge AI DX / 피지컬 AI 부트캠프 — 교육 실습·수강 중**  
GX Works2 기반 PLC 래더, 센서·공압·구동장치, 뉴로메카 6축 로봇의 Conty·Python 예제, PLC–로봇 핸드셰이크를 학습·실습했습니다. 강사 예제 실습과 독립적인 팀 프로젝트 개발을 구분합니다.

**전기·설비·내장 현장 — 시공 참여 경험**  
대유기전에서는 전기 배관·배선·결선과 손상 관로 복구, 아성설비에서는 급수·배수·소방 배관 시공 및 통수·누수 점검, NCT에서는 자재 관리와 내장 시공을 경험했습니다. 현장 작업 참여 경험이며 상용 설계·산업설비 유지보수 경력을 의미하지 않습니다.

**전자공학과 학생회 총무부장 — 2025.01–2025.12**  
연간 약 **2,200만 원 규모 예산과 8개 주요 행사**의 재정 기록을 관리했습니다. 본인은 예산 편성·증빙·환불 자료 정리와 감사자료집 제작을 담당하고, 부학회장·학회장·대의원의 검토·결재 절차를 운영했습니다. 행사는 학생회 조직이 함께 운영했습니다.

## 기술 경험

| 경험 수준 | 도구·기술 |
|---|---|
| 직접 사용 | Python, OpenCV, Pluto+ SDR, STFT·CNN, 위상차 AoA, TTL/CMOS, Proteus, 배선·납땜·계측 |
| 프로젝트 진행 중 | YOLO, ArUco, 호모그래피, 비전 특징 매칭, SO-101 연계 |
| 교육·예제 실습 | GX Works2, PLC 래더, 공압, Conty 3.3, Python 로봇 제어, CC-Link |

---

경험·진행 상태 기준: **2026.11.09**. 프로젝트별 개인 기여, 팀 범위와 검증 내용은 [종합 PDF](public/downloads/engineering-portfolio.pdf)에 정리했습니다.

<details>
<summary>사이트 개발·유지보수 안내</summary>

[개발 환경](docs/development.md) · [콘텐츠·사진 관리](docs/maintenance.md) · [배포 절차](docs/deployment.md)

</details>
