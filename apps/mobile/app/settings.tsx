import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mobileNotifier } from "@/adapters/mobileNotifier";
import { isSupabaseEnabled } from "@/adapters/supabase";
import { Card, Button } from "@/ui";

const ENABLED_KEY = "learnloop:notify:enabled";
const MORNING = { hour: 9, minute: 0 };
const EVENING = { hour: 22, minute: 0 };

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    void AsyncStorage.getItem(ENABLED_KEY).then((v) => setEnabled(v === "1"));
  }, []);

  const enable = async () => {
    const perm = await mobileNotifier.requestPermission();
    if (perm !== "granted") {
      setStatus("알림 권한이 거부되어 켤 수 없습니다. 설정에서 허용해 주세요.");
      return;
    }
    await mobileNotifier.scheduleDaily("morning", MORNING.hour, MORNING.minute);
    await mobileNotifier.scheduleDaily("evening", EVENING.hour, EVENING.minute);
    await AsyncStorage.setItem(ENABLED_KEY, "1");
    setEnabled(true);
    setStatus("매일 09:00 · 22:00 알림이 예약되었습니다.");
  };

  const disable = async () => {
    await mobileNotifier.cancelDaily("morning");
    await mobileNotifier.cancelDaily("evening");
    await AsyncStorage.setItem(ENABLED_KEY, "0");
    setEnabled(false);
    setStatus("알림 예약을 해제했습니다.");
  };

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
    >
      <Card>
        <Text className="text-[19px] font-semibold text-ink">매일 학습 알람</Text>
        <Text className="mt-1 text-[14px] leading-relaxed text-ink-48">
          아침 09:00 · 저녁 22:00에 잠금화면 알림을 보냅니다. 앱이 닫혀 있어도
          예약된 시간에 울립니다.
        </Text>

        <View className="mt-4 flex-row items-center justify-between border-t border-divider pt-4">
          <View>
            <Text className="text-[15px] font-medium text-ink">알림 사용</Text>
            <Text className="text-[13px] text-ink-48">{enabled ? "켜짐" : "꺼짐"}</Text>
          </View>
          <Button
            title={enabled ? "끄기" : "켜기"}
            variant={enabled ? "secondary" : "primary"}
            onPress={enabled ? disable : enable}
          />
        </View>

        {status ? (
          <Text className="mt-3 text-[13px] text-action">{status}</Text>
        ) : null}
      </Card>

      <Card className="mt-4">
        <Text className="text-[15px] font-medium text-ink">동기화</Text>
        <Text className="mt-1 text-[13px] leading-relaxed text-ink-48">
          {isSupabaseEnabled
            ? "Supabase 동기화 켜짐 — 같은 기기 ID의 웹/모바일 진도가 합쳐집니다."
            : "로컬 저장 모드 — 이 기기에만 진도가 저장됩니다."}
        </Text>
      </Card>
    </ScrollView>
  );
}
