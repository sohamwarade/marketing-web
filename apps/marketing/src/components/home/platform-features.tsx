import * as React from "react";
import Link from "next/link";
import { Video, BookOpen, Laptop, BarChart3, Bookmark, Gift, ArrowRight } from "lucide-react";
import { Section, Container, Button } from "@puzzlers/ui";

const FEATURES = [
  {
    icon: Video,
    title: "Structured Courses & Notes",
    desc: "HD video lectures organized chapter-by-chapter with downloadable PDF notes and formula summaries.",
    anchor: "/features#courses",
  },
  {
    icon: BookOpen,
    title: "Chapter Practice with Solutions",
    desc: "Topic-wise problem sets with step-by-step conceptual hints and complete written solutions.",
    anchor: "/features#practice",
  },
  {
    icon: Laptop,
    title: "Authentic CBT Mock Tests",
    desc: "Realistic NTA and State CET test screen with 5-state palette, continuous autosave, and strict timer sync.",
    anchor: "/features#cbt",
  },
  {
    icon: BarChart3,
    title: "Deep Diagnostic Analytics",
    desc: "Detailed score breakdowns by subject, question difficulty, time spent, and comparative percentiles.",
    anchor: "/features#analytics",
  },
  {
    icon: Bookmark,
    title: "Mistakes Book & Notebooks",
    desc: "Every incorrect and unattempted question is saved to your personal revision log for quick re-practice.",
    anchor: "/features#mistakes",
  },
  {
    icon: Gift,
    title: "Free Diagnostic Trial Tests",
    desc: "Experience the interface and assess your current baseline with zero upfront commitment.",
    anchor: "/features#trials",
  },
];

export function PlatformFeatures() {
  return (
    <Section tone="cream">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
            Engineered Specifically for Exam Day Success
          </h2>
          <p className="mt-2 text-sm text-body">
            Every feature on Puzzlers is calibrated to train speed, precision, and calm under time pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={idx}
                href={feat.anchor}
                className="group rounded-2xl border border-border bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-blue-300 flex flex-col justify-start"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary mb-4 transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-heading group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/features">
            <Button variant="outline" className="font-semibold border-border hover:bg-white">
              Explore all platform features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
