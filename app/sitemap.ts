import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date("2026-11-21T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
