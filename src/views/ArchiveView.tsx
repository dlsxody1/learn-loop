import { useMemo, useState } from "react";
import type { ProblemCategory, Solution } from "@/types";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CategoryBadge } from "@/components/ui/Badge";

interface ArchiveViewProps {
  solutions: Solution[];
  onDelete: (id: string) => Promise<void>;
}

type Filter = "all" | ProblemCategory;

export function ArchiveView({ solutions, onDelete }: ArchiveViewProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? solutions : solutions.filter((s) => s.category === filter)),
    [solutions, filter],
  );

  return (
    <section className="mx-auto max-w-[1080px] px-5 py-8">
      <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.374px]">
        풀이 기록
      </h1>
      <p className="mt-2 text-[17px] leading-relaxed text-ink-48">
        지금까지 저장한 풀이 {solutions.length}건.
      </p>

      <div className="mt-6 flex gap-1">
        {(["all", "algorithm", "fe-concept"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "press rounded-full px-3.5 py-1.5 text-[14px] tracking-[-0.224px]",
              filter === f ? "bg-ink text-white" : "text-ink-48 hover:text-ink",
            )}
          >
            {f === "all" ? "전체" : f === "algorithm" ? "알고리즘" : "FE 개념"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-[17px] text-ink-48">
          아직 저장된 풀이가 없습니다. ‘오늘’ 탭에서 문제를 풀어보세요.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((s) => {
            const isOpen = openId === s.id;
            return (
              <Card key={s.id} className="overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                  className="press flex w-full items-center gap-3 px-5 py-4 text-left"
                >
                  <CategoryBadge category={s.category} />
                  <span className="flex-1">
                    <span className="block text-[17px] font-semibold tracking-[-0.374px]">
                      {s.problemTitle}
                    </span>
                    <span className="block text-[13px] text-ink-48">
                      Week {s.week} · {s.language} · {formatDate(s.createdAt)}
                    </span>
                  </span>
                  <span className="text-ink-48">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-divider px-5 py-4">
                    <pre className="overflow-x-auto rounded-[8px] bg-pearl p-3 font-mono text-[13px] leading-relaxed text-ink">
                      {s.code || "(코드 없음)"}
                    </pre>
                    {s.notes && (
                      <p className="mt-3 whitespace-pre-line rounded-[8px] bg-parchment p-3 text-[15px] leading-relaxed text-ink-80">
                        {s.notes}
                      </p>
                    )}
                    <div className="mt-4">
                      <Button variant="ghost" onClick={() => onDelete(s.id)}>
                        삭제
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
