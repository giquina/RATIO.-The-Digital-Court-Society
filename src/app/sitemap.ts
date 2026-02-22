import { MetadataRoute } from "next";

const DOMAIN = "https://ratiothedigitalcourtsociety.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Public pages
  const publicRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/register", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  // App pages (discoverable by search engines for SEO)
  const appRoutes = [
    { path: "/home", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/sessions", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/community", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/ai-practice", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/library", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/law-book", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/parliament", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/rankings", priority: 0.6, changeFrequency: "daily" as const },
    { path: "/chambers", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/tools", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return [...publicRoutes, ...appRoutes].map((route) => ({
    url: `${DOMAIN}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
