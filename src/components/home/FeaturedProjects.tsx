import Link from "next/link";
import ProjectGrid from "@/components/projects/ProjectGrid";
import type { ProjectMeta } from "@/types/content";

export default function FeaturedProjects({ projects }: { projects: ProjectMeta[] }) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">주요 프로젝트</h2>
        <Link
          href="/projects"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          전체 보기 &rarr;
        </Link>
      </div>
      <ProjectGrid projects={projects} />
    </section>
  );
}
