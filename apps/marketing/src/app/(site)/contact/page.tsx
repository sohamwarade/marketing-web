import * as React from "react";
import type { Metadata } from "next";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { Section, Container } from "@puzzlers/ui";
import { constructMetadata } from "@/lib/seo";
import { ContactForm } from "@/islands/contact-form";

export const metadata: Metadata = constructMetadata({
  title: "Contact Support & Admissions | Puzzlers",
  description:
    "Get in touch with the Puzzlers academic admissions and technical support team for assistance with courses, tests, or payments.",
  canonicalUrl: "/contact",
});

export default function ContactPage() {
  return (
    <div>
      <Section tone="white" className="pt-12 pb-16 text-center border-b border-border">
        <Container className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            Direct Support
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight mt-4 font-display">
            Contact Admissions & Technical Help
          </h1>
          <p className="mt-4 text-base text-body leading-relaxed">
            Have questions regarding batches, question bank accuracy, or account access? We are here to help.
          </p>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-heading mb-2">Send Us a Message</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Our support team typically responds within 1 business day.
              </p>
              <ContactForm />
            </div>

            {/* Support Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-heading border-b border-border pb-3">
                  Support Channels
                </h3>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-heading block">Email Support</span>
                    <a href="mailto:support@puzzlers.in" className="text-xs text-blue-600 hover:underline">
                      support@puzzlers.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-heading block">Admissions Desk</span>
                    <span className="text-xs text-muted-foreground">+91 91234 56789</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-heading block">Working Hours</span>
                    <span className="text-xs text-muted-foreground">Monday – Saturday: 9:00 AM – 7:00 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-blue-50/60 p-6 shadow-sm text-xs space-y-2">
                <span className="font-bold text-navy block text-sm">Online Platform Operations</span>
                <p className="text-body leading-relaxed">
                  Puzzlers CBT infrastructure is monitored 24/7 on Cloudflare Workers edge nodes. Scheduled mock tests operate without interruption during live exam windows.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
