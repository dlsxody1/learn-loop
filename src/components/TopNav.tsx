import { cn } from "@/lib/cn";

export type View = "today" | "curriculum" | "archive" | "progress";

const TABS: { id: View; label: string }[] = [
  { id: "today", label: "오늘" },
  { id: "curriculum", label: "커리큘럼" },
  { id: "archive", label: "기록" },
  { id: "progress", label: "진행" },
];

interface TopNavProps {
  view: View;
  onChange: (v: View) => void;
}

/** 상단 고정 내비. parchment 80% + blur(20px) 백드롭 (Apple sub-nav 규칙). */
export function TopNav({ view, onChange }: TopNavProps) {
  return (
    <header className="blur-nav sticky top-0 z-10 border-b border-hairline">
      <nav className="mx-auto flex max-w-[1080px] items-center justify-between px-5 py-3">
        <span className="text-[17px] font-semibold tracking-[-0.374px]">
          LINE Prep
        </span>
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={view === t.id ? "page" : undefined}
              className={cn(
                "press rounded-full px-3.5 py-1.5 text-[14px] tracking-[-0.224px]",
                view === t.id
                  ? "bg-ink text-white"
                  : "text-ink-48 hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
