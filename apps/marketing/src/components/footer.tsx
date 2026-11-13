import * as React from "react";
import Link from "next/link";
import { Logo } from "@puzzlers/ui";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-navy/20 bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <Logo variant="full" tone="light" />
            <p className="max-w-sm text-sm text-blue-100/80 leading-relaxed">
              Official computer-based test preparation platform for MHT-CET and JEE Main.
              Complete syllabus courses, verified test simulations, and deep diagnostic analytics.
            </p>
            <div className="text-xs text-blue-200/70 pt-2">
              Support Email: <a href="mailto:support@puzzlers.in" className="underline hover:text-white">support@puzzlers.in</a>
            </div>
          </div>

          {/* Examinations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber">Examinations</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-blue-100/80">
              <li>
                <Link href="/mht-cet" className="hover:text-white transition-colors">
                  MHT-CET Preparation
                </Link>
              </li>
              <li>
                <Link href="/jee-main" className="hover:text-white transition-colors">
                  JEE Main Preparation
                </Link>
              </li>
              <li>
                <Link href="/test-series" className="hover:text-white transition-colors">
                  All Mock Test Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Catalog */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-blue-100/80">
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/batches" className="hover:text-white transition-colors">
                  Target Batches
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Puzzlers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber">Legal & Policies</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-blue-100/80">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/60 gap-4">
          <p>© {currentYear} Puzzlers. All rights reserved.</p>
          <p>Designed strictly per official MHT-CET & NTA JEE examination standards.</p>
        </div>
      </div>
    </footer>
  );
}
