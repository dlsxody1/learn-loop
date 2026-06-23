import { useMemo, useState } from "react";
import type { QuizQuestion, QuizSession } from "@learnloop/core";
import { SESSION_LABEL } from "@learnloop/core";
import { QuizCard } from "@/components/QuizCard";
import { QuizResult } from "@/components/QuizResult";

interface QuizSessionViewProps {
  session: QuizSession;
  questions: QuizQuestion[];
  onRecord: (q: QuizQuestion, correct: boolean) => void;
  onDone: () => void;
}

/** 아침/저녁 한 세션(기본 5문항) 풀이 → 결과. */
export function QuizSessionView({
  session,
  questions,
  onRecord,
  onDone,
}: QuizSessionViewProps) {
  const [i, setI] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(questions.length === 0);

  // 진입 시점에 고정된 문항 목록 — 재셔플 방지.
  const list = useMemo(() => questions, [questions]);

  const handleNext = (correct: boolean) => {
    onRecord(list[i], correct);
    if (correct) setCorrectCount((c) => c + 1);
    if (i + 1 >= list.length) {
      setFinished(true);
    } else {
      setI((x) => x + 1);
    }
  };

  if (finished) {
    return (
      <QuizResult
        title={`${SESSION_LABEL[session]} 퀴즈 완료`}
        correct={correctCount}
        total={list.length}
        onPrimary={onDone}
        primaryLabel="퀴즈 홈으로"
      />
    );
  }

  return (
    <QuizCard
      key={list[i].id}
      question={list[i]}
      index={i}
      total={list.length}
      onNext={handleNext}
    />
  );
}
