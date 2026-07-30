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

### 히어로 / CTA / 갤러리 캐러셀 (2026-07-27)

- **CTA 분리**: 히어로 배너는 배경 + 헤드라인 + 서브 텍스트만. CTA 2개는 새 `.locator_section`
  (좌측 텍스트 + CTA / 우측 지도 카드 2열)으로 이동. `.hero_map_card` → `.map_card` 개명.
- `.button_secondary`를 크림 배경용(진한 초록 테두리·글자)으로 변경. 히어로 위 반투명 흰색은 더 이상 맞지 않음.
- **피처 카드 5장 복원**: `Summer Film Picks` 재추가. 360px는 세로 스택, 768px 이상만 가로 스크롤 레일.
- **갤러리 캐러셀**: `.gallery_layout` 2열. 좌측 고정(타이틀·설명·[FILM ARCHIVE]),
  우측 카드형 캐러셀 6장. 슬라이드 데이터는 `data-slide_*` 속성, 표시 대상은 `[data-slide_field]`.
  active index 변경 시 좌측 카메라/필름/작가 + 우측 하단 캡션(번호/제목/좋아요) + 카운터가 함께 갱신.
- 하트·화살표 아이콘을 `currentColor` 인라인 SVG로 교체 (기존 `heart.svg`·`arrow-up-right.svg`는
  밝은 고정색이라 각각 어두운 캡션/크림 배경에서 보이지 않았음).

#### 캐러셀 구현 중 잡은 버그 2건

1. IntersectionObserver 콜백이 한 번에 여러 슬라이드를 전달할 때 **순회 마지막 항목이 이겨서** 로드 직후
   6번 슬라이드가 선택됨 → 교차 비율이 가장 큰 항목을 고르도록 수정.
2. 브라우저가 트랙 스크롤 위치를 끝으로 복원해 `render(0)`이 즉시 덮어써짐 → 초기화 시
   `scrollToSlide(0, 'auto')`로 명시 초기화. `scroll-snap-align`도 `center` → `start`.
3. 뷰포트 폭이 바뀌면 슬라이드 너비가 달라져 스크롤 위치가 어긋남 → resize 시 현재 슬라이드로 재정렬.

### 최종 시안 기준 전면 정렬 (2026-07-28)

`데스크탑_최종.png` / `태블릭_최종.png` / `모바일_최종.png` 및 `logo.png` 반영.

#### 컨테이너 규격

| 토큰 | 값 | 비고 |
|---|---|---|
| `--page_max` | 1680px | 콘텐츠 폭. 1920에서 좌우 마진 120px |
| `--container_max` | `page_max + gutter*2` | 여백이 중앙정렬 마진과 이중 적용되지 않도록 |
| `--text_max` | 1200px | 본문 텍스트 블록 (design-analysis 1200~1280) |
| `--gutter` | 16 / 32 / `clamp(80,6.25vw,120)` | 모바일 / 태블릿 / 데스크톱 |
| `--header_gutter` | 16 / 32 / `clamp(86,6.77vw,130)` | 1920에서 130px |

#### 지정 수치 반영 (1920px 실측)

- header_inner 좌우 마진 **130px**
- 메인 컨테이너 좌우 마진 **120px** (콘텐츠 폭 1680)
- hero_caption 좌측 **100px** / 하단 **100px**
- locator_intro 높이 **660px** 확보 후 section_subtitle로 연결

#### 구조 변경

- 로고를 `assets/image/logo.png`로 교체. **투명 배경 흰색 로고**라 크림 배경(스크롤 헤더·푸터)에서만
  `filter: brightness(0)`으로 반전.
- 모바일(<768) 헤더를 [햄버거] - [로고] - [검색] 3분할로 전환. 드로어/검색은 상호 배타, ESC·바깥 클릭·
  데스크톱 복귀 시 닫힘. `aria-expanded`/`aria-label` 동기화.
- 시안대로 eyebrow + "당신의 평범한 하루에..." + 본문 + CTA를 locator 섹션으로 이동.
  feature 섹션은 "처음이어도 괜찮아, 셔터를 누르는 순간부터" 중앙 헤딩으로 교체.
- archive 좌측 열을 소개글 → 제품 사진 → 특징 목록 세로 스택으로 변경 (기존 2열 → 1열).
  제품 사진 `5/4`, 고양이 `4/3`, 썸네일 `3/2`.
- approach의 Grain/Connection/Creation을 pill 버튼 → 구분선 아래 전체 폭 세리프 텍스트로 변경.
- 섹션 세로 패딩 확대: 데스크톱 140~180px, 태블릿 96~120px, 모바일 48~80px.

#### 이번에 잡은 버그

- `.hero_visual`에 `width`가 없어 `max-height: 90vh`가 **폭까지** 1688px로 줄이고 있었음 →
  `width: 100%` 명시.
- 섹션 컨테이너가 `max-width: page_max` + `padding: gutter`라 1920에서 좌우 여백이
  120이 아니라 **240px**로 이중 적용됨 → `--container_max` 도입.
- 768px에서 헤더가 137px 2줄 → nav 14px/gap 16px, 검색창 150px로 줄여 85px 1줄.

### 세부 수치 · 인터랙션 · 폰트 (2026-07-28)

#### 폰트

- `Pretendard Variable` (jsDelivr CDN) 본문 전역, `Noto Serif KR` (Google Fonts) `--font_serif`로
  브랜드 키워드(Grain/Connection/Creation)에 적용.
- `design-analysis.md` 버튼 명세를 `4~6px` → **캡슐형 `9999px`** 로 갱신 (최종 시안 기준).

#### 지정 수치 (1920 실측)

| 항목 | 값 |
|---|---|
| 헤더 로고 높이 | 52px (태블릿 44 / 모바일 38) |
| 푸터 로고 | 56px, 테두리 제거 |
| 지도 이미지 | **751 x 797** |
| 텍스트 그룹 ↔ CTA 수직 간격 | **170px** (태블릿 90) |
| 피처 타이틀 ↔ 설명/카드 간격 | **250px** (태블릿 140) |
| 갤러리 우측 이미지 | 760px (기존 560) |

1280 구간에서 좌측 텍스트가 눌리지 않도록 두 열 모두 `min(고정폭, 비율)` 상한을 함께 둔다.

#### 인터랙션

- **글자 등장**: `[data-letter_reveal]`를 단어 → 글자 span으로 분해하고 IntersectionObserver 진입 시
  18ms 간격으로 `is_revealed` 부여. `prefers-reduced-motion`이면 즉시 전체 표시.
- **캐러셀 전환**: 스크롤 스냅 방식을 폐기하고 슬라이드를 절대 배치 후 교차 페이드(+미세 scale).
  스냅과 smooth scroll이 충돌해 생기던 튕김이 원천 제거됨. 터치 스와이프는 별도 핸들러로 유지.
- **브랜드 스토리**: Grain/Connection/Creation 버튼 클릭 시 `brandstory1~3.png`로 교차 페이드,
  5초 자동 롤링. hover/focus 중에는 정지, 탭이 백그라운드로 가면 정지.
- 피처 레일은 `overflow-x: auto` 유지하되 `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`
  으로 스크롤바만 숨김 (실측 스크롤바 높이 0px).

#### 모바일 섹션 간격

360px에서 섹션별 `padding: 120px / 140px`, approach `140px / 140px`,
`locator_intro`는 `min-height: 60vh`로 한 화면에 한 섹션이 들어오도록 확장.

### 컴포넌트 규격 · 가로 스크롤 · 슬라이더 (2026-07-28)

| 항목 | 값 |
|---|---|
| Read More 버튼 | 160 x 35 (전 브레이크포인트) |
| 갤러리 메인 이미지 | `aspect-ratio: 362 / 352` — 1920에서 760x739, 768에서 366x356 |
| CTA 버튼 좌우 간격 | 16px → **32px** (768 이상) |
| 브랜드 스토리 높이 | 360:787 / 768:1145 / 1920:1670 을 `clamp()` 선형 보간 |

- 브랜드 스토리 배경을 `21.brand1.jpg` / `22.brand2.png` / `23.21.brand3.png`로 교체.
  딤 처리(`rgba(40,45,42,0.45)`)와 키워드 텍스트는 유지.
- 아카이브 우측을 슬라이더로 전환. 프레임 5장(대표 고양이 + 썸네일 4장)을 `<` `>` 버튼이 순환하고,
  썸네일 클릭으로 직접 이동. 활성 썸네일은 앰버 아웃라인.
- 갤러리 캐러셀 `<` `>` 를 **순환(Loop)** 으로 변경 (끝에서 disabled 되던 로직 제거).

#### 피처 레일 가로 스크롤

- `overflow-x: auto` + `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` (스크롤바 높이 0px)
- `wheel` 핸들러로 세로 휠 → 가로 스크롤 매핑. 레일 양 끝에서는 `preventDefault`를 하지 않아
  페이지 세로 스크롤로 자연스럽게 넘어간다.
- Pointer 드래그 지원 (`is_draggable` / `is_dragging` 커서, 드래그 후 클릭은 취소).
- **`scroll-snap-type: x proximity`를 제거**했다. 스냅이 휠/드래그로 이동한 위치를 즉시 0으로
  되감아 "가로 스크롤이 안 되는" 증상의 직접 원인이었다.

#### 글자 등장 보강

`threshold: 0.25` → `0.01` + `rootMargin: '0px 0px -12% 0px'`.
문장이 뷰포트보다 길면 0.25에 도달하지 못해 트리거되지 않던 문제를 해소.

### 모바일 문구 축약 · 순서 교정 · 하단 정렬 (2026-07-28)

#### 구조 오류 수정

`</main>`이 히어로 섹션 직후와 approach 섹션 뒤 **두 번** 있어, locator 이하 모든 섹션이 `<main>` 밖으로
빠져 있었다. 앞쪽 `</main>`을 제거해 `main` 1개로 정리.

#### 브레이크포인트별 문구 교체

`.only_desktop` / `.only_mobile` 유틸리티 도입. `display: none`이라 스크린리더도 한쪽만 읽는다.

| 위치 | 모바일 문구 |
|---|---|
| `.locator_body` | "필름이 가진 특유의 결을 ... 전문 현상소에 맡겨보세요." (2줄) |
| `.feature_text` | "필름로그는 자판기를 통한 ... 모든 서비스를 제공합니다." (영문 문단은 모바일에서 숨김) |
| `.approach_heading p` | "당신의 소중한 찰나가 온전한 추억으로 머물 수 있도록." |
| `.approach_detail` | 3문단 → 1문단 축약 |

#### 모바일 로케이터 순서

`.locator_actions`를 `.locator_text` 밖으로 빼내 `.locator_layout`의 직계 자식으로 변경.

- 모바일: `order`로 텍스트(1) → 지도(2) → CTA(3)
- 768 이상: 명시적 `grid-column` / `grid-row`로 좌측 열에 텍스트 + CTA, 우측 열에 지도가 2행에 걸침
- 모바일 CTA는 `max-width: 260px` + 가운데 정렬 (전체 폭 → 260px)

#### 브랜드 스토리 하단 정렬 + 모바일 787px

- `.approach_section`을 `align-items: stretch`, `.approach_content`를 `flex: 1` 세로 flex로 두고
  `.approach_detail`에 `margin-top: auto` → 설명 텍스트와 Read More가 항상 하단에 붙는다.
- 미디어쿼리의 `.approach_detail { margin-top }` 4곳을 `padding-top`으로 변경 (margin이면 auto를 덮어씀).
- `.approach_content`에 걸려 있던 `min-height: inherit`가 패딩과 합쳐져 모바일 높이를 963px로
  부풀리고 있었다. 제거 후 **정확히 787px**.

#### 태블릿 히어로

`.hero_content`가 768 구간에서 `top: header+40px`으로 상단 고정이던 것을 `bottom: 64px` 하단 고정으로 변경.

### 마퀴 · sticky 스택 · 문구 JS 통합 (2026-07-28)

#### 피처 카드: 브레이크포인트별 완전히 다른 인터랙션

| 구간 | 동작 |
|---|---|
| ≥768 | 무한 자동 가로 스크롤(마퀴). `main.js`가 카드 5장을 한 벌 복제해 붙이고 원본 세트 폭을 `--marquee_shift`로 넣는다. `translate3d(-shift)` 지점에서 복제본 1번이 원본 1번 자리에 오므로 이음매가 없다. 속도 55px/s, hover·focus-within 시 `animation-play-state: paused`. |
| <768 | `position: sticky` + z-index 1~5 스택. 스크롤하면 카드가 차곡차곡 포개지고 올리면 벗겨진다. |

- 복제본은 `aria-hidden="true"` + 내부 링크 `tabindex="-1"`, 모바일에서는 `display: none`.
- 기존 휠/드래그 가로 스크롤 로직(`initFeatureRail`)은 마퀴로 대체되어 **삭제**했다.
- 모바일 스크롤 미동작 원인이었던 `overflow-x: auto` + 포인터 드래그 핸들러를 제거하고
  `.feature_cards`를 `display: block` + `touch-action: pan-y`로 되돌렸다.

#### 문구 JS 통합

`.only_desktop` / `.only_mobile` 이중 마크업을 제거. HTML에는 데스크톱 문구 한 벌만 두고
`data-text_mobile` 속성에 모바일 문구를 담아 `initResponsiveText()`가 `matchMedia('(min-width: 768px)')`
변화에 따라 `textContent`를 교체한다. 값이 빈 문자열이면 모바일에서 `hidden` 처리.
JS가 실패해도 데스크톱 문구가 그대로 남아 degrade된다.

#### 그 외

- 아카이브 좌우 열 하단 라인 정렬: `.archive_grid { align-items: stretch }`,
  `.archive_side_main { flex: 1 }`, `.archive_stage`는 데스크톱에서 `aspect-ratio: auto` +
  `height: 100%`로 좌측 READ MORE 하단선까지 늘어난다 (1920 실측 delta **0px**, stage 847px).
- 히어로 `aspect-ratio` `1920/1024` → **`4/3`** (1920에서 960px), `max-height: min(96vh, 1100px)`.
  `<video>`는 `object-fit: cover` + `width/height: 100%` 유지.
- Read More: 모바일 160x35 / 태블릿 190x48 / 데스크톱 210x54. flex 컬럼에서 늘어나지 않도록
  `align-self: flex-start` + `width: fit-content`.
- CTA 2개: `flex-wrap: nowrap` + `flex: 1 1 0` + `white-space: nowrap`으로 해상도가 낮아져도
  나란히 유지되며 폭만 줄어든다.

### GNB 간격 · 지도 중복 제거 · 카드 버튼 정렬 (2026-07-28)

- **GNB**: `.global_nav`에 `flex: 1` + `justify-content: space-evenly`를 줘 로고와 검색창 사이 남는
  폭을 모두 쓰게 했다. 1920 기준 nav 폭 **480px → 1244px**, 항목 간격 147px.
  1280 이상은 `gap: 40px` + 좌우 `padding: 40px`. 모바일은 기존 햄버거 드로어 그대로.
- **지도 중복 카드 제거**: 지도 목업 PNG에 지점 안내 카드가 이미 그려져 있는데 `.location_panel`이
  바깥에 한 벌 더 렌더링되고 있었다. 마크업과 관련 CSS(`.location_panel`, `.link_button`)를 삭제.
  `.map_content`의 자식은 지도 하나만 남는다.
- **카드 READ MORE 하단 고정**: `.feature_card_body`에 `flex: 1`,
  `.feature_card_body .read_more`에 `margin-top: auto`. 본문 `min-height: calc(1.6em * 3)`으로
  본문 시작선도 맞춘다. 1920/768에서 5장 모두 카드 하단 오프셋 0px, 360에서 20px(카드 패딩)로 균일.
- **갤러리 이미지 폭**: `.gallery_layout`을 아카이브와 동일한
  `minmax(0, 0.62fr) minmax(0, 1fr)` + `gap: 60px`로 맞췄다. 1920에서 두 섹션 우측 이미지 폭 모두 **1000px**.
  태블릿/모바일은 기존 비율 유지.

### GNB 재조정 · 타이포 스케일 · 지도 오버레이 복원 (2026-07-30)

- **GNB**: `flex: 1` + `space-evenly`(1244px 확산)를 되돌려 `flex: 0 1 auto` + `margin: 0 auto` +
  `justify-content: center`로 중앙 집중. 1920 기준 nav 폭 496px / 항목 간격 34px, 768은 26px.
- **타이포 스케일**: `--font_xsmall / --font_small / --font_body / --font_lead`를 도입하고
  브레이크포인트마다 한 단계씩 올린다. 본문 계열 20여 개 규칙이 이 토큰을 참조한다.

  | 토큰 | 360 | 768 | 1280+ |
  |---|---|---|---|
  | `--font_xsmall` | 13 | 14 | 15 |
  | `--font_small` | 15 | 16 | 17 |
  | `--font_body` | 16 | 17 | 18 |
  | `--font_lead` | 18 | 20 | 22 |

- **지도 카드**: 배경을 `assets/image/map.png`(오버레이 없는 순수 지도)로 교체하고
  `.map_background`로 절대 배치. 그 위에 실제 HTML 요소를 오버레이했다.
  - 지점 뱃지 4개 (`.map_badge_cluster/point/east/south`) — 모두 `<button>`, `aria-label` 부여
  - `.location_panel` — 지점명/주소/영업시간 + `.stock_toggle` 버튼(`aria-expanded="false"`,
    추후 하얀 박스 확장 인터랙션 연결 지점)
  - `.map_locate` — 우측 하단 현재 위치 아이콘 버튼
  - 정보가 HTML로 존재하므로 배경 이미지는 `alt=""` 장식 처리
  - 3개 브레이크포인트 모두 오버레이 요소가 지도 영역 안에 들어감을 실측 확인

### 시안 실측 기반 여백·마커 보정 (2026-07-30)

#### 측정 방법

`데스크탑_최종.png`(3840x20414 = 1920 CSS px @2x)를 캔버스에 그려 40px 간격으로 가로 스캔,
크림 배경이 아닌 픽셀의 좌우 끝을 찾아 콘텐츠 밴드를 뽑았다. `2.map.png`는 1:1로 렌더해 마커를 직접 측정.

#### 컨테이너 좌우 마진

시안 실측 좌측 마진: locator 99px / gallery 96px / archive 135px / footer 174px → 기준 **약 100px**.
`--gutter`를 `clamp(80,6.25vw,120)` → `clamp(67px, 5.2vw, 100px)`로 좁히고,
컨테이너 상한에 걸려 마진이 되돌아가지 않도록 `--page_max`를 1680 → **1720px**로 함께 넓혔다.
1920 실측 결과 4개 컨테이너 모두 좌우 **100px / 폭 1720px**.

#### 지도 마커 (2.map.png 실측 → 비율 변환)

`.map_image_wrapper`에 `container-type: inline-size`를 주고 `cqw`(지도 폭의 1%)로 크기를 잡았다.
지도가 작아질 때 판독 불가가 되지 않도록 `max()`로 하한을 둔다.

| 마커 | 원본 지름 | 원본 중심 | CSS |
|---|---|---|---|
| cluster "2" | 80px | 31.3%, 20.0% | `max(30px, 5.33cqw)` |
| point "1" (노랑) | 54px | 37.9%, 21.2% | `max(22px, 3.6cqw)` |
| east "1" | 52px | 46.2%, 19.2% | `max(21px, 3.46cqw)` |
| south "1" | 52px | 37.5%, 25.7% | `max(21px, 3.46cqw)` |

1920(지도 751px)에서 40/27/26/26px, 중심 좌표는 시안과 소수점까지 일치.
태블릿 이하에서는 하한이 걸려 중심이 최대 2%p 밀린다(판독성 우선).

#### 세로 여백 - 측정 결과 기록

시안 전체 높이 **10,207px**, 현재 페이지 **8,889px**로 이미 시안보다 짧다.
그럼에도 체감 지적이 있어 데스크톱 섹션 패딩을 140/160 → **118/136**,
태블릿을 96/112 → **80/96**으로 약 15% 줄였다. 더 줄이면 시안과의 괴리가 커진다.

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
