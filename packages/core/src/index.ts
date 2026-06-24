// 도메인 타입
export * from "./types";

// 데이터
export { problems, problemsOfWeek } from "./data/problems";
export { weeks, phases, phaseOfWeek } from "./data/curriculum";
export { packs, packById } from "./data/quiz/packs";
export { pack1Questions } from "./data/quiz/pack-1";
export { pack2Questions } from "./data/quiz/pack-2";

// 순수 로직
export { cn } from "./lib/cn";
export {
  suggestedSession,
  isMorningWindow,
  isEveningWindow,
  SESSION_LABEL,
} from "./lib/session";
export {
  TOTAL_WEEKS,
  currentWeekFrom,
  totalChecklistItems,
  doneChecklistItems,
  curriculumProgress,
  currentStreak,
  weekItemKeys,
} from "./lib/progress";
export { buildAlarmIcs } from "./lib/ics";

// 캘린더(Google Calendar 연동)
export {
  buildCalendarEvents,
  CALENDAR_TZID,
} from "./calendar/buildCalendarEvents";
export type { StudyCalendarEvent } from "./calendar/buildCalendarEvents";
export {
  toGoogleEvent,
  deterministicEventId,
} from "./calendar/toGoogleEvent";
export type { GoogleEventResource } from "./calendar/toGoogleEvent";

// 어댑터 인터페이스 (플랫폼별 구현은 각 앱이 주입)
export type { IdGen } from "./adapters/id";
export type { KeyValueStore } from "./adapters/kv";
export type { Notifier, NotifyPermission } from "./adapters/notifier";
export type {
  CalendarSync,
  CalendarConnectStatus,
  CalendarSyncResult,
} from "./adapters/calendarSync";

// 퀴즈 도메인
export type { QuizRepo } from "./quiz/quizRepo";
export { createKvQuizRepo } from "./quiz/quizRepo";
export type { SupabaseLike } from "./quiz/supabaseQuizRepo";
export { createSupabaseQuizRepo } from "./quiz/supabaseQuizRepo";
export {
  useQuiz,
  PASS_THRESHOLD,
  FINAL_TEST_SIZE,
  PACK_DURATION_DAYS,
} from "./quiz/useQuiz";
export type { PackProgress, UseQuizDeps } from "./quiz/useQuiz";
