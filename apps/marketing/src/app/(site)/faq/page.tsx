import * as React from "react";
import type { Metadata } from "next";
import { Section, Container } from "@puzzlers/ui";
import { api } from "@/lib/api";
import { constructMetadata } from "@/lib/seo";
import { FaqSearch } from "@/islands/faq-search";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Frequently Asked Questions | Puzzlers Help Center",
  description:
    "Find answers to common questions about MHT-CET and JEE tests, CBT autosave recovery, course access, and Cashfree payments.",
  canonicalUrl: "/faq",
});

export default async function FaqPage() {
  const faqs = await api.getFaqs("global");

  // Schema.org FAQPage JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answerHtml.replace(/<[^>]*>?/gm, ""),
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section tone="white" className="pt-12 pb-14 text-center border-b border-border">
        <Container className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight mt-4 font-display">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base text-body leading-relaxed">
            Everything you need to know about CBT tests, pricing, and our preparation methodology.
          </p>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <FaqSearch faqs={faqs} />
        </Container>
      </Section>
    </div>
  );
}
