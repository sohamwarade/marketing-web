import * as React from "react";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { ValueStrip } from "@/components/home/value-strip";
import { ExamCategories } from "@/components/home/exam-categories";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { PopularBatches } from "@/components/home/popular-batches";
import { TestSeriesSection } from "@/components/home/test-series-section";
import { PlatformFeatures } from "@/components/home/platform-features";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { LearningWorkflow } from "@/components/home/learning-workflow";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTABand } from "@/components/home/cta-band";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "MHT-CET & JEE Preparation Platform | Online CBT Tests & Courses",
  description:
    "Prepare for MHT-CET, JEE Main, and JEE Advanced with authentic computer-based test series, structured video courses, and deep diagnostic analytics.",
});

export default async function HomePage() {
  const [examinations, courses, batches, testSeries, faqs] = await Promise.all([
    api.getExaminations(),
    api.getCourses({ featured: true }),
    api.getBatches({ featured: true }),
    api.getTestSeries(),
    api.getFaqs("global"),
  ]);

  return (
    <>
      {/* 1. Hero */}
      <Hero examinations={examinations} />

      {/* 2. Value Proposition Strip */}
      <ValueStrip />

      {/* 3. Examination Categories (Cream) */}
      <ExamCategories examinations={examinations} />

      {/* 4. Featured Courses (White) */}
      <FeaturedCourses courses={courses} />

      {/* 5. Popular Batches (Pale Blue) */}
      <PopularBatches batches={batches} />

      {/* 6. Test Series (White) */}
      <TestSeriesSection testSeries={testSeries} />

      {/* 7. Platform Features (Cream) */}
      <PlatformFeatures />

      {/* 8. Why Choose Puzzlers (White) */}
      <WhyChooseUs />

      {/* 9. Learning Workflow (Pale Blue) */}
      <LearningWorkflow />

      {/* 10. Testimonials (White, conditional on consent) */}
      <TestimonialsSection />

      {/* 11. FAQs (Cream) */}
      <FAQSection faqs={faqs} />

      {/* 12. Final CTA (Navy) */}
      <CTABand />
    </>
  );
}
