import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as Crypto from "expo-crypto";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** 환경변수가 있으면 Supabase 클라이언트 생성(없으면 null → 로컬 폴백). */
export const supabase: SupabaseClient | null =
  url && publishableKey
    ? createClient(url, publishableKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export const isSupabaseEnabled = supabase !== null;

const DEVICE_ID_KEY = "learnloop:device-id";
let cachedDeviceId: string | null = null;

/**
 * 기기 식별자. 웹과 동일한 device_id 규칙을 쓰면 같은 사용자의 진도가 합쳐진다.
 * (웹은 동기 localStorage라 즉시 반환하지만, RN은 비동기라 최초 1회 비동기 로드.)
 */
export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = Crypto.randomUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  cachedDeviceId = id;
  return id;
}
