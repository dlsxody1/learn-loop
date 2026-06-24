/**
 * Google OAuth2 Authorization Code + PKCE (웹).
 * client secret을 노출하지 않기 위해 PKCE를 쓰고, code 교환은 Edge Function이 한다.
 * 이 모듈은 (1) authorize URL로 redirect, (2) 콜백 code 처리만 담당.
 */
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPE = "https://www.googleapis.com/auth/calendar.events";
const VERIFIER_KEY = "learnloop:gcal:verifier";
const STATE_KEY = "learnloop:gcal:state";

/** Vite 환경변수. GCP에서 발급한 Web client id와 등록된 redirect URI. */
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const REDIRECT_URI =
  (import.meta.env.VITE_GOOGLE_REDIRECT_URI as string | undefined) ??
  (typeof window !== "undefined"
    ? `${window.location.origin}/oauth/google/callback`
    : undefined);

export function isGoogleOauthConfigured(): boolean {
  return Boolean(CLIENT_ID && REDIRECT_URI);
}

function base64UrlEncode(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(len = 64): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return base64UrlEncode(arr.buffer);
}

async function challengeFromVerifier(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64UrlEncode(digest);
}

/** authorize URL로 이동. 호출 후 페이지를 떠난다. */
export async function startGoogleOauth(): Promise<void> {
  if (!CLIENT_ID || !REDIRECT_URI) {
    throw new Error("VITE_GOOGLE_CLIENT_ID / VITE_GOOGLE_REDIRECT_URI 미설정");
  }
  const verifier = randomString();
  const state = randomString(16);
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);

  const challenge = await challengeFromVerifier(verifier);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  });
  window.location.assign(`${AUTH_URL}?${params.toString()}`);
}

export interface OauthCallback {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

/**
 * 현재 URL이 OAuth 콜백이면 code+verifier를 꺼내고, 아니면 null.
 * state를 검증해 CSRF를 막는다. 성공 시 sessionStorage를 비운다.
 */
export function consumeOauthCallback(): OauthCallback | null {
  if (typeof window === "undefined") return null;
  const sp = new URLSearchParams(window.location.search);
  const code = sp.get("code");
  const state = sp.get("state");
  if (!code || !state) return null;

  const savedState = sessionStorage.getItem(STATE_KEY);
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!savedState || savedState !== state || !verifier) return null;

  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
  return { code, codeVerifier: verifier, redirectUri: REDIRECT_URI! };
}

/** 콜백 처리 후 URL의 ?code=... 를 정리한다. */
export function clearOauthQuery(): void {
  if (typeof window === "undefined") return;
  window.history.replaceState({}, "", window.location.pathname);
}
