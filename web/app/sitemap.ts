import type { MetadataRoute } from "next";
import { getConfig } from "./lib/site-data";

const BASE = "https://traditumbyvictoria.ro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cfg = await getConfig();
  const now = new Date();
  const staticPaths = ["", "/despre", "/produse", "/galerie", "/recenzii", "/contact", "/termeni", "/confidentialitate", "/cookie-uri"];
  const routes: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: BASE + p,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
  for (const c of cfg.categories) {
    routes.push({ url: `${BASE}/produse/${c.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
  }
  return routes;
}
