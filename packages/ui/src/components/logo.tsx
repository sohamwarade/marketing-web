import * as React from "react";
import { cn } from "../lib/utils";

export interface LogoProps {
  variant?: "full" | "mark";
  tone?: "light" | "dark";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "full", tone = "dark", className, size = "md" }: LogoProps) {
  const isLight = tone === "light";

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 font-display select-none", className)}>
      <div className={cn("relative shrink-0 overflow-hidden rounded-xl", sizeClasses[size])}>
        <img
          src="/logo.png"
          alt="Puzzlers Logo"
          className="h-full w-full object-contain drop-shadow-xs"
        />
      </div>
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-black tracking-tight",
              textSizes[size],
              isLight ? "text-white" : "text-navy"
            )}
          >
            PUZZLERS
          </span>
          <span
            className={cn(
              "text-[9px] font-bold tracking-widest uppercase mt-0.5",
              isLight ? "text-blue-200" : "text-blue-600"
            )}
          >
            MHT-CET &amp; JEE
          </span>
        </div>
      )}
    </div>
  );
}
