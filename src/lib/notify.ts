import { isEveningWindow, isMorningWindow } from "./session";

/**
 * 인앱 알림(보조). 서비스워커 백그라운드 타이머는 신뢰도가 낮아,
 * 앱이 열려있을 때(마운트 + visibilitychange) 시간대를 체크해
 * 오늘 아직 안 보낸 알림만 한 번 띄운다.
 */
const ENABLED_KEY = "learnloop:notify:enabled";
const LAST_PREFIX = "learnloop:lastNotified:"; // + `${session}:${YYYY-MM-DD}`

export function isNotifyEnabled(): boolean {
  return localStorage.getItem(ENABLED_KEY) === "1";
}

export function setNotifyEnabled(on: boolean): void {
  localStorage.setItem(ENABLED_KEY, on ? "1" : "0");
}

export function notifyPermission(): NotificationPermission | "unsupported" {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}

/** 토글 켜기 → 권한 요청. 허용되면 enabled=true 저장. */
export async function enableNotifications(): Promise<NotificationPermission | "unsupported"> {
  if (typeof Notification === "undefined") return "unsupported";
  let perm = Notification.permission;
  if (perm === "default") {
    perm = await Notification.requestPermission();
  }
  setNotifyEnabled(perm === "granted");
  return perm;
}

function ymd(now: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

function alreadyNotified(session: "morning" | "evening", now: Date): boolean {
  return localStorage.getItem(`${LAST_PREFIX}${session}:${ymd(now)}`) === "1";
}

function markNotified(session: "morning" | "evening", now: Date): void {
  localStorage.setItem(`${LAST_PREFIX}${session}:${ymd(now)}`, "1");
}

function fire(session: "morning" | "evening", onClick?: () => void): void {
  const title =
    session === "morning" ? "LearnLoop 아침 학습 🌅" : "LearnLoop 저녁 학습 🌙";
  const body =
    session === "morning"
      ? "아침 퀴즈를 풀고 하루를 시작하세요."
      : "저녁 퀴즈로 오늘 학습을 복습하세요.";
  const n = new Notification(title, { body, icon: "/icon-192.png" });
  n.onclick = () => {
    window.focus();
    onClick?.();
    n.close();
  };
}

/**
 * 시간대 체크 후 필요 시 알림을 띄운다.
 * @param onClick 알림 클릭 시 호출(예: 퀴즈 뷰로 이동)
 */
export function maybeNotify(onClick?: () => void, now: Date = new Date()): void {
  if (!isNotifyEnabled()) return;
  if (notifyPermission() !== "granted") return;

  if (isMorningWindow(now) && !alreadyNotified("morning", now)) {
    fire("morning", onClick);
    markNotified("morning", now);
  } else if (isEveningWindow(now) && !alreadyNotified("evening", now)) {
    fire("evening", onClick);
    markNotified("evening", now);
  }
}
