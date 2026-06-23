import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@learnloop/core";

type Variant = "primary" | "secondary" | "utility" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * Apple 버튼 문법: 액션은 pill, 유틸리티는 사각.
 * 누름 피드백 scale(0.95)은 .press 유틸이 담당.
 */
const base = "press inline-flex items-center justify-center font-normal disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // Action Blue pill — 브랜드 액션 신호
  primary:
    "rounded-full bg-action text-white px-5 min-h-[44px] text-[17px] hover:opacity-90",
  // 투명 + 1px Action Blue 보더 pill
  secondary:
    "rounded-full border border-action text-action px-5 min-h-[44px] text-[17px] hover:bg-action/5",
  // ink fill 사각 8px / 14px — 보조 유틸리티
  utility:
    "rounded-[8px] bg-ink text-white px-4 py-2 text-[14px] hover:opacity-90",
  ghost:
    "rounded-[8px] text-action px-3 py-2 text-[14px] hover:bg-action/5",
};

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
