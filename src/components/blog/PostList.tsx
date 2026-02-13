import PostCard from "./PostCard";
import type { BlogPostMeta } from "@/types/content";

export default function PostList({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-12">
        아직 작성된 글이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
