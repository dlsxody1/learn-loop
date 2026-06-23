import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** 카드: 18px radius, 1px 하airline 보더, 드롭섀도 없음 (Apple 규칙). */
export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-hairline bg-canvas",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
