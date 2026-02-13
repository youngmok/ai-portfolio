interface TechBadgeProps {
  name: string;
  isAiTool?: boolean;
}

export default function TechBadge({ name, isAiTool = false }: TechBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isAiTool
          ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      }`}
    >
      {isAiTool && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 2.607a1 1 0 01-1.664 1.11l-1.503-2.255-2.785 1.115V12a1 1 0 11-2 0v-1.912L7.215 8.974l-1.502 2.255a1 1 0 11-1.664-1.11l1.738-2.607-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1z" />
        </svg>
      )}
      {name}
    </span>
  );
}
