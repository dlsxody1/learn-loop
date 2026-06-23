import type { ChecklistState, Solution } from "../types";
import { weeks } from "../data/curriculum";

export const TOTAL_WEEKS = 24;
const MS_PER_DAY = 86_400_000;

/** 시작일로부터 경과 주차(1~24)를 계산한다. 순수 함수. */
export function currentWeekFrom(startISO: string, now: Date = new Date()): number {
  const start = new Date(startISO);
  const days = Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY);
  const week = Math.floor(days / 7) + 1;
  return Math.min(Math.max(week, 1), TOTAL_WEEKS);
}

/** 전체 체크리스트 항목 수. */
export function totalChecklistItems(): number {
  return weeks.reduce((sum, w) => sum + w.items.length, 0);
}

/** 완료한 체크리스트 항목 수. */
export function doneChecklistItems(state: ChecklistState): number {
  return Object.values(state).filter(Boolean).length;
}

/** 커리큘럼 진행률(0~100). */
export function curriculumProgress(state: ChecklistState): number {
  const total = totalChecklistItems();
  if (total === 0) return 0;
  return Math.round((doneChecklistItems(state) / total) * 100);
}

/** 풀이를 남긴 고유 날짜(YYYY-MM-DD) 집합. */
function solvedDates(solutions: Solution[]): Set<string> {
  return new Set(solutions.map((s) => s.createdAt.slice(0, 10)));
}

/** 오늘 기준 연속 풀이 일수(streak). 순수 함수. */
export function currentStreak(solutions: Solution[], now: Date = new Date()): number {
  const dates = solvedDates(solutions);
  if (dates.size === 0) return 0;
  let streak = 0;
  const cursor = new Date(now);
  // 오늘 안 풀었으면 어제부터 카운트 시작
  if (!dates.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dates.has(toKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function toKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** 한 주의 체크리스트 키 목록. */
export function weekItemKeys(week: number): string[] {
  const w = weeks.find((x) => x.week === week);
  if (!w) return [];
  return w.items.map((_, i) => `${week}:${i}`);
}
