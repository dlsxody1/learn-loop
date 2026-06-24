/**
 * StudyCalendarEvent → Google Calendar event resource 변환 (순수 함수).
 * 결정론적 event id로 idempotency를 보장한다: 같은 학습 세션은 항상 같은 id →
 * events.insert 재시도 시 409(중복)로 걸러진다.
 * 외부 의존 없음 → Deno/브라우저 공용.
 */
import type { StudyCalendarEvent } from "./buildCalendarEvents";

export interface GoogleEventResource {
  id: string;
  summary: string;
  description: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  extendedProperties: {
    private: { learnloopKey: string; learnloopVersion: string };
  };
}

/**
 * Google event id 규칙: base32hex 문자집합(소문자 a-v + 0-9), 5~1024자.
 * 외부 라이브러리 없이 FNV-1a(64bit) 해시 2개를 묶어 충돌 확률을 낮춘 뒤
 * base32hex로 인코딩한다. 같은 key → 항상 같은 id.
 */
export function deterministicEventId(key: string): string {
  const h1 = fnv1a(key, 0x811c9dc5n);
  const h2 = fnv1a(key, 0xcbf29ce4n); // 다른 시드로 한 번 더
  return "ll" + toBase32Hex(h1) + toBase32Hex(h2);
}

const FNV_PRIME = 0x100000001b3n;
const MASK64 = (1n << 64n) - 1n;

function fnv1a(input: string, seed: bigint): bigint {
  let hash = seed & MASK64;
  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * FNV_PRIME) & MASK64;
  }
  return hash;
}

const BASE32HEX = "0123456789abcdefghijklmnopqrstuv";

function toBase32Hex(n: bigint): string {
  let out = "";
  let v = n;
  for (let i = 0; i < 13; i++) {
    out = BASE32HEX[Number(v & 31n)] + out;
    v >>= 5n;
  }
  return out;
}

export function toGoogleEvent(e: StudyCalendarEvent): GoogleEventResource {
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
