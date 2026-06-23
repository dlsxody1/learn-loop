import { useCallback, useState } from "react";

const KEY = "line-prep:start-date";

/** 학습 시작일 (없으면 오늘로 초기화). 현재 주차 계산의 기준. */
export function useStartDate() {
  const [startDate, setStart] = useState<string>(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved;
    const today = new Date().toISOString();
    localStorage.setItem(KEY, today);
    return today;
  });

  const reset = useCallback((iso: string = new Date().toISOString()) => {
    localStorage.setItem(KEY, iso);
    setStart(iso);
  }, []);

  return { startDate, reset };
}
