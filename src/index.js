/**
 * Worker Traditium By Victoria
 * - Servește site-ul static (binding ASSETS)
 * - API produse cu stocare în KV (binding PRODUCTS)
 * - Autentificare admin pe bază de parolă (secret ADMIN_PASSWORD)
 *
 * Pagina /admin (public/admin.html) consumă acest API.
 */

const PRODUCTS_KEY = "products";
const IMG_PREFIX = "img:";
const COOKIE_NAME = "tv_session";
const SESSION_TTL = 60 * 60 * 8; // 8 ore

// Produse inițiale, salvate la prima accesare dacă magazinul e gol.
const DEFAULT_PRODUCTS = [
  {
    id: "seed-torturi",
    name: "Tort personalizat",
    price: "La comandă",
    category: "Torturi",
    description: "Torturi personalizate pentru aniversări, nunți și orice ocazie specială, create după dorința ta.",
    image: "/img/product-1.jpg",
  },
  {
    id: "seed-prajituri",
    name: "Prăjituri de casă",
    price: "La comandă",
    category: "Prăjituri",
    description: "Prăjituri fine și aromate, pregătite zilnic după rețete artizanale.",
    image: "/img/product-2.jpg",
  },
  {
    id: "seed-mesedulci",
    name: "Mese dulci",
    price: "La comandă",
    category: "Mese dulci",
    description: "Candy bar și mese dulci pentru evenimente — un colț de poveste pentru momentele tale speciale.",
    image: "/img/product-3.jpg",
  },
];

// Configurația de conținut (bannere, titluri, contact), salvată la prima accesare.
const CONFIG_KEY = "siteconfig";
const DEFAULT_CONFIG = {
  carousel: [
    {
      image: "/img/carousel-1.jpg",
      eyebrow: "Laborator de cofetărie",
      title: "Creăm dulciuri cu pasiune",
      subtitle: "Bine ați venit în laboratorul nostru de cofetărie, unde pasiunea pentru dulciuri întâlnește măiestria culinară!",
      buttonText: "Vezi produsele",
      buttonLink: "product.html",
    },
    {
      image: "/img/carousel-2.jpg",
      eyebrow: "Traditium By Victoria",
      title: "O experiență culinară inedită",
      subtitle: "Un proiect născut din dorința de a oferi o experiență culinară inedită, în fiecare desert pe care îl creăm.",
      buttonText: "Comandă acum",
      buttonLink: "contact.html",
    },
  ],
  promo: { title: "Cea mai dulce cofetărie din orașul tău" },
  pageTitles: {
    about: "Despre noi",
    service: "Servicii",
    product: "Produse",
    team: "Echipa noastră",
    testimonial: "Testimoniale",
    contact: "Contact",
    notfound: "Pagina 404",
  },
  contact: {
    phone: "+40 7XX XXX XXX",
    email: "contact@traditumbyvictoria.ro",
    address: "Adresa ta, Localitate, România",
    facebook: "",
    instagram: "",
    tiktok: "",
  },
};

// ---------------------------------------------------------------- utilitare

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

function b64urlEncode(bytes) {
  let bin = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function hmac(key, message) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return b64urlEncode(sig);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

// Token de sesiune: base64url(payload).semnătură, semnat cu ADMIN_PASSWORD
async function createSession(env) {
  const payload = JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL });
  const p = b64urlEncode(new TextEncoder().encode(payload));
  const sig = await hmac(env.ADMIN_PASSWORD, p);
  return `${p}.${sig}`;
}

async function verifySession(env, token) {
  if (!token || !token.includes(".")) return false;
  const [p, sig] = token.split(".");
  const expected = await hmac(env.ADMIN_PASSWORD, p);
  if (!timingSafeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

async function isAuthed(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  return verifySession(env, getCookie(request, COOKIE_NAME));
}

// ---------------------------------------------------------------- produse

async function getProducts(env) {
  let data = await env.PRODUCTS.get(PRODUCTS_KEY, "json");
  if (!data) {
    data = DEFAULT_PRODUCTS;
    await env.PRODUCTS.put(PRODUCTS_KEY, JSON.stringify(data));
  }
  return data;
}

async function saveProducts(env, products) {
  await env.PRODUCTS.put(PRODUCTS_KEY, JSON.stringify(products));
}

function sanitizeProduct(body) {
  return {
    name: String(body.name || "").slice(0, 120).trim(),
    price: String(body.price || "").slice(0, 60).trim(),
    category: String(body.category || "").slice(0, 60).trim(),
    description: String(body.description || "").slice(0, 600).trim(),
    image: String(body.image || "").slice(0, 300).trim(),
  };
}

// ---------------------------------------------------------------- configurație

async function getConfig(env) {
  let data = await env.PRODUCTS.get(CONFIG_KEY, "json");
  if (!data) {
    data = DEFAULT_CONFIG;
    await env.PRODUCTS.put(CONFIG_KEY, JSON.stringify(data));
  }
  return data;
}

function str(v, max) {
  return String(v == null ? "" : v).slice(0, max).trim();
}

function sanitizeConfig(body) {
  const d = DEFAULT_CONFIG;
  const carouselSrc = Array.isArray(body.carousel) ? body.carousel.slice(0, 8) : [];
  const carousel = carouselSrc.map((s) => ({
    image: str(s.image, 300),
    eyebrow: str(s.eyebrow, 120),
    title: str(s.title, 160),
    subtitle: str(s.subtitle, 400),
    buttonText: str(s.buttonText, 60),
    buttonLink: str(s.buttonLink, 200),
  }));
  const pt = body.pageTitles || {};
  const ct = body.contact || {};
  const promo = body.promo || {};
  return {
    carousel: carousel.length ? carousel : d.carousel,
    promo: { title: str(promo.title, 160) || d.promo.title },
    pageTitles: {
      about: str(pt.about, 80) || d.pageTitles.about,
      service: str(pt.service, 80) || d.pageTitles.service,
      product: str(pt.product, 80) || d.pageTitles.product,
      team: str(pt.team, 80) || d.pageTitles.team,
      testimonial: str(pt.testimonial, 80) || d.pageTitles.testimonial,
      contact: str(pt.contact, 80) || d.pageTitles.contact,
      notfound: str(pt.notfound, 80) || d.pageTitles.notfound,
    },
    contact: {
      phone: str(ct.phone, 60),
      email: str(ct.email, 120),
      address: str(ct.address, 200),
      facebook: str(ct.facebook, 200),
      instagram: str(ct.instagram, 200),
      tiktok: str(ct.tiktok, 200),
    },
  };
}

// ---------------------------------------------------------------- API

async function handleApi(request, env, url) {
  const { pathname } = url;
  const method = request.method;

  // sesiune curentă
  if (pathname === "/api/me") {
    return json({ authed: await isAuthed(request, env) });
  }

  // login
  if (pathname === "/api/login" && method === "POST") {
    if (!env.ADMIN_PASSWORD) return json({ error: "ADMIN_PASSWORD nu este configurat" }, 500);
    const body = await request.json().catch(() => ({}));
    if (typeof body.password === "string" && timingSafeEqual(body.password, env.ADMIN_PASSWORD)) {
      const token = await createSession(env);
      return json({ ok: true }, 200, {
        "Set-Cookie": `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL}`,
      });
    }
    return json({ error: "Parolă incorectă" }, 401);
  }

  // logout
  if (pathname === "/api/logout" && method === "POST") {
    return json({ ok: true }, 200, {
      "Set-Cookie": `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
    });
  }

  // listă produse (public)
  if (pathname === "/api/products" && method === "GET") {
    return json(await getProducts(env));
  }

  // configurație conținut (public)
  if (pathname === "/api/config" && method === "GET") {
    return json(await getConfig(env));
  }

  // imagine (public)
  if (pathname.startsWith("/api/img/") && method === "GET") {
    const key = IMG_PREFIX + pathname.slice("/api/img/".length);
    const obj = await env.PRODUCTS.getWithMetadata(key, "arrayBuffer");
    if (!obj || !obj.value) return new Response("Not found", { status: 404 });
    const ct = (obj.metadata && obj.metadata.ct) || "application/octet-stream";
    return new Response(obj.value, {
      headers: { "content-type": ct, "cache-control": "public, max-age=31536000, immutable" },
    });
  }

  // --- de aici încolo, doar autentificat ---
  if (!(await isAuthed(request, env))) {
    return json({ error: "Neautorizat" }, 401);
  }

  // salvare configurație conținut
  if (pathname === "/api/config" && method === "PUT") {
    const body = await request.json().catch(() => ({}));
    const config = sanitizeConfig(body);
    await env.PRODUCTS.put(CONFIG_KEY, JSON.stringify(config));
    return json(config);
  }

  // upload imagine
  if (pathname === "/api/upload" && method === "POST") {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") return json({ error: "Fără fișier" }, 400);
    if (file.size > 5 * 1024 * 1024) return json({ error: "Imaginea depășește 5 MB" }, 400);
    const id = crypto.randomUUID();
    const buf = await file.arrayBuffer();
    await env.PRODUCTS.put(IMG_PREFIX + id, buf, { metadata: { ct: file.type || "image/jpeg" } });
    return json({ url: `/api/img/${id}` });
  }

  // adăugare produs
  if (pathname === "/api/products" && method === "POST") {
    const body = await request.json().catch(() => ({}));
    const product = sanitizeProduct(body);
    if (!product.name) return json({ error: "Numele este obligatoriu" }, 400);
    product.id = crypto.randomUUID();
    const products = await getProducts(env);
    products.push(product);
    await saveProducts(env, products);
    return json(product, 201);
  }

  // editare / ștergere produs
  const matchId = pathname.match(/^\/api\/products\/([^/]+)$/);
  if (matchId) {
    const id = decodeURIComponent(matchId[1]);
    const products = await getProducts(env);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return json({ error: "Produs inexistent" }, 404);

    if (method === "PUT") {
      const body = await request.json().catch(() => ({}));
      const updated = sanitizeProduct(body);
      if (!updated.name) return json({ error: "Numele este obligatoriu" }, 400);
      products[idx] = { ...products[idx], ...updated, id };
      await saveProducts(env, products);
      return json(products[idx]);
    }

    if (method === "DELETE") {
      const [removed] = products.splice(idx, 1);
      await saveProducts(env, products);
      // curăță imaginea din KV dacă era stocată local
      if (removed.image && removed.image.startsWith("/api/img/")) {
        await env.PRODUCTS.delete(IMG_PREFIX + removed.image.slice("/api/img/".length));
      }
      return json({ ok: true });
    }
  }

  return json({ error: "Rută inexistentă" }, 404);
}

// ---------------------------------------------------------------- entry

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, url);
      } catch (err) {
        return json({ error: "Eroare server", detail: String(err) }, 500);
      }
    }

    // /admin -> servește pagina de administrare statică
    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      return env.ASSETS.fetch(new Request(new URL("/admin.html", url), request));
    }

    // restul: fișiere statice
    return env.ASSETS.fetch(request);
  },
};
