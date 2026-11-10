import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Video, FileText, CheckCircle2, BookOpen, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import { Section, Container, Button, PriceTag, ExamBadge, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@puzzlers/ui";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { studentUrl } from "@/lib/links";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await api.getCourseBySlug(slug);
  if (!course) return {};

  return constructMetadata({
    title: `${course.title} | ${course.examination.name} Course`,
    description: course.description,
    canonicalUrl: `/courses/${course.slug}`,
  });
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await api.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const batches = await api.getBatches({ examination: course.examination.slug });

  const ctaUrl = course.isFree
    ? studentUrl("/register", { next: `/explore/courses/${course.slug}` })
    : studentUrl("/checkout", { item: `course:${course.id}` });

  const ctaLabel = course.isFree ? "Enroll for free" : "Buy course now";

  // Schema.org Course JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "Puzzlers",
      "sameAs": "https://puzzlers.in",
    },
    "offers": {
      "@type": "Offer",
      "price": course.pricePaise / 100,
      "priceCurrency": "INR",
      "category": "Educational",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <Section tone="white" className="pt-10 pb-14 border-b border-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <ExamBadge code={course.examination.code} />
                <span className="rounded-md bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-semibold">
                  {course.subject}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight font-display">
                {course.title}
              </h1>
              <p className="text-base text-body leading-relaxed max-w-2xl">
                {course.description}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <PriceTag pricePaise={course.pricePaise} compareAtPricePaise={course.compareAtPricePaise} size="lg" />
                <a href={ctaUrl}>
                  <Button variant="accent" size="lg" className="font-bold shadow-md">
                    {ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-heading border-b border-border pb-3">
                Course Inclusions
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Video className="h-4 w-4 text-blue-600" />
                    Video Lessons
                  </span>
                  <span className="font-bold text-heading">{course.counts.videos} Videos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Chapter Notes & PDFs
                  </span>
                  <span className="font-bold text-heading">{course.counts.pdfs} PDFs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Diagnostic Tests
                  </span>
                  <span className="font-bold text-heading">{course.counts.tests} Tests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-amber" />
                    Device Support
                  </span>
                  <span className="font-bold text-heading">Mobile & Web</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Curriculum Preview */}
      <Section tone="cream">
        <Container className="max-w-4xl space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-extrabold text-heading">Curriculum & Chapters</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Structured step-by-step conceptual lectures and topic tests.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <Accordion type="single">
              <AccordionItem value="ch-1">
                <AccordionTrigger itemValue="ch-1">
                  <span>Chapter 01: Core Fundamentals & Principles</span>
                </AccordionTrigger>
                <AccordionContent itemValue="ch-1">
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-muted/60">
                      <span className="font-medium">1.1 Introduction and Theoretical Framework</span>
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        Free Preview
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/60">
                      <span className="font-medium">1.2 Standard Numerical Formulations & Derivations</span>
                      <span className="text-muted-foreground">32 mins</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/60">
                      <span className="font-medium">1.3 Chapter Diagnostic Drill (CBT)</span>
                      <span className="text-blue-600 font-bold">15 Questions</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ch-2">
                <AccordionTrigger itemValue="ch-2">
                  <span>Chapter 02: Advanced Applications & PYQ Analysis</span>
                </AccordionTrigger>
                <AccordionContent itemValue="ch-2">
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-muted/60">
                      <span className="font-medium">2.1 Complex Multi-Step Numerical Problems</span>
                      <span className="text-muted-foreground">45 mins</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/60">
                      <span className="font-medium">2.2 10-Year Previous Question Trends & Traps</span>
                      <span className="text-muted-foreground">40 mins</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/60">
                      <span className="font-medium">2.3 Chapter Assessment Test</span>
                      <span className="text-blue-600 font-bold">25 Questions</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Container>
      </Section>
    </div>
  );
}
