import type { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "소개",
  description: "AI와 함께 성장하는 개발자 소개",
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-8">소개</h1>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          AI 도구를 적극 활용하여 효율적으로 개발하는 것을 지향하는 개발자입니다.
        </p>

        <h2>AI 도구 활용</h2>
        <p>
          Claude Code, GPT 등 AI 도구를 일상적인 개발 워크플로우에 통합하여 사용하고 있습니다.
          단순한 코드 생성을 넘어, 설계 논의와 코드 리뷰, 문서화까지 다양한 영역에서 활용합니다.
        </p>

        <h2>기술 스택</h2>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
          {[
            { category: "Backend", items: ["Java", "Spring Boot", "Spring Batch", "MyBatis"] },
            { category: "Frontend", items: ["Next.js", "TypeScript", "Tailwind CSS", "React"] },
            { category: "DevOps", items: ["Docker", "GitHub Actions", "PostgreSQL", "Gradle"] },
          ].map((group) => (
            <div key={group.category} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">
                {group.category}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2>이 사이트에 대해</h2>
        <p>
          이 포트폴리오 사이트는 Next.js 15, Tailwind CSS, MDX로 구축되었으며,
          GitHub Pages에 정적 사이트로 배포됩니다.
          사이트 자체도 Claude Code와의 협업으로 만들어졌습니다.
        </p>
      </div>
    </Container>
  );
}
