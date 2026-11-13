import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container, Button } from "@puzzlers/ui";
import { BatchCard } from "@/components/batch-card";
import type { PublicBatchCard } from "@puzzlers/schemas";

export function PopularBatches({ batches }: { batches: PublicBatchCard[] }) {
  if (!batches || batches.length === 0) return null;

  return (
    <Section tone="pale">
      <Container>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
              Target Academic Batches
            </h2>
            <p className="mt-1 text-sm text-body">
              All-inclusive batches combining all core subject courses, test series, and mentorship.
            </p>
          </div>
          <Link href="/batches">
            <Button variant="ghost" className="text-primary font-bold hover:text-blue-700 group">
              View all batches
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.slice(0, 3).map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
