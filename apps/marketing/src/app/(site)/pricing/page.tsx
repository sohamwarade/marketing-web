import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Section, Container, Button, Badge } from "@puzzlers/ui";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { studentUrl } from "@/lib/links";
import { formatINR } from "@puzzlers/ui";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Pricing & Plans | MHT-CET & JEE Preparation",
  description:
    "Transparent pricing for MHT-CET and JEE batches, subject courses, and test series. Free trial tests available for all registered students.",
  canonicalUrl: "/pricing",
});

export default async function PricingPage() {
  const [batches, courses, status] = await Promise.all([
    api.getBatches(),
    api.getCourses(),
    api.getPlatformStatus(),
  ]);

  return (
    <div>
      <Section tone="white" className="pt-12 pb-16 text-center border-b border-border">
        <Container className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight mt-4 font-display">
            Start for Free, Upgrade for Comprehensive Rank Prep
          </h1>
          <p className="mt-4 text-base sm:text-lg text-body leading-relaxed">
            Every student receives {status.features.trialMaxTests} free diagnostic CBT tests. Choose full-cohort batches or individual subject boosters as you advance.
          </p>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* 1. Free Trial Tier */}
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <Badge variant="outline" className="text-xs font-bold mb-3">
                  STARTER
                </Badge>
                <h3 className="text-2xl font-black text-heading">Free Baseline Assessment</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Experience authentic exam conditions with zero credit card or upfront commitment.
                </p>
                <div className="my-6">
                  <span className="text-4xl font-black text-heading">₹0</span>
                  <span className="text-xs text-muted-foreground ml-2">Forever free</span>
                </div>
                <ul className="space-y-3 text-xs text-body font-medium border-t border-border pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{status.features.trialMaxTests} Full-length diagnostic CBT tests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Instant score calculation & solution access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Basic time and accuracy breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Free foundation chapter videos</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <a href={studentUrl("/register")}>
                  <Button variant="accent" className="w-full font-bold shadow-md">
                    Start free today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* 2. Test Series Tier */}
            <div className="rounded-2xl border-2 border-primary bg-white p-8 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Most Popular for CBT Prep
              </div>
              <div>
                <Badge variant="default" className="text-xs font-bold mb-3">
                  TEST SERIES PRO
                </Badge>
                <h3 className="text-2xl font-black text-heading">National CBT Mock Series</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Complete test suite matching official MHT-CET and JEE testing engines.
                </p>
                <div className="my-6">
                  <span className="text-4xl font-black text-heading">₹2,999</span>
                  <span className="text-xs text-muted-foreground ml-2">Annual validity</span>
                </div>
                <ul className="space-y-3 text-xs text-body font-medium border-t border-border pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Up to 110 Full, Part & Chapter CBT Tests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Continuous cloud autosave recovery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>10-Year Previous Question Papers (PYQs)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Detailed section, chapter & time analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Automated Mistake Book Notebook</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/test-series">
                  <Button variant="default" className="w-full font-bold">
                    View test series
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3. Full Cohort Batch Tier */}
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <Badge variant="outline" className="text-xs font-bold mb-3">
                  COMPLETE BATCH
                </Badge>
                <h3 className="text-2xl font-black text-heading">Target Academic Cohort</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Complete lecture syllabus, written notes, mentorship, and all test series included.
                </p>
                <div className="my-6">
                  <span className="text-4xl font-black text-heading">₹9,999</span>
                  <span className="text-xs text-muted-foreground ml-2">Full course access</span>
                </div>
                <ul className="space-y-3 text-xs text-body font-medium border-t border-border pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>All subject video courses (Physics, Chem, Math)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Downloadable comprehensive chapter PDF notes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Includes complete CBT Test Series</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Weekly live doubt solving & strategy sessions</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/batches">
                  <Button variant="outline" className="w-full font-semibold">
                    Explore all batches
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Pricing notes */}
          <div className="mt-12 text-center text-xs text-muted-foreground space-y-2 max-w-xl mx-auto">
            <p>All prices are inclusive of applicable GST. Have a scholarship coupon? Apply during checkout.</p>
            <p>
              Please review our{" "}
              <Link href="/refund-policy" className="underline hover:text-heading">
                Refund & Cancellation Policy
              </Link>{" "}
              prior to purchasing paid packages.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
