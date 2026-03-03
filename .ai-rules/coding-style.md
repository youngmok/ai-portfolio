# Coding Style Rules — ai-portfolio

## TypeScript / React Conventions
- TypeScript strict 모드
- 컴포넌트: 함수형 + 훅 패턴 (클래스 컴포넌트 금지)
- Props 타입: `interface *Props {}` 패턴
- `any` 타입 사용 금지 → 구체적 타입 정의

## Next.js App Router
- 페이지: `app/*/page.tsx`
- 레이아웃: `app/*/layout.tsx`
- 정적 export: `output: "export"` (Route Handler, Server Actions 사용 불가)
- 이미지: `unoptimized: true` (정적 배포 제약)

## Styling
- Tailwind CSS 4 유틸리티 클래스만 사용
- 인라인 스타일 (`style={}`) 금지
- 다크 모드: `dark:` 접두사 활용 (next-themes 연동)

## Content (MDX)
- 프로젝트: `content/projects/*.mdx`
- 블로그: `content/blog/*.mdx`
- Frontmatter 필수 필드: slug, title, description, date
- 새 콘텐츠 추가 시 `generate-sitemap.mjs`가 자동 반영

## Component Organization
```
src/components/
├── blog/       # 블로그 관련 (PostCard, PostList)
├── home/       # 홈페이지 섹션 (HeroSection, FeaturedProjects)
├── layout/     # 레이아웃 (Header, Footer, Container)
├── projects/   # 프로젝트 관련 (ProjectCard, ProjectGrid)
└── ui/         # 범용 UI (ThemeToggle, Tag, BackToTop)
```
