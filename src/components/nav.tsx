import type { ReactNode } from "react";

export type View = "today" | "quiz" | "curriculum" | "archive" | "progress";

export interface NavTab {
  id: View;
  label: string;
  /** 하단 탭 바용 인라인 SVG — 24x24 viewBox, currentColor stroke. */
  icon: ReactNode;
}

const i = (d: string): ReactNode => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const TABS: NavTab[] = [
  { id: "today", label: "오늘", icon: i("M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z") },
  {
    id: "quiz",
    label: "퀴즈",
    icon: i(
      "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1 1-1 1.7M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    ),
  },
  {
    id: "curriculum",
    label: "커리큘럼",
    icon: i("M4 5h16M4 5v14M4 12h16M4 19h16M9 5v14"),
  },
  {
    id: "archive",
    label: "기록",
    icon: i("M4 7h16M4 7l1 12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"),
  },
  {
    id: "progress",
    label: "진행",
    icon: i("M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-8"),
  },
];
