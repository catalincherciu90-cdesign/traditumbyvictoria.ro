// Stratul de date al site-ului.
// În producție (Cloudflare) citește configul din KV (PRODUCTS / cheia "siteconfig")
// și recenziile din cheia "reviews". În dev (fără binding) folosește valorile
// implicite de mai jos, care oglindesc DEFAULT_CONFIG din worker-ul actual.

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceMin?: string;
  priceMax?: string;
  priceOnRequest?: boolean;
  images: string[];
  products?: { title: string; image: string; description?: string }[];
};

export type Testimonial = {
  name: string;
  role?: string;
  rating: number;
  text: string;
};

export type Review = Testimonial & { id?: string; date?: string };

export type SiteContent = {
  homeAbout: { eyebrow: string; title: string; p1: string; p2: string; bullets: string[] };
  facts: { value: string; label: string }[];
  services: { eyebrow: string; title: string; intro: string; items: { title: string; text: string }[] };
  aboutPage: { eyebrow: string; title: string; story: string; highlight: string };
};

export type SiteConfig = {
  promo: { title: string };
  contact: { phone: string; email: string; address: string; facebook: string; instagram: string; tiktok: string };
  categories: Category[];
  gallery: string[];
  galleryPage: (string | { url: string; cat?: string })[];
  hours: Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", string>;
  content: SiteContent;
  testimonials: Testimonial[];
};

export const DEFAULT_CONFIG: SiteConfig = {
  promo: { title: "Cea mai dulce cofetărie din orașul tău" },
  contact: {
    phone: "0725 252 493",
    email: "contact@traditumbyvictoria.ro",
    address: "Strada Libertății 53, București",
    facebook: "",
    instagram: "",
    tiktok: "",
  },
  categories: [
    {
      id: "torturi",
      slug: "torturi",
      title: "Torturi",
      description:
        "Torturi personalizate pentru aniversări, nunți, botezuri și orice ocazie specială. Fiecare tort este realizat la comandă, din ingrediente atent alese, după tema și dorința ta.",
      priceMin: "150",
      priceMax: "600",
      images: ["/img/product-1.jpg", "/img/about-1.jpg"],
    },
    {
      id: "candybar",
      slug: "candybar",
      title: "Candy Bar",
      description:
        "Mese dulci și candy bar-uri pentru evenimente — un colț de poveste cu prăjituri asortate, macarons, tarte și deserturi în miniatură, aranjate elegant pentru momentele tale speciale.",
      priceMin: "300",
      priceMax: "1500",
      images: ["/img/product-3.jpg", "/img/service-2.jpg"],
    },
  ],
  gallery: ["/img/product-1.jpg", "/img/product-2.jpg", "/img/product-3.jpg"],
  galleryPage: [
    "/img/product-1.jpg", "/img/product-2.jpg", "/img/product-3.jpg",
    "/img/about-1.jpg", "/img/about-2.jpg", "/img/service-1.jpg", "/img/service-2.jpg",
  ],
  hours: {
    mon: "09:00 - 18:00", tue: "09:00 - 18:00", wed: "09:00 - 18:00",
    thu: "09:00 - 18:00", fri: "09:00 - 18:00", sat: "10:00 - 16:00", sun: "",
  },
  content: {
    homeAbout: {
      eyebrow: "Despre noi",
      title: "Pregătim fiecare produs din toată inima",
      p1: "Traditum By Victoria este un proiect ce a luat naștere din dorința de a oferi o experiență culinară inedită. În laboratorul nostru de cofetărie, fiecare desert este gândit cu grijă și realizat din ingrediente alese cu atenție.",
      p2: "Pasiunea pentru dulciuri întâlnește măiestria culinară în fiecare tort, prăjitură sau desert pe care îl creăm — cu rețete artizanale și un strop de tradiție.",
      bullets: ["Produse de calitate", "Torturi personalizate", "Comenzi online", "Livrare la domiciliu"],
    },
    facts: [
      { value: "10", label: "Ani de experiență" },
      { value: "80", label: "Rețete artizanale" },
      { value: "120", label: "Sortimente de produse" },
      { value: "2500", label: "Clienți mulțumiți" },
    ],
    services: {
      eyebrow: "Serviciile noastre",
      title: "Ce îți oferim?",
      intro: "De la torturi personalizate până la mese dulci pentru evenimente, ne ocupăm de fiecare detaliu ca momentele tale să fie cu adevărat dulci.",
      items: [
        { title: "Produse de calitate", text: "Ingrediente alese cu grijă și rețete artizanale, pentru un gust pe care îl ții minte." },
        { title: "Torturi personalizate", text: "Creăm torturi după dorința ta, pentru aniversări, nunți, botezuri și orice ocazie." },
        { title: "Comenzi online", text: "Comanzi simplu, prin telefon sau mesaj, iar noi ne ocupăm de rest." },
        { title: "Livrare la domiciliu", text: "Aducem deserturile proaspete direct la tine, gata pentru momentul special." },
      ],
    },
    aboutPage: {
      eyebrow: "Despre noi",
      title: "Povestea Traditum by Victoria",
      story: "Povestea Traditum by Victoria a început în urmă cu peste 15 ani, din dorința de a aduce pe masă gustul autentic al deserturilor făcute în casă.\n\nLa început pregăteam cozonaci, pască, prăjituri și produse tradiționale în propria bucătărie. Ceea ce a pornit din necesitate s-a transformat treptat într-o pasiune care m-a însoțit zi de zi.\n\nDe-a lungul anilor am investit timp, muncă și multă dorință de a învăța. Am urmat cursuri, am testat rețete, am perfecționat tehnici și am căutat mereu să ofer produse realizate cu atenție la fiecare detaliu.\n\nAstăzi, în laboratorul propriu, pregătesc cu aceeași grijă torturi, prăjituri, candy bar-uri și produse tradiționale de sezon. Fiecare comandă este realizată cu ingrediente atent alese și cu respect pentru gustul autentic care m-a inspirat încă de la început.",
      highlight: "Traditum by Victoria înseamnă tradiție, perseverență și dragoste pentru ceea ce fac.",
    },
  },
  testimonials: [
    { name: "Andreea M.", role: "Client", rating: 5, text: "Cel mai bun tort de la aniversarea fiicei mele! Arăta superb și avea un gust pe măsură. Recomand cu drag." },
    { name: "Mihai P.", role: "Client", rating: 5, text: "Am comandat masa dulce pentru nuntă și totul a fost perfect. Invitații au fost încântați de fiecare desert." },
    { name: "Elena D.", role: "Client", rating: 5, text: "Prăjiturile de casă au exact gustul copilăriei. Se simte că sunt făcute cu suflet și ingrediente bune." },
    { name: "Cristina V.", role: "Client", rating: 5, text: "Servicii impecabile și deserturi delicioase. Traditum By Victoria a devenit cofetăria mea preferată!" },
  ],
};

// Accesează binding-ul KV prin OpenNext, dacă rulează pe Cloudflare.
async function getKV(): Promise<KVNamespace | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ctx?.env as any)?.PRODUCTS ?? null;
  } catch {
    return null;
  }
}

function mergeConfig(data: Partial<SiteConfig> | null): SiteConfig {
  if (!data) return DEFAULT_CONFIG;
  return {
    ...DEFAULT_CONFIG,
    ...data,
    contact: { ...DEFAULT_CONFIG.contact, ...(data.contact || {}) },
    hours: { ...DEFAULT_CONFIG.hours, ...(data.hours || {}) },
    categories: Array.isArray(data.categories) && data.categories.length ? data.categories : DEFAULT_CONFIG.categories,
    gallery: Array.isArray(data.gallery) ? data.gallery : DEFAULT_CONFIG.gallery,
    galleryPage: Array.isArray(data.galleryPage) ? data.galleryPage : DEFAULT_CONFIG.galleryPage,
    testimonials: Array.isArray(data.testimonials) ? data.testimonials : DEFAULT_CONFIG.testimonials,
    content: {
      ...DEFAULT_CONFIG.content,
      ...(data.content || {}),
      homeAbout: { ...DEFAULT_CONFIG.content.homeAbout, ...(data.content?.homeAbout || {}) },
      services: { ...DEFAULT_CONFIG.content.services, ...(data.content?.services || {}) },
      aboutPage: { ...DEFAULT_CONFIG.content.aboutPage, ...(data.content?.aboutPage || {}) },
      facts: Array.isArray(data.content?.facts) ? data.content!.facts : DEFAULT_CONFIG.content.facts,
    },
  };
}

export async function getConfig(): Promise<SiteConfig> {
  const kv = await getKV();
  if (!kv) return DEFAULT_CONFIG;
  try {
    const raw = (await kv.get("siteconfig", "json")) as Partial<SiteConfig> | null;
    return mergeConfig(raw);
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function getReviews(): Promise<Review[]> {
  const kv = await getKV();
  if (!kv) return [];
  try {
    const list = ((await kv.get("reviews", "json")) as (Review & { approved?: boolean })[]) || [];
    // arată doar recenziile aprobate (cele vechi, fără câmp, rămân vizibile)
    return list.filter((r) => r.approved !== false);
  } catch {
    return [];
  }
}

// Normalizează un element de galerie la { url, cat }.
export function galItem(g: string | { url: string; cat?: string }): { url: string; cat?: string } {
  return typeof g === "string" ? { url: g } : g;
}

// Text de preț pentru o categorie.
export function categoryPrice(c: Category): string {
  if (c.priceOnRequest) return "Preț la cerere";
  if (c.priceMin && c.priceMax) return `${c.priceMin} – ${c.priceMax} lei`;
  if (c.priceMin) return `de la ${c.priceMin} lei`;
  return "Preț la cerere";
}
