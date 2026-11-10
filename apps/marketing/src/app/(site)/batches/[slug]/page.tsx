import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Layers, ShieldCheck, Calendar, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Section, Container, Button, PriceTag, ExamBadge, Badge } from "@puzzlers/ui";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { studentUrl } from "@/lib/links";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const batch = await api.getBatchBySlug(slug);
  if (!batch) return {};

  return constructMetadata({
    title: `${batch.title} | ${batch.examination.name} Batch`,
    description: batch.description,
    canonicalUrl: `/batches/${batch.slug}`,
  });
}

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const batch = await api.getBatchBySlug(slug);

  if (!batch) {
    notFound();
  }

  const ctaUrl = batch.isFree
    ? studentUrl("/register", { next: `/explore/batches/${batch.slug}` })
    : studentUrl("/checkout", { item: `batch:${batch.id}` });

  const ctaLabel = batch.isFree ? "Enroll in batch for free" : "Enroll now";

  return (
    <div>
      {/* Hero */}
      <Section tone="white" className="pt-10 pb-14 border-b border-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <ExamBadge code={batch.examination.code} />
                <Badge variant="outline" className="text-xs font-bold">
                  Academic Year {batch.academicYear}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight font-display">
                {batch.title}
              </h1>
              <p className="text-base text-body leading-relaxed max-w-2xl">
                {batch.description}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <PriceTag pricePaise={batch.pricePaise} compareAtPricePaise={batch.compareAtPricePaise} size="lg" />
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
                Batch Highlights
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Courses Included
                  </span>
                  <span className="font-bold text-heading">{batch.counts.courses} Complete Courses</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    Full CBT Tests
                  </span>
                  <span className="font-bold text-heading">{batch.counts.tests} Mock Tests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-amber" />
                    Starts On
                  </span>
                  <span className="font-bold text-heading">{formatDate(batch.startsAt)}</span>
                </div>
                {batch.enrollment.seatsLeft !== undefined && (
                  <div className="rounded-lg bg-amber-50 p-3 text-center text-xs font-bold text-amber-900 border border-amber-200">
                    Hurry! Only {batch.enrollment.seatsLeft} seats remaining
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
