export const SITE_CONFIG = {
  title: "AI Portfolio",
  description: "AI와 함께한 프로젝트와 작업 일지를 기록하는 포트폴리오",
  url: "https://username.github.io/ai-portfolio",
  basePath: "/ai-portfolio",
  author: {
    name: "Developer",
    email: "",
    github: "https://github.com/username",
  },
  nav: [
    { label: "홈", href: "/" },
    { label: "프로젝트", href: "/projects" },
    { label: "블로그", href: "/blog" },
    { label: "소개", href: "/about" },
  ],
} as const;
