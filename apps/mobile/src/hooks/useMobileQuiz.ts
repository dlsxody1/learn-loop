import { useEffect, useMemo, useState } from "react";
import {
  useQuiz as useCoreQuiz,
  createKvQuizRepo,
  createSupabaseQuizRepo,
  type QuizRepo,
} from "@learnloop/core";
import { mobileKv } from "@/adapters/mobileKv";
import { mobileIdGen } from "@/adapters/mobileId";
import { supabase, getDeviceId } from "@/adapters/supabase";

/**
 * 코어 useQuiz에 모바일 어댑터를 주입하는 래퍼.
 * Supabase가 설정돼 있으면 device_id를 비동기 로드해 DB 동기화 저장소를 쓰고,
 * 그 전(또는 미설정 시)에는 AsyncStorage 폴백으로 즉시 동작한다.
 */
export function useMobileQuiz() {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    void getDeviceId().then((id) => {
      if (alive) setDeviceId(id);
    });
    return () => {
      alive = false;
    };
  }, []);

  const repo = useMemo<QuizRepo>(() => {
    if (supabase && deviceId) {
      return createSupabaseQuizRepo(supabase, deviceId);
    }
    return createKvQuizRepo(mobileKv);
  }, [deviceId]);

  return useCoreQuiz({ repo, idGen: mobileIdGen });
}
