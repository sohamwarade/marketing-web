import * as React from "react";
import Link from "next/link";
import { BookOpen, Video, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, PriceTag, ExamBadge, Button } from "@puzzlers/ui";
import type { PublicCourseCard } from "@puzzlers/schemas";

export function CourseCard({ course }: { course: PublicCourseCard }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group border-border hover:border-blue-300">
      <div className="relative aspect-video w-full bg-gradient-to-br from-blue-900 to-navy flex items-center justify-center p-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center">
          <ExamBadge code={course.examination.code} className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-md" />
          <h4 className="text-lg font-bold tracking-tight text-white line-clamp-2">
            {course.title}
          </h4>
          <span className="text-xs text-blue-200 mt-1 inline-block font-medium">
            {course.subject}
          </span>
        </div>
      </div>

      <CardContent className="flex-1 p-5 space-y-4">
        {course.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-body font-medium pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-blue-600" />
            <span>{course.counts.videos} Video Lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>{course.counts.pdfs} Chapter Notes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            <span>{course.counts.tests} Topic Tests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-amber" />
            <span>Full Syllabus</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border mt-auto">
        <PriceTag pricePaise={course.pricePaise} compareAtPricePaise={course.compareAtPricePaise} size="sm" />
        <Link href={`/courses/${course.slug}`}>
          <Button variant="default" size="sm" className="font-semibold">
            View course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
