// Google OAuth2 token endpoint + Calendar API 래퍼.
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_EVENTS_URL =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

function clientCreds() {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI");
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI 미설정",
    );
  }
  return { clientId, clientSecret, redirectUri };
}

/** authorization code → tokens (PKCE code_verifier 포함). */
export async function exchangeCode(
  code: string,
  codeVerifier: string,
  redirectOverride?: string,
): Promise<GoogleTokens> {
  const { clientId, clientSecret, redirectUri } = clientCreds();
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectOverride ?? redirectUri,
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`token exchange 실패: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/** refresh_token → 새 access_token. */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<GoogleTokens> {
  const { clientId, clientSecret } = clientCreds();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`token refresh 실패: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export type InsertResult = "created" | "skipped";

/**
 * events.insert. 결정론적 id가 이미 존재하면 Google이 409를 반환 → skipped.
 * (idempotency: 같은 학습 세션을 두 번 만들지 않는다.)
 */
export async function insertEvent(
  accessToken: string,
  event: Record<string, unknown>,
): Promise<InsertResult> {
  const res = await fetch(CALENDAR_EVENTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
  if (res.status === 409) return "skipped"; // 이미 존재
  if (!res.ok) {
    throw new Error(`event insert 실패: ${res.status} ${await res.text()}`);
  }
  return "created";
}
