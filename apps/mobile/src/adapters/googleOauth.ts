/**
 * Google OAuth2 + PKCE (모바일, expo-auth-session).
 * Native custom scheme(learnloop://) redirect를 쓴다 — expo-auth-session 56에는
 * Expo proxy(auth.expo.io)가 없다. code 교환은 Edge Function이 하고,
 * 클라이언트가 redirectUri를 함께 넘겨 Edge Function이 동일 redirect로 교환한다.
 */
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const SCOPE = ["https://www.googleapis.com/auth/calendar.events"];
const DISCOVERY = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export function isGoogleOauthConfigured(): boolean {
  return Boolean(CLIENT_ID);
}

export interface MobileOauthResult {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

/**
 * 시스템 브라우저로 동의 흐름을 띄우고 authorization code + verifier를 반환.
 * 취소/실패 시 null.
 */
export async function promptGoogleOauth(): Promise<MobileOauthResult | null> {
  if (!CLIENT_ID) throw new Error("EXPO_PUBLIC_GOOGLE_CLIENT_ID 미설정");

  // app.json scheme "learnloop" → learnloop://oauth 로 복귀.
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "learnloop",
    path: "oauth",
  });

  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    scopes: SCOPE,
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true,
    extraParams: { access_type: "offline", prompt: "consent" },
  });

  const result = await request.promptAsync(DISCOVERY);

  if (result.type !== "success" || !result.params.code) return null;
  return {
    code: result.params.code,
    codeVerifier: request.codeVerifier ?? "",
    redirectUri,
  };
}
