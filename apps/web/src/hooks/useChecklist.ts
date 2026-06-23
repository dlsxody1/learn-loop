import { useCallback, useEffect, useState } from "react";
import type { ChecklistState } from "@learnloop/core";
import { storage } from "@/lib/storage";

/** 커리큘럼 체크리스트 상태 조회/토글. 데이터 관심사만 담당. */
export function useChecklist() {
  const [state, setState] = useState<ChecklistState>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      const loaded = await storage.getChecklist();
      if (active) {
        setState(loaded);
        setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(async (key: string, done: boolean) => {
    // 낙관적 업데이트
    setState((prev) => ({ ...prev, [key]: done }));
    await storage.setChecklistItem(key, done);
  }, []);

  return { state, isLoading, toggle };
}
