import * as React from "react";
import Link from "next/link";
import { Users, Calendar, ShieldCheck, Layers } from "lucide-react";
import { Card, CardContent, CardFooter, PriceTag, ExamBadge, Button, Badge } from "@puzzlers/ui";
import type { PublicBatchCard } from "@puzzlers/schemas";

export function BatchCard({ batch }: { batch: PublicBatchCard }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-border hover:border-blue-300">
      <div className="bg-gradient-to-r from-blue-50 to-cream p-5 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <ExamBadge code={batch.examination.code} />
          <Badge variant="outline" className="text-[10px] font-bold">
            {batch.academicYear}
          </Badge>
        </div>
        <h3 className="text-lg font-bold text-heading tracking-tight line-clamp-1">
          {batch.title}
        </h3>
        {batch.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {batch.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-5 space-y-4">
        {batch.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {batch.description}
          </p>
        )}

        <div className="space-y-2 text-xs text-body font-medium">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              Included Courses:
            </span>
            <span className="font-bold text-heading">{batch.counts.courses} Courses</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
              Included Mock Tests:
            </span>
            <span className="font-bold text-heading">{batch.counts.tests} CBT Mocks</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-amber" />
              Validity:
            </span>
            <span className="font-bold text-heading">
              {batch.validity.mode === "fixed_date"
                ? `Until ${new Date(batch.validity.endsAt || "").toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
                : `${batch.validity.days} Days`}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border mt-auto">
        <PriceTag pricePaise={batch.pricePaise} compareAtPricePaise={batch.compareAtPricePaise} size="sm" />
        <Link href={`/batches/${batch.slug}`}>
          <Button variant="default" size="sm" className="font-semibold">
            Explore batch
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
