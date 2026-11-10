import * as React from "react";
import { cn } from "../lib/utils";

export interface ExamBadgeProps {
  code: string;
  className?: string;
}

export function ExamBadge({ code, className }: ExamBadgeProps) {
  const normalized = code.toUpperCase().replace("-", "_");

  let label = code;
  let bgClass = "bg-blue-50 text-blue-700 border-blue-200";

  if (normalized.includes("MHT") || normalized.includes("CET")) {
    label = "MHT-CET";
    bgClass = "bg-amber-50 text-amber-800 border-amber-200";
  } else if (normalized.includes("ADVANCED")) {
    label = "JEE Advanced";
    bgClass = "bg-purple-50 text-purple-800 border-purple-200";
  } else if (normalized.includes("JEE")) {
    label = "JEE Main";
    bgClass = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
        bgClass,
        className
      )}
    >
      {label}
    </span>
  );
}
