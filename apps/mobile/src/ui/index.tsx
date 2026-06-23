import { Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "@learnloop/core";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "rounded-lg border border-hairline bg-canvas p-5",
        className,
      )}
    >
      {children}
    </View>
  );
}

interface BtnProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export function Button({ title, variant = "primary", className, ...rest }: BtnProps) {
  const disabled = rest.disabled;
  return (
    <Pressable
      className={cn(
        "min-h-[44px] items-center justify-center rounded-full px-5 active:opacity-80",
        variant === "primary" ? "bg-action" : "border border-action bg-canvas",
        disabled && "opacity-40",
        className,
      )}
      {...rest}
    >
      <Text
        className={cn(
          "text-[16px] font-medium",
          variant === "primary" ? "text-white" : "text-action",
        )}
      >
        {title}
      </Text>
    </Pressable>
  );
}
