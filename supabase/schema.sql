-- LINE Prep — Supabase 스키마
-- Supabase 프로젝트 생성 후 SQL Editor에 붙여넣어 실행하세요.

-- 풀이 저장 테이블
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

-- 커리큘럼 체크리스트 상태
create table if not exists public.checklist (
  device_id  text not null,
  item_key   text not null,
  done       boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (device_id, item_key)
);

-- 개인용(단일 기기) 앱이라 RLS는 익명 키 접근을 허용한다.
-- 여러 사용자로 확장하려면 auth.uid() 기반 정책으로 교체하세요.
alter table public.solutions enable row level security;
alter table public.checklist enable row level security;

create policy "anon full access solutions" on public.solutions
  for all using (true) with check (true);

create policy "anon full access checklist" on public.checklist
  for all using (true) with check (true);
