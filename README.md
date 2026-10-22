# 김유리 — Yuri Kim (glass.gkim) Portfolio & Archive

A minimal editorial artist portfolio and archive web application designed in the contemporary art catalogue style (modern minimalism / artist dossier format).

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4 + PostCSS**, and pure Swiss typography.

---

## 🧭 Desktop 3-Column Editorial Split Layout & 4-Tier Navigation

The application organizes all content through a centralized data schema (`src/data/data.ts`) and renders a 3-column split view (Desktop) with responsive 1-column mobile stacking:

### 1. Left Column: Navigation / Sidebar (Fixed & Sticky)
- **1. CV**:
  - `- Curriculum Vitae`: Active inverted state (`bg-black text-white px-2 py-0.5 inline-block`).
- **2. 작업 (Works)**:
  - `- 두 명을 위한 접기 (Folding for Two)`
  - `- 자동차1의 접이식 엔진1 (Folding Engine 1 of Car 1)`
  - `- 손가락과 머리 위 (Above Fingers and Heads)`
  - `- 가볍고 두꺼운 (Light and Thick)`
  - `- 가볍고 두꺼운 2 (Light and Thick 2)`
  - `- 룰 북 (Rule Book)`
- **3. 프로젝트 (Projects)**:
  - `- 인천아트플랫폼 기획대관 전시 — <눈자리나게, 이어> (Incheon Art Platform Exhibition — <Lingering Traces Linked>)`
  - `- 국제 예술·문화 교류 레지던시 — 《Beyond Stage 2026》 (International Arts & Cultural Exchange Residency — 《Beyond Stage 2026》)`
  - `- 현대미술 갤러리 아카이빙 & 공간 기록 — 《Gallery 175》 (Contemporary Art Gallery Archiving & Spatial Documentation — 《Gallery 175》)`
- **4. External Contacts / Links (Non-State-Breaking Action Triggers)**:
  - `email`: Copies `glass.gkim@gmail.com` to the clipboard with temporary feedback badge ("Copied!") and mailto fallback. Does not alter active view selection.
  - `instagram`: Opens `@sarrg_` in a new tab (`target="_blank" rel="noopener noreferrer"`). Does not alter active view selection.
  - Location indicator: `서울, 대한민국 / Seoul, Republic of Korea`.

---

### 2. Center Column: Text & Details
- **When CV is active**:
  - Artist Name: `김유리` / `Yuri Kim` (Bilingual)
  - Statement & Biography: Korean paragraphs and English paragraphs with generous line heights (`leading-[1.85]`).
  - Education, Research, Location, and Direct contact specifications.
- **When a Work is active**:
  - Title & Year: `[한글 제목] [English Title], [Year]`
  - Detailed Specifications (상세 제원): Year, Medium/Format, Dimensions, Duration, Role, Context in bilingual tabular alignment.
  - Artist Notes & Description: Korean overview block and English translation block.
- **When a Project is active**:
  - Title: `[프로젝트 제목] [English Title]`
  - Details: Period (`기간 / Period`), Role (`역할 / Role`), Context (`협력 / Context`).
  - Project Overview: Korean project essay and English curatorial record.

---

### 3. Right Column: Media / History
- **When CV is active**:
  - Artist portrait & studio documentation marquee stream.
  - Chronological exhibition and career history (연도 역순, 한/영 병기):
    - `Selected Exhibitions & Curatorial (전시 및 기획)`
    - `Professional Experience (실무 및 기관 이력)`
    - `Stage & Collaborations (무대 기술 및 기타 협업)`
    - `Education & Research (학력 및 연구)`
- **When a Work is active**:
  - Vertical stack of high-resolution stills, installation views, and detail captures with generous vertical margins.
  - Each media item includes bilingual captions in Korean and English.
- **When a Project is active**:
  - Project archive documentation photos & installation views with bilingual captions.
  - Official website / catalog link button (`[ 관련 공식 아카이브 링크 ↗ ]`) opening the project's external record.

---

## 📱 Responsive & Mobile Behavior
- On screens `< 768px`, smoothly collapses into a 1-column stack (Top Navigation -> Text & Details -> Media / History) with instant zero-reload state switching.

---

## 💻 Local Execution & Direct URL Routes

```bash
cd portfolio

# Development mode
npm run dev

# Optimized production build & start
npm run build
npm run start -- -p 3000
```

### Direct Route Quick Links:
- **CV View (Default)**: [http://localhost:3000/ko?tab=cv](http://localhost:3000/ko?tab=cv)
- **Work 1: Folding for Two**: [http://localhost:3000/ko?work=folding-for-two](http://localhost:3000/ko?work=folding-for-two)
- **Work 2: Folding Engine 1 of Car 1**: [http://localhost:3000/ko?work=folding-engine-1-car-1](http://localhost:3000/ko?work=folding-engine-1-car-1)
- **Work 3: Above Fingers and Heads**: [http://localhost:3000/ko?work=above-fingers-and-heads](http://localhost:3000/ko?work=above-fingers-and-heads)
- **Work 4: Light and Thick**: [http://localhost:3000/ko?work=light-and-thick](http://localhost:3000/ko?work=light-and-thick)
- **Work 5: Light and Thick 2**: [http://localhost:3000/ko?work=light-and-thick-2](http://localhost:3000/ko?work=light-and-thick-2)
- **Work 6: Rule Book**: [http://localhost:3000/ko?work=rule-book](http://localhost:3000/ko?work=rule-book)
- **Project 1: Incheon Art Platform**: [http://localhost:3000/ko?project=incheon-artlab-2026](http://localhost:3000/ko?project=incheon-artlab-2026)
- **Project 2: Beyond Stage 2026**: [http://localhost:3000/ko?project=beyond-stage-2026](http://localhost:3000/ko?project=beyond-stage-2026)
- **Project 3: Gallery 175**: [http://localhost:3000/ko?project=gallery-175-archiving](http://localhost:3000/ko?project=gallery-175-archiving)
- **English Route**: [http://localhost:3000/en](http://localhost:3000/en)

---

## 🛠 Admin / Edit Mode (인라인 편집 및 서버 저장)

1. **관리자 모드 활성화 (Edit Mode Toggle)**:
   - 좌측 사이드바 하단 `Edit (관리)` 버튼 클릭.
   - 보안 인증 패스코드 입력 (기본 패스코드: `2026` 또는 `1234`).
2. **인라인 텍스트 및 미디어 수정**:
   - **CV 뷰**: 작가 국/영문명, 바이오 문단(`+ 문단 추가`, `- 삭제`), 학력 및 연락처 정보, 전시 및 경력 이력(`+ 새 카테고리`, `+ 항목 추가`, `- 삭제`).
   - **작업 (Works)**: 사이드바의 `+ Add`로 새 작업 추가, 제목/연도/제원/설명문 수정, 미디어 이미지 추가/삭제 및 캡션 편집, 작업 삭제.
   - **프로젝트 (Projects)**: `+ Add`로 새 프로젝트 추가, 기간/역할/기관/설명문/링크 수정, 미디어 추가/삭제 및 캡션 편집.
3. **서버 저장 (Save to Server)**:
   - 상단 블랙 상태 바의 `💾 서버에 저장 (Save)` 클릭 시 `POST /api/save-content`를 호출하여 `src/data/content.json`에 영구 저장.
   - 저장 완료 시 미니멀 토스트 알림(`✓ 성공적으로 저장되었습니다.`) 피드백.
   - 정적/오프라인 환경 대비 `localStorage` 자동 백업 및 `JSON 백업` 파일 다운로드 기능 내장.

---

## 📐 Layout & Typography Architecture

- **3열 독립 스크롤 레이아웃 (Independent Column Scroll Layout)**:
  - `html`, `body`에 `height: 100vh; overflow: hidden;`을 적용하여 브라우저 전체 창의 기본 스크롤바를 완전 제거.
  - 화면 좌측(`padding-left: clamp(24px, 3vw, 48px)`)을 기준으로 자연스럽게 뻗어나가는 3단 컬럼 구성:
    - **1열 (좌측 네비게이션)**: `width: clamp(240px, 22vw, 320px);`, `h-screen overflow-y-auto custom-scrollbar` (메뉴 리스트 개별 스크롤)
    - **2열 (중앙 본문/상세)**: `width: clamp(420px, 34vw, 540px);`, `h-screen overflow-y-auto custom-scrollbar` (한 줄당 25~30자의 최적 에디토리얼 도록 규격, 작가 노트/제원 개별 스크롤)
    - **3열 (우측 미디어/전시 이력)**: `flex: 1; min-width: 480px;`, `h-screen overflow-y-auto custom-scrollbar` (미디어 갤러리 및 전시 이력 개별 스크롤)
- **반응형 유동 폰트 (Fluid Typography with clamp)**:
  - **글로벌 폰트 스택**: `-apple-system, BlinkMacSystemFont, "Pretendard", "Helvetica Neue", Arial, sans-serif;`
  - **대제목/섹션 타이틀**: `font-size: clamp(20px, 1.8vw, 24px);`, `font-weight: 700 ~ 800 (Heavy Bold)`, `line-height: 1.25`
  - **부제/영문명/연도**: `font-size: clamp(16.5px, 1.3vw, 18.5px);`, `font-weight: 700`, `line-height: 1.35`
  - **기본 본문 텍스트 (Base Body Text)**: `font-size: clamp(16px, 1.15vw, 17.5px);` (16px 미만 폰트 전면 제거), 본문 `font-normal ~ font-medium`, 키워드 `font-bold`
  - **행간 및 자간**: `line-height: 1.65`, `letter-spacing: -0.015em`
  - **문단 간 여백 (Fluid Paragraph Gap)**: `margin-bottom: clamp(24px, 2.5vw, 32px);`
  - **색상**: 완전한 칠흑색 (`#000000`)
  - **액티브 박스 패딩 보정**: 폰트 크기에 맞춰 인라인 하이라이트 박스 여백(`padding: 2px 6px`) 및 줄바꿈 복제(`-webkit-box-decoration-break: clone; box-decoration-break: clone;`) 정렬


