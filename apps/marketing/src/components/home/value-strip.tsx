import * as React from "react";
import { Video, BookOpen, Laptop, BarChart3 } from "lucide-react";
import { Container } from "@puzzlers/ui";

const VALUE_PROPS = [
  {
    icon: Video,
    title: "Video Lessons & Notes",
    desc: "Complete syllabus coverage with chapter notes and quick formulas.",
  },
  {
    icon: BookOpen,
    title: "Chapter-Wise Practice",
    desc: "Targeted problem sets with detailed step-by-step solutions.",
  },
  {
    icon: Laptop,
    title: "Exam-Pattern CBT Mocks",
    desc: "Exact NTA and CET test screens with full section rules and timers.",
  },
  {
    icon: BarChart3,
    title: "Diagnostic Analytics",
    desc: "In-depth score breakdown by section, accuracy, and time per question.",
  },
];

export function ValueStrip() {
  return (
    <section className="border-y border-border bg-white py-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-heading">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
