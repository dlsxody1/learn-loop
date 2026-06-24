-- LearnLoop — Supabase 스키마
-- 이 파일은 적용된 마이그레이션(init_learnloop_schema_with_quiz)과 동일하다.
--
-- ⚠️ RLS 정책 주의: 개인용(단일 기기) 앱이라 데이터를 device_id로만 묶고
-- 익명 키의 전체 접근(using/with check = true)을 허용한다. Supabase linter가
-- 이를 "RLS Policy Always True"로 경고하는데, 이는 의도된 트레이드오프다.
-- 여러 사용자로 확장하려면 Supabase Auth 도입 후 모든 정책을
-- `using (device_id = auth.uid()::text)` 형태로 교체하라.

-- ── 풀이 저장 ──────────────────────────────────────────────
create table if not exists public.solutions (
  id            text primary key,
  device_id     text not null,
  problem_id    text not null,
  problem_title text not null,
  category      text not null check (category in ('algorithm', 'fe-concept')),
  week          int  not null,
  language      text not null default 'typescript',
  code          text not null default '',
  notes         text not null default '',
  created_at    timestamptz not null default now()
);
create index if not exists solutions_device_idx on public.solutions (device_id, created_at desc);

-- ── 커리큘럼 체크리스트 ────────────────────────────────────
create table if not exists public.checklist (
  device_id  text not null,
  item_key   text not null,
  done       boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (device_id, item_key)
);

-- ── 퀴즈 풀이 기록 ─────────────────────────────────────────
create table if not exists public.quiz_attempts (
  id           uuid primary key,
  device_id    text not null,
  question_id  text not null,
  pack_id      text not null,
  session      text not null check (session in ('morning', 'evening')),
  correct      boolean not null,
  attempted_at timestamptz not null default now()
);
create index if not exists quiz_attempts_device_idx
  on public.quiz_attempts (device_id, pack_id, attempted_at desc);

-- ── 팩 확인 테스트 통과 기록 ───────────────────────────────
create table if not exists public.pack_completions (
  device_id        text not null,
  pack_id          text not null,
  final_test_score int  not null,
  passed_at        timestamptz not null default now(),
  primary key (device_id, pack_id)
);

-- ── 퀴즈 KV 상태(활성 팩, 팩 시작일 등) ────────────────────
create table if not exists public.quiz_state (
  device_id  text not null,
  key        text not null,
  value      text not null,
  updated_at timestamptz not null default now(),
  primary key (device_id, key)
);

-- ── OAuth 토큰(Google Calendar 연동) ───────────────────────
-- ⚠️ 다른 테이블과 달리 anon/authenticated 접근을 완전히 차단한다.
--    refresh_token 탈취 방지를 위해 service_role(Edge Function)만 접근.
--    (RLS enable + 정책 없음 + GRANT 회수) 세 겹 차단. 토큰은 클라이언트로 절대 안 나간다.
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

-- ── RLS (device_id 익명 접근, 위 주의사항 참고) ────────────
alter table public.solutions        enable row level security;
alter table public.checklist        enable row level security;
alter table public.quiz_attempts    enable row level security;
alter table public.pack_completions enable row level security;
alter table public.quiz_state       enable row level security;

create policy "anon full access solutions" on public.solutions
  for all using (true) with check (true);
create policy "anon full access checklist" on public.checklist
  for all using (true) with check (true);
create policy "anon full access quiz_attempts" on public.quiz_attempts
  for all using (true) with check (true);
create policy "anon full access pack_completions" on public.pack_completions
  for all using (true) with check (true);
create policy "anon full access quiz_state" on public.quiz_state
  for all using (true) with check (true);

-- oauth_tokens는 service_role 전용: RLS는 켜되 정책을 만들지 않고,
-- anon/authenticated GRANT는 회수, service_role에만 DML 부여.
alter table public.oauth_tokens enable row level security;
revoke all on public.oauth_tokens from anon, authenticated;
grant select, insert, update, delete on public.oauth_tokens to service_role;
