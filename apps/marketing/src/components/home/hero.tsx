import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Button, Container } from "@puzzlers/ui";
import { studentUrl } from "@/lib/links";
import type { PublicExamination } from "@puzzlers/schemas";

export function Hero({ examinations }: { examinations: PublicExamination[] }) {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-cream/70 blur-2xl" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber" />
              <span>Official 2026-2027 Pattern Mock Tests</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-heading leading-[1.1] font-display">
              Prepare for <span className="text-primary">MHT-CET</span> and{" "}
              <span className="text-navy">JEE</span> with real exam-pattern CBT tests.
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-body leading-relaxed">
              Master your syllabus with comprehensive video courses, chapter-wise practice, and authentic computer-based tests evaluated with server-level precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a href={studentUrl("/register")} className="w-full sm:w-auto">
                <Button variant="accent" size="lg" className="w-full sm:w-auto text-base font-bold shadow-md">
                  Start free preparation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/test-series" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-semibold border-input hover:bg-muted">
                  Explore test series
                </Button>
              </Link>
            </div>

            {/* Exam Quick-Pick Chips */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-muted-foreground">
              <span>Quick jump:</span>
              {examinations.map((exam) => (
                <Link
                  key={exam.slug}
                  href={`/${exam.slug}`}
                  className="rounded-full border border-border bg-white px-3 py-1 font-medium text-heading hover:border-primary hover:text-primary transition-colors shadow-2xs"
                >
                  {exam.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Authentic Computer-Based Test (CBT) Interface Preview Mockup */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg rounded-2xl border border-border bg-white shadow-xl overflow-hidden">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-border bg-navy px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs font-mono font-bold tracking-tight text-blue-100">
                    MHT-CET 2026 MOCK TEST #1
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded bg-blue-900/80 px-2 py-0.5 text-xs font-mono font-bold text-amber">
                  <Clock className="h-3 w-3" />
                  <span>02:44:18</span>
                </div>
              </div>

              {/* CBT Screen Body */}
              <div className="p-4 space-y-4 bg-white text-left">
                {/* Section tabs */}
                <div className="flex gap-1 border-b border-border pb-2 text-xs font-bold">
                  <span className="rounded bg-blue-100 text-blue-800 px-2.5 py-1">Physics (Sec 1)</span>
                  <span className="rounded text-muted-foreground px-2.5 py-1">Chemistry</span>
                  <span className="rounded text-muted-foreground px-2.5 py-1">Mathematics</span>
                </div>

                {/* Question Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-heading">Question No. 14</span>
                  <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    +2.00, -0.00
                  </span>
                </div>

                {/* Question Stem */}
                <div className="rounded-lg bg-muted/40 p-3 text-xs leading-relaxed text-heading font-medium border border-border/60">
                  A particle executes SHM with an amplitude of 4 cm. At what displacement from the mean position are its kinetic and potential energies equal?
                </div>

                {/* Options List */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2.5 rounded-md border border-primary bg-blue-50/70 p-2 font-medium text-navy">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      A
                    </span>
                    <span>2√2 cm</span>
                    <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2.5 rounded-md border border-border p-2 font-medium text-body">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-input text-[10px] font-bold">
                      B
                    </span>
                    <span>2 cm</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-md border border-border p-2 font-medium text-body">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-input text-[10px] font-bold">
                      C
                    </span>
                    <span>√2 cm</span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Continuous Cloud Autosave Active</span>
                  </div>
                  <span className="rounded bg-muted px-2 py-0.5 font-bold text-heading">
                    Single Correct
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
