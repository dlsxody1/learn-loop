import { useCallback, useEffect, useState } from "react";
import type { Solution } from "@learnloop/core";
import { storage } from "@/lib/storage";

/** 풀이 목록 조회/저장/삭제. 데이터 관심사만 담당. */
export function useSolutions() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setSolutions(await storage.listSolutions());
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (s: Solution) => {
      await storage.saveSolution(s);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await storage.deleteSolution(id);
      await refresh();
    },
    [refresh],
  );

  return { solutions, isLoading, error, save, remove, refresh };
}
