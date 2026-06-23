import { useMemo } from "react";
import {
  useQuiz as useCoreQuiz,
  createKvQuizRepo,
  createSupabaseQuizRepo,
  type QuizRepo,
} from "@learnloop/core";
import { webKv } from "@/adapters/webKv";
import { webIdGen } from "@/adapters/webId";
import { supabase, getDeviceId } from "@/lib/supabase";

export { PASS_THRESHOLD, FINAL_TEST_SIZE, PACK_DURATION_DAYS } from "@learnloop/core";
export type { PackProgress } from "@learnloop/core";

/**
 * 코어 useQuiz에 웹 어댑터를 주입하는 얇은 래퍼.
 * Supabase가 설정돼 있으면 DB 동기화 저장소(웹↔모바일 공유), 아니면 localStorage 폴백.
 */
export function useQuiz() {
  const repo = useMemo<QuizRepo>(
    () =>
      supabase
        ? createSupabaseQuizRepo(supabase, getDeviceId())
        : createKvQuizRepo(webKv),
    [],
  );
  return useCoreQuiz({ repo, idGen: webIdGen });
}
