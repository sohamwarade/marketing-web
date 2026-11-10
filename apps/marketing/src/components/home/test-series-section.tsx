import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container, Button } from "@puzzlers/ui";
import { TestSeriesCard } from "@/components/test-series-card";
import type { PublicTestSeriesCard } from "@puzzlers/schemas";

export function TestSeriesSection({ testSeries }: { testSeries: PublicTestSeriesCard[] }) {
  if (!testSeries || testSeries.length === 0) return null;

  return (
    <Section tone="white">
      <Container>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
              Computer-Based Tests
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight mt-3">
              Official Pattern Test Series
            </h2>
            <p className="mt-1 text-sm text-body">
              Practice full-length papers with authentic negative marking and real-time rank predictions.
            </p>
          </div>
          <Link href="/test-series">
            <Button variant="ghost" className="text-primary font-bold hover:text-blue-700 group">
              View all test series
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testSeries.slice(0, 2).map((item) => (
            <TestSeriesCard key={item.id} testSeries={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
