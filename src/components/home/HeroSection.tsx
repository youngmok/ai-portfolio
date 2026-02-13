import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          AI와 함께 만드는
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            개발 이야기
          </span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
          Claude Code, GPT 등 AI 도구와 함께한 프로젝트와 경험을 기록합니다.
          설계부터 구현, 배포까지 — AI 페어 프로그래밍의 모든 것.
        </p>

        <div className="flex gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            프로젝트 보기
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            블로그 읽기
          </Link>
        </div>
      </div>
    </section>
  );
}
