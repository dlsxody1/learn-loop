import type { PackCompletion, QuizAttempt } from "../types";
import type { KeyValueStore } from "../adapters/kv";

/**
 * 퀴즈 진행 상태 저장소. KeyValueStore 어댑터 위에서 동작한다(웹=localStorage,
 * 모바일=AsyncStorage). 인터페이스가 비동기라 모든 메서드가 Promise를 반환한다.
 *
 * (Phase 3에서 Supabase 백엔드를 같은 형태의 구현으로 추가 가능.)
 */
export interface QuizRepo {
  getAttempts(): Promise<QuizAttempt[]>;
  addAttempt(a: QuizAttempt): Promise<void>;
  getCompletions(): Promise<PackCompletion[]>;
  addCompletion(c: PackCompletion): Promise<void>;
  getActivePackId(fallback: string): Promise<string>;
  setActivePackId(id: string): Promise<void>;
  /** 팩을 처음 푼 ISO 날짜. 없으면 nowIso로 기록 후 반환. */
  getPackStartedAt(packId: string, nowIso: string): Promise<string>;
}

const ATTEMPTS_KEY = "learnloop:quiz:attempts";
const COMPLETIONS_KEY = "learnloop:quiz:completions";
const ACTIVE_PACK_KEY = "learnloop:quiz:activePack";
const PACK_STARTED_PREFIX = "learnloop:quiz:packStarted:";

/** KeyValueStore 기반 기본 구현. */
export function createKvQuizRepo(kv: KeyValueStore): QuizRepo {
  async function readJson<T>(key: string, fallback: T): Promise<T> {
    try {
      const raw = await kv.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  return {
    async getAttempts() {
      return readJson<QuizAttempt[]>(ATTEMPTS_KEY, []);
    },
    async addAttempt(a) {
      const all = await readJson<QuizAttempt[]>(ATTEMPTS_KEY, []);
      all.push(a);
      await kv.setItem(ATTEMPTS_KEY, JSON.stringify(all));
    },
    async getCompletions() {
      return readJson<PackCompletion[]>(COMPLETIONS_KEY, []);
    },
    async addCompletion(c) {
      const all = (await readJson<PackCompletion[]>(COMPLETIONS_KEY, [])).filter(
        (x) => x.packId !== c.packId,
      );
      all.push(c);
      await kv.setItem(COMPLETIONS_KEY, JSON.stringify(all));
    },
    async getActivePackId(fallback) {
      return (await kv.getItem(ACTIVE_PACK_KEY)) ?? fallback;
    },
    async setActivePackId(id) {
      await kv.setItem(ACTIVE_PACK_KEY, id);
    },
    async getPackStartedAt(packId, nowIso) {
      const key = PACK_STARTED_PREFIX + packId;
      let v = await kv.getItem(key);
      if (!v) {
        v = nowIso;
        await kv.setItem(key, v);
      }
      return v;
    },
  };
}
