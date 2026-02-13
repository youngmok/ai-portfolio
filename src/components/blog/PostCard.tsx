import Link from "next/link";
import Tag from "@/components/ui/Tag";
import type { BlogPostMeta } from "@/types/content";

export default function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>

      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {post.title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {post.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {post.aiTools.map((tool) => (
          <Tag key={tool} label={tool} variant="blue" />
        ))}
        {post.tags.slice(0, 3).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </Link>
  );
}
