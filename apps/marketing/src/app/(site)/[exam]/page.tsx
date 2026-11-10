import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Section, Container, Button, ExamBadge, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@puzzlers/ui";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { studentUrl } from "@/lib/links";
import { BatchCard } from "@/components/batch-card";
import { CourseCard } from "@/components/course-card";
import { TestSeriesCard } from "@/components/test-series-card";
import { LearningWorkflow } from "@/components/home/learning-workflow";

export const dynamicParams = false;
export const revalidate = 300;

export async function generateStaticParams() {
  const examinations = await api.getExaminations();
  return examinations.map((e) => ({
    exam: e.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam: examSlug } = await params;
  const detail = await api.getExaminationBySlug(examSlug);
  if (!detail) return {};

  return constructMetadata({
    title: `${detail.name} Exam Preparation | Online CBT Mock Tests & Courses`,
    description: detail.description,
    canonicalUrl: `/${examSlug}`,
  });
}

export default async function ExamLandingPage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam: examSlug } = await params;
  const exam = await api.getExaminationBySlug(examSlug);

  if (!exam) {
    notFound();
  }

  const [batches, courses, testSeries, faqs] = await Promise.all([
    api.getBatches({ examination: examSlug }),
    api.getCourses({ examination: examSlug }),
    api.getTestSeries(),
    api.getFaqs(`examination:${examSlug}`),
  ]);

  const examTestSeries = testSeries.filter((ts) => ts.examination.slug === examSlug);

  return (
    <div>
      {/* 1. Hero */}
      <Section tone="white" className="pt-12 pb-16 border-b border-border">
        <Container>
          <div className="max-w-3xl space-y-5">
            <ExamBadge code={exam.code} className="text-xs px-3 py-1 font-bold" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight font-display">
              {exam.name} Preparation with Puzzlers
            </h1>
            <p className="text-base sm:text-lg text-body leading-relaxed">
              {exam.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a href={studentUrl("/register", { exam: examSlug })}>
                <Button variant="accent" size="lg" className="font-bold shadow-md">
                  Start free preparation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#test-series">
                <Button variant="outline" size="lg" className="font-semibold">
                  View test series
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Official Pattern Summary */}
      <Section tone="cream">
        <Container>
          <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  OFFICIAL EXAM SPECIFICATION
                </span>
                <h3 className="text-xl font-bold text-heading mt-0.5">
                  {exam.patternSummary.profileName}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-blue-50 px-3 py-1.5 rounded-lg">
                <Clock className="h-4 w-4" />
                <span>{exam.patternSummary.durationMinutes} Minutes</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <h4 className="font-bold text-heading uppercase tracking-wider text-[11px] mb-2 text-primary">
                  Tested Subjects
                </h4>
                <ul className="space-y-1.5 text-body">
                  {exam.patternSummary.subjects.map((sub, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-heading uppercase tracking-wider text-[11px] mb-2 text-primary">
                  Question Formats
                </h4>
                <ul className="space-y-1.5 text-body">
                  {exam.patternSummary.questionTypes.map((qt, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>{qt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-bold text-heading uppercase tracking-wider text-[11px] mb-2 text-primary">
                Marking Scheme
              </h4>
              <div className="flex flex-wrap gap-2">
                {exam.patternSummary.marking.map((m, i) => (
                  <span
                    key={i}
                    className="rounded bg-muted px-2.5 py-1 text-xs font-medium text-heading border border-border"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground italic pt-2">
              Based on the latest official exam profile; verify on official examination conducting authority portal.
            </p>
          </div>
        </Container>
      </Section>

      {/* 3. Batches */}
      {batches.length > 0 && (
        <Section tone="white">
          <Container>
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-heading">
                Target Batches for {exam.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Structured programs combining lectures, drills, and proctored CBT mocks.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {batches.map((b) => (
                <BatchCard key={b.id} batch={b} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 4. Test Series */}
      {examTestSeries.length > 0 && (
        <Section tone="pale" id="test-series">
          <Container>
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-heading">
                Computer-Based Test Series
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Simulated test environments matching official timing and grading rules.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examTestSeries.map((ts) => (
                <TestSeriesCard key={ts.id} testSeries={ts} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 5. Courses */}
      {courses.length > 0 && (
        <Section tone="white">
          <Container>
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-heading">
                Subject-Wise Courses
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Enroll in individual subjects to reinforce conceptual weak spots.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 6. Learning Workflow */}
      <LearningWorkflow />

      {/* 7. Exam FAQs */}
      {faqs.length > 0 && (
        <Section tone="cream">
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-extrabold text-heading text-center mb-8">
              {exam.name} FAQs
            </h2>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <Accordion type="single">
                {faqs.map((f) => (
                  <AccordionItem key={f.id} value={f.id}>
                    <AccordionTrigger itemValue={f.id}>
                      <span>{f.question}</span>
                    </AccordionTrigger>
                    <AccordionContent itemValue={f.id}>
                      <div
                        className="prose prose-sm text-body"
                        dangerouslySetInnerHTML={{ __html: f.answerHtml }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Container>
        </Section>
      )}

      {/* 8. CTA */}
      <Section tone="navy" className="py-16 text-center">
        <Container className="max-w-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Begin {exam.name} Preparation?
          </h2>
          <p className="text-sm text-blue-100">
            Start with free baseline diagnostic tests today.
          </p>
          <div className="pt-2">
            <a href={studentUrl("/register", { exam: examSlug })}>
              <Button variant="accent" size="lg" className="font-bold shadow-md">
                Start free now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </Container>
      </Section>
    </div>
  );
}
