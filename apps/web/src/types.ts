export type ProblemCategory = "algorithm" | "fe-concept";

export type Difficulty = "easy" | "medium" | "hard";

export interface Problem {
  id: string;
  week: number;
  category: ProblemCategory;
  title: string;
  difficulty: Difficulty;
  /** 문제 본문 (마크다운 아님, 일반 텍스트 단락). */
  prompt: string;
  /** 풀이를 시작할 때 에디터에 채워질 보일러플레이트. */
  starter?: string;
  /** JD 키워드 태그 — 무엇을 검증하는 문제인지. */
  tags: string[];
  /** 펼쳐 볼 수 있는 핵심 힌트 / 모범 답안 포인트. */
  hint?: string;
}

export interface CurriculumItem {
  text: string;
}

export interface CurriculumWeek {
  week: number;
  title: string;
  goal: string;
  items: CurriculumItem[];
  deliverable: string;
}

export interface CurriculumPhase {
  id: string;
  name: string;
  weeks: number[];
  theme: string;
}

/** 사용자가 저장한 풀이 1건. */
export interface Solution {
  id: string;
  problemId: string;
  problemTitle: string;
  category: ProblemCategory;
  week: number;
  language: string;
  code: string;
  notes: string;
  createdAt: string; // ISO
}

/** 커리큘럼 체크리스트 항목 완료 상태. key = `${week}:${index}`. */
export type ChecklistState = Record<string, boolean>;

// ── 퀴즈 (아침/저녁 분리 + 점프 학습) ─────────────────────────
export type QuizSession = "morning" | "evening";

export type QuizTopic =
  | "javascript"
  | "typescript"
  | "react"
  | "web"
  | "css"
  | "browser"
  | "perf";

export interface QuizQuestion {
  id: string; // "p1-m-001" (pack1, morning, 001)
  packId: string; // "pack-1"
  topic: QuizTopic;
  session: QuizSession;
  difficulty: Difficulty;
  question: string;
  choices: string[]; // 4지선다
  answerIndex: number;
  explanation: string;
}

export interface QuizPack {
  id: string; // "pack-1"
  order: number; // 1, 2, 3...
  title: string; // "JS/React 기초"
  description: string;
  /** 기본 첫 팩만 true. 확인 테스트 통과 시 다음 팩 unlock. */
  unlocked: boolean;
}

export interface QuizAttempt {
  id: string;
  questionId: string;
  packId: string;
  session: QuizSession;
  correct: boolean;
  attemptedAt: string; // ISO
}

export interface PackCompletion {
  packId: string;
  finalTestScore: number; // 0~100
  passedAt: string; // ISO
}
