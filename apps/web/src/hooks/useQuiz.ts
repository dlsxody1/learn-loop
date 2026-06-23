import { useMemo } from "react";
import { useQuiz as useCoreQuiz, createKvQuizRepo } from "@learnloop/core";
import { webKv } from "@/adapters/webKv";
import { webIdGen } from "@/adapters/webId";

export { PASS_THRESHOLD, FINAL_TEST_SIZE, PACK_DURATION_DAYS } from "@learnloop/core";
export type { PackProgress } from "@learnloop/core";

/** 코어 useQuiz에 웹 어댑터(localStorage + crypto)를 주입하는 얇은 래퍼. */
export function useQuiz() {
  const repo = useMemo(() => createKvQuizRepo(webKv), []);
  return useCoreQuiz({ repo, idGen: webIdGen });
}
