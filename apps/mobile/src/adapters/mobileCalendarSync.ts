/**
 * 모바일 CalendarSync 구현. OAuth는 expo-auth-session(googleOauth.ts),
 * code 교환/동기화는 웹과 동일한 Edge Function이 한다.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  CalendarConnectStatus,
  CalendarSync,
  CalendarSyncResult,
} from "@learnloop/core";
import { getDeviceId } from "@/adapters/supabase";
import {
  isGoogleOauthConfigured,
  promptGoogleOauth,
} from "@/adapters/googleOauth";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const CONNECTED_FLAG = "learnloop:gcal:connected";

async function callFn<T>(name: string, body: unknown): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(data?.error ?? `${name} 실패 (${res.status})`);
  return data;
}

export const mobileCalendarSync: CalendarSync = {
  async connect(): Promise<CalendarConnectStatus> {
    if (!isGoogleOauthConfigured() || !SUPABASE_URL || !ANON_KEY) {
      return "unsupported";
    }
    const oauth = await promptGoogleOauth();
    if (!oauth) return "disconnected"; // 사용자 취소
    const deviceId = await getDeviceId();
    await callFn("google-oauth-exchange", {
      deviceId,
      code: oauth.code,
      codeVerifier: oauth.codeVerifier,
      redirectUri: oauth.redirectUri,
    });
    await AsyncStorage.setItem(CONNECTED_FLAG, "1");
    return "connected";
  },

  async disconnect(): Promise<void> {
    await AsyncStorage.removeItem(CONNECTED_FLAG);
  },

  async status(): Promise<CalendarConnectStatus> {
    if (!isGoogleOauthConfigured() || !SUPABASE_URL || !ANON_KEY) {
      return "unsupported";
    }
    const v = await AsyncStorage.getItem(CONNECTED_FLAG);
    return v === "1" ? "connected" : "disconnected";
  },

  async sync(opts): Promise<CalendarSyncResult> {
    const deviceId = await getDeviceId();
    return callFn<CalendarSyncResult>("calendar-sync", {
      deviceId,
      since: opts?.since,
    });
  },
};
