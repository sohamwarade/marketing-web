"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Input } from "@puzzlers/ui";
import type { PublicFaq } from "@puzzlers/schemas";

export function FaqSearch({ faqs }: { faqs: PublicFaq[] }) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answerHtml.toLowerCase().includes(q) ||
        (f.category && f.category.toLowerCase().includes(q))
    );
  }, [faqs, query]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search FAQs by topic or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-11 text-base shadow-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No FAQs found matching &quot;{query}&quot;. Try different keywords.
        </div>
      ) : (
        <Accordion type="single" className="max-w-3xl mx-auto divide-y divide-border">
          {filtered.map((faq) => (
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
      )}
    </div>
  );
}
