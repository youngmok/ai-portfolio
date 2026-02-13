export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  techStack: string[];
  aiTools: string[];
  category: string;
  featured: boolean;
  status: "completed" | "in-progress" | "planned";
  githubUrl?: string;
  liveUrl?: string;
  startDate: string;
  lastUpdated: string;
  content: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  aiTools: string[];
  thumbnail?: string;
  published: boolean;
  relatedProject?: string;
  readingTime: string;
  content: string;
}

export type ProjectMeta = Omit<Project, "content">;
export type BlogPostMeta = Omit<BlogPost, "content">;
