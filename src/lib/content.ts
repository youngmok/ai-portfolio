import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Project, ProjectMeta, BlogPost, BlogPostMeta } from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

// --- Projects ---

export function getAllProjects(): ProjectMeta[] {
  const dir = path.join(CONTENT_DIR, "projects");
  const files = getMdxFiles(dir);

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title ?? "",
        description: data.description ?? "",
        thumbnail: data.thumbnail,
        techStack: data.techStack ?? [],
        aiTools: data.aiTools ?? [],
        category: data.category ?? "",
        featured: data.featured ?? false,
        status: data.status ?? "completed",
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        startDate: data.startDate ?? "",
        lastUpdated: data.lastUpdated ?? "",
      } satisfies ProjectMeta;
    })
    .sort((a, b) => (a.lastUpdated > b.lastUpdated ? -1 : 1));
}

export function getFeaturedProjects(): ProjectMeta[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | null {
  const filePath = path.join(CONTENT_DIR, "projects", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    thumbnail: data.thumbnail,
    techStack: data.techStack ?? [],
    aiTools: data.aiTools ?? [],
    category: data.category ?? "",
    featured: data.featured ?? false,
    status: data.status ?? "completed",
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    startDate: data.startDate ?? "",
    lastUpdated: data.lastUpdated ?? "",
    content,
  };
}

// --- Blog ---

export function getAllPosts(): BlogPostMeta[] {
  const dir = path.join(CONTENT_DIR, "blog");
  const files = getMdxFiles(dir);

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        aiTools: data.aiTools ?? [],
        thumbnail: data.thumbnail,
        published: data.published ?? true,
        relatedProject: data.relatedProject,
        readingTime: readingTime(content).text,
      } satisfies BlogPostMeta;
    })
    .filter((p) => p.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, "blog", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    aiTools: data.aiTools ?? [],
    thumbnail: data.thumbnail,
    published: data.published ?? true,
    relatedProject: data.relatedProject,
    readingTime: readingTime(content).text,
    content,
  };
}
