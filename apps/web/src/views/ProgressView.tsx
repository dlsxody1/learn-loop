import { useState } from "react";
import type { ChecklistState, Solution } from "@/types";
import {
  curriculumProgress,
  currentStreak,
  doneChecklistItems,
  totalChecklistItems,
} from "@/lib/progress";
import { problems } from "@/data/problems";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { downloadAlarmIcs } from "@/lib/ics";
import {
  enableNotifications,
  isNotifyEnabled,
  notifyPermission,
  setNotifyEnabled,
} from "@/lib/notify";

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
    <section className="mx-auto max-w-[1080px] px-4 py-7 sm:px-5 sm:py-8">
      <h1 className="text-[28px] sm:text-[34px] font-semibold leading-[1.1] tracking-[-0.374px]">
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

      <AlarmCard />
    </section>
  );
}

/** 매일 학습 알람 설정 — 캘린더(.ics) + 인앱 알림 토글. */
function AlarmCard() {
  const [enabled, setEnabled] = useState<boolean>(() => isNotifyEnabled());
  const [status, setStatus] = useState<string>("");

  const toggle = async () => {
    if (enabled) {
      setNotifyEnabled(false);
      setEnabled(false);
      setStatus("");
      return;
    }
    const perm = await enableNotifications();
    if (perm === "granted") {
      setEnabled(true);
      setStatus("인앱 알림이 켜졌습니다 (앱이 열려있을 때 알려드려요).");
    } else if (perm === "unsupported") {
      setStatus("이 브라우저는 알림을 지원하지 않습니다.");
    } else {
      setStatus("브라우저 알림 권한이 거부되어 켤 수 없습니다.");
    }
  };

  const perm = notifyPermission();

  return (
    <Card className="mt-5 p-6">
      <h2 className="text-[19px] font-semibold tracking-[-0.3px]">
        매일 학습 알람
      </h2>
      <p className="mt-1 text-[14px] leading-relaxed text-ink-48">
        아침 09:00 · 저녁 22:00. 휴대폰 캘린더에 추가하면 잠금화면 알림으로,
        인앱 알림은 앱이 열려있을 때 보조로 알려줍니다.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-medium">휴대폰 캘린더에 추가</p>
            <p className="text-[13px] text-ink-48">매일 반복(.ics) 다운로드</p>
          </div>
          <Button variant="secondary" onClick={downloadAlarmIcs}>
            .ics 받기
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-divider pt-3">
          <div>
            <p className="text-[15px] font-medium">인앱 알림 사용</p>
            <p className="text-[13px] text-ink-48">
              {perm === "unsupported"
                ? "미지원 브라우저"
                : enabled
                  ? "켜짐"
                  : "꺼짐"}
            </p>
          </div>
          <Button
            variant={enabled ? "secondary" : "primary"}
            onClick={toggle}
            disabled={perm === "unsupported"}
          >
            {enabled ? "끄기" : "켜기"}
          </Button>
        </div>
      </div>

      {status && <p className="mt-3 text-[13px] text-action">{status}</p>}
    </Card>
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
