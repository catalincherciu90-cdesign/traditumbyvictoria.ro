import { DEFAULT_CONFIG } from "./site-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export function str(v: Any, max = 300): string {
  return String(v == null ? "" : v).slice(0, max).trim();
}

export function slugify(s: string): string {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeContent(body: Any) {
  const d = DEFAULT_CONFIG.content;
  const c = body && typeof body === "object" ? body : {};
  const ha = c.homeAbout || {}, sv = c.services || {}, ap = c.aboutPage || {};
  const bullets = Array.isArray(ha.bullets) ? ha.bullets : [];
  const facts = Array.isArray(c.facts) ? c.facts : [];
  const items = Array.isArray(sv.items) ? sv.items : [];
  return {
    homeAbout: {
      eyebrow: str(ha.eyebrow, 60) || d.homeAbout.eyebrow,
      title: str(ha.title, 160) || d.homeAbout.title,
      p1: str(ha.p1, 1000) || d.homeAbout.p1,
      p2: str(ha.p2, 1000) || d.homeAbout.p2,
      bullets: d.homeAbout.bullets.map((def, i) => str(bullets[i], 80) || def),
    },
    facts: d.facts.map((def, i) => ({
      value: str(facts[i]?.value, 12) || def.value,
      label: str(facts[i]?.label, 60) || def.label,
    })),
    services: {
      eyebrow: str(sv.eyebrow, 60) || d.services.eyebrow,
      title: str(sv.title, 160) || d.services.title,
      intro: str(sv.intro, 600) || d.services.intro,
      items: d.services.items.map((def, i) => ({
        title: str(items[i]?.title, 80) || def.title,
        text: str(items[i]?.text, 400) || def.text,
      })),
    },
    aboutPage: {
      eyebrow: str(ap.eyebrow, 60) || d.aboutPage.eyebrow,
      title: str(ap.title, 160) || d.aboutPage.title,
      story: str(ap.story, 4000) || d.aboutPage.story,
      highlight: str(ap.highlight, 300) || d.aboutPage.highlight,
    },
  };
}

export function sanitizeConfig(body: Any) {
  const d = DEFAULT_CONFIG;
  const ct = body.contact || {};
  const promo = body.promo || {};

  const catsSrc = Array.isArray(body.categories) ? body.categories.slice(0, 30) : [];
  const usedSlugs: Record<string, boolean> = {};
  const categories = catsSrc
    .map((c: Any, i: number) => {
      c = c || {};
      const title = str(c.title, 80) || "Categorie " + (i + 1);
      let slug = slugify(c.slug) || slugify(title) || "categorie-" + (i + 1);
      while (usedSlugs[slug]) slug = slug + "-" + (i + 1);
      usedSlugs[slug] = true;
      const imgs = Array.isArray(c.images) ? c.images.slice(0, 12).map((x: Any) => str(x, 300)).filter(Boolean) : [];
      const products = Array.isArray(c.products)
        ? c.products.slice(0, 100).map((pr: Any) => ({
            title: str(pr && (pr.title || pr.name), 120),
            image: str(pr && pr.image, 300),
            description: str(pr && pr.description, 400),
          })).filter((pr: Any) => pr.image || pr.title)
        : [];
      return {
        id: str(c.id, 60) || slug,
        slug,
        title,
        description: str(c.description, 1500),
        priceMin: str(c.priceMin, 30),
        priceMax: str(c.priceMax, 30),
        priceOnRequest: !!c.priceOnRequest,
        images: imgs,
        products,
      };
    })
    .filter((c: Any) => c.title);

  const gallery = Array.isArray(body.gallery)
    ? body.gallery.slice(0, 40).map((i: Any) => str(i, 300)).filter(Boolean)
    : d.gallery;
  const galItem = (x: Any) =>
    typeof x === "string" ? { url: str(x, 300), cat: "" } : { url: str(x && x.url, 300), cat: str(x && x.cat, 40) };
  const galleryPage = Array.isArray(body.galleryPage)
    ? body.galleryPage.slice(0, 120).map(galItem).filter((i: Any) => i.url)
    : d.galleryPage;

  const hoursSrc = body.hours && typeof body.hours === "object" ? body.hours : {};
  const hours: Record<string, string> = {};
  for (const day of ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]) hours[day] = str(hoursSrc[day], 40);

  const testimonials = Array.isArray(body.testimonials)
    ? body.testimonials.slice(0, 20).map((t: Any) => ({
        name: str(t && t.name, 80),
        role: str(t && t.role, 60) || "Client",
        text: str(t && t.text, 600),
        rating: Math.min(5, Math.max(1, parseInt(t && t.rating, 10) || 5)),
      })).filter((t: Any) => t.name || t.text)
    : d.testimonials;

  return {
    promo: { title: str(promo.title, 160) || d.promo.title },
    contact: {
      phone: str(ct.phone, 60),
      email: str(ct.email, 120),
      address: str(ct.address, 200),
      facebook: str(ct.facebook, 200),
      instagram: str(ct.instagram, 200),
      tiktok: str(ct.tiktok, 200),
    },
    categories: categories.length ? categories : d.categories,
    gallery,
    galleryPage,
    hours,
    testimonials,
    content: sanitizeContent(body.content),
  };
}
