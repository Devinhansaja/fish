import type { MetadataRoute } from "next";
import { SITE_URL, nav } from "@/lib/site";
import { species } from "@/lib/species";
import { posts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...nav.map((n) => ({
      url: `${SITE_URL}${n.href === "/" ? "" : n.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: n.href === "/" ? 1 : 0.8,
    })),
    ...species.map((s) => ({
      url: `${SITE_URL}/fish-collection/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/news/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
