import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_MARKETING_URL || "https://puzzlers.in";
const SITE_NAME = "Puzzlers";
const DEFAULT_DESCRIPTION =
  "Official preparation platform for MHT-CET and JEE Main. Realistic CBT exam simulations, structured video lessons, and deep diagnostic performance analytics.";

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  noIndex = false,
  ogImage = "/og-image.jpg",
}: {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  ogImage?: string;
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — MHT-CET & JEE Exam Preparation`;
  const canonical = canonicalUrl ? `${SITE_URL}${canonicalUrl}` : SITE_URL;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
    },
    icons: {
      icon: "/favicon.png",
      apple: "/logo.png",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`],
    },
    metadataBase: new URL(SITE_URL),
  };
}
