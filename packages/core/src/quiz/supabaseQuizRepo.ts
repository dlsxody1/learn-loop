import type { PackCompletion, QuizAttempt } from "../types";
import type { QuizRepo } from "./quizRepo";

/**
 * core가 @supabase/supabase-js에 직접 의존하지 않도록 하는 최소 인터페이스.
 * 웹/모바일이 각자 만든 supabase 클라이언트를 이 형태로 넘긴다(구조적 호환).
 */
export interface SupabaseLike {
  from(table: string): any;
}

const STATE_ACTIVE_PACK = "activePack";
const STATE_PACK_STARTED_PREFIX = "packStarted:";

/**
 * Supabase 백엔드 QuizRepo. device_id로 행을 묶어 웹↔모바일 진도를 공유한다.
 * 테이블: quiz_attempts, pack_completions, quiz_state.
 */
export function createSupabaseQuizRepo(
  sb: SupabaseLike,
  deviceId: string,
): QuizRepo {
  async function getState(key: string): Promise<string | null> {
    const { data, error } = await sb
      .from("quiz_state")
      .select("value")
      .eq("device_id", deviceId)
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    return data?.value ?? null;
  }

  async function setState(key: string, value: string): Promise<void> {
    const { error } = await sb
      .from("quiz_state")
      .upsert(
        { device_id: deviceId, key, value, updated_at: new Date().toISOString() },
        { onConflict: "device_id,key" },
      );
    if (error) throw error;
  }

  return {
    async getAttempts() {
      const { data, error } = await sb
        .from("quiz_attempts")
        .select("*")
        .eq("device_id", deviceId)
        .order("attempted_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(
        (r: any): QuizAttempt => ({
          id: r.id,
          questionId: r.question_id,
          packId: r.pack_id,
          session: r.session,
          correct: r.correct,
          attemptedAt: r.attempted_at,
        }),
      );
    },
    async addAttempt(a) {
      const { error } = await sb.from("quiz_attempts").insert({
        id: a.id,
        device_id: deviceId,
        question_id: a.questionId,
        pack_id: a.packId,
        session: a.session,
        correct: a.correct,
        attempted_at: a.attemptedAt,
      });
      if (error) throw error;
    },
    async getCompletions() {
      const { data, error } = await sb
        .from("pack_completions")
        .select("*")
        .eq("device_id", deviceId);
      if (error) throw error;
      return (data ?? []).map(
        (r: any): PackCompletion => ({
          packId: r.pack_id,
          finalTestScore: r.final_test_score,
          passedAt: r.passed_at,
        }),
      );
    },
    async addCompletion(c) {
      const { error } = await sb.from("pack_completions").upsert(
        {
          device_id: deviceId,
          pack_id: c.packId,
          final_test_score: c.finalTestScore,
          passed_at: c.passedAt,
        },
        { onConflict: "device_id,pack_id" },
      );
      if (error) throw error;
    },
    async getActivePackId(fallback) {
      return (await getState(STATE_ACTIVE_PACK)) ?? fallback;
    },
    async setActivePackId(id) {
      await setState(STATE_ACTIVE_PACK, id);
    },
    async getPackStartedAt(packId, nowIso) {
      const key = STATE_PACK_STARTED_PREFIX + packId;
      const existing = await getState(key);
      if (existing) return existing;
      await setState(key, nowIso);
      return nowIso;
    },
  };
}
