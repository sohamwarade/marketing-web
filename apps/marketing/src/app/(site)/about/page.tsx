import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Target, Award, Users, ArrowRight } from "lucide-react";
import { Section, Container, Button } from "@puzzlers/ui";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "About Puzzlers | MHT-CET & JEE Preparation Platform",
  description:
    "Learn about Puzzlers' mission: building high-fidelity computer-based testing, structured learning, and deep analytics for competitive entrance exams.",
});

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <Section tone="white" className="pt-12 pb-16">
        <Container className="text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Our Purpose
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight mt-4 font-display">
            Built for Students Who Value Speed, Accuracy, and Practice Integrity
          </h1>
          <p className="mt-4 text-base sm:text-lg text-body leading-relaxed">
            Puzzlers was created to bridge the gap between classroom theory and the intense realities of competitive entrance examinations in India.
          </p>
        </Container>
      </Section>

      {/* Mission & Philosophy */}
      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-heading">100% Exam Fidelity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We believe that preparation is incomplete if your mock tests do not replicate the actual interface, timing pressure, and negative marking quirks of the real exam day.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-heading">Diagnostic Feedback</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Marks alone don't explain how to improve. We show you exactly how many seconds you spend per question, your topic-wise accuracy, and your recurring calculation traps.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-heading">Structured Progression</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                From foundational chapter videos to rigorous mixed-syllabus mock papers, every piece of content follows a cohesive pedagogical progression.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* How tests are constructed */}
      <Section tone="white">
        <Container className="max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
              How Puzzlers Tests Are Constructed
            </h2>
            <p className="text-sm text-body">
              Every question in our bank undergoes multiple stages of verification before reaching candidates.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl border border-border p-5 bg-card">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                1
              </span>
              <div>
                <h4 className="text-base font-bold text-heading">Original & Pattern-Calibrated Problem Formulation</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Questions are authored by experienced entrance subject matter experts to match the precise syllabus weightage, cognitive depth, and time consumption benchmarks of MHT-CET and JEE.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-border p-5 bg-card">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                2
              </span>
              <div>
                <h4 className="text-base font-bold text-heading">Strict Exam Integrity & Instant Evaluation</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Scoring rules, section boundaries, and deadline enforcement mirror official guidelines, with instant automated score calculation and rank percentile generation upon test submission.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-border p-5 bg-card">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                3
              </span>
              <div>
                <h4 className="text-base font-bold text-heading">Detailed Explanations & Alternate Solution Paths</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  After test release, students receive detailed step-by-step mathematical proofs, conceptual justifications, and shortcut elimination techniques for multiple-choice problems.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center">
            <Link href="/contact">
              <Button variant="default" className="font-semibold">
                Have questions? Contact our team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
