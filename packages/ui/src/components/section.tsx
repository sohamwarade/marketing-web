import * as React from "react";
import { cn } from "../lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: "white" | "cream" | "pale" | "navy";
}

export function Section({ tone = "white", className, children, ...props }: SectionProps) {
  const tones: Record<string, string> = {
    white: "bg-white text-body",
    cream: "bg-cream text-body",
    pale: "bg-blue-50/60 text-body",
    navy: "bg-navy text-white",
  };

  return (
    <section className={cn("py-12 md:py-16 transition-colors", tones[tone], className)} {...props}>
      {children}
    </section>
  );
}

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
