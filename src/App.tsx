import { useState } from "react";
import { TopNav, type View } from "@/components/TopNav";
import { TodayView } from "@/views/TodayView";
import { CurriculumView } from "@/views/CurriculumView";
import { ArchiveView } from "@/views/ArchiveView";
import { ProgressView } from "@/views/ProgressView";
import { useSolutions } from "@/hooks/useSolutions";
import { useChecklist } from "@/hooks/useChecklist";
import { useStartDate } from "@/hooks/useStartDate";
import { currentWeekFrom } from "@/lib/progress";
import { isSupabaseEnabled } from "@/lib/supabase";

export function App() {
  const [view, setView] = useState<View>("today");
  const { startDate } = useStartDate();
  const [week, setWeek] = useState<number>(() => currentWeekFrom(startDate));

  const { solutions, save, remove } = useSolutions();
  const { state: checklist, toggle } = useChecklist();

  const goToWeek = (w: number) => {
    setWeek(w);
    setView("today");
  };

  return (
    <div className="min-h-screen bg-canvas pb-20">
      <TopNav view={view} onChange={setView} />

      {!isSupabaseEnabled && <LocalModeBanner />}

      {view === "today" && (
        <TodayView week={week} onWeekChange={setWeek} solutions={solutions} onSave={save} />
      )}
      {view === "curriculum" && (
        <CurriculumView
          checklist={checklist}
          onToggle={toggle}
          currentWeek={week}
          onJumpToWeek={goToWeek}
        />
      )}
      {view === "archive" && <ArchiveView solutions={solutions} onDelete={remove} />}
      {view === "progress" && <ProgressView solutions={solutions} checklist={checklist} />}
    </div>
  );
}

/** Supabase 미설정 시 로컬 저장 모드임을 알리는 정보 배너. */
function LocalModeBanner() {
  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-[1080px] px-5 py-2 text-[13px] tracking-[-0.12px] text-ink-48">
        로컬 저장 모드 — 이 브라우저에만 기록됩니다. 여러 기기 동기화는 .env에 Supabase 키를 넣으면 활성화됩니다.
      </div>
    </div>
  );
}
