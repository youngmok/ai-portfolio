import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "프로젝트",
  description: "AI와 함께 만든 프로젝트 갤러리",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <Container className="py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">프로젝트</h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI와 함께 설계하고 구현한 프로젝트들입니다.
        </p>
      </div>
      <ProjectGrid projects={projects} />
    </Container>
  );
}
