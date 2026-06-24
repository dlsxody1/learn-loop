/**
 * Google Calendar 연동 추상화.
 * - 웹: OAuth redirect → 콜백에서 code 교환. Edge Function이 토큰 보관.
 * - 모바일: expo-auth-session(PKCE) → code 교환. 동일 Edge Function 사용.
 * 토큰 자체는 클라이언트가 보지 않는다(Edge Function이 device_id로 관리).
 */
export type CalendarConnectStatus = "connected" | "disconnected" | "unsupported";

export interface CalendarSyncResult {
  created: number;
  skipped: number;
}

export interface CalendarSync {
  /** OAuth 연동 시작. 완료(또는 진행 상태)를 반환. 웹은 redirect라 이 호출이 페이지를 떠날 수 있다. */
  connect(): Promise<CalendarConnectStatus>;
  /** 연동 해제(저장된 토큰 폐기). */
  disconnect(): Promise<void>;
  /** 현재 연동 상태. */
  status(): Promise<CalendarConnectStatus>;
  /** 학습 기록을 캘린더로 동기화. since 미지정 시 백엔드 기본(최근 N일). */
  sync(opts?: { since?: string }): Promise<CalendarSyncResult>;
}
