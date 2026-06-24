/**
 * 웹 CalendarSync 구현. OAuth는 redirect(googleOauth.ts), 토큰 교환/동기화는
 * Edge Function이 한다. 클라이언트는 토큰을 보지 않는다.
 */
import type {
  CalendarConnectStatus,
  CalendarSync,
  CalendarSyncResult,
} from "@learnloop/core";
import { getDeviceId } from "@/lib/supabase";
import {
  clearOauthQuery,
  consumeOauthCallback,
  isGoogleOauthConfigured,
  startGoogleOauth,
} from "@/lib/googleOauth";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;
const CONNECTED_FLAG = "learnloop:gcal:connected";

function fnUrl(name: string): string {
  return `${SUPABASE_URL}/functions/v1/${name}`;
}

async function callFn<T>(name: string, body: unknown): Promise<T> {
  const res = await fetch(fnUrl(name), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data?.error ?? `${name} 실패 (${res.status})`);
  }
  return data;
}

export const webCalendarSync: CalendarSync = {
  async connect(): Promise<CalendarConnectStatus> {
    if (!isGoogleOauthConfigured() || !SUPABASE_URL || !ANON_KEY) {
      return "unsupported";
    }
    await startGoogleOauth(); // redirect — 이 줄 이후 페이지를 떠난다.
    return "disconnected";
  },

  async disconnect(): Promise<void> {
    localStorage.removeItem(CONNECTED_FLAG);
    // 서버 토큰 폐기는 별도 엔드포인트가 필요하나 MVP에서는 로컬 플래그만 해제.
  },

  async status(): Promise<CalendarConnectStatus> {
    if (!isGoogleOauthConfigured() || !SUPABASE_URL || !ANON_KEY) {
      return "unsupported";
    }
    return localStorage.getItem(CONNECTED_FLAG) === "1"
      ? "connected"
      : "disconnected";
  },

  async sync(opts): Promise<CalendarSyncResult> {
    const deviceId = getDeviceId();
    const result = await callFn<CalendarSyncResult>("calendar-sync", {
      deviceId,
      since: opts?.since,
    });
    return result;
  },
};

/**
 * 앱 진입 시 호출. URL이 OAuth 콜백이면 code를 교환하고 연동 플래그를 세운다.
 * 반환값: 이번에 막 연동됐는지(연동 직후 1회 자동 sync 트리거에 사용).
 */
export async function handleOauthCallbackIfPresent(): Promise<boolean> {
  const cb = consumeOauthCallback();
  if (!cb) return false;
  try {
    const deviceId = getDeviceId();
    await callFn("google-oauth-exchange", {
      deviceId,
      code: cb.code,
      codeVerifier: cb.codeVerifier,
      redirectUri: cb.redirectUri,
    });
    localStorage.setItem(CONNECTED_FLAG, "1");
    return true;
  } finally {
    clearOauthQuery();
  }
}
