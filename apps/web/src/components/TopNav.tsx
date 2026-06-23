import { cn } from "@learnloop/core";
import { TABS, type View } from "./nav";

export type { View };

interface TopNavProps {
  view: View;
  onChange: (v: View) => void;
}

/**
 * 상단 고정 내비. parchment 80% + blur(20px) 백드롭 (Apple sub-nav 규칙).
 * 모바일에서는 탭을 숨기고 로고만 보이며, 탭 전환은 BottomTabBar가 담당한다.
 */
export function TopNav({ view, onChange }: TopNavProps) {
  return (
    <header className="blur-nav sticky top-0 z-10 border-b border-hairline">
      <nav className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-3 sm:px-5">
        <span className="flex items-center gap-1.5 text-[17px] font-semibold tracking-[-0.374px]">
          <span aria-hidden="true" className="text-action">
            ↻
          </span>
          LearnLoop
        </span>
        <div className="hidden items-center gap-1 sm:flex">
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
