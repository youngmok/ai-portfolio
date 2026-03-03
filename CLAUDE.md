# AI Portfolio

## Language Requirement
모든 설명과 상호작용은 **한국어**(Korean)로 합니다. 코드 주석과 변수명은 영어.

## Project Overview
AI와 함께한 개발 프로젝트를 기록하는 정적 포트폴리오 + 블로그 웹사이트. MDX 기반 콘텐츠 관리, GitHub Pages 배포.

**배포 URL**: https://youngmok.github.io/ai-portfolio

**참고**: ai-portfolio-mono(Turborepo 모노레포)의 선행 프로젝트이며, 현재도 독립적으로 활성 운영 중입니다.

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router, 정적 export)
- **UI**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5 (strict mode)
- **Content**: MDX + gray-matter (YAML frontmatter)
- **코드 하이라이팅**: rehype-pretty-code + shiki
- **테마**: next-themes (다크모드)
- **배포**: GitHub Pages (GitHub Actions)
- **Port**: 3000 (개발 서버)

## Build & Run Commands
```bash
npm install
npm run dev           # 개발 서버 (포트 3000)
npm run build         # 정적 빌드 (prebuild → sitemap 생성 → next build → out/)
npm run lint          # ESLint 검사
```

## Project Structure
```
ai-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈 (히어로 + 프로젝트 + 최근 포스트)
│   │   ├── about/page.tsx      # 소개
│   │   ├── career/page.tsx     # 경력
│   │   ├── blog/[slug]/page.tsx    # 블로그 상세
│   │   └── projects/[slug]/page.tsx # 프로젝트 상세
│   ├── components/             # React 컴포넌트 (31개)
│   ├── lib/
│   │   ├── analytics.ts        # Analytics 추적 (portfolio-analytics 연동)
│   │   ├── constants.ts        # 사이트 설정
│   │   ├── content.ts          # MDX 파일 파싱
│   │   └── mdx.ts              # MDX 렌더링 설정
│   └── types/content.ts        # Project, BlogPost 타입
├── content/
│   ├── projects/               # 프로젝트 MDX (6개)
│   └── blog/                   # 블로그 MDX (10개)
├── public/images/              # 이미지 에셋
├── scripts/generate-sitemap.mjs # 사이트맵 자동 생성
├── out/                        # 정적 빌드 출력
├── next.config.ts              # Next.js 설정 (basePath: /ai-portfolio)
└── .github/workflows/deploy.yml # GitHub Pages 배포
```

## Environment Variables (.env.local)
| 변수 | 필수 | 설명 |
|------|------|------|
| `NEXT_PUBLIC_ANALYTICS_URL` | ❌ | Supabase Analytics 엔드포인트 |

## Key Patterns
- `output: "export"` — 정적 HTML 생성 (Route Handler 사용 불가)
- `basePath: "/ai-portfolio"` — GitHub Pages 서브 경로
- `unoptimized: true` — 이미지 최적화 비활성화 (정적 배포)
- Tailwind `dark:` 유틸리티 — 다크모드 스타일링

## Testing
- 현재 테스트 없음. Vitest + React Testing Library 도입 권장.
