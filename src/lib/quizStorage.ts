import type { PackCompletion, QuizAttempt } from "@/types";

/**
 * 퀴즈 진행 상태 저장소 (localStorage 전용).
 * 풀이 기록(QuizAttempt[]), 팩 완료 기록(PackCompletion[]),
 * 활성 팩 ID, 각 팩의 학습 시작일을 보관한다.
 *
 * 솔루션/체크리스트와 달리 Supabase 스키마를 새로 요구하지 않도록
 * 의도적으로 로컬에만 저장한다(개인 단말 학습 진도용).
 */
const ATTEMPTS_KEY = "learnloop:quiz:attempts";
const COMPLETIONS_KEY = "learnloop:quiz:completions";
const ACTIVE_PACK_KEY = "learnloop:quiz:activePack";
const PACK_STARTED_PREFIX = "learnloop:quiz:packStarted:";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getAttempts(): QuizAttempt[] {
  return readJson<QuizAttempt[]>(ATTEMPTS_KEY, []);
}

export function addAttempt(a: QuizAttempt): void {
  const all = getAttempts();
  all.push(a);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(all));
}

export function getCompletions(): PackCompletion[] {
  return readJson<PackCompletion[]>(COMPLETIONS_KEY, []);
}

export function addCompletion(c: PackCompletion): void {
  const all = getCompletions().filter((x) => x.packId !== c.packId);
  all.push(c);
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(all));
}

export function getActivePackId(fallback: string): string {
  return localStorage.getItem(ACTIVE_PACK_KEY) ?? fallback;
}

export function setActivePackId(id: string): void {
  localStorage.setItem(ACTIVE_PACK_KEY, id);
}

/** 팩을 처음 풀기 시작한 ISO 날짜. 없으면 지금 기록하고 반환한다. */
export function getPackStartedAt(packId: string, nowIso: string): string {
  const key = PACK_STARTED_PREFIX + packId;
  let v = localStorage.getItem(key);
  if (!v) {
    v = nowIso;
    localStorage.setItem(key, v);
  }
  return v;
}
