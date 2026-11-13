import * as React from "react";
import type { Metadata } from "next";
import { Section, Container } from "@puzzlers/ui";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { CourseCard } from "@/components/course-card";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "All Courses | MHT-CET & JEE Syllabus Coverage",
  description:
    "Explore comprehensive subject courses for MHT-CET and JEE Main. Physics, Chemistry, and Mathematics lectures, PDFs, and tests.",
  canonicalUrl: "/courses",
});

export default async function CoursesListingPage() {
  const [courses, examinations] = await Promise.all([
    api.getCourses(),
    api.getExaminations(),
  ]);

  return (
    <div>
      <Section tone="white" className="pt-10 pb-8 border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
              Syllabus Library
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-heading tracking-tight mt-3 font-display">
              All Courses & Subject Modules
            </h1>
            <p className="mt-2 text-sm text-body">
              Explore subject-wise courses with full video modules, curated formula sheets, and chapter CBT drills.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="pale">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
