import type { ChecklistState, Solution } from "@/types";
import {
  curriculumProgress,
  currentStreak,
  doneChecklistItems,
  totalChecklistItems,
} from "@/lib/progress";
import { problems } from "@/data/problems";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ProgressViewProps {
  solutions: Solution[];
  checklist: ChecklistState;
}

export function ProgressView({ solutions, checklist }: ProgressViewProps) {
  const streak = currentStreak(solutions);
  const progress = curriculumProgress(checklist);
  const solvedIds = new Set(solutions.map((s) => s.problemId));
  const algoSolved = problems.filter(
    (p) => p.category === "algorithm" && solvedIds.has(p.id),
  ).length;
  const feSolved = problems.filter(
    (p) => p.category === "fe-concept" && solvedIds.has(p.id),
  ).length;
  const algoTotal = problems.filter((p) => p.category === "algorithm").length;
  const feTotal = problems.filter((p) => p.category === "fe-concept").length;

  return (
    <section className="mx-auto max-w-[1080px] px-5 py-8">
      <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.374px]">
        진행 현황
      </h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Stat label="연속 학습" value={`${streak}일`} caption="🔥 streak" />
        <Stat label="저장한 풀이" value={`${solutions.length}건`} caption="누적" />
        <Stat
          label="커리큘럼 완료"
          value={`${doneChecklistItems(checklist)}/${totalChecklistItems()}`}
          caption="체크리스트 항목"
        />
      </div>

      <Card className="mt-5 p-6">
        <ProgressBar value={progress} label="전체 커리큘럼 진행률" />
      </Card>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Card className="p-6">
          <ProgressBar
            value={pct(algoSolved, algoTotal)}
            label={`알고리즘 ${algoSolved}/${algoTotal}`}
          />
        </Card>
        <Card className="p-6">
          <ProgressBar
            value={pct(feSolved, feTotal)}
            label={`FE 개념 ${feSolved}/${feTotal}`}
          />
        </Card>
      </div>
    </section>
  );
}

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <Card className="p-6">
      <p className="text-[14px] text-ink-48">{label}</p>
      <p className="mt-1 text-[40px] font-semibold leading-[1.1] tracking-[-0.374px]">
        {value}
      </p>
      <p className="mt-1 text-[13px] text-ink-48">{caption}</p>
    </Card>
  );
}

function pct(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
