import type { QuizSession } from "../types";

export type NotifyPermission = "granted" | "denied" | "default" | "unsupported";

/**
 * 일일 학습 알림 추상화.
 * - 웹: Notification API + "앱 오픈 시 체크"(진짜 예약 불가)
 * - 모바일: expo-notifications 로컬 스케줄(진짜 OS 예약 알림)
 */
export interface Notifier {
  permission(): Promise<NotifyPermission>;
  requestPermission(): Promise<NotifyPermission>;
  /** 매일 같은 시각 반복 알림 예약(또는 웹에서는 활성화 플래그). */
  scheduleDaily(session: QuizSession, hour: number, minute: number): Promise<void>;
  /** 예약 취소(또는 비활성화). */
  cancelDaily(session: QuizSession): Promise<void>;
}
