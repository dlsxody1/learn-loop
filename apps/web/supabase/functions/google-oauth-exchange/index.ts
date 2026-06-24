// OAuth authorization code → access/refresh token 교환 후 oauth_tokens에 저장.
// 토큰은 응답으로 반환하지 않는다(클라이언트는 연동 성공 여부만 안다).
import { corsHeaders, json } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { exchangeCode } from "../_shared/google.ts";

interface Body {
  deviceId?: string;
  code?: string;
  codeVerifier?: string;
  redirectUri?: string; // 모바일(expo proxy)은 web과 다른 redirect를 쓸 수 있음
}

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

  const { deviceId, code, codeVerifier, redirectUri } = body;
  if (!deviceId || !code || !codeVerifier) {
    return json({ error: "missing_params" }, 400);
  }

  try {
    const tokens = await exchangeCode(code, codeVerifier, redirectUri);
    if (!tokens.refresh_token) {
      // prompt=consent + access_type=offline 인데도 없으면 재동의 필요.
      return json({ error: "no_refresh_token" }, 400);
    }

    const expiresAt = new Date(
      Date.now() + tokens.expires_in * 1000,
    ).toISOString();

    const sb = supabaseAdmin();
    const { error } = await sb.from("oauth_tokens").upsert(
      {
        device_id: deviceId,
        provider: "google",
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt,
        scope: tokens.scope,
        token_type: tokens.token_type ?? "Bearer",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id,provider" },
    );
    if (error) throw error;

    return json({ connected: true, scope: tokens.scope });
  } catch (e) {
    return json({ error: "exchange_failed", detail: String(e) }, 500);
  }
});
