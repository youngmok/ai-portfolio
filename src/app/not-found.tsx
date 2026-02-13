import Link from "next/link";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </Container>
  );
}
