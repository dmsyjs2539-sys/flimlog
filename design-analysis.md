# [필름로그] 디자인 분석표

## 확인한 자료

- 디자인 원본: https://www.figma.com/design/lNUpIdgLj2eDnRZKQTS7oU/%EC%9C%A4%EC%9D%80%EC%84%A0?node-id=291-361&m=dev
- 확인한 화면: [인트로, 메인이미지]
- 실제 에셋 위치: [/assets/images]

## 화면 목록

| 화면 | 목적 | 주요 행동 | 필요한 상태 |
|---|---|---|---|
| 인트로 (Intro) | 필름로그 브랜드 감성 전달 및 서비스 진입 대기 | • 메인 페이지 자동 전환 대기<br>• 화면 클릭/터치 시 전환<br>• Skip 버튼 클릭 | • 기본 (비디오/이미지 애니메이션 재생)<br>• 로딩 (에셋 프리로딩)<br>• 페이드아웃 (화면 전환) |
| 메인 페이지 (Hero) | 핵심 서비스 안내 및 주요 기능(현상/스캔, 자판기 위치 등) 탐색 | • GNB 메뉴 이동<br>• 메인 CTA 버튼 클릭 (접수/검색)<br>• 하단 섹션 탐색 스크롤 | • 기본 (Default)<br>• 고정 헤더 (Sticky GNB)<br>• 모바일 메뉴 열림 (Mobile Drawer Open) |

## 공통 영역

- 헤더: 상단 좌측 로고, 중앙/우측 메인 메뉴(서비스 안내, 위치 찾기, 갤러리 등), 현재 메뉴는 텍스트 컬러 강조 및 하단 Indicator 바 활성화
- 푸터: 사업자 정보, 고객센터 안내, 이용약관/개인정보처리방침, SNS 링크, 저작권 문구 (`ⓒ FILMLOG All rights reserved.`)
- 공통 버튼: 
  - 기본: 메인 브랜드 컬러 배경 + 흰색 텍스트 (`border-radius: 4px~6px`)
  - hover: 배경색 Darken 또는 커서 Pointer 변경
  - focus: 아웃라인(Border) 강조
  - disabled: 회색 배경 (`#E0E0E0`) + 클릭 불가 (`cursor: not-allowed`)
- 공통 카드:
  - 구조: 상단 대표 이미지 (3:2 또는 4:3 비율) + 하단 텍스트 레이아웃 (태그, 제목, 설명, 날짜)
  - 반복 규칙: Flex/Grid 레이아웃 적용, Hover 시 이미지 Zoom-in (`transform: scale(1.03)`) 및 Box Shadow 효과

## 디자인 토큰

- 배경색: 메인 배경 웜베이지/크림톤 (`#F9F6F0` 또는 `#FFFFFF`), 다크 포인트/푸터 배경 (`#1A3B2B`)
- 본문색: 기본 본문 (`#222222`), 부연 설명/메타 텍스트 (`#666666`), 반전 텍스트 (`#FFFFFF`)
- 강조색: 브랜드 시그니처 컬러 (다크 그린/카키 계열 `#1A3B2B` 또는 테라코타 앰버 계열)
- 제목 폰트: Pretendard 또는 Noto Serif KR / Bold (700) ~ SemiBold (600)
- 본문 폰트: Pretendard 또는 Noto Sans KR / Regular (400) ~ Medium (500)
- 기본 간격: 8px 그리드 시스템 (`4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`)
- 라운드: 버튼 (`4px`~`6px`), 카드/입력창 (`8px`~`12px`), 원형 버튼 (`9999px`)
- 그림자: 카드 기본 (`0 2px 8px rgba(0,0,0,0.05)`), 드롭다운/모달 (`0 8px 16px rgba(0,0,0,0.1)`)

## 반응형

- 360px: 1열(Single Column) 수직 배치, 모바일 햄버거 메뉴 전환, 좌우 여백 `16px`
- 768px: 2열(2 Columns) Grid 배치, GNB 간격 축소 및 태블릿 대응, 좌우 여백 `32px`
- 1280px: 3~4열 Grid 배치, 데스크톱 최대 폭(Max-width) `1200px` ~ `1280px` 중앙 정렬

## 인터랙션

- 메뉴: 모바일 햄버거 클릭 시 Slide-in(드롭다운/드로어) 열기·닫기, 데스크톱 메뉴 호버 시 텍스트 밑줄/컬러 변경
- 버튼: Hover 시 Smooth transition (0.2s) 적용, Active 클릭 시 미세한 Scale Down (`transform: scale(0.98)`)
- 스크롤: Down 스크롤 시 Sticky Header 배경 반투명Blur 처리, 섹션 진입 시 Fade-In / Slide-Up
- 애니메이션: 인트로 화면 재생 후 1초간 Fade-Out 되며 메인 화면으로 자연스럽게 전환

## 에셋

- 로고: `/assets/images/logo.svg` (또는 `/assets/images/logo.png`)
- 이미지: `/assets/images/intro-bg.png`, `/assets/images/hero-main.png`
- 아이콘: SVG 벡터 아이콘 세트 (Search, Menu, Close, Location-pin, Arrow)
- 폰트: Pretendard (Web Font CDN 또는 static 폰트 파일), Noto Serif KR

## 확인된 사실

- Figma 노드 `291-361` 기준 인트로 화면 및 메인 히어로 비주얼 요소 구성 확인.
- 프로젝트 내 실제 이미지 에셋 경로가 `/assets/images`로 지정되어 있음을 확인.
- 필름로그 브랜드 특유의 톤앤매너(따뜻한 배경색과 다크 그린 강조색 조화) 반영.

## 아직 확인하지 못한 내용

- 인트로 화면에서 메인 페이지로 넘어가는 자동 전환 타임(예: 3초) 지정 여부.
- `/assets/images` 폴더 내 저장될 에셋의 최종 포맷(PNG, WebP, SVG 등) 및 정밀한 파일명 규칙.
- 폰트 로딩 방식(웹폰트 CDN 사용 여부 혹은 프로젝트 저장소 패키징 여부).