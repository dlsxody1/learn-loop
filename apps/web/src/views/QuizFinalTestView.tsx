import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/types";
import { QuizCard } from "@/components/QuizCard";
import { QuizResult } from "@/components/QuizResult";
import { PASS_THRESHOLD } from "@/hooks/useQuiz";

interface QuizFinalTestViewProps {
  packTitle: string;
  questions: QuizQuestion[];
  onRecord: (q: QuizQuestion, correct: boolean) => void;
  /** 채점 결과를 상위로 넘겨 통과/잠금해제 처리. 반환값으로 통과여부+점수. */
  onSubmit: (correctCount: number, total: number) => { passed: boolean; score: number };
  onDone: () => void;
}

/** 팩 확인 테스트(무작위 20문항, 70% 이상 통과 → 다음 팩 unlock). */
export function QuizFinalTestView({
  packTitle,
  questions,
  onRecord,
  onSubmit,
  onDone,
}: QuizFinalTestViewProps) {
  const list = useMemo(() => questions, [questions]);
  const [i, setI] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<{ passed: boolean } | null>(null);

  const handleNext = (correct: boolean) => {
    onRecord(list[i], correct);
    const nextCorrect = correctCount + (correct ? 1 : 0);
    setCorrectCount(nextCorrect);
    if (i + 1 >= list.length) {
      const r = onSubmit(nextCorrect, list.length);
      setResult({ passed: r.passed });
    } else {
      setI((x) => x + 1);
    }
  };

  if (result) {
    return (
      <QuizResult
        title={`${packTitle} 확인 테스트`}
        correct={correctCount}
        total={list.length}
        passed={result.passed}
        passLabel={
          result.passed
            ? "🎉 통과! 다음 묶음이 열렸습니다."
            : `아쉽지만 불합격 (${Math.round(PASS_THRESHOLD * 100)}% 필요). 복습 후 다시 도전하세요.`
        }
        onPrimary={onDone}
        primaryLabel="퀴즈 홈으로"
      />
    );
  }

  return (
    <div>
      <p className="mb-3 text-center text-[14px] font-medium text-action">
        {packTitle} 확인 테스트
      </p>
      <QuizCard
        key={list[i].id}
        question={list[i]}
        index={i}
        total={list.length}
        onNext={handleNext}
      />
    </div>
  );
}
