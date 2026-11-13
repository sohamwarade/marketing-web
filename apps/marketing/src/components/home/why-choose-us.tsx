import * as React from "react";
import { CheckCircle2, ShieldCheck, Zap, Layers } from "lucide-react";
import { Section, Container } from "@puzzlers/ui";

const POINTS = [
  {
    icon: CheckCircle2,
    title: "100% Pattern & Marking Scheme Fidelity",
    desc: "MHT-CET zero-negative rules and JEE Main numerical marking schemes are accurately coded and evaluated.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Data-Loss Continuous Autosave",
    desc: "Every response is persisted both locally in your browser and on high-speed Cloudflare edge nodes. Power cuts or network drops never erase your answers.",
  },
  {
    icon: Zap,
    title: "Precision Time-Per-Question Diagnostics",
    desc: "Discover where you spent excess minutes or rushed through easy questions. Review average candidate timing against your own pacing.",
  },
  {
    icon: Layers,
    title: "All-in-One Account Workflow",
    desc: "Watch lessons, attempt chapter drills, take full mocks, and inspect your mistake notebooks under a single streamlined login.",
  },
];

export function WhyChooseUs() {
  return (
    <Section tone="white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
              Why Puzzlers
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
              Designed Around Real Testing Realities
            </h2>
            <p className="text-sm text-body leading-relaxed">
              Competitive examinations are won through consistency and exam temperament. Puzzlers removes friction so you can focus entirely on mastery.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {POINTS.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div key={idx} className="rounded-xl border border-border bg-white p-5 shadow-sm space-y-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-heading">{pt.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
