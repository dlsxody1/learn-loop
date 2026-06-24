-- LearnLoop — OAuth 토큰 저장 (Google Calendar 연동)
-- ⚠️ 다른 테이블과 달리 anon/authenticated 접근을 완전히 차단한다.
--    refresh_token 탈취를 막기 위해 service_role(Edge Function)만 접근.
--    (1) RLS enable, (2) anon/authenticated 정책 없음, (3) GRANT 회수 — 세 겹 차단.
create table if not exists public.oauth_tokens (
  device_id     text not null,
  provider      text not null default 'google',
  access_token  text not null,
  refresh_token text not null,
  expires_at    timestamptz not null,
  scope         text not null,
  token_type    text not null default 'Bearer',
  updated_at    timestamptz not null default now(),
  primary key (device_id, provider)
);

alter table public.oauth_tokens enable row level security;

-- 정책을 만들지 않는다 → anon/authenticated 기본 거부. 상속 GRANT까지 회수.
revoke all on public.oauth_tokens from anon, authenticated;
-- 이 프로젝트는 명시적 GRANT 패턴을 쓰므로 service_role에 DML을 직접 부여.
grant select, insert, update, delete on public.oauth_tokens to service_role;
