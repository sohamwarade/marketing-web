import * as React from "react";
import { BookOpen, CheckCircle, Laptop, TrendingUp } from "lucide-react";
import { Section, Container } from "@puzzlers/ui";

const STEPS = [
  {
    step: "01",
    icon: BookOpen,
    title: "Learn",
    desc: "Understand concepts deeply through syllabus-mapped video lessons and notes.",
  },
  {
    step: "02",
    icon: CheckCircle,
    title: "Practise",
    desc: "Solve chapter questions with instant step-by-step solutions to build muscle memory.",
  },
  {
    step: "03",
    icon: Laptop,
    title: "Test",
    desc: "Attempt full CBT mocks under strict exam conditions, section timers, and negative marking.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Analyse & Improve",
    desc: "Pinpoint weak chapters, revise mistake notebooks, and watch your percentiles climb.",
  },
];

export function LearningWorkflow() {
  return (
    <Section tone="pale">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Proven Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight mt-3">
            The 4-Step Learning Workflow
          </h2>
          <p className="mt-2 text-sm text-body">
            A continuous feedback loop designed to systematically eliminate careless errors and blind spots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="relative rounded-2xl border border-border bg-white p-6 shadow-sm flex flex-col items-center text-center">
                <span className="absolute top-4 right-4 text-xs font-mono font-bold text-muted-foreground/50">
                  {s.step}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-heading">{s.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
