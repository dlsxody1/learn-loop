import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CalendarConnectStatus } from "@learnloop/core";
import { mobileNotifier } from "@/adapters/mobileNotifier";
import { isSupabaseEnabled } from "@/adapters/supabase";
import { mobileCalendarSync } from "@/adapters/mobileCalendarSync";
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

      <CalendarSyncCard />
    </ScrollView>
  );
}

/** Google Calendar 연동 — 학습 기록을 캘린더 이벤트로 동기화. */
function CalendarSyncCard() {
  const [conn, setConn] = useState<CalendarConnectStatus>("disconnected");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void mobileCalendarSync.status().then(setConn);
  }, []);

  const connect = async () => {
    setBusy(true);
    setStatus("");
    try {
      const r = await mobileCalendarSync.connect();
      setConn(r);
      if (r === "connected") {
        setStatus("연동됐습니다. 최근 학습 기록을 동기화하는 중…");
        const since = new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString();
        const s = await mobileCalendarSync.sync({ since });
        setStatus(`동기화 완료 · ${s.created}건 추가, ${s.skipped}건 기존.`);
      } else if (r === "unsupported") {
        setStatus("Google Calendar 연동이 설정되지 않았습니다 (env 미설정).");
      }
    } catch (e) {
      setStatus(`연동 실패: ${String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const syncNow = async () => {
    setBusy(true);
    setStatus("동기화 중…");
    try {
      const s = await mobileCalendarSync.sync();
      setStatus(`동기화 완료 · ${s.created}건 추가, ${s.skipped}건 기존.`);
    } catch (e) {
      setStatus(`동기화 실패: ${String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    await mobileCalendarSync.disconnect();
    setConn("disconnected");
    setStatus("연동을 해제했습니다.");
  };

  return (
    <Card className="mt-4">
      <Text className="text-[19px] font-semibold text-ink">
        Google Calendar 연동
      </Text>
      <Text className="mt-1 text-[14px] leading-relaxed text-ink-48">
        언제 어떤 팩을 몇 문제 풀었는지 캘린더에 자동으로 기록합니다.
      </Text>

      <View className="mt-4 flex-row items-center justify-between border-t border-divider pt-4">
        <View className="flex-1 pr-3">
          <Text className="text-[15px] font-medium text-ink">
            {conn === "unsupported"
              ? "설정 필요"
              : conn === "connected"
                ? "연동됨"
                : "연동 안 됨"}
          </Text>
          <Text className="text-[13px] text-ink-48">
            {conn === "connected"
              ? "학습 기록이 내 캘린더에 남습니다."
              : "Google 계정으로 연동하세요."}
          </Text>
        </View>
        {conn === "connected" ? (
          <View className="flex-row gap-2">
            <Button title="해제" variant="secondary" onPress={disconnect} />
            <Button title="동기화" variant="primary" onPress={syncNow} />
          </View>
        ) : (
          <Button
            title="연동하기"
            variant="primary"
            onPress={connect}
            disabled={busy || conn === "unsupported"}
          />
        )}
      </View>

      {status ? (
        <Text className="mt-3 text-[13px] text-action">{status}</Text>
      ) : null}
    </Card>
  );
}
