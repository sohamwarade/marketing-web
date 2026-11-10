import * as React from "react";
import type { Metadata } from "next";
import { Section, Container } from "@puzzlers/ui";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { BatchCard } from "@/components/batch-card";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Target Academic Batches | MHT-CET & JEE Complete Programs",
  description:
    "Enroll in full-year and intensive crash batches for MHT-CET and JEE. Complete syllabus video lectures, scheduled CBT mocks, and personal mentorship.",
  canonicalUrl: "/batches",
});

export default async function BatchesListingPage() {
  const batches = await api.getBatches();

  return (
    <div>
      <Section tone="white" className="pt-10 pb-8 border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
              Full Programs
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-heading tracking-tight mt-3 font-display">
              Target Academic Batches
            </h1>
            <p className="mt-2 text-sm text-body">
              Structured preparation cohorts featuring all core courses, weekly scheduled tests, and performance reviews.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="pale">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <BatchCard key={batch.id} batch={batch} />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
