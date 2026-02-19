import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL = "https://youngmok.github.io/ai-portfolio";
const CONTENT_DIR = path.join(process.cwd(), "content");

function getMdxSlugs(dir) {
  const fullDir = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullDir)) return [];
  return fs.readdirSync(fullDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(fullDir, f), "utf-8");
      const { data } = matter(raw);
      return {
        slug: f.replace(/\.mdx$/, ""),
        lastmod: data.lastUpdated || data.date || new Date().toISOString().split("T")[0],
      };
    });
}

const staticPages = [
  { url: "/", priority: "1.0" },
  { url: "/projects/", priority: "0.9" },
  { url: "/blog/", priority: "0.9" },
  { url: "/about/", priority: "0.7" },
];

const projects = getMdxSlugs("projects");
const posts = getMdxSlugs("blog");

const urls = [
  ...staticPages.map((p) => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <priority>${p.priority}</priority>
  </url>`),
  ...projects.map((p) => `  <url>
    <loc>${BASE_URL}/projects/${p.slug}/</loc>
    <lastmod>${p.lastmod}</lastmod>
    <priority>0.8</priority>
  </url>`),
  ...posts.map((p) => `  <url>
    <loc>${BASE_URL}/blog/${p.slug}/</loc>
    <lastmod>${p.lastmod}</lastmod>
    <priority>0.8</priority>
  </url>`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
console.log("sitemap.xml generated!");
