import Container from "./Container";
import { SITE_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.author.name}. Built with AI.</p>
          <div className="flex items-center gap-4">
            <a
              href={SITE_CONFIG.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              GitHub
            </a>
            <a
              href="/rss.xml"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              RSS
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
