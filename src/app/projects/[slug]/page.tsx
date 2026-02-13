import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layout/Container";
import TechBadge from "@/components/projects/TechBadge";
import BackToTop from "@/components/ui/BackToTop";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const content = await renderMdx(project.content);

  const statusLabels: Record<string, string> = {
    completed: "완료",
    "in-progress": "진행 중",
    planned: "계획",
  };

  return (
    <Container className="py-12">
      <Link
        href="/projects"
        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
      >
        &larr; 프로젝트 목록
      </Link>

      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium">
            {project.category}
          </span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 dark:text-gray-400">
            {statusLabels[project.status] ?? project.status}
          </span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 dark:text-gray-400">
            {project.startDate} ~ {project.lastUpdated}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold">{project.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.aiTools.map((tool) => (
            <TechBadge key={tool} name={tool} isAiTool />
          ))}
          {project.techStack.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        )}
      </header>

      <article className="prose prose-gray dark:prose-invert max-w-none">
        {content}
      </article>

      <BackToTop />
    </Container>
  );
}
