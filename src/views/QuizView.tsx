import { useState } from "react";
import type { QuizQuestion, QuizSession } from "@/types";
import { useQuiz } from "@/hooks/useQuiz";
import { suggestedSession, SESSION_LABEL } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuizSessionView } from "./QuizSessionView";
import { QuizFinalTestView } from "./QuizFinalTestView";

const SESSION_SIZE = 5;

type Mode =
  | { kind: "home" }
  | { kind: "session"; session: QuizSession; questions: QuizQuestion[] }
  | { kind: "final"; questions: QuizQuestion[] };

/** 퀴즈 메인 라우터: 홈(세션 선택/확인 테스트) ↔ 세션 ↔ 확인 테스트. */
export function QuizView() {
  const quiz = useQuiz();
  const [mode, setMode] = useState<Mode>({ kind: "home" });
  const { activePack, progress } = quiz;

  // 진입 시 시드를 매번 살짝 다르게(시간 기반) — 같은 세션 재진입 시 새 문항.
  const startSession = (session: QuizSession) => {
    const seed = Date.now() & 0xffff;
    const questions = quiz.pickSessionQuestions(session, SESSION_SIZE, seed);
    if (questions.length === 0) return;
    setMode({ kind: "session", session, questions });
  };

  const startFinalTest = () => {
    const seed = Date.now() & 0xffff;
    const questions = quiz.pickFinalTestQuestions(seed);
    if (questions.length === 0) return;
    setMode({ kind: "final", questions });
  };

  const backHome = () => setMode({ kind: "home" });

  if (mode.kind === "session") {
    return (
      <section className="mx-auto max-w-[680px] px-4 py-7 sm:px-5 sm:py-8">
        <QuizSessionView
          session={mode.session}
          questions={mode.questions}
          onRecord={quiz.recordAttempt}
          onDone={backHome}
        />
      </section>
    );
  }

  if (mode.kind === "final") {
    return (
      <section className="mx-auto max-w-[680px] px-4 py-7 sm:px-5 sm:py-8">
        <QuizFinalTestView
          packTitle={activePack.title}
          questions={mode.questions}
          onRecord={quiz.recordAttempt}
          onSubmit={quiz.submitFinalTest}
          onDone={backHome}
        />
      </section>
    );
  }

  const suggested = suggestedSession();
  const ratioPct = Math.round(progress.ratio * 100);
  const hasQuestions = progress.total > 0;

  return (
    <section className="mx-auto max-w-[680px] px-4 py-7 sm:px-5 sm:py-8">
      <p className="text-[14px] tracking-[-0.224px] text-action">
        학습 묶음 {activePack.order} · {activePack.title}
      </p>
      <h1 className="mt-1 text-[28px] font-semibold leading-[1.1] tracking-[-0.374px] sm:text-[34px]">
        오늘의 퀴즈
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-48 sm:text-[16px]">
        {activePack.description}
      </p>

      {!hasQuestions ? (
        <Card className="mt-6 p-6 text-center text-ink-48">
          이 묶음의 문제가 아직 준비 중입니다. 직전 묶음을 통과하면 열려요.
        </Card>
      ) : (
        <>
          <Card className="mt-6 p-5 sm:p-6">
            <ProgressBar
              value={ratioPct}
              label={`이번 묶음 진도 ${progress.answered}/${progress.total}`}
            />
            {progress.completed && (
              <p className="mt-3 text-[13px] text-action">
                ✓ 확인 테스트 통과 ({progress.completed.finalTestScore}점)
              </p>
            )}
          </Card>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SessionCard
              session="morning"
              recommended={suggested === "morning"}
              onStart={() => startSession("morning")}
            />
            <SessionCard
              session="evening"
              recommended={suggested === "evening"}
              onStart={() => startSession("evening")}
            />
          </div>

          <Card className="mt-5 p-5 sm:p-6">
            <h3 className="text-[17px] font-semibold tracking-[-0.3px]">
              확인 테스트
            </h3>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-48">
              {progress.finalTestUnlocked
                ? "무작위 20문항 중 70% 이상 맞히면 다음 묶음이 열립니다."
                : "묶음의 80%를 풀거나 시작 후 28일이 지나면 열립니다."}
            </p>
            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={startFinalTest}
                disabled={!progress.finalTestUnlocked}
              >
                확인 테스트 보기
              </Button>
            </div>
          </Card>
        </>
      )}
    </section>
  );
}

function SessionCard({
  session,
  recommended,
  onStart,
}: {
  session: QuizSession;
  recommended: boolean;
  onStart: () => void;
}) {
  const emoji = session === "morning" ? "🌅" : "🌙";
  return (
    <Card className="flex flex-col p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="text-[22px]" aria-hidden="true">
          {emoji}
        </span>
        <h3 className="text-[19px] font-semibold tracking-[-0.3px]">
          {SESSION_LABEL[session]} 퀴즈
        </h3>
        {recommended && (
          <span className="ml-auto rounded-full bg-action/10 px-2 py-0.5 text-[11px] font-medium text-action">
            지금 추천
          </span>
        )}
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-48">
        {SESSION_SIZE}문항 빠른 풀이 · 즉시 채점 + 해설
      </p>
      <div className="mt-4">
        <Button onClick={onStart}>{SESSION_LABEL[session]} 시작</Button>
      </div>
    </Card>
  );
}
