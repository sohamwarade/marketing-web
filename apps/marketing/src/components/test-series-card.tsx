import * as React from "react";
import Link from "next/link";
import { Award, Calendar, CheckSquare, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, PriceTag, ExamBadge, Button } from "@puzzlers/ui";
import type { PublicTestSeriesCard } from "@puzzlers/schemas";
import { formatDate } from "@/lib/format";

export function TestSeriesCard({ testSeries }: { testSeries: PublicTestSeriesCard }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-border hover:border-blue-300">
      <div className="bg-gradient-to-br from-navy to-blue-900 p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <ExamBadge code={testSeries.examination.code} className="bg-white/20 text-white border-white/30" />
          <span className="text-[10px] font-bold text-amber uppercase tracking-wider">
            CBT Exam Series
          </span>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
          {testSeries.title}
        </h3>
      </div>

      <CardContent className="flex-1 p-5 space-y-4">
        {testSeries.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {testSeries.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-body font-medium bg-muted/60 p-3 rounded-lg">
          <div>
            <span className="text-muted-foreground block text-[10px]">FULL LENGTH MOCKS</span>
            <span className="text-sm font-bold text-heading">{testSeries.counts.fullMocks} Tests</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">PART SYLLABUS</span>
            <span className="text-sm font-bold text-heading">{testSeries.counts.partSyllabus} Tests</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">CHAPTER TESTS</span>
            <span className="text-sm font-bold text-heading">{testSeries.counts.chapter} Tests</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">PREVIOUS YEAR PAPERS</span>
            <span className="text-sm font-bold text-heading">{testSeries.counts.pyq} PYQs</span>
          </div>
        </div>

        {testSeries.nextScheduledTestDate && (
          <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md font-medium">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>Next Live Mock: {formatDate(testSeries.nextScheduledTestDate)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border mt-auto">
        <PriceTag pricePaise={testSeries.pricePaise} compareAtPricePaise={testSeries.compareAtPricePaise} size="sm" />
        <Link href={`/batches/${testSeries.slug}`}>
          <Button variant="default" size="sm" className="font-semibold">
            View schedule
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
