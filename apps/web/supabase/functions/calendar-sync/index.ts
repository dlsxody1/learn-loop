// 학습 기록(quiz_attempts)을 Google Calendar 이벤트로 동기화.
// 결정론적 event id로 idempotent — 여러 번 호출해도 중복 이벤트가 안 생긴다.
import { corsHeaders, json } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { insertEvent, refreshAccessToken } from "../_shared/google.ts";
import { buildCalendarEvents, toGoogleEvent } from "../_shared/calendar.ts";

interface Body {
  deviceId?: string;
  since?: string; // ISO. 미지정 시 최근 14일.
}

const DEFAULT_LOOKBACK_DAYS = 14;
// access_token이 60초 안에 만료되면 미리 갱신.
const REFRESH_SKEW_MS = 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const { deviceId } = body;
  if (!deviceId) return json({ error: "missing_device_id" }, 400);

  const since =
    body.since ??
    new Date(
      Date.now() - DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

  const sb = supabaseAdmin();

  // 1) 토큰 조회
  const { data: tokenRow, error: tokenErr } = await sb
    .from("oauth_tokens")
    .select("*")
    .eq("device_id", deviceId)
    .eq("provider", "google")
    .maybeSingle();
  if (tokenErr) return json({ error: "token_lookup_failed" }, 500);
  if (!tokenRow) return json({ error: "not_connected" }, 409);

  // 2) 만료 임박 시 refresh
  let accessToken = tokenRow.access_token as string;
  let refreshed = false;
  if (new Date(tokenRow.expires_at).getTime() - Date.now() < REFRESH_SKEW_MS) {
    try {
      const next = await refreshAccessToken(tokenRow.refresh_token as string);
      accessToken = next.access_token;
      refreshed = true;
      await sb
        .from("oauth_tokens")
        .update({
          access_token: next.access_token,
          expires_at: new Date(
            Date.now() + next.expires_in * 1000,
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("device_id", deviceId)
        .eq("provider", "google");
    } catch (e) {
      return json({ error: "refresh_failed", detail: String(e) }, 401);
    }
  }

  // 3) 학습 기록 조회
  const { data: rows, error: attErr } = await sb
    .from("quiz_attempts")
    .select("pack_id, session, correct, attempted_at")
    .eq("device_id", deviceId)
    .gte("attempted_at", since)
    .order("attempted_at", { ascending: true });
  if (attErr) return json({ error: "attempts_lookup_failed" }, 500);

  const attempts = (rows ?? []).map((r) => ({
    packId: r.pack_id as string,
    session: r.session as string,
    correct: r.correct as boolean,
    attemptedAt: r.attempted_at as string,
  }));

  // 4) 이벤트 생성
  const events = buildCalendarEvents(attempts);
  let created = 0;
  let skipped = 0;
  for (const e of events) {
    try {
      const result = await insertEvent(accessToken, toGoogleEvent(e));
      if (result === "created") created++;
      else skipped++;
    } catch (e) {
      return json(
        { error: "insert_failed", detail: String(e), created, skipped },
        502,
      );
    }
  }

  return json({ created, skipped, refreshed, total: events.length });
});
