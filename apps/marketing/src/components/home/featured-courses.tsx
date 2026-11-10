import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container, Button } from "@puzzlers/ui";
import { CourseCard } from "@/components/course-card";
import type { PublicCourseCard } from "@puzzlers/schemas";

export function FeaturedCourses({ courses }: { courses: PublicCourseCard[] }) {
  if (!courses || courses.length === 0) return null;

  return (
    <Section tone="white">
      <Container>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
              Syllabus Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight mt-3">
              Featured Comprehensive Courses
            </h2>
            <p className="mt-1 text-sm text-body">
              Deep-dive lectures, structured notes, and solved questions for all subjects.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="text-primary font-bold hover:text-blue-700 group">
              View all courses
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
