import * as React from "react";
import type { Metadata } from "next";
import { Section, Container } from "@puzzlers/ui";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy | Puzzlers",
  description: "Official Privacy Policy regarding user account data, test answers, and analytics at Puzzlers.",
  canonicalUrl: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <Section tone="white" className="py-12">
      <Container className="max-w-3xl space-y-6">
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-black text-heading tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: November 2026
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-body space-y-4 leading-relaxed">
          <p>
            At Puzzlers (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we are committed to safeguarding the privacy of our students and candidates. This policy explains what information is collected when you create an account, take practice tests, or purchase batches.
          </p>

          <h3 className="text-base font-bold text-heading">1. Information We Collect</h3>
          <p>
            We collect personal identification details (name, email address, phone number), examination targets (MHT-CET or JEE), test submission logs, answer responses, and diagnostic metrics. Payment transactions are processed directly by Cashfree Payment Gateway; we do not store full credit card numbers or banking passwords.
          </p>

          <h3 className="text-base font-bold text-heading">2. How We Use Your Data</h3>
          <p>
            Your information is used solely to provide your learning dashboard, maintain your continuous test attempt autosave, compute percentile analytics, and communicate critical exam schedules. We never sell student data to third-party marketing brokers.
          </p>

          <h3 className="text-base font-bold text-heading">3. Security of Data</h3>
          <p>
            Your session tokens and test states are protected with strict transport encryption (TLS 1.3), secure HTTP cookies, and row-level database authorization.
          </p>

          <h3 className="text-base font-bold text-heading">4. Contact For Privacy Queries</h3>
          <p>
            If you have questions regarding your stored responses or wish to request data deletion, contact us at <a href="mailto:privacy@puzzlers.in" className="text-primary underline">privacy@puzzlers.in</a>.
          </p>
        </div>
      </Container>
    </Section>
  );
}
