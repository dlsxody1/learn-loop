import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Difficulty, ProblemCategory } from "@/types";

export function CategoryBadge({ category }: { category: ProblemCategory }) {
  const isAlgo = category === "algorithm";
  return (
    <Pill className={isAlgo ? "bg-ink text-white" : "bg-parchment text-ink"}>
      {isAlgo ? "알고리즘" : "FE 개념"}
    </Pill>
  );
}

const difficultyLabel: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return <Pill className="bg-parchment text-ink-48">{difficultyLabel[level]}</Pill>;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="text-[12px] tracking-[-0.12px] text-ink-48">#{children}</span>
  );
}

function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] tracking-[-0.12px]",
        className,
      )}
    >
      {children}
    </span>
  );
}
