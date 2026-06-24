// service_role 키로 만든 Supabase 클라이언트. RLS를 우회하므로
// oauth_tokens(정책 없음) 같은 보호 테이블에 접근할 수 있다.
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY는 Edge 런타임이 기본 주입한다.
import { createClient } from "jsr:@supabase/supabase-js@2";

export function supabaseAdmin() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 미설정");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
