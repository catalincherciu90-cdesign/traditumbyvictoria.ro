import type { SiteConfig, Category, Review, Testimonial } from "./site-data";

const BASE = "https://traditumbyvictoria.ro";

export function bakeryLd(cfg: SiteConfig, ratings: (Review | Testimonial)[]) {
  const count = ratings.length;
  const avg = count ? ratings.reduce((s, r) => s + (r.rating || 5), 0) / count : 5;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ld: any = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Traditum By Victoria",
    description: "Cofetărie artizanală în București — torturi personalizate, prăjituri de casă și candy bar pentru evenimente.",
    url: BASE,
    telephone: cfg.contact.phone,
    email: cfg.contact.email,
    address: { "@type": "PostalAddress", streetAddress: cfg.contact.address, addressLocality: "București", addressCountry: "RO" },
    areaServed: ["București", "Ilfov"],
    servesCuisine: "Cofetărie",
    priceRange: "$$",
  };
  if (count) ld.aggregateRating = { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: count, bestRating: 5, worstRating: 1 };
  return ld;
}

export function categoryLd(c: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: c.title,
    description: c.description,
    image: c.images.map((i) => (i.startsWith("http") ? i : BASE + i)),
    brand: { "@type": "Brand", name: "Traditum By Victoria" },
    offers: c.priceOnRequest || !c.priceMin
      ? { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "RON", url: `${BASE}/produse/${c.slug}` }
      : { "@type": "AggregateOffer", priceCurrency: "RON", lowPrice: c.priceMin, highPrice: c.priceMax || c.priceMin, availability: "https://schema.org/InStock", url: `${BASE}/produse/${c.slug}` },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: BASE + it.path })),
  };
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
}
