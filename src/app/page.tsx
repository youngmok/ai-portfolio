import Container from "@/components/layout/Container";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import RecentPosts from "@/components/home/RecentPosts";
import { getFeaturedProjects, getAllPosts } from "@/lib/content";

export default function HomePage() {
  const projects = getFeaturedProjects();
  const posts = getAllPosts().slice(0, 3);

  return (
    <Container>
      <HeroSection />
      <FeaturedProjects projects={projects} />
      <RecentPosts posts={posts} />
    </Container>
  );
}
