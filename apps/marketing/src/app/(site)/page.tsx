import * as React from "react";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { ExamCategories } from "@/components/home/exam-categories";
import { PopularBatches } from "@/components/home/popular-batches";
import { TestSeriesSection } from "@/components/home/test-series-section";
import { PlatformFeatures } from "@/components/home/platform-features";
import { FAQSection } from "@/components/home/faq-section";
import { CTABand } from "@/components/home/cta-band";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "MHT-CET & JEE Preparation Platform | Online CBT Tests & Courses",
  description:
    "Prepare for MHT-CET and JEE Main with authentic computer-based test series, structured video courses, and deep diagnostic analytics.",
});

export default async function HomePage() {
  const [examinations, batches, testSeries, faqs] = await Promise.all([
    api.getExaminations(),
    api.getBatches({ featured: true }),
    api.getTestSeries(),
    api.getFaqs("global"),
  ]);

  return (
    <>
      {/* 1. Hero */}
      <Hero examinations={examinations} />

      {/* 2. Target Examinations */}
      <ExamCategories examinations={examinations} />

      {/* 3. Target Batches */}
      <PopularBatches batches={batches} />

      {/* 4. Computer-Based Test Series */}
      <TestSeriesSection testSeries={testSeries} />

      {/* 5. Core Platform Features */}
      <PlatformFeatures />

      {/* 6. FAQs */}
      <FAQSection faqs={faqs} />

      {/* 7. Final CTA */}
      <CTABand />
    </>
  );
}

