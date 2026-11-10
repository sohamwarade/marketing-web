import * as React from "react";
import { cn } from "../lib/utils";

export interface LogoProps {
  variant?: "full" | "mark";
  tone?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "full", tone = "dark", className }: LogoProps) {
  const isLight = tone === "light";

  return (
    <div className={cn("inline-flex items-center gap-2 font-display select-none", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-navy text-white shadow-md">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-amber"
        >
          <path d="m10 15 5-5-5-5" />
          <path d="M4 20h7a4 4 0 0 0 4-4V4" />
        </svg>
      </div>
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "text-xl font-black tracking-tight",
              isLight ? "text-white" : "text-navy"
            )}
          >
            PUZZLERS
          </span>
          <span
            className={cn(
              "text-[9px] font-bold tracking-widest uppercase",
              isLight ? "text-blue-200" : "text-blue-600"
            )}
          >
            MHT-CET & JEE
          </span>
        </div>
      )}
    </div>
  );
}
