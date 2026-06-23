import { useState } from "react";
import type { ChecklistState } from "@/types";
import { phases, weeks } from "@/data/curriculum";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

interface CurriculumViewProps {
  checklist: ChecklistState;
  onToggle: (key: string, done: boolean) => void;
  currentWeek: number;
  onJumpToWeek: (w: number) => void;
}

export function CurriculumView({
  checklist,
  onToggle,
  currentWeek,
  onJumpToWeek,
}: CurriculumViewProps) {
  const [openWeek, setOpenWeek] = useState<number | null>(currentWeek);

  return (
    <section className="mx-auto max-w-[1080px] px-4 py-7 sm:px-5 sm:py-8">
      <h1 className="text-[28px] sm:text-[34px] font-semibold leading-[1.1] tracking-[-0.374px]">
        24주 커리큘럼
      </h1>
      <p className="mt-2 text-[17px] leading-relaxed text-ink-48">
        LINE Pay Hybrid Engineer 목표 · 주차별 학습 항목을 체크하며 진행하세요.
      </p>

      <div className="mt-8 space-y-10">
        {phases.map((phase) => (
          <div key={phase.id}>
            <div className="mb-3 flex items-baseline gap-3">
              <h2 className="text-[21px] font-semibold tracking-[-0.374px]">
                {phase.name}
              </h2>
              <span className="text-[15px] text-ink-48">{phase.theme}</span>
            </div>

            <div className="space-y-2">
              {phase.weeks.map((wk) => {
                const week = weeks.find((w) => w.week === wk)!;
                const isOpen = openWeek === wk;
                const total = week.items.length;
                const done = week.items.filter(
                  (_, i) => checklist[`${wk}:${i}`],
                ).length;
                const complete = total > 0 && done === total;

                return (
                  <Card key={wk} className="overflow-hidden">
                    <button
                      onClick={() => setOpenWeek(isOpen ? null : wk)}
                      className="press flex w-full items-center gap-3 px-5 py-4 text-left"
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px]",
                          complete
                            ? "bg-action text-white"
                            : wk === currentWeek
                              ? "bg-ink text-white"
                              : "bg-parchment text-ink-48",
                        )}
                      >
                        {complete ? "✓" : wk}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[17px] font-semibold tracking-[-0.374px]">
                          {week.title}
                        </span>
                        <span className="block text-[14px] text-ink-48">
                          {done}/{total} 완료 · {week.deliverable}
                        </span>
                      </span>
                      <span className="text-ink-48">{isOpen ? "▲" : "▼"}</span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-divider px-5 py-4">
                        <p className="mb-3 text-[15px] leading-relaxed text-ink-80">
                          🎯 {week.goal}
                        </p>
                        <ul className="space-y-2">
                          {week.items.map((item, i) => {
                            const key = `${wk}:${i}`;
                            const checked = !!checklist[key];
                            return (
                              <li key={key}>
                                <label className="flex cursor-pointer items-start gap-3">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => onToggle(key, e.target.checked)}
                                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-action)]"
                                  />
                                  <span
                                    className={cn(
                                      "text-[15px] leading-relaxed",
                                      checked
                                        ? "text-ink-48 line-through"
                                        : "text-ink",
                                    )}
                                  >
                                    {item.text}
                                  </span>
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                        <button
                          onClick={() => onJumpToWeek(wk)}
                          className="press mt-4 text-[14px] text-action hover:opacity-80"
                        >
                          이 주차 문제 풀러 가기 ›
                        </button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
