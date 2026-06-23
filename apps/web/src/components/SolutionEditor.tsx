import { useState } from "react";
import type { Problem, Solution } from "@learnloop/core";
import { Button } from "./ui/Button";

interface SolutionEditorProps {
  problem: Problem;
  existing?: Solution;
  onSave: (s: Solution) => Promise<void>;
  onCancel: () => void;
}

const LANGUAGES = ["typescript", "javascript", "kotlin", "swift", "text"];

/**
 * 풀이 입력 에디터. 에디터 내부 입력은 로컬 상태로 관리(제어가 적절한 경계).
 * 비즈니스 로직(저장)은 props 콜백으로 위임 — 조합 관심사 분리.
 */
export function SolutionEditor({ problem, existing, onSave, onCancel }: SolutionEditorProps) {
  const [code, setCode] = useState(existing?.code ?? problem.starter ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [language, setLanguage] = useState(
    existing?.language ?? defaultLanguage(problem),
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        id: existing?.id ?? crypto.randomUUID(),
        problemId: problem.id,
        problemTitle: problem.title,
        category: problem.category,
        week: problem.week,
        language,
        code,
        notes,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 border-t border-divider pt-4">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-[14px] text-ink-48">언어</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-[8px] border border-hairline bg-canvas px-2 py-1 text-[14px]"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={10}
        placeholder="여기에 풀이 코드를 작성하세요…"
        className="w-full resize-y rounded-[8px] border border-hairline bg-pearl p-3 font-mono text-[13px] leading-relaxed text-ink focus:border-action focus:outline-none"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="접근 방법·시간복잡도·배운 점 메모…"
        className="mt-3 w-full resize-y rounded-[8px] border border-hairline bg-canvas p-3 text-[15px] leading-relaxed text-ink focus:border-action focus:outline-none"
      />

      <div className="mt-4 flex items-center gap-2">
        <Button variant="primary" onClick={handleSave} disabled={saving || !code.trim()}>
          {saving ? "저장 중…" : existing ? "풀이 업데이트" : "풀이 저장"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}

function defaultLanguage(problem: Problem): string {
  if (problem.tags.includes("Kotlin")) return "kotlin";
  if (problem.tags.includes("Swift")) return "swift";
  if (problem.category === "fe-concept") return "text";
  return "typescript";
}
