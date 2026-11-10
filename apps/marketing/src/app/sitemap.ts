import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await api.getSitemapEntries();

  return entries.map((entry) => ({
    url: entry.loc,
    lastModified: entry.lastmod ? new Date(entry.lastmod) : new Date(),
    changeFrequency: (entry.changefreq as any) || "weekly",
    priority: entry.priority ?? 0.8,
  }));
}
