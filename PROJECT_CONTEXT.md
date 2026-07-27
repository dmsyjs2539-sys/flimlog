# [필름로그] 프로젝트 진행 상황

최종 갱신: 2026-07-27

## 완료 내용

### 명명 규칙 (PRD §13)

- `index.html`의 CSS class·id 약 70개를 kebab-case → snake_case로 전환
- 상태 class는 `is_scrolled` 형식 적용
- 잔여 kebab-case 0건 (grep 확인)

### 에셋 (PRD §12)

- `figma.com/api/mcp/asset/*` 원격 URL 20개 제거 → `assets/image/` 로컬 파일로 교체
- 검색·화살표 아이콘 3개는 inline SVG + `currentColor`로 전환
- 원격 URL 0건, 로드 실패 이미지 0건

### 헤더 가독성

- `position: fixed`로 변경해 디자인대로 히어로 이미지 위에 겹치도록 수정
  (기존 `sticky`는 히어로 위쪽 크림 영역에 놓여 흰 글자가 보이지 않았음)
- `::before` 그라데이션 스크림으로 밝은 이미지 위 흰 글자 확보
- `main.js`가 히어로를 벗어나면 `is_scrolled` 부여 → 크림 배경 + blur + `#0d3322` 글자

### 히어로 / 지도 카드 겹침

- `.hero_map_card`를 absolute 오버레이에서 분리 → 히어로 아래 우측 정렬 블록
- `2.map.png` 목업에 마커·패널이 이미 그려져 있어 중복되던 `.map_badges` 오버레이 제거

### 반응형 (PRD §14)

mobile-first로 재구성. 브레이크포인트를 PRD 기준값 그대로 사용.

| 구간 | 여백 | feature 카드 | 갤러리 그리드 | 헤더 |
|---|---|---|---|---|
| base (360px) | 16px | 1.25장 노출 | 2열 | 메뉴 자체 행 + 가로 스와이프 |
| `min-width: 768px` | 32px | 2.3장 노출 | 3열 | 메뉴 자체 행 |
| `min-width: 1280px` | 40px | 4장 전부 노출 | 2열 | 로고·메뉴·검색 1행 |

### feature 카드 (디자인 일치 + 가로 스크롤)

- 디자인 원본 기준 **4장**으로 정리 (`Summer Film Picks` 제거)
- grid → flex 레일로 변경. `flex-wrap: nowrap` + `overflow-x: auto`로 줄바꿈 없이 가로 스크롤
- `scroll-snap-type: x proximity` 사용. `mandatory`는 페이지 스크롤과 간섭해 레일이 임의 위치로 튀어 제외
- 마지막 카드는 `padding-right`를 유지하고 구분선만 제거 (제거 시 카드 내용 폭이 혼자 넓어짐)
- 1280px에서는 4장이 정확히 들어차 스크롤이 발생하지 않음

### 고정 높이 → aspect-ratio

| 대상 | 변경 전 | 변경 후 |
|---|---|---|
| `.hero_visual` | 높이 미지정 (원본 비율) | `3/4` → `1920/1024` (768~) |
| `.map_image_wrapper` | `737px` | `1/1` |
| `.showcase_image` | `798px` | `4/3` |
| `.archive_media img` | `500px` | `4/3` → `3/4` (768~) |
| `.archive_side_image` | `380px` | `16/11` |
| `.archive_thumbs img` | `96px` | `4/3` |
| `.feature_card img` | `258px` | `4/3` |
| `.gallery_grid img` | `100%` | `1/1` |
| `.approach_section` | `min-height: 900px` | 콘텐츠 기반 padding |

남은 px 높이는 아이콘·버튼 터치 영역뿐 (레이아웃 미영향).

### 이미지 배정 오류 수정 (2026-07-27)

`assets/figma/archive-main.png`가 고양이 사진이 아니라 **서울 지도**임을 확인. 저해상도 시안 썸네일만 보고 배정한 것이 원인.

| 위치 | 변경 전 | 변경 후 |
|---|---|---|
| `.archive_side_image` (아카이브 캐러셀) | `figma/archive-main.png` (지도) | `image/9.mainbest.jpg` (고양이) |
| `.showcase_image` (갤러리 메인) | `image/9.mainbest.jpg` (고양이) | `image/14.best1.jpg` (아이) |
| `.gallery_grid` 1번 | `image/14.best1.jpg` | `image/19.best6 (2).PNG` |

- `.archive_side_image` 비율을 `16/11` → `3/2`로 변경 (원본 2432x1622와 동일해 잘림 없음)
- 데스크톱 `.archive_left` 제품 사진 폭 240px → 280px (시안 비중 반영)
- 태블릿 지도 카드를 우측 정렬 → 중앙 정렬 (태블릿 시안 기준)

## 검증 결과

브라우저 실측 (2026-07-27).

| 폭 | 가로 스크롤 | 깨진 이미지 | 헤더 높이 | 히어로/지도 겹침 | 문서 높이 |
|---|---|---|---|---|---|
| 360px | 없음 | 0 | 96px | 없음 | 8,640px |
| 768px | 없음 | 0 | 127px | 없음 | — |
| 1280px | 없음 | 0 | 90px | 없음 | 6,346px |

- 1280px 히어로 텍스트 40~680px / 지도 카드 805~1225px → 축 분리 확인
- 360px에서 `.global_nav`만 내부 가로 스크롤(의도), 페이지 전체 스크롤은 없음

## 남은 문제

### 검증하지 못한 항목

- **`main.js` 실제 동작 미검증**. 프리뷰 패널이 `file://` 스크립트를 차단함 (`net::ERR_BLOCKED_BY_CLIENT`).
  CSS는 `is_scrolled` 수동 적용으로 전환 확인 완료. 실제 브라우저에서 스크롤 확인 필요.

### 디자인 불일치

- **feature 카드 개수 미확정**. 데스크톱 시안은 한 줄에 4장만 보이지만, 모바일 시안(`26.07.21_모바일.png`)에는
  `7.summer.png`가 포함된 **5장**이 세로로 나열되어 있음. 데스크톱은 5번째가 가로 스크롤 밖에 있는 것으로 보임.
  현재 구현은 사용자 지시에 따라 4장. 확인 후 5장 복원 여부 결정 필요.
- 태블릿 시안의 갤러리 메인(아이 사진)은 **우측 정렬 약 43% 폭**이나 현재는 전체 폭. 시안에 grid가 보이지 않아 보류.

- `2.map.png` 목업에 "필름로그 서울 본점" 패널이 그려져 있어 `.location_panel` 텍스트와 내용이 중복됨.
  지도 API 연동 시 해소 예정 (텍스트 패널은 접근성상 유지).
- `design-analysis.md`의 토큰(브랜드색 `#1A3B2B`, 버튼 라운드 `4~6px`)과 구현(`#0d3322`, 라운드 `60px` pill, 강조색 `#ffb900`)이 불일치. 문서 또는 구현 중 한쪽 정렬 필요.

### 미구현 (PRD 대비)

| 항목 | PRD |
|---|---|
| 인트로 / 스플래시 + Skip | §8 |
| Kakao/Naver 지도 API 연동, 마커·인포윈도우 | §7, §12 |
| 3~4단계 간편 현상 접수 | §7 |
| localStorage 원클릭 재접수 | §11 |
| 실시간 재고 상태 (색상 + 텍스트 병행) | §7, §15 |
| 모바일 햄버거 드로어 | design-analysis |
| 검색창을 실제 `input` + `label`로 전환 | §15 |
| `href="#"` 링크 7개, `#mypage` 앵커 대상 없음 | §18 |
| Pretendard 웹폰트 로드 (현재 system-ui 폴백) | design-analysis |

## 참고

- `CLAUDE.md`가 `@AGENTS.md`를 참조하지만 해당 파일이 저장소에 없음.
