import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PostList from "@/components/blog/PostList";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "블로그",
  description: "AI와 함께하는 개발 일지와 기술 포스트",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">블로그</h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI와 함께하는 개발 여정을 기록합니다.
        </p>
      </div>
      <PostList posts={posts} />
    </Container>
  );
}
