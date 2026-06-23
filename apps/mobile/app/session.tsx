import { useMemo, useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  cn,
  SESSION_LABEL,
  PASS_THRESHOLD,
  type QuizQuestion,
  type QuizSession,
} from "@learnloop/core";
import { useMobileQuiz } from "@/hooks/useMobileQuiz";
import { Card, Button } from "@/ui";

const SESSION_SIZE = 5;

export default function SessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ session?: string; mode?: string }>();
  const quiz = useMobileQuiz();
  const isFinal = params.mode === "final";
  const session = (params.session as QuizSession) ?? "morning";

  // 진입 시 한 번만 문항을 고정한다. (loaded 후 첫 렌더에서 확정)
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [i, setI] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<{ passed: boolean } | null>(null);

  // 문항 확정 (quiz.loaded 이후).
  useMemo(() => {
    if (!quiz.loaded || questions) return;
    const seed = Date.now() & 0xffff;
    const qs = isFinal
      ? quiz.pickFinalTestQuestions(seed)
      : quiz.pickSessionQuestions(session, SESSION_SIZE, seed);
    setQuestions(qs);
    if (qs.length === 0) setFinished(true);
  }, [quiz.loaded, questions, isFinal, session]);

  if (!questions) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <Text className="text-ink-48">불러오는 중…</Text>
      </View>
    );
  }

  const handleGraded = (correct: boolean) => {
    quiz.recordAttempt(questions[i], correct);
    const nextCorrect = correctCount + (correct ? 1 : 0);
    setCorrectCount(nextCorrect);
    if (i + 1 >= questions.length) {
      if (isFinal) {
        const r = quiz.submitFinalTest(nextCorrect, questions.length);
        setFinalResult({ passed: r.passed });
      }
      setFinished(true);
    } else {
      setI((x) => x + 1);
    }
  };

  if (finished) {
    const pct =
      questions.length === 0
        ? 0
        : Math.round((correctCount / questions.length) * 100);
    return (
      <ScrollView
        className="flex-1 bg-canvas"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
      >
        <Card className="items-center">
          <Text className="text-[14px] text-ink-48">
            {isFinal ? `${quiz.activePack.title} 확인 테스트` : `${SESSION_LABEL[session]} 퀴즈 완료`}
          </Text>
          <Text className="mt-2 text-[44px] font-semibold text-ink">{pct}점</Text>
          <Text className="mt-1 text-[15px] text-ink-80">
            {questions.length}문항 중 {correctCount}문항 정답
          </Text>
          {finalResult ? (
            <Text
              className={cn(
                "mt-4 text-center text-[16px] font-semibold",
                finalResult.passed ? "text-action" : "text-red-500",
              )}
            >
              {finalResult.passed
                ? "🎉 통과! 다음 묶음이 열렸습니다."
                : `아쉽지만 불합격 (${Math.round(PASS_THRESHOLD * 100)}% 필요).`}
            </Text>
          ) : null}
          <Button title="퀴즈 홈으로" className="mt-6 w-full" onPress={() => router.back()} />
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
    >
      {isFinal ? (
        <Text className="mb-3 text-center text-[14px] font-medium text-action">
          {quiz.activePack.title} 확인 테스트
        </Text>
      ) : null}
      <QuizQuestionCard
        key={questions[i].id}
        question={questions[i]}
        index={i}
        total={questions.length}
        onGraded={handleGraded}
      />
    </ScrollView>
  );
}

function QuizQuestionCard({
  question,
  index,
  total,
  onGraded,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  onGraded: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const graded = selected !== null;
  const correct = selected === question.answerIndex;

  return (
    <Card>
      <View className="flex-row items-center justify-between">
        <Text className="text-[13px] text-ink-48">
          {index + 1} / {total}
        </Text>
        <Text className="text-[13px] uppercase text-ink-48">{question.topic}</Text>
      </View>

      <Text className="mt-3 text-[19px] font-semibold leading-snug text-ink">
        {question.question}
      </Text>

      <View className="mt-4 gap-2">
        {question.choices.map((c, idx) => {
          const isAnswer = idx === question.answerIndex;
          const isPicked = idx === selected;
          return (
            <Pressable
              key={idx}
              disabled={graded}
              onPress={() => setSelected(idx)}
              className={cn(
                "rounded-md border px-4 py-3",
                !graded && "border-hairline active:opacity-70",
                graded && isAnswer && "border-action bg-action/10",
                graded && isPicked && !isAnswer && "border-red-400 bg-red-50",
                graded && !isAnswer && !isPicked && "border-hairline opacity-60",
              )}
            >
              <Text className="text-[15px] text-ink">
                <Text className="font-semibold text-ink-48">
                  {String.fromCharCode(65 + idx)}{"  "}
                </Text>
                {c}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {graded ? (
        <View className="mt-4">
          <Text
            className={cn(
              "text-[15px] font-semibold",
              correct ? "text-action" : "text-red-500",
            )}
          >
            {correct ? "정답입니다 ✓" : "오답입니다 ✗"}
          </Text>
          <View className="mt-2 rounded-sm bg-parchment p-3">
            <Text className="text-[14px] leading-relaxed text-ink-80">
              {question.explanation}
            </Text>
          </View>
          <Button
            title={index + 1 === total ? "결과 보기" : "다음 문제"}
            className="mt-4"
            onPress={() => onGraded(correct)}
          />
        </View>
      ) : null}
    </Card>
  );
}
