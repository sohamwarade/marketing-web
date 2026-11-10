import * as React from "react";
import Link from "next/link";
import { ChevronDown, BookOpen, Layers, Award, Sparkles } from "lucide-react";
import { Logo } from "@puzzlers/ui";
import { AuthStateButton } from "@/islands/auth-state-button";
import { MobileNav } from "@/islands/mobile-nav";
import { api } from "@/lib/api";

export async function Header() {
  const examinations = await api.getExaminations();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md transition-shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center" aria-label="Puzzlers Home">
            <Logo variant="full" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-body">
            {/* Mega menu for Exams */}
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 py-2 font-semibold text-heading transition-colors hover:text-primary cursor-pointer"
              >
                <span>Examinations</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:rotate-180" />
              </button>

              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute left-0 top-full mt-1 w-80 rounded-xl border border-border bg-white p-3 shadow-xl">
                <div className="space-y-1">
                  {examinations.map((exam) => (
                    <Link
                      key={exam.slug}
                      href={`/${exam.slug}`}
                      className="flex flex-col rounded-lg p-2.5 transition-colors hover:bg-blue-50/80"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-heading text-sm">{exam.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">
                          {exam.code}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {exam.shortDescription || exam.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/courses" className="transition-colors hover:text-primary">
              Courses
            </Link>
            <Link href="/batches" className="transition-colors hover:text-primary">
              Batches
            </Link>
            <Link href="/test-series" className="transition-colors hover:text-primary">
              Test Series
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="/features" className="transition-colors hover:text-primary">
              Features
            </Link>
          </nav>
        </div>

        {/* Right side: Auth island & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex">
            <AuthStateButton />
          </div>
          <MobileNav examinations={examinations} />
        </div>
      </div>
    </header>
  );
}
