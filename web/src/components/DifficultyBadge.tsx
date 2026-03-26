import { getDifficultyColor, getDifficultyBg } from "@/lib/utils";
import type { DifficultyClass } from "@/lib/mock-data";

interface Props {
  difficulty: DifficultyClass;
  size?: "sm" | "md" | "lg";
}

export default function DifficultyBadge({ difficulty, size = "md" }: Props) {
  const color = getDifficultyColor(difficulty);
  const bg = getDifficultyBg(difficulty);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
      style={{ color, backgroundColor: bg, border: `1px solid ${color}30` }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, backgroundColor: color, flexShrink: 0 }}
      />
      Class {difficulty}
    </span>
  );
}
