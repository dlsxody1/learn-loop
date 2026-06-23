import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** 환경변수가 채워졌을 때만 Supabase 클라이언트를 만든다. 아니면 null → 로컬 폴백. */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseEnabled = supabase !== null;

/** 단일 사용자(개인용) 식별자. 인증 없이 기기 단위로 데이터를 묶는다. */
export function getDeviceId(): string {
  const KEY = "line-prep:device-id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
