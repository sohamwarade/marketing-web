import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { constructMetadata } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = constructMetadata();

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body data-surface="marketing" className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-blue-100 selection:text-navy">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
