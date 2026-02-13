import ProjectCard from "./ProjectCard";
import type { ProjectMeta } from "@/types/content";

export default function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-12">
        아직 프로젝트가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
