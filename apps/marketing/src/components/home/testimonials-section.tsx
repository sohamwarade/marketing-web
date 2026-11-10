import * as React from "react";
import { Quote } from "lucide-react";
import { Section, Container } from "@puzzlers/ui";
import testimonialsData from "@/content/testimonials.json";

interface Testimonial {
  id: string;
  name: string;
  examination: string;
  year: string;
  quote: string;
  consentOnFile: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export function TestimonialsSection() {
  const approvedTestimonials = (testimonialsData as Testimonial[]).filter(
    (t) => t.consentOnFile && t.approvedBy
  );

  if (approvedTestimonials.length === 0) {
    return null;
  }

  return (
    <Section tone="white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Student Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading tracking-tight mt-3">
            What Practicing Students Say
          </h2>
          <p className="mt-2 text-sm text-body">
            Feedback from students who trained with our CBT mock test engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {approvedTestimonials.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl border border-border bg-card p-7 shadow-sm flex flex-col justify-between"
            >
              <Quote className="h-8 w-8 text-blue-200 mb-3" />
              <p className="text-sm text-body leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-heading">{item.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    Target: {item.examination} ({item.year})
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Verified Student
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
