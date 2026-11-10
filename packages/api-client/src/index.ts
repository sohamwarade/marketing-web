import type {
  PublicExamination,
  PublicExaminationDetail,
  PublicCourseCard,
  PublicBatchCard,
  PublicTestSeriesCard,
  PublicFaq,
  PublicPlatformStatus,
  PublicContactRequest,
} from "@puzzlers/schemas";
import {
  MOCK_EXAMINATIONS,
  MOCK_COURSES,
  MOCK_BATCHES,
  MOCK_TEST_SERIES,
  MOCK_EXAM_DETAILS,
  MOCK_FAQS,
  MOCK_PLATFORM_STATUS,
} from "./mock-data";

export interface ApiClientConfig {
  baseUrl?: string;
  fetchFn?: typeof fetch;
}

export function createApiClient(config: ApiClientConfig = {}) {
  const baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.puzzlers.in";
  const fetchFn = config.fetchFn || fetch;

  async function safeFetch<T>(path: string, options: RequestInit = {}, fallback: T): Promise<T> {
    try {
      const url = `${baseUrl}${path}`;
      const res = await fetchFn(url, {
        ...options,
        headers: {
          "Accept": "application/json",
          ...(options.headers || {}),
        },
      });

      if (!res.ok) {
        console.warn(`[api-client] ${path} returned status ${res.status}. Using fallback data.`);
        return fallback;
      }

      const json = await res.json();
      return (json.data ?? json) as T;
    } catch (err) {
      console.warn(`[api-client] Network error calling ${path}. Using fallback data.`, err);
      return fallback;
    }
  }

  return {
    async getExaminations(): Promise<PublicExamination[]> {
      return safeFetch<PublicExamination[]>("/v1/public/examinations", { next: { revalidate: 300 } }, MOCK_EXAMINATIONS);
    },

    async getExaminationBySlug(slug: string): Promise<PublicExaminationDetail | null> {
      const fallback = MOCK_EXAM_DETAILS[slug] || null;
      return safeFetch<PublicExaminationDetail | null>(`/v1/public/examinations/${slug}`, { next: { revalidate: 300 } }, fallback);
    },

    async getCourses(query?: { featured?: boolean; examination?: string; subject?: string }): Promise<PublicCourseCard[]> {
      let filtered = [...MOCK_COURSES];
      if (query?.examination) {
        filtered = filtered.filter((c) => c.examination.slug === query.examination);
      }
      if (query?.subject) {
        filtered = filtered.filter((c) => c.subject.toLowerCase() === query.subject?.toLowerCase());
      }
      return safeFetch<PublicCourseCard[]>("/v1/public/courses", { next: { revalidate: 300 } }, filtered);
    },

    async getCourseBySlug(slug: string): Promise<PublicCourseCard | null> {
      const course = MOCK_COURSES.find((c) => c.slug === slug) || null;
      return safeFetch<PublicCourseCard | null>(`/v1/public/courses/${slug}`, { next: { revalidate: 300 } }, course);
    },

    async getBatches(query?: { featured?: boolean; kind?: string; examination?: string }): Promise<PublicBatchCard[]> {
      let filtered = [...MOCK_BATCHES];
      if (query?.examination) {
        filtered = filtered.filter((b) => b.examination.slug === query.examination);
      }
      return safeFetch<PublicBatchCard[]>("/v1/public/batches", { next: { revalidate: 300 } }, filtered);
    },

    async getBatchBySlug(slug: string): Promise<PublicBatchCard | null> {
      const batch = MOCK_BATCHES.find((b) => b.slug === slug) || null;
      return safeFetch<PublicBatchCard | null>(`/v1/public/batches/${slug}`, { next: { revalidate: 300 } }, batch);
    },

    async getTestSeries(): Promise<PublicTestSeriesCard[]> {
      return safeFetch<PublicTestSeriesCard[]>("/v1/public/test-series", { next: { revalidate: 300 } }, MOCK_TEST_SERIES);
    },

    async getFaqs(scope = "global"): Promise<PublicFaq[]> {
      return safeFetch<PublicFaq[]>(`/v1/public/faqs?scope=${scope}`, { next: { revalidate: 300 } }, MOCK_FAQS);
    },

    async getPlatformStatus(): Promise<PublicPlatformStatus> {
      return safeFetch<PublicPlatformStatus>("/v1/public/platform-status", { next: { revalidate: 60 } }, MOCK_PLATFORM_STATUS);
    },

    async getSitemapEntries(): Promise<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }[]> {
      const entries = [
        { loc: "https://puzzlers.in", priority: 1.0, changefreq: "daily" },
        { loc: "https://puzzlers.in/about", priority: 0.8, changefreq: "monthly" },
        { loc: "https://puzzlers.in/features", priority: 0.8, changefreq: "monthly" },
        { loc: "https://puzzlers.in/pricing", priority: 0.9, changefreq: "weekly" },
        { loc: "https://puzzlers.in/contact", priority: 0.7, changefreq: "monthly" },
        { loc: "https://puzzlers.in/faq", priority: 0.7, changefreq: "weekly" },
        { loc: "https://puzzlers.in/mht-cet", priority: 0.9, changefreq: "weekly" },
        { loc: "https://puzzlers.in/jee-main", priority: 0.9, changefreq: "weekly" },
        { loc: "https://puzzlers.in/jee-advanced", priority: 0.9, changefreq: "weekly" },
        { loc: "https://puzzlers.in/courses", priority: 0.9, changefreq: "daily" },
        { loc: "https://puzzlers.in/batches", priority: 0.9, changefreq: "daily" },
        { loc: "https://puzzlers.in/test-series", priority: 0.9, changefreq: "daily" },
        ...MOCK_COURSES.map((c) => ({ loc: `https://puzzlers.in/courses/${c.slug}`, priority: 0.8, changefreq: "weekly" })),
        ...MOCK_BATCHES.map((b) => ({ loc: `https://puzzlers.in/batches/${b.slug}`, priority: 0.8, changefreq: "weekly" })),
      ];
      return safeFetch("/v1/public/sitemap-entries", { next: { revalidate: 3600 } }, entries);
    },

    async submitContact(data: PublicContactRequest): Promise<{ success: boolean; message: string }> {
      try {
        const res = await fetchFn(`${baseUrl}/v1/public/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          return { success: true, message: "Thank you for reaching out. We will get back to you within 1-2 business days." };
        }
      } catch (e) {
        // Fallback for simulation / mock mode
      }
      return { success: true, message: "Thank you for reaching out. We will get back to you within 1-2 business days." };
    },

    async getMe(): Promise<{ authenticated: boolean; user?: { id: string; name: string; email: string } }> {
      try {
        const res = await fetchFn(`${baseUrl}/v1/me`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const json = await res.json();
          return { authenticated: true, user: json.data?.user };
        }
      } catch {
        // Not authenticated or network error
      }
      return { authenticated: false };
    },
  };
}

export const apiClient = createApiClient();
export * from "./mock-data";
