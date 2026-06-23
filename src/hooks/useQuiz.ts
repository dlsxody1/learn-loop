import { useCallback, useMemo, useState } from "react";
import type {
  PackCompletion,
  QuizAttempt,
  QuizQuestion,
  QuizSession,
} from "@/types";
import { pack1Questions } from "@/data/quiz/pack-1";
import { pack2Questions } from "@/data/quiz/pack-2";
import { packs } from "@/data/quiz/packs";
import {
  addAttempt,
  addCompletion,
  getActivePackId,
  getAttempts,
  getCompletions,
  getPackStartedAt,
  setActivePackId as persistActivePackId,
} from "@/lib/quizStorage";

/** 팩 ID → 문제 풀. */
const QUESTIONS_BY_PACK: Record<string, QuizQuestion[]> = {
  "pack-1": pack1Questions,
  "pack-2": pack2Questions,
};

export const PASS_THRESHOLD = 0.7; // 70%
export const FINAL_TEST_SIZE = 20;
export const PACK_DURATION_DAYS = 28;
/** 확인 테스트 진입 가능: 전체 문항 80% 풀이 또는 28일 경과. */
const FINAL_TEST_UNLOCK_RATIO = 0.8;

export interface PackProgress {
  packId: string;
  total: number;
  answered: number; // 고유 문항 풀이 수
  correct: number;
  ratio: number; // answered / total
  finalTestUnlocked: boolean;
  completed: PackCompletion | undefined;
}

function nowIso(): string {
  return new Date().toISOString();
}

function questionsOf(packId: string): QuizQuestion[] {
  return QUESTIONS_BY_PACK[packId] ?? [];
}

/** 결정적 셔플(시드 기반) — 매 렌더마다 순서가 흔들리지 않게. */
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useQuiz() {
  const firstPack = packs[0]?.id ?? "pack-1";
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getAttempts());
  const [completions, setCompletions] = useState<PackCompletion[]>(() =>
    getCompletions(),
  );
  const [activePackId, setActivePackIdState] = useState<string>(() =>
    getActivePackId(firstPack),
  );

  const activePack = packs.find((p) => p.id === activePackId) ?? packs[0];

  /** 팩별 시작일(없으면 지금 기록). 확인 테스트 28일 트리거 계산용. */
  const packStartedAt = useMemo(
    () => getPackStartedAt(activePackId, nowIso()),
    [activePackId],
  );

  const setActivePack = useCallback((id: string) => {
    persistActivePackId(id);
    setActivePackIdState(id);
  }, []);

  /** 한 세션의 미답 문항(아직 정답을 맞히지 못한 문항)을 우선 추출한다. */
  const pickSessionQuestions = useCallback(
    (session: QuizSession, count: number, seed: number): QuizQuestion[] => {
      const pool = questionsOf(activePackId).filter(
        (q) => q.session === session,
      );
      const correctIds = new Set(
        attempts
          .filter((a) => a.packId === activePackId && a.correct)
          .map((a) => a.questionId),
      );
      const unseen = pool.filter((q) => !correctIds.has(q.id));
      // 미답을 우선, 부족하면 이미 맞힌 것도 복습으로 채운다.
      const ordered = [
        ...shuffle(unseen, seed),
        ...shuffle(
          pool.filter((q) => correctIds.has(q.id)),
          seed + 7,
        ),
      ];
      return ordered.slice(0, count);
    },
    [activePackId, attempts],
  );

  /** 확인 테스트용 — 팩 전체에서 무작위 N문항. */
  const pickFinalTestQuestions = useCallback(
    (seed: number): QuizQuestion[] => {
      const pool = questionsOf(activePackId);
      return shuffle(pool, seed).slice(0, Math.min(FINAL_TEST_SIZE, pool.length));
    },
    [activePackId],
  );

  const recordAttempt = useCallback(
    (q: QuizQuestion, correct: boolean) => {
      const a: QuizAttempt = {
        id: crypto.randomUUID(),
        questionId: q.id,
        packId: q.packId,
        session: q.session,
        correct,
        attemptedAt: nowIso(),
      };
      addAttempt(a);
      setAttempts((prev) => [...prev, a]);
    },
    [],
  );

  const progress = useMemo<PackProgress>(() => {
    const pool = questionsOf(activePackId);
    const total = pool.length;
    const packAttempts = attempts.filter((a) => a.packId === activePackId);
    const answeredIds = new Set(packAttempts.map((a) => a.questionId));
    const correctIds = new Set(
      packAttempts.filter((a) => a.correct).map((a) => a.questionId),
    );
    const answered = answeredIds.size;
    const ratio = total === 0 ? 0 : answered / total;
    const daysElapsed =
      (Date.now() - new Date(packStartedAt).getTime()) / 86_400_000;
    const finalTestUnlocked =
      total > 0 &&
      (ratio >= FINAL_TEST_UNLOCK_RATIO || daysElapsed >= PACK_DURATION_DAYS);
    return {
      packId: activePackId,
      total,
      answered,
      correct: correctIds.size,
      ratio,
      finalTestUnlocked,
      completed: completions.find((c) => c.packId === activePackId),
    };
  }, [activePackId, attempts, completions, packStartedAt]);

  /** 확인 테스트 채점 → 통과 시 완료 기록 + 다음 팩 unlock + 활성 팩 전환. */
  const submitFinalTest = useCallback(
    (correctCount: number, totalCount: number): { passed: boolean; score: number } => {
      const score = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
      const passed = correctCount / Math.max(1, totalCount) >= PASS_THRESHOLD;
      if (passed) {
        const completion: PackCompletion = {
          packId: activePackId,
          finalTestScore: score,
          passedAt: nowIso(),
        };
        addCompletion(completion);
        setCompletions((prev) => [
          ...prev.filter((c) => c.packId !== activePackId),
          completion,
        ]);
        // 다음 팩으로 활성 전환
        const current = packs.find((p) => p.id === activePackId);
        const next = packs.find((p) => p.order === (current?.order ?? 0) + 1);
        if (next) setActivePack(next.id);
      }
      return { passed, score };
    },
    [activePackId, setActivePack],
  );

  /** 팩이 unlock 됐는지: 첫 팩이거나 직전 팩을 통과했으면 true. */
  const isPackUnlocked = useCallback(
    (packId: string): boolean => {
      const pack = packs.find((p) => p.id === packId);
      if (!pack) return false;
      if (pack.order === 1) return true;
      const prev = packs.find((p) => p.order === pack.order - 1);
      return !!prev && completions.some((c) => c.packId === prev.id);
    },
    [completions],
  );

  return {
    packs,
    activePack,
    activePackId,
    setActivePack,
    progress,
    pickSessionQuestions,
    pickFinalTestQuestions,
    recordAttempt,
    submitFinalTest,
    isPackUnlocked,
  };
}
