import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Award } from "lucide-react";
import { Section, Container, ExamBadge } from "@puzzlers/ui";
import type { PublicExamination } from "@puzzlers/schemas";

export function ExamCategories({ examinations }: { examinations: PublicExamination[] }) {
  if (!examinations || examinations.length === 0) return null;

  return (
    <Section tone="cream">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Target Focus
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight mt-3">
            Choose Your Target Examination
          </h2>
          <p className="mt-2 text-sm text-body">
            Tailored study paths, curated chapter questions, and official test simulators built for your specific entrance syllabus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examinations.map((exam) => (
            <Link
              key={exam.slug}
              href={`/${exam.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <ExamBadge code={exam.code} />
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-primary transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-heading group-hover:text-primary transition-colors">
                  {exam.name}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {exam.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-xs text-body font-semibold">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <BookOpen className="h-3.5 w-3.5" />
                  {exam.counts?.courses || 0} Courses
                </span>
                <span className="flex items-center gap-1.5 text-navy">
                  <Award className="h-3.5 w-3.5" />
                  {exam.counts?.testSeries || 0} Test Series
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
