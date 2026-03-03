# Security Rules — ai-portfolio

## Frontend Security
- `dangerouslySetInnerHTML` 사용 금지
- MDX 렌더링은 `next-mdx-remote`의 안전한 파이프라인 사용
- 외부 링크: `rel="noopener noreferrer"` 필수

## Environment Variables
- `NEXT_PUBLIC_*` 접두사 변수는 클라이언트에 노출됨 — 민감 정보 포함 금지
- Analytics URL만 `NEXT_PUBLIC_ANALYTICS_URL`로 허용

## Static Site
- 정적 export이므로 서버 사이드 보안 이슈는 제한적
- 빌드 시점의 환경변수만 사용됨 (런타임 변수 없음)
- GitHub Pages 배포: HTTPS 자동 적용
