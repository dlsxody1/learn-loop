import { cn } from "@learnloop/core";
import { TABS, type View } from "./nav";

interface BottomTabBarProps {
  view: View;
  onChange: (v: View) => void;
}

/**
 * 모바일 전용 하단 고정 탭 바 (iOS 표준). 데스크톱(sm 이상)에서는 숨긴다.
 * safe-area-inset-bottom으로 iOS 홈 인디케이터를 피한다.
 */
export function BottomTabBar({ view, onChange }: BottomTabBarProps) {
  return (
    <nav
      className="blur-nav fixed inset-x-0 bottom-0 z-20 border-t border-hairline pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="하단 내비게이션"
    >
      <div className="mx-auto flex max-w-[560px] items-stretch justify-around px-1">
        {TABS.map((t) => {
          const active = view === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "press flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1.5",
                active ? "text-action" : "text-ink-48",
              )}
            >
              <span className="[&>svg]:h-[22px] [&>svg]:w-[22px]">{t.icon}</span>
              <span className="text-[10px] font-medium tracking-[-0.1px]">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
