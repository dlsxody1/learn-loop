// packages/core/src/calendar/* 의 Deno 자족 포팅.
// core는 npm 패키지라 Edge(Deno)에서 직접 import가 까다로워, 동일 알고리즘을
// 외부 의존 없이 여기 복제한다. 로직이 바뀌면 양쪽을 함께 수정해야 한다.
// (그룹화 키/결정론적 id 규칙은 core와 반드시 일치해야 idempotency가 유지된다.)

export const CALENDAR_TZID = "Asia/Seoul";
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// core packs.ts와 동기화. 새 팩 추가 시 여기도 갱신.
const PACK_TITLES: Record<string, string> = {
  "pack-1": "JS · React 기초",
  "pack-2": "TS · 성능 · 브라우저",
};
const SESSION_LABEL: Record<string, string> = {
  morning: "아침",
  evening: "저녁",
};

export interface Attempt {
  packId: string;
  session: string;
  correct: boolean;
  attemptedAt: string; // UTC ISO
}

export interface StudyCalendarEvent {
  key: string;
  summary: string;
  description: string;
  startLocal: string;
  endLocal: string;
  timeZone: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function kstYmd(iso: string): string {
  const k = new Date(new Date(iso).getTime() + KST_OFFSET_MS);
  return `${k.getUTCFullYear()}-${pad(k.getUTCMonth() + 1)}-${pad(k.getUTCDate())}`;
}

function msToKstLocal(ms: number): string {
  const k = new Date(ms + KST_OFFSET_MS);
  return `${k.getUTCFullYear()}-${pad(k.getUTCMonth() + 1)}-${pad(
    k.getUTCDate(),
  )}T${pad(k.getUTCHours())}:${pad(k.getUTCMinutes())}:${pad(k.getUTCSeconds())}`;
}

export function buildCalendarEvents(
  attempts: Attempt[],
  minDurationMin = 15,
): StudyCalendarEvent[] {
  const minMs = minDurationMin * 60 * 1000;
  const groups = new Map<
    string,
    {
      key: string;
      packId: string;
      session: string;
      firstMs: number;
      lastMs: number;
      count: number;
      correct: number;
    }
  >();

  for (const a of attempts) {
    const ymd = kstYmd(a.attemptedAt);
    const ms = new Date(a.attemptedAt).getTime();
    const key = `${ymd}|${a.packId}|${a.session}`;
    const g = groups.get(key);
    if (!g) {
      groups.set(key, {
        key,
        packId: a.packId,
        session: a.session,
        firstMs: ms,
        lastMs: ms,
        count: 1,
        correct: a.correct ? 1 : 0,
      });
    } else {
      g.firstMs = Math.min(g.firstMs, ms);
      g.lastMs = Math.max(g.lastMs, ms);
      g.count += 1;
      g.correct += a.correct ? 1 : 0;
    }
  }

  return [...groups.values()]
    .sort((a, b) => a.firstMs - b.firstMs)
    .map((g) => {
      const title = PACK_TITLES[g.packId] ?? g.packId;
      const label = SESSION_LABEL[g.session] ?? g.session;
      const endMs = g.lastMs > g.firstMs ? g.lastMs : g.firstMs + minMs;
      const rate = Math.round((g.correct / g.count) * 100);
      return {
        key: g.key,
        summary: `LearnLoop · ${title} (${label})`,
        description: `${g.count}문제 풀이 · 정답률 ${rate}% (${g.correct}/${g.count})`,
        startLocal: msToKstLocal(g.firstMs),
        endLocal: msToKstLocal(endMs),
        timeZone: CALENDAR_TZID,
      };
    });
}

// ── 결정론적 event id (core/toGoogleEvent.ts와 동일 규칙) ──
const FNV_PRIME = 0x100000001b3n;
const MASK64 = (1n << 64n) - 1n;
const BASE32HEX = "0123456789abcdefghijklmnopqrstuv";

function fnv1a(input: string, seed: bigint): bigint {
  let hash = seed & MASK64;
  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * FNV_PRIME) & MASK64;
  }
  return hash;
}

function toBase32Hex(n: bigint): string {
  let out = "";
  let v = n;
  for (let i = 0; i < 13; i++) {
    out = BASE32HEX[Number(v & 31n)] + out;
    v >>= 5n;
  }
  return out;
}

export function deterministicEventId(key: string): string {
  return "ll" + toBase32Hex(fnv1a(key, 0x811c9dc5n)) +
    toBase32Hex(fnv1a(key, 0xcbf29ce4n));
}

export function toGoogleEvent(e: StudyCalendarEvent) {
  return {
    id: deterministicEventId(e.key),
    summary: e.summary,
    description: e.description,
    start: { dateTime: e.startLocal, timeZone: e.timeZone },
    end: { dateTime: e.endLocal, timeZone: e.timeZone },
    extendedProperties: {
      private: { learnloopKey: e.key, learnloopVersion: "1" },
    },
  };
}
