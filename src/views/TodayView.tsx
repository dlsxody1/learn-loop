import type { Solution } from "@/types";
import { problemsOfWeek } from "@/data/problems";
import { phaseOfWeek, weeks } from "@/data/curriculum";
import { TOTAL_WEEKS } from "@/lib/progress";
import { ProblemCard } from "@/components/ProblemCard";
import { Button } from "@/components/ui/Button";

interface TodayViewProps {
  week: number;
  onWeekChange: (w: number) => void;
  solutions: Solution[];
  onSave: (s: Solution) => Promise<void>;
}

export function TodayView({ week, onWeekChange, solutions, onSave }: TodayViewProps) {
  const dayProblems = problemsOfWeek(week);
  const meta = weeks.find((w) => w.week === week);
  const phase = phaseOfWeek(week);
  const byProblemId = new Map(solutions.map((s) => [s.problemId, s]));

  return (
    <section className="mx-auto max-w-[1080px] px-4 py-7 sm:px-5 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[14px] tracking-[-0.224px] text-action">
            {phase?.name} · Week {week} / {TOTAL_WEEKS}
          </p>
          <h1 className="mt-1 text-[28px] sm:text-[34px] font-semibold leading-[1.1] tracking-[-0.374px]">
            {meta?.title}
          </h1>
          <p className="mt-2 max-w-[640px] text-[17px] leading-relaxed text-ink-48">
            {meta?.goal}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="utility"
            onClick={() => onWeekChange(Math.max(1, week - 1))}
            aria-label="이전 주"
            disabled={week <= 1}
          >
            ‹
          </Button>
          <Button
            variant="utility"
            onClick={() => onWeekChange(Math.min(TOTAL_WEEKS, week + 1))}
            aria-label="다음 주"
            disabled={week >= TOTAL_WEEKS}
          >
            ›
          </Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {dayProblems.map((p) => (
          <ProblemCard
            key={p.id}
            problem={p}
            solution={byProblemId.get(p.id)}
            onSave={onSave}
          />
        ))}
      </div>

      {dayProblems.length === 0 && (
        <p className="text-[17px] text-ink-48">이 주차의 문제가 아직 없습니다.</p>
      )}
    </section>
  );
}
