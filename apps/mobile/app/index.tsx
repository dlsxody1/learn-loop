import { ScrollView, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { suggestedSession, SESSION_LABEL, type QuizSession } from "@learnloop/core";
import { useMobileQuiz } from "@/hooks/useMobileQuiz";
import { Card, Button } from "@/ui";

export default function QuizHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const quiz = useMobileQuiz();
  const { activePack, progress } = quiz;
  const suggested = suggestedSession();
  const ratioPct = Math.round(progress.ratio * 100);

  const startSession = (session: QuizSession) => {
    router.push({ pathname: "/session", params: { session } });
  };

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
    >
      <Text className="text-[14px] text-action">
        학습 묶음 {activePack.order} · {activePack.title}
      </Text>
      <Text className="mt-1 text-[28px] font-semibold text-ink">오늘의 퀴즈</Text>
      <Text className="mt-2 text-[15px] leading-relaxed text-ink-48">
        {activePack.description}
      </Text>

      <Card className="mt-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-[14px] text-ink-48">
            이번 묶음 진도 {progress.answered}/{progress.total}
          </Text>
          <Text className="text-[14px] text-ink">{ratioPct}%</Text>
        </View>
        <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-divider">
          <View
            className="h-full rounded-full bg-action"
            style={{ width: `${ratioPct}%` }}
          />
        </View>
        {progress.completed ? (
          <Text className="mt-3 text-[13px] text-action">
            ✓ 확인 테스트 통과 ({progress.completed.finalTestScore}점)
          </Text>
        ) : null}
      </Card>

      <View className="mt-5 gap-4">
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
      </View>

      <Card className="mt-5">
        <Text className="text-[17px] font-semibold text-ink">확인 테스트</Text>
        <Text className="mt-1 text-[14px] leading-relaxed text-ink-48">
          {progress.finalTestUnlocked
            ? "무작위 20문항 중 70% 이상 맞히면 다음 묶음이 열립니다."
            : "묶음의 80%를 풀거나 시작 후 28일이 지나면 열립니다."}
        </Text>
        <Button
          title="확인 테스트 보기"
          variant="secondary"
          className="mt-4"
          disabled={!progress.finalTestUnlocked}
          onPress={() => router.push({ pathname: "/session", params: { mode: "final" } })}
        />
      </Card>

      <Link href="/settings" className="mt-6 text-center text-[15px] text-action">
        매일 학습 알람 설정 →
      </Link>
    </ScrollView>
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
    <Card>
      <View className="flex-row items-center gap-2">
        <Text className="text-[22px]">{emoji}</Text>
        <Text className="text-[19px] font-semibold text-ink">
          {SESSION_LABEL[session]} 퀴즈
        </Text>
        {recommended ? (
          <View className="ml-auto rounded-full bg-action/10 px-2 py-0.5">
            <Text className="text-[11px] font-medium text-action">지금 추천</Text>
          </View>
        ) : null}
      </View>
      <Text className="mt-2 text-[14px] leading-relaxed text-ink-48">
        5문항 빠른 풀이 · 즉시 채점 + 해설
      </Text>
      <Button title={`${SESSION_LABEL[session]} 시작`} className="mt-4" onPress={onStart} />
    </Card>
  );
}
