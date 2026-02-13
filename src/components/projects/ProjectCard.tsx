import Link from "next/link";
import Image from "next/image";
import TechBadge from "./TechBadge";
import type { ProjectMeta } from "@/types/content";
import { SITE_CONFIG } from "@/lib/constants";

const statusLabels: Record<string, { text: string; color: string }> = {
  completed: { text: "완료", color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  "in-progress": { text: "진행 중", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  planned: { text: "계획", color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" },
};

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  const status = statusLabels[project.status] ?? statusLabels.completed;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all"
    >
      {project.thumbnail ? (
        <div className="aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <Image
            src={`${SITE_CONFIG.basePath}${project.thumbnail}`}
            alt={project.title}
            width={600}
            height={338}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 flex items-center justify-center">
          <span className="text-4xl opacity-50">{project.category === "Backend" ? "{ }" : "</>"}</span>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
            {status.text}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{project.category}</span>
        </div>

        <h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {project.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.aiTools.map((tool) => (
            <TechBadge key={tool} name={tool} isAiTool />
          ))}
          {project.techStack.slice(0, 3).map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
          {project.techStack.length > 3 && (
            <span className="text-xs text-gray-400 self-center">+{project.techStack.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
