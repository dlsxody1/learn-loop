import { useState } from "react";
import type { Problem, Solution } from "@learnloop/core";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { CategoryBadge, DifficultyBadge, Tag } from "./ui/Badge";
import { SolutionEditor } from "./SolutionEditor";

interface ProblemCardProps {
  problem: Problem;
  solution?: Solution;
  onSave: (s: Solution) => Promise<void>;
}

export function ProblemCard({ problem, solution, onSave }: ProblemCardProps) {
  const [editing, setEditing] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSave = async (s: Solution) => {
    await onSave(s);
    setEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CategoryBadge category={problem.category} />
        <DifficultyBadge level={problem.difficulty} />
        {solution && (
          <span className="ml-auto text-[12px] tracking-[-0.12px] text-action">
            ✓ 저장됨
          </span>
        )}
      </div>

      <h3 className="text-[21px] font-semibold tracking-[-0.374px]">{problem.title}</h3>
      <p className="mt-2 whitespace-pre-line text-[17px] leading-relaxed text-ink-80">
        {problem.prompt}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {problem.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      {problem.hint && (
        <div className="mt-4">
          <button
            onClick={() => setShowHint((v) => !v)}
            className="press text-[14px] text-action hover:opacity-80"
          >
            {showHint ? "힌트 접기 ›" : "힌트 / 핵심 포인트 보기 ›"}
          </button>
          {showHint && (
            <p className="mt-2 rounded-[8px] bg-parchment p-3 text-[15px] leading-relaxed text-ink-80">
              {problem.hint}
            </p>
          )}
        </div>
      )}

      {editing ? (
        <SolutionEditor
          problem={problem}
          existing={solution}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="mt-4">
          <Button variant={solution ? "secondary" : "primary"} onClick={() => setEditing(true)}>
            {solution ? "풀이 수정하기" : "풀이 시작하기"}
          </Button>
        </div>
      )}
    </Card>
  );
}
