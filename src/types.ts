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
