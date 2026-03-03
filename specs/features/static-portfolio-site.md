# Feature: 정적 포트폴리오 사이트

## 개요
AI와 함께 개발한 프로젝트들을 MDX 기반으로 기록하는 정적 포트폴리오 + 블로그 웹사이트. GitHub Pages에 배포한다.

## 수용 기준

### 홈페이지 (/)
- [ ] 히어로 섹션에 소개 메시지와 CTA 버튼을 표시한다
- [ ] 주요 프로젝트를 FeaturedProjects 컴포넌트로 하이라이트한다
- [ ] 최근 블로그 포스트 3개를 RecentPosts로 표시한다

### 프로젝트 갤러리 (/projects)
- [ ] 전체 프로젝트를 카드 그리드로 표시한다
- [ ] 각 카드에 제목, 설명, 기술 스택 배지를 포함한다
- [ ] 카드 클릭 시 프로젝트 상세 페이지(/projects/[slug])로 이동한다

### 프로젝트 상세 (/projects/[slug])
- [ ] MDX 콘텐츠를 렌더링한다 (코드 하이라이팅 포함)
- [ ] 기술 스택, 상태, 카테고리 메타 정보를 표시한다
- [ ] GitHub 링크 버튼을 제공한다

### 블로그 (/blog)
- [ ] 전체 블로그 포스트를 날짜순으로 정렬하여 표시한다
- [ ] 각 포스트에 제목, 날짜, 태그, 읽기 시간을 포함한다
- [ ] 블로그 상세 페이지(/blog/[slug])에서 MDX를 렌더링한다

### 경력 (/career)
- [ ] 아코디언 UI로 경력 정보를 표시한다
- [ ] 각 경력에 기간, 직책, 주요 업무를 포함한다

### 소개 (/about)
- [ ] 개인 소개 및 기술 역량을 표시한다

### 공통 기능
- [ ] 다크 모드를 지원한다 (시스템 설정 자동 감지)
- [ ] 반응형 레이아웃 (모바일/태블릿/데스크톱)
- [ ] SEO: 페이지별 메타데이터, sitemap.xml 자동 생성
- [ ] BackToTop 버튼으로 상단 이동

## 기술 제약
- Next.js 16 App Router, `output: "export"` (정적 HTML)
- `basePath: "/ai-portfolio"` (GitHub Pages 서브 경로)
- MDX: gray-matter(frontmatter) + next-mdx-remote(렌더링)
- 코드 하이라이팅: rehype-pretty-code + shiki (빌드 타임)
- 이미지 최적화 비활성화 (`unoptimized: true`)
- 배포: GitHub Actions → `out/` → GitHub Pages
