import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Tag from "@/components/ui/Tag";
import BackToTop from "@/components/ui/BackToTop";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const content = await renderMdx(post.content);

  return (
    <Container className="py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
      >
        &larr; 블로그 목록
      </Link>

      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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

        <h1 className="text-3xl sm:text-4xl font-bold">{post.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{post.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {post.aiTools.map((tool) => (
            <Tag key={tool} label={tool} variant="blue" />
          ))}
          {post.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        {post.relatedProject && (
          <Link
            href={`/projects/${post.relatedProject}`}
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            관련 프로젝트 보기 &rarr;
          </Link>
        )}
      </header>

      <article className="prose prose-gray dark:prose-invert max-w-none">
        {content}
      </article>

      <BackToTop />
    </Container>
  );
}
