import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container, Button, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@puzzlers/ui";
import type { PublicFaq } from "@puzzlers/schemas";

export function FAQSection({ faqs }: { faqs: PublicFaq[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Section tone="cream">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Answers & Clarity
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-body">
            Common questions regarding test patterns, courses, and technical simulation details.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
          <Accordion type="single">
            {faqs.slice(0, 6).map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger itemValue={faq.id}>
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent itemValue={faq.id}>
                  <div
                    className="prose prose-sm max-w-none text-body"
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link href="/faq">
              <Button variant="outline" className="font-semibold text-primary">
                View all FAQs & Help Topics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
