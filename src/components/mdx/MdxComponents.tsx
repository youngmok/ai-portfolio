import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

function CustomImage({ src, alt }: React.ComponentProps<"img">) {
  if (!src || typeof src !== "string") return null;

  const imgSrc = src.startsWith("/") ? `${SITE_CONFIG.basePath}${src}` : src;

  return (
    <span className="block my-6">
      <Image
        src={imgSrc}
        alt={alt ?? ""}
        width={800}
        height={450}
        className="rounded-lg"
      />
    </span>
  );
}

function CustomLink(props: React.ComponentProps<"a">) {
  const { href, children, ...rest } = props;
  if (!href) return <span {...rest}>{children}</span>;

  if (href.startsWith("/")) {
    return <Link href={href} {...rest}>{children}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Callout({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "tip" }) {
  const styles = {
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200",
    warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200",
    tip: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200",
  };

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      {children}
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  img: CustomImage,
  a: CustomLink,
  Callout,
};
