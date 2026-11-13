import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { Button, Container } from "@puzzlers/ui";
import { studentUrl } from "@/lib/links";
import type { PublicExamination } from "@puzzlers/schemas";

export function Hero({ examinations }: { examinations: PublicExamination[] }) {
  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16 md:pt-16 md:pb-20">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-cream/70 blur-2xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-heading leading-[1.12] font-display">
              Master <span className="text-primary">MHT-CET</span> &amp;{" "}
              <span className="text-navy">JEE</span> with official computer-based tests.
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-body leading-relaxed">
              Complete syllabus video lectures, chapter-wise practice, and authentic NTA and CET test simulations with instant, server-evaluated score analysis.
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
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-semibold border-border hover:bg-muted">
                  Explore test series
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: CBT Interface Simulator Screen */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg rounded-2xl border border-border bg-white shadow-xl overflow-hidden">
              {/* CBT Window Topbar */}
              <div className="flex items-center justify-between border-b border-border bg-navy px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs font-mono font-bold tracking-tight text-blue-100">
                    MHT-CET Mock Examination
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded bg-blue-900/80 px-2 py-0.5 text-xs font-mono font-bold text-amber">
                  <Clock className="h-3 w-3" />
                  <span>02:44:18</span>
                </div>
              </div>

              {/* CBT Screen Body */}
              <div className="p-5 space-y-4 bg-white text-left">
                {/* Section tabs */}
                <div className="flex gap-1.5 border-b border-border pb-2.5 text-xs font-bold">
                  <span className="rounded-md bg-blue-100 text-blue-900 px-3 py-1">Physics</span>
                  <span className="rounded-md text-muted-foreground px-3 py-1">Chemistry</span>
                  <span className="rounded-md text-muted-foreground px-3 py-1">Mathematics</span>
                </div>

                {/* Question Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold text-heading">Question 14</span>
                  <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    +2.00, 0.00
                  </span>
                </div>

                {/* Question Stem */}
                <div className="rounded-xl bg-muted/30 p-3.5 text-xs leading-relaxed text-heading font-medium border border-border/60">
                  A particle executes simple harmonic motion with an amplitude of 4 cm. At what displacement from the mean position are its kinetic and potential energies equal?
                </div>

                {/* Options List */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3 rounded-lg border border-primary bg-blue-50/70 p-2.5 font-medium text-navy">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      A
                    </span>
                    <span>2√2 cm</span>
                    <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-2.5 font-medium text-body">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-input text-[10px] font-bold">
                      B
                    </span>
                    <span>2 cm</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-2.5 font-medium text-body">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-input text-[10px] font-bold">
                      C
                    </span>
                    <span>√2 cm</span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-border text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Autosave active</span>
                  </div>
                  <span className="rounded bg-muted px-2 py-0.5 font-medium text-heading">
                    Single Choice
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
