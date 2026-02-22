import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/monitoring/"],
      },
    ],
    sitemap: "https://ratiothedigitalcourtsociety.com/sitemap.xml",
  };
}
