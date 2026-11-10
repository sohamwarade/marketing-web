import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Video, BookOpen, Laptop, BarChart3, Bookmark, Gift, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Section, Container, Button } from "@puzzlers/ui";
import { constructMetadata } from "@/lib/seo";
import { studentUrl } from "@/lib/links";

export const metadata: Metadata = constructMetadata({
  title: "Platform Features | LMS, CBT Engine & Diagnostics",
  description:
    "Explore Puzzlers' factual features: NTA-accurate computer-based testing, continuous cloud autosave, structured video lessons, and deep time diagnostics.",
  canonicalUrl: "/features",
});

export default function FeaturesPage() {
  return (
    <div>
      <Section tone="white" className="pt-12 pb-16 text-center border-b border-border">
        <Container className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Engineering & Pedagogy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight mt-4 font-display">
            Built for Accurate, Reliable Exam Preparation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-body leading-relaxed">
            Every feature on Puzzlers is calibrated to mirror official MHT-CET and JEE testing realities.
          </p>
        </Container>
      </Section>

      {/* Feature 1: Structured Courses */}
      <Section tone="white" id="courses">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Video className="h-4 w-4" />
                <span>Structured Courses</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-heading">
                Comprehensive Syllabus Progression & Chapter Notes
              </h2>
              <p className="text-sm text-body leading-relaxed">
                Lectures broken down by chapter, topic, and sub-topic. Downloadable revision notes and formula cheat-sheets accompany every single lesson.
              </p>
              <ul className="space-y-2 text-xs font-medium text-body pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Organized Chapter → Topic → Lesson structure</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Downloadable PDF materials and key summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Free preview lessons accessible before enrollment</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-6 shadow-sm">
              <div className="space-y-2.5">
                <div className="rounded-lg bg-white p-3 shadow-xs border border-border flex items-center justify-between">
                  <span className="text-xs font-bold">1. Motion in a Straight Line</span>
                  <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-bold">Completed</span>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-xs border border-border flex items-center justify-between">
                  <span className="text-xs font-bold">2. Newton&apos;s Laws of Motion</span>
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">In Progress</span>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-xs border border-border flex items-center justify-between">
                  <span className="text-xs font-bold">3. Work, Energy and Power</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-bold">Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Feature 2: Authentic CBT Tests */}
      <Section tone="cream" id="cbt">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-border pb-2">
                  <span className="font-bold text-heading">Question Palette Simulation</span>
                  <span className="text-amber font-mono font-bold">01:59:45</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
                  <span className="p-2 rounded bg-green-600 text-white">1</span>
                  <span className="p-2 rounded bg-green-600 text-white">2</span>
                  <span className="p-2 rounded bg-red-600 text-white">3</span>
                  <span className="p-2 rounded bg-purple-600 text-white">4</span>
                  <span className="p-2 rounded bg-muted text-heading">5</span>
                </div>
                <div className="text-[11px] text-muted-foreground pt-1 flex justify-between">
                  <span>Answered: 2</span>
                  <span>Not Answered: 1</span>
                  <span>Review: 1</span>
                  <span>Not Visited: 1</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Laptop className="h-4 w-4" />
                <span>Authentic CBT Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-heading">
                5-State Question Palette & Server Autosave
              </h2>
              <p className="text-sm text-body leading-relaxed">
                Never get startled on exam day. Puzzlers CBT provides the exact color palette (Not Visited, Not Answered, Answered, Marked for Review), section timer rules, and instant autosave.
              </p>
              <ul className="space-y-2 text-xs font-medium text-body pt-2">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Answers survive tab close, reload, or network interruption</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Accurate MHT-CET and JEE marking scheme evaluation</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Feature 3: Detailed Analytics */}
      <Section tone="white" id="analytics">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <BarChart3 className="h-4 w-4" />
                <span>Deep Diagnostics</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-heading">
                Time-Per-Question & Accuracy Diagnostics
              </h2>
              <p className="text-sm text-body leading-relaxed">
                Know where your minutes went. See average candidate timing against your own pacing, discover if you rush on easy questions, and review subject-wise percentiles.
              </p>
              <ul className="space-y-2 text-xs font-medium text-body pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Section-wise accuracy and negative mark deduction metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Time-spent heatmap to eliminate pacing errors</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-heading uppercase tracking-wider">Score Diagnostic Overview</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Physics Section</span>
                    <span className="text-primary">82% Accuracy</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Chemistry Section</span>
                    <span className="text-primary">90% Accuracy</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Mathematics Section</span>
                    <span className="text-primary">74% Accuracy</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "74%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section tone="navy" className="py-16 text-center">
        <Container className="max-w-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Experience All Features in Free Trial Mode
          </h2>
          <p className="text-sm text-blue-100">
            Create your account in under 30 seconds and take your first diagnostic test.
          </p>
          <div className="pt-2">
            <a href={studentUrl("/register")}>
              <Button variant="accent" size="lg" className="font-bold shadow-md">
                Start free preparation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </Container>
      </Section>
    </div>
  );
}
