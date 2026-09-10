import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: "https://traditumbyvictoria.ro/sitemap.xml",
    host: "https://traditumbyvictoria.ro",
  };
}
