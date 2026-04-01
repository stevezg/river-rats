import { getDifficultyColor, getDifficultyBg } from "@/lib/utils";
import type { DifficultyClass } from "@riverrats/shared";

interface Props {
  difficulty: DifficultyClass;
  size?: "sm" | "md" | "lg";
  inline?: boolean;
}

export default function DifficultyBadge({ difficulty, size = "md", inline = false }: Props) {
  const color = getDifficultyColor(difficulty);
  const bg = getDifficultyBg(difficulty);

  if (inline) {
    return (
      <span className="text-xs font-medium" style={{ color }}>
        Class {difficulty}
      </span>
    );
  }

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
