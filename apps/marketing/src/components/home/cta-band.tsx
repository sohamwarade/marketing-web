import * as React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Section, Container, Button } from "@puzzlers/ui";
import { studentUrl } from "@/lib/links";

export function CTABand() {
  return (
    <Section tone="navy" className="relative overflow-hidden py-20">
      <div className="absolute top-0 right-0 -z-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-0 h-64 w-64 rounded-full bg-amber/10 blur-3xl" />

      <Container className="relative z-10 text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
          Start Preparing Today
        </h2>
        <p className="mt-4 text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-xl mx-auto">
          Begin with free trial mock tests and diagnostic chapter drills. See your baseline score and experience the real CBT interface.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={studentUrl("/register")} className="w-full sm:w-auto">
            <Button variant="accent" size="lg" className="w-full sm:w-auto font-bold text-base shadow-lg">
              Start free preparation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto font-semibold text-white border-white/30 hover:bg-white/10"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Talk to admissions
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-xs text-blue-200/70">
          No credit card required for free tests • Instant account setup
        </p>
      </Container>
    </Section>
  );
}
