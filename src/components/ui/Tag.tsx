interface TagProps {
  label: string;
  variant?: "default" | "blue" | "green" | "amber";
  size?: "sm" | "md";
}

const variants = {
  default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
  green: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300",
  amber: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
};

export default function Tag({ label, variant = "default", size = "sm" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      {label}
    </span>
  );
}
