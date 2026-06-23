import "../global.css";
import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();

  // 알림 탭 시 퀴즈 홈으로 이동.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      router.push("/");
    });
    return () => sub.remove();
  }, [router]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#ffffff" },
          headerTitleStyle: { fontWeight: "600" },
          headerTintColor: "#0066cc",
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "LearnLoop" }} />
        <Stack.Screen name="session" options={{ title: "퀴즈", presentation: "card" }} />
        <Stack.Screen name="settings" options={{ title: "알림 설정" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
