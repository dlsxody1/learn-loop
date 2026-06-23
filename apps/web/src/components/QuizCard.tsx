import { useState } from "react";
import type { QuizQuestion } from "@/types";
import { cn } from "@/lib/cn";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface QuizCardProps {
  question: QuizQuestion;
  index: number;
  total: number;
  /** 채점 후 다음 문항으로. correct는 채점 결과. */
  onNext: (correct: boolean) => void;
}

/** 한 문항: 4지선다 → 선택 즉시 채점 + 해설 → 다음. */
export function QuizCard({ question, index, total, onNext }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const graded = selected !== null;
  const correct = selected === question.answerIndex;

  const choose = (i: number) => {
    if (graded) return;
    setSelected(i);
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between text-[13px] text-ink-48">
        <span>
          {index + 1} / {total}
        </span>
        <span className="uppercase tracking-wide">{question.topic}</span>
      </div>

      <h2 className="mt-3 whitespace-pre-line text-[19px] font-semibold leading-snug tracking-[-0.3px] sm:text-[21px]">
        {question.question}
      </h2>

      <div className="mt-4 flex flex-col gap-2">
        {question.choices.map((c, i) => {
          const isAnswer = i === question.answerIndex;
          const isPicked = i === selected;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={graded}
              className={cn(
                "press rounded-[11px] border px-4 py-3 text-left text-[15px] leading-snug transition-colors sm:text-[16px]",
                !graded && "border-hairline hover:border-action/50",
                graded && isAnswer && "border-action bg-action/8 text-ink",
                graded &&
                  isPicked &&
                  !isAnswer &&
                  "border-red-400 bg-red-50 text-ink",
                graded && !isAnswer && !isPicked && "border-hairline opacity-60",
              )}
            >
              <span className="mr-2 font-semibold text-ink-48">
                {String.fromCharCode(65 + i)}
              </span>
              {c}
            </button>
          );
        })}
      </div>

      {graded && (
        <div className="mt-4">
          <p
            className={cn(
              "text-[15px] font-semibold",
              correct ? "text-action" : "text-red-500",
            )}
          >
            {correct ? "정답입니다 ✓" : "오답입니다 ✗"}
          </p>
          <p className="mt-1.5 rounded-[8px] bg-parchment p-3 text-[14px] leading-relaxed text-ink-80">
            {question.explanation}
          </p>
          <div className="mt-4">
            <Button onClick={() => onNext(correct)}>
              {index + 1 === total ? "결과 보기" : "다음 문제"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
