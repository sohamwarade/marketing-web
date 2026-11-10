import * as React from "react";
import type { Metadata } from "next";
import { Section, Container } from "@puzzlers/ui";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { TestSeriesCard } from "@/components/test-series-card";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Mock Test Series | MHT-CET & JEE NTA-Pattern CBT Tests",
  description:
    "Authentic computer-based test series with live scheduled mocks, part-syllabus tests, chapter drills, and previous year papers.",
  canonicalUrl: "/test-series",
});

export default async function TestSeriesListingPage() {
  const testSeries = await api.getTestSeries();

  return (
    <div>
      <Section tone="white" className="pt-10 pb-8 border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
              Real Exam Environment
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-heading tracking-tight mt-3 font-display">
              Official CBT Mock Test Series
            </h1>
            <p className="mt-2 text-sm text-body">
              Simulate full test conditions with authentic question palettes, section time-locks, and server-evaluated percentiles.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="pale">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testSeries.map((ts) => (
              <TestSeriesCard key={ts.id} testSeries={ts} />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
