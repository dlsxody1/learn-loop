import * as Notifications from "expo-notifications";
import type { Notifier, NotifyPermission, QuizSession } from "@learnloop/core";

/**
 * 모바일 알림 — expo-notifications 로컬 스케줄.
 * 진짜 OS 예약 알림(앱이 닫혀 있어도 매일 같은 시각 잠금화면 알림). 서버 불필요.
 */

// 포그라운드에서도 알림 배너를 띄운다.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SESSION_TEXT: Record<QuizSession, { title: string; body: string }> = {
  morning: {
    title: "LearnLoop 아침 학습 🌅",
    body: "아침 퀴즈를 풀고 하루를 시작하세요.",
  },
  evening: {
    title: "LearnLoop 저녁 학습 🌙",
    body: "저녁 퀴즈로 오늘 학습을 복습하세요.",
  },
};

function toPermission(
  status: Notifications.PermissionStatus,
): NotifyPermission {
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  return "default";
}

/** 같은 세션의 기존 예약을 식별자로 찾는다(중복 예약 방지). */
async function scheduledIdsFor(session: QuizSession): Promise<string[]> {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all
    .filter((n) => n.content.data?.session === session)
    .map((n) => n.identifier);
}

export const mobileNotifier: Notifier = {
  async permission() {
    const { status } = await Notifications.getPermissionsAsync();
    return toPermission(status);
  },

  async requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    return toPermission(status);
  },

  async scheduleDaily(session, hour, minute) {
    // 기존 예약 제거 후 재등록.
    for (const id of await scheduledIdsFor(session)) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    const text = SESSION_TEXT[session];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: text.title,
        body: text.body,
        data: { session, route: "/quiz" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  },

  async cancelDaily(session) {
    for (const id of await scheduledIdsFor(session)) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  },
};
