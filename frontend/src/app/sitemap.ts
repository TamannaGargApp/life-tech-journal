import type { MetadataRoute } from "next";

const BASE = "https://lifetechjournal.com";
const API  = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,            lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/blog`,  lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
  try {
    const res  = await fetch(`${API}/articles?size=500&status=published`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const articlePages: MetadataRoute.Sitemap = (data.items ?? []).map((a: { slug: string; updated_at: string }) => ({
      url: `${BASE}/blog/${a.slug}`, lastModified: new Date(a.updated_at), changeFrequency: "weekly" as const, priority: 0.8,
    }));
    return [...staticPages, ...articlePages];
  } catch {
    return staticPages;
  }
}
