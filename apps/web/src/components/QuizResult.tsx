import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface QuizResultProps {
  correct: number;
  total: number;
  title: string;
  /** 통과 여부를 표시해야 하는 확인 테스트일 때만 전달. */
  passed?: boolean;
  passLabel?: string;
  onPrimary: () => void;
  primaryLabel: string;
  onSecondary?: () => void;
  secondaryLabel?: string;
}

/** 세션/확인 테스트 종료 후 점수 요약. */
export function QuizResult({
  correct,
  total,
  title,
  passed,
  passLabel,
  onPrimary,
  primaryLabel,
  onSecondary,
  secondaryLabel,
}: QuizResultProps) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);

  return (
    <Card className="p-6 text-center sm:p-8">
      <p className="text-[14px] text-ink-48">{title}</p>
      <p className="mt-2 text-[44px] font-semibold leading-none tracking-[-0.374px]">
        {pct}
        <span className="text-[24px] text-ink-48">점</span>
      </p>
      <p className="mt-2 text-[15px] text-ink-80">
        {total}문항 중 {correct}문항 정답
      </p>

      {passed !== undefined && (
        <p
          className={
            passed
              ? "mt-4 text-[16px] font-semibold text-action"
              : "mt-4 text-[16px] font-semibold text-red-500"
          }
        >
          {passLabel}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center gap-2">
        <Button onClick={onPrimary} className="w-full sm:w-auto">
          {primaryLabel}
        </Button>
        {onSecondary && secondaryLabel && (
          <Button variant="ghost" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
