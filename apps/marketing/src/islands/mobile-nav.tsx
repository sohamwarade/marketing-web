"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, BookOpen, Layers, Award, HelpCircle } from "lucide-react";
import { Button, Logo } from "@puzzlers/ui";
import { studentUrl } from "@/lib/links";

export function MobileNav({ examinations }: { examinations: { name: string; slug: string }[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-navy shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <Logo variant="full" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-heading"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-4">
              <div className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                Target Examinations
              </div>
              <div className="flex flex-col space-y-1">
                {examinations.map((exam) => (
                  <Link
                    key={exam.slug}
                    href={`/${exam.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-2 text-base font-medium text-heading hover:text-primary"
                  >
                    <span>{exam.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              <div className="my-2 border-t border-border" />

              <div className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                Explore
              </div>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/courses"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-base font-medium text-heading hover:text-primary"
                >
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Courses
                </Link>
                <Link
                  href="/batches"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-base font-medium text-heading hover:text-primary"
                >
                  <Layers className="h-4 w-4 text-blue-600" />
                  Batches
                </Link>
                <Link
                  href="/test-series"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-base font-medium text-heading hover:text-primary"
                >
                  <Award className="h-4 w-4 text-blue-600" />
                  Test Series
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-base font-medium text-heading hover:text-primary"
                >
                  Pricing
                </Link>
                <Link
                  href="/features"
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-base font-medium text-heading hover:text-primary"
                >
                  Features
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-base font-medium text-heading hover:text-primary"
                >
                  FAQs
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-base font-medium text-heading hover:text-primary"
                >
                  Contact Us
                </Link>
              </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-border flex flex-col gap-3">
              <a href={studentUrl("/login", { next: "/dashboard" })}>
                <Button variant="outline" className="w-full font-semibold">
                  Login
                </Button>
              </a>
              <a href={studentUrl("/register")}>
                <Button variant="accent" className="w-full font-semibold">
                  Start free
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
