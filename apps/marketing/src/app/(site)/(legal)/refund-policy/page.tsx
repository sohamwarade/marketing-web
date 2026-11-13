import * as React from "react";
import type { Metadata } from "next";
import { Section, Container } from "@puzzlers/ui";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Refund & Cancellation Policy | Puzzlers",
  description: "Official cancellation and refund policies for Puzzlers courses, batches, and test series.",
  canonicalUrl: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <Section tone="white" className="py-12">
      <Container className="max-w-3xl space-y-6">
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-black text-heading tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: November 2026
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-body space-y-4 leading-relaxed">
          <p>
            We strive to provide total transparency in our digital educational offerings. Please review our refund guidelines prior to purchase:
          </p>

          <h3 className="text-base font-bold text-heading">1. Free Trial Assessment</h3>
          <p>
            Because we offer free diagnostic CBT tests and preview lessons for every student, candidates are strongly encouraged to test the platform interface and video streaming compatibility before completing a purchase.
          </p>

          <h3 className="text-base font-bold text-heading">2. Digital Test Series & Courses</h3>
          <p>
            Due to the immediate provisioning of proprietary digital test papers and downloadable PDF notes upon payment confirmation, purchases of standalone Test Series and digital courses are generally non-refundable once unlocked.
          </p>

          <h3 className="text-base font-bold text-heading">3. Technical Errors & Duplicate Transactions</h3>
          <p>
            In the event of an inadvertent double charge or payment gateway deduction where access was not provisioned, a full refund for the duplicate transaction will be processed to the original payment source within 5–7 banking days via Cashfree.
          </p>

          <h3 className="text-base font-bold text-heading">4. Contacting Billing Support</h3>
          <p>
            For assistance with transaction verification or refund inquiries, write to <a href="mailto:billing@puzzlers.in" className="text-primary underline">billing@puzzlers.in</a> with your Order ID.
          </p>
        </div>
      </Container>
    </Section>
  );
}
