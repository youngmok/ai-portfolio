import Link from "next/link";
import PostList from "@/components/blog/PostList";
import type { BlogPostMeta } from "@/types/content";

export default function RecentPosts({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">최근 글</h2>
        <Link
          href="/blog"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          전체 보기 &rarr;
        </Link>
      </div>
      <PostList posts={posts} />
    </section>
  );
}
