import * as React from "react";
import type { Metadata } from "next";
import { Section, Container } from "@puzzlers/ui";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Terms and Conditions | Puzzlers",
  description: "Terms and conditions governing the use of the Puzzlers learning and test platform.",
  canonicalUrl: "/terms",
});

export default function TermsPage() {
  return (
    <Section tone="white" className="py-12">
      <Container className="max-w-3xl space-y-6">
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-black text-heading tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: November 2026
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-body space-y-4 leading-relaxed">
          <p>
            By accessing or using Puzzlers (puzzlers.in and app.puzzlers.in), you agree to be bound by these Terms and Conditions.
          </p>

          <h3 className="text-base font-bold text-heading">1. User Accounts and Fair Use</h3>
          <p>
            Each registered account is for individual use only. Account sharing, automated scraping of question banks, or attempted reverse engineering of test answer keys will result in immediate suspension without refund.
          </p>

          <h3 className="text-base font-bold text-heading">2. Intellectual Property</h3>
          <p>
            All video lectures, PDF chapter summaries, CBT test questions, and diagnostic charts are proprietary to Puzzlers or licensed providers. Unauthorized redistribution is prohibited.
          </p>

          <h3 className="text-base font-bold text-heading">3. Examination Simulation Notice</h3>
          <p>
            Puzzlers mock tests are independent study materials designed to replicate the official testing experience. We are not officially affiliated with or endorsed by NTA or the Maharashtra State CET Cell.
          </p>
        </div>
      </Container>
    </Section>
  );
}
