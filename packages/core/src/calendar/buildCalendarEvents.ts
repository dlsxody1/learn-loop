/**
 * 학습 기록(quiz_attempts)을 캘린더 이벤트로 묶는 순수 함수.
 * (날짜, packId, session) 단위로 그룹화해 "한 번의 학습 세션" = 이벤트 1개로 만든다.
 * DOM/외부 의존 없음 → 브라우저와 Deno(Edge Function) 양쪽에서 import 가능.
 *
 * 시간대: ics.ts와 동일하게 Asia/Seoul(KST, +09:00 고정, DST 없음)을 기준으로 한다.
 * attempted_at은 UTC ISO이므로 +9h 해서 KST 벽시계 날짜/시각을 계산한다.
 */
import type { QuizAttempt } from "../types";
import { SESSION_LABEL } from "../lib/session";
import { packById } from "../data/quiz/packs";

export const CALENDAR_TZID = "Asia/Seoul";
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export interface StudyCalendarEvent {
  /** 결정론적 dedupe 키: `${ymd}|${packId}|${session}` (ymd는 KST 기준) */
  key: string;
  summary: string;
  description: string;
  /** KST 벽시계 ISO(타임존 표기 없음), 예: "2026-06-24T09:05:00" */
  startLocal: string;
  endLocal: string;
  timeZone: string;
  attemptCount: number;
  correctCount: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** UTC ISO → KST 벽시계 Date 컴포넌트. */
function toKstParts(iso: string) {
  const kst = new Date(new Date(iso).getTime() + KST_OFFSET_MS);
  return {
    ymd: `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}`,
    local: `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(
      kst.getUTCDate(),
    )}T${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:${pad(kst.getUTCSeconds())}`,
    ms: new Date(iso).getTime(),
  };
}

/** ms(UTC epoch) → KST 벽시계 ISO 문자열. */
function msToKstLocal(ms: number): string {
  const kst = new Date(ms + KST_OFFSET_MS);
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(
    kst.getUTCDate(),
  )}T${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:${pad(kst.getUTCSeconds())}`;
}

interface Group {
  key: string;
  packId: string;
  session: QuizAttempt["session"];
  firstMs: number;
  lastMs: number;
  attemptCount: number;
  correctCount: number;
}

/**
 * attempt 배열을 (KST 날짜, packId, session) 그룹으로 묶어 이벤트 목록을 만든다.
 * @param opts.minDurationMin 시작==끝일 때 부여할 최소 길이(분). 기본 15.
 */
export function buildCalendarEvents(
  attempts: QuizAttempt[],
  opts: { minDurationMin?: number } = {},
): StudyCalendarEvent[] {
  const minDurationMs = (opts.minDurationMin ?? 15) * 60 * 1000;
  const groups = new Map<string, Group>();

  for (const a of attempts) {
    const { ymd, ms } = toKstParts(a.attemptedAt);
    const key = `${ymd}|${a.packId}|${a.session}`;
    const g = groups.get(key);
    if (!g) {
      groups.set(key, {
        key,
        packId: a.packId,
        session: a.session,
        firstMs: ms,
        lastMs: ms,
        attemptCount: 1,
        correctCount: a.correct ? 1 : 0,
      });
    } else {
      g.firstMs = Math.min(g.firstMs, ms);
      g.lastMs = Math.max(g.lastMs, ms);
      g.attemptCount += 1;
      g.correctCount += a.correct ? 1 : 0;
    }
  }

  return [...groups.values()]
    .sort((a, b) => a.firstMs - b.firstMs)
    .map((g) => {
      const title = packById(g.packId)?.title ?? g.packId;
      const sessionLabel = SESSION_LABEL[g.session];
      const endMs =
        g.lastMs > g.firstMs ? g.lastMs : g.firstMs + minDurationMs;
      const rate = Math.round((g.correctCount / g.attemptCount) * 100);
      return {
        key: g.key,
        summary: `LearnLoop · ${title} (${sessionLabel})`,
        description: `${g.attemptCount}문제 풀이 · 정답률 ${rate}% (${g.correctCount}/${g.attemptCount})`,
        startLocal: msToKstLocal(g.firstMs),
        endLocal: msToKstLocal(endMs),
        timeZone: CALENDAR_TZID,
        attemptCount: g.attemptCount,
        correctCount: g.correctCount,
      };
    });
}
