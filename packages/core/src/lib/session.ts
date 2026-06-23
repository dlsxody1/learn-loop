import type { QuizSession } from "../types";

/**
 * 현재 시각 기준 권장 세션을 반환한다.
 * - 12시 이전 → 아침
 * - 18시 이후 → 저녁
 * - 그 외(12~18시) → 직전 시간대 기준 아침 권장(사용자가 직접 바꿀 수 있음)
 */
export function suggestedSession(now: Date = new Date()): QuizSession {
  const h = now.getHours();
  if (h < 12) return "morning";
  if (h >= 18) return "evening";
  return "morning";
}

/** 알림/배너 노출용 시간대 윈도우 판정. */
export function isMorningWindow(now: Date = new Date()): boolean {
  const h = now.getHours();
  return h >= 9 && h < 12;
}

export function isEveningWindow(now: Date = new Date()): boolean {
  const h = now.getHours();
  return h >= 22 && h < 24;
}

export const SESSION_LABEL: Record<QuizSession, string> = {
  morning: "아침",
  evening: "저녁",
};
