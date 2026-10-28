"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteConfig, Category, Order } from "../lib/site-data";
import { DEFAULT_CONFIG } from "../lib/site-data";
import QrImage from "../components/QrImage";
import QrScanner from "../components/QrScanner";

type Msg = { id: string; name: string; email?: string; subject?: string; message: string; date?: string };
type Rev = { id: string; name: string; text: string; rating: number; approved?: boolean; date?: string };

const TABS = [
  ["contact", "Contact & Program"],
  ["categorii", "Categorii"],
  ["continut", "Conținut pagini"],
  ["testimoniale", "Testimoniale"],
  ["galerie", "Galerie"],
  ["mesaje", "Mesaje"],
  ["comenzi", "Comenzi"],
  ["recenzii", "Recenzii"],
  ["aplicatie", "Aplicație"],
] as const;

const inp = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-gold";
const lbl = "mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft";
const btn = "rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60";
const btnGhost = "rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink-soft hover:border-gold hover:text-gold-deep";

async function api(path: string, opts?: RequestInit) {
  const res = await fetch(path, { ...opts, headers: { ...(opts?.body && typeof opts.body === "string" ? { "content-type": "application/json" } : {}), ...(opts?.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Eroare");
  return data;
}

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [cfg, setCfg] = useState<SiteConfig | null>(null);
  const [tab, setTab] = useState<string>("contact");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [reviews, setReviews] = useState<Rev[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [scanning, setScanning] = useState(false);
  const [appMode, setAppMode] = useState(false);

  const flash = (t: string) => { setToast(t); setTimeout(() => setToast(""), 2500); };

  const loadConfig = useCallback(async () => {
    const c = (await api("/api/config")) as SiteConfig;
    // normalizează cu valorile implicite pentru câmpuri lipsă
    setCfg({ ...DEFAULT_CONFIG, ...c, content: { ...DEFAULT_CONFIG.content, ...c.content }, contact: { ...DEFAULT_CONFIG.contact, ...c.contact }, hours: { ...DEFAULT_CONFIG.hours, ...c.hours } });
  }, []);

  // Autentificare prin tokenul scanat dintr-un QR (din text brut sau URL ?qr=...).
  const consumeQr = useCallback(async (raw: string): Promise<boolean> => {
    const m = String(raw).match(/[a-f0-9]{40,80}/);
    if (!m) return false;
    try {
      await api("/api/login-qr/consume", { method: "POST", body: JSON.stringify({ token: m[0] }) });
      setScanning(false);
      setAuthed(true);
      await loadConfig();
      return true;
    } catch (err) {
      setLoginErr((err as Error).message);
      return false;
    }
  }, [loadConfig]);

  useEffect(() => {
    (async () => {
      // dacă pagina a fost deschisă prin scanarea unui QR de login (?qr=token)
      const params = new URLSearchParams(window.location.search);
      const qr = params.get("qr");
      if (qr) {
        const ok = await consumeQr(qr);
        window.history.replaceState({}, "", window.location.pathname);
        if (ok) return;
      }
      try {
        const me = (await api("/api/me")) as { authed: boolean };
        setAuthed(me.authed);
        if (me.authed) await loadConfig();
      } catch { setAuthed(false); }
    })();
  }, [loadConfig, consumeQr]);

  // Înregistrează service worker-ul (pentru instalarea aplicației pe telefon).
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  // Mod „aplicație instalată" (standalone): arătăm doar Comenzi, Produse, Mesaje.
  // ?app=1 forțează acest mod în browser (pentru previzualizare).
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("app") === "1";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standalone = forced || window.matchMedia?.("(display-mode: standalone)")?.matches || (navigator as any).standalone === true;
    if (standalone) { setAppMode(true); setTab("comenzi"); }
  }, []);

  // Încarcă datele tabului activ (funcționează și la schimbarea automată a tabului).
  useEffect(() => {
    if (!authed || !cfg) return;
    if (tab === "mesaje") api("/api/messages").then((m) => setMessages(m as Msg[])).catch(() => {});
    else if (tab === "recenzii") api("/api/reviews").then((r) => setReviews(r as Rev[])).catch(() => {});
    else if (tab === "comenzi") api("/api/orders").then((o) => setOrders(o as Order[])).catch(() => {});
  }, [authed, cfg, tab]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    try {
      await api("/api/login", { method: "POST", body: JSON.stringify({ password: pw }) });
      setAuthed(true);
      await loadConfig();
    } catch (err) { setLoginErr((err as Error).message); }
  }

  async function logout() {
    await api("/api/logout", { method: "POST" });
    setAuthed(false); setCfg(null); setPw("");
  }

  async function save() {
    if (!cfg) return;
    setSaving(true);
    try {
      const saved = (await api("/api/config", { method: "PUT", body: JSON.stringify(cfg) })) as SiteConfig;
      setCfg({ ...DEFAULT_CONFIG, ...saved, content: { ...DEFAULT_CONFIG.content, ...saved.content } });
      flash("Salvat cu succes ✓");
    } catch (err) { flash("Eroare: " + (err as Error).message); }
    setSaving(false);
  }

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const r = (await api("/api/upload", { method: "POST", body: fd })) as { url: string };
    return r.url;
  }

  const patch = (fn: (c: SiteConfig) => void) => setCfg((prev) => { if (!prev) return prev; const next = structuredClone(prev); fn(next); return next; });

  // ---------- login screen ----------
  if (authed === null) return <div className="grid min-h-dvh place-items-center text-ink-soft">Se încarcă…</div>;
  if (!authed) {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream px-5">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg ring-1 ring-line">
          <p className="font-display text-2xl font-bold text-ink">Traditum <span className="text-gold">Admin</span></p>
          <p className="mt-1 text-sm text-ink-soft">Autentifică-te pentru a edita site-ul.</p>

          {scanning ? (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-ink">Scanează codul QR afișat în adminul de pe calculator.</p>
              <QrScanner onResult={(t) => consumeQr(t)} onError={(m) => setLoginErr(m)} />
              {loginErr && <p className="mt-2 text-sm text-red-600">{loginErr}</p>}
              <button onClick={() => { setScanning(false); setLoginErr(""); }} className={`${btnGhost} mt-3 w-full`}>Înapoi la parolă</button>
            </div>
          ) : (
            <>
              <form onSubmit={login}>
                <label className={`${lbl} mt-6`}>Parolă</label>
                <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={inp} autoFocus />
                {loginErr && <p className="mt-2 text-sm text-red-600">{loginErr}</p>}
                <button className={`${btn} mt-5 w-full`}>Intră în admin</button>
              </form>
              <div className="my-4 flex items-center gap-3 text-xs text-ink-soft"><span className="h-px flex-1 bg-line" />sau<span className="h-px flex-1 bg-line" /></div>
              <button onClick={() => { setScanning(true); setLoginErr(""); }} className={`${btnGhost} w-full`}>📷 Autentificare prin cod QR</button>
            </>
          )}
        </div>
      </div>
    );
  }
  if (!cfg) return <div className="grid min-h-dvh place-items-center text-ink-soft">Se încarcă datele…</div>;

  // În aplicația instalată arătăm doar: Comenzi, Produse (categorii), Mesaje.
  const APP_TABS = ["comenzi", "categorii", "mesaje"];
  const visibleTabs = appMode ? TABS.filter(([k]) => APP_TABS.includes(k)) : TABS;

  return (
    <div className={`min-h-dvh bg-cream ${appMode ? "pb-24" : ""}`}>
      {/* Top bar */}
      {appMode ? (
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-dark px-5 py-3 text-cream shadow-sm">
          <p className="font-display text-lg font-bold">Traditum <span className="text-gold">Admin</span></p>
          <div className="flex items-center gap-2">
            {toast && <span className="text-xs font-medium text-green-300">{toast}</span>}
            <button onClick={save} disabled={saving} className={btn}>{saving ? "…" : "Salvează"}</button>
            <button onClick={logout} className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-cream/80 hover:text-white">Ieși</button>
          </div>
        </header>
      ) : (
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-3">
          <p className="font-display text-lg font-bold text-ink">Traditum <span className="text-gold">Admin</span></p>
          <div className="flex items-center gap-3">
            {toast && <span className="text-sm font-medium text-green-700">{toast}</span>}
            <a href="/" target="_blank" className={btnGhost}>Vezi site-ul ↗</a>
            <button onClick={save} disabled={saving} className={btn}>{saving ? "Se salvează…" : "Salvează tot"}</button>
            <button onClick={logout} className={btnGhost}>Ieși</button>
          </div>
        </header>
      )}

      <div className="mx-auto max-w-5xl px-5 py-6">
        {/* Tabs (doar în browser; în aplicație folosim bara de jos) */}
        {!appMode && (
          <nav className="mb-6 flex flex-wrap gap-2">
            {visibleTabs.map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === k ? "bg-gold text-white" : "bg-white text-ink-soft ring-1 ring-line hover:text-gold-deep"}`}>
                {label}
              </button>
            ))}
          </nav>
        )}

        {appMode && (
          <h1 className="mb-4 font-display text-2xl text-ink">
            {tab === "categorii" ? "Produse" : tab === "comenzi" ? "Comenzi" : "Mesaje"}
          </h1>
        )}

        {tab === "contact" && <ContactTab cfg={cfg} patch={patch} uploadImage={uploadImage} />}
        {tab === "categorii" && <CategoriiTab cfg={cfg} patch={patch} uploadImage={uploadImage} flash={flash} />}
        {tab === "continut" && <ContinutTab cfg={cfg} patch={patch} />}
        {tab === "testimoniale" && <TestimonialeTab cfg={cfg} patch={patch} />}
        {tab === "galerie" && <GalerieTab cfg={cfg} patch={patch} uploadImage={uploadImage} />}
        {tab === "mesaje" && <MesajeTab messages={messages} onDelete={async (id) => { await api(`/api/messages/${id}`, { method: "DELETE" }); setMessages((m) => m.filter((x) => x.id !== id)); }} />}
        {tab === "comenzi" && <ComenziTab cfg={cfg} patch={patch} save={save} orders={orders}
          onStatus={async (id, status) => { await api(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); setOrders((o) => o.map((x) => x.id === id ? { ...x, status } : x)); }}
          onDelete={async (id) => { await api(`/api/orders/${id}`, { method: "DELETE" }); setOrders((o) => o.filter((x) => x.id !== id)); }} />}
        {tab === "recenzii" && <RecenziiTab reviews={reviews}
          onApprove={async (id) => { await api(`/api/reviews/${id}`, { method: "PATCH", body: JSON.stringify({ approved: true }) }); setReviews((r) => r.map((x) => x.id === id ? { ...x, approved: true } : x)); }}
          onDelete={async (id) => { await api(`/api/reviews/${id}`, { method: "DELETE" }); setReviews((r) => r.filter((x) => x.id !== id)); }} />}
        {tab === "aplicatie" && <AplicatieTab />}
      </div>

      {/* Save bar mobil (doar browser) */}
      {!appMode && (
        <div className="sticky bottom-0 border-t border-line bg-white px-5 py-3 md:hidden">
          <button onClick={save} disabled={saving} className={`${btn} w-full`}>{saving ? "Se salvează…" : "Salvează tot"}</button>
        </div>
      )}

      {/* Bară de navigare jos (stil aplicație) */}
      {appMode && <BottomTabBar tab={tab} setTab={setTab} />}
    </div>
  );
}

// ======================= TAB: Contact & Program =======================
function ContactTab({ cfg, patch, uploadImage }: { cfg: SiteConfig; patch: (fn: (c: SiteConfig) => void) => void; uploadImage: (f: File) => Promise<string> }) {
  const days: [keyof SiteConfig["hours"], string][] = [["mon", "Luni"], ["tue", "Marți"], ["wed", "Miercuri"], ["thu", "Joi"], ["fri", "Vineri"], ["sat", "Sâmbătă"], ["sun", "Duminică"]];
  return (
    <div className="space-y-6">
      <Card title="Logo" hint="Apare în meniul de sus al site-ului. Lasă gol pentru a afișa numele ca text.">
        <div className="flex items-center gap-4">
          {cfg.logo ? (
            <div className="rounded-xl bg-dark p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cfg.logo} alt="Logo" className="h-12 w-auto" />
            </div>
          ) : (
            <div className="grid h-16 w-24 place-items-center rounded-xl bg-cream-2 text-xs text-ink-soft">fără logo</div>
          )}
          <div className="flex flex-col gap-2">
            <UploadButton uploadImage={uploadImage} onUpload={(url) => patch((c) => { c.logo = url; })} label={cfg.logo ? "Schimbă logo" : "+ Încarcă logo"} />
            {cfg.logo && <button className={btnGhost} onClick={() => patch((c) => { c.logo = ""; })}>Elimină logo</button>}
          </div>
        </div>
      </Card>
      <Card title="Date de contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon" value={cfg.contact.phone} onChange={(v) => patch((c) => { c.contact.phone = v; })} />
          <Field label="Email" value={cfg.contact.email} onChange={(v) => patch((c) => { c.contact.email = v; })} />
          <Field label="Adresă" value={cfg.contact.address} onChange={(v) => patch((c) => { c.contact.address = v; })} className="sm:col-span-2" />
          <Field label="Facebook (URL)" value={cfg.contact.facebook} onChange={(v) => patch((c) => { c.contact.facebook = v; })} />
          <Field label="Instagram (URL)" value={cfg.contact.instagram} onChange={(v) => patch((c) => { c.contact.instagram = v; })} />
          <Field label="TikTok (URL)" value={cfg.contact.tiktok} onChange={(v) => patch((c) => { c.contact.tiktok = v; })} />
        </div>
      </Card>
      <Card title="Text promoțional (prima pagină)">
        <Field label="Titlu promo" value={cfg.promo.title} onChange={(v) => patch((c) => { c.promo.title = v; })} />
      </Card>
      <Card title="Program de lucru" hint="Lasă gol pentru „Închis”.">
        <div className="grid gap-3 sm:grid-cols-2">
          {days.map(([k, label]) => (
            <Field key={k} label={label} value={cfg.hours[k]} placeholder="ex: 09:00 - 18:00" onChange={(v) => patch((c) => { c.hours[k] = v; })} />
          ))}
        </div>
      </Card>
    </div>
  );
}

// ======================= TAB: Categorii =======================
function CategoriiTab({ cfg, patch, uploadImage, flash }: { cfg: SiteConfig; patch: (fn: (c: SiteConfig) => void) => void; uploadImage: (f: File) => Promise<string>; flash: (t: string) => void }) {
  const [aiBusy, setAiBusy] = useState<number | null>(null);

  async function genDescriere(i: number) {
    setAiBusy(i);
    try {
      const cat = cfg.categories[i];
      const out = (await api("/api/generate", { method: "POST", body: JSON.stringify({ kind: "page", hint: cat.title }) })) as { title?: string; description?: string; priceMin?: string; priceMax?: string };
      patch((c) => {
        if (out.description) c.categories[i].description = out.description;
        if (out.priceMin) c.categories[i].priceMin = out.priceMin;
        if (out.priceMax) c.categories[i].priceMax = out.priceMax;
      });
      flash("Text generat ✓ (nu uita să salvezi)");
    } catch (err) { flash("Eroare AI: " + (err as Error).message); }
    setAiBusy(null);
  }

  return (
    <div className="space-y-5">
      {cfg.categories.map((cat, i) => (
        <Card key={i} title={`Categoria ${i + 1}`}
          actions={<button className={btnGhost} onClick={() => patch((c) => { c.categories.splice(i, 1); })}>Șterge</button>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Titlu" value={cat.title} onChange={(v) => patch((c) => { c.categories[i].title = v; })} />
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={!!cat.priceOnRequest} onChange={(e) => patch((c) => { c.categories[i].priceOnRequest = e.target.checked; })} /> Preț la cerere</label>
            </div>
            {!cat.priceOnRequest && <Field label="Preț minim (lei)" value={cat.priceMin || ""} onChange={(v) => patch((c) => { c.categories[i].priceMin = v; })} />}
            {!cat.priceOnRequest && <Field label="Preț maxim (lei)" value={cat.priceMax || ""} onChange={(v) => patch((c) => { c.categories[i].priceMax = v; })} />}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className={lbl}>Descriere</span>
              <button className={btnGhost} disabled={aiBusy === i} onClick={() => genDescriere(i)}>{aiBusy === i ? "Se generează…" : "✨ Generează cu AI"}</button>
            </div>
            <textarea className={`${inp} min-h-[120px]`} value={cat.description} onChange={(e) => patch((c) => { c.categories[i].description = e.target.value; })} />
          </div>
          <ImageList label="Imagini categorie" images={cat.images} uploadImage={uploadImage}
            onChange={(imgs) => patch((c) => { c.categories[i].images = imgs; })} />
          <ProductsEditor cat={cat} uploadImage={uploadImage} onChange={(prods) => patch((c) => { c.categories[i].products = prods; })} />
        </Card>
      ))}
      <button className={btn} onClick={() => patch((c) => { c.categories.push({ id: "", slug: "", title: "Categorie nouă", description: "", priceMin: "", priceMax: "", images: [], products: [] }); })}>+ Adaugă categorie</button>
    </div>
  );
}

function ProductsEditor({ cat, uploadImage, onChange }: { cat: Category; uploadImage: (f: File) => Promise<string>; onChange: (p: NonNullable<Category["products"]>) => void }) {
  const products = cat.products || [];
  return (
    <div className="mt-4 rounded-xl bg-cream/60 p-4">
      <p className="mb-3 text-sm font-semibold text-ink">Produse individuale în galerie ({products.length})</p>
      <div className="grid gap-3">
        {products.map((p, j) => (
          <div key={j} className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-line">
            <ImageThumb url={p.image} uploadImage={uploadImage} onUpload={(url) => onChange(products.map((x, k) => k === j ? { ...x, image: url } : x))} />
            <input className={`${inp} flex-1`} placeholder="Nume produs" value={p.title} onChange={(e) => onChange(products.map((x, k) => k === j ? { ...x, title: e.target.value } : x))} />
            <button className={btnGhost} onClick={() => onChange(products.filter((_, k) => k !== j))}>✕</button>
          </div>
        ))}
      </div>
      <button className={`${btnGhost} mt-3`} onClick={() => onChange([...products, { title: "", image: "" }])}>+ Adaugă produs</button>
    </div>
  );
}

// ======================= TAB: Conținut =======================
function ContinutTab({ cfg, patch }: { cfg: SiteConfig; patch: (fn: (c: SiteConfig) => void) => void }) {
  const c = cfg.content;
  return (
    <div className="space-y-6">
      <Card title="Secțiunea „Despre noi” (prima pagină)">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow" value={c.homeAbout.eyebrow} onChange={(v) => patch((x) => { x.content.homeAbout.eyebrow = v; })} />
          <Field label="Titlu" value={c.homeAbout.title} onChange={(v) => patch((x) => { x.content.homeAbout.title = v; })} />
        </div>
        <Area label="Paragraf 1" value={c.homeAbout.p1} onChange={(v) => patch((x) => { x.content.homeAbout.p1 = v; })} />
        <Area label="Paragraf 2" value={c.homeAbout.p2} onChange={(v) => patch((x) => { x.content.homeAbout.p2 = v; })} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {c.homeAbout.bullets.map((b, i) => (
            <Field key={i} label={`Bullet ${i + 1}`} value={b} onChange={(v) => patch((x) => { x.content.homeAbout.bullets[i] = v; })} />
          ))}
        </div>
      </Card>
      <Card title="Cifre (statistici)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.facts.map((f, i) => (
            <div key={i} className="space-y-2 rounded-lg bg-cream/60 p-3">
              <Field label="Valoare" value={f.value} onChange={(v) => patch((x) => { x.content.facts[i].value = v; })} />
              <Field label="Etichetă" value={f.label} onChange={(v) => patch((x) => { x.content.facts[i].label = v; })} />
            </div>
          ))}
        </div>
      </Card>
      <Card title="Servicii">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow" value={c.services.eyebrow} onChange={(v) => patch((x) => { x.content.services.eyebrow = v; })} />
          <Field label="Titlu" value={c.services.title} onChange={(v) => patch((x) => { x.content.services.title = v; })} />
        </div>
        <Area label="Intro" value={c.services.intro} onChange={(v) => patch((x) => { x.content.services.intro = v; })} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {c.services.items.map((it, i) => (
            <div key={i} className="space-y-2 rounded-lg bg-cream/60 p-3">
              <Field label={`Serviciu ${i + 1} — titlu`} value={it.title} onChange={(v) => patch((x) => { x.content.services.items[i].title = v; })} />
              <Area label="Descriere" value={it.text} onChange={(v) => patch((x) => { x.content.services.items[i].text = v; })} />
            </div>
          ))}
        </div>
      </Card>
      <Card title="Pagina „Despre noi” (poveste)">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow" value={c.aboutPage.eyebrow} onChange={(v) => patch((x) => { x.content.aboutPage.eyebrow = v; })} />
          <Field label="Titlu" value={c.aboutPage.title} onChange={(v) => patch((x) => { x.content.aboutPage.title = v; })} />
        </div>
        <Area label="Poveste (paragrafe separate prin rând gol)" value={c.aboutPage.story} rows={10} onChange={(v) => patch((x) => { x.content.aboutPage.story = v; })} />
        <Area label="Frază de final (highlight)" value={c.aboutPage.highlight} onChange={(v) => patch((x) => { x.content.aboutPage.highlight = v; })} />
      </Card>
    </div>
  );
}

// ======================= TAB: Testimoniale =======================
function TestimonialeTab({ cfg, patch }: { cfg: SiteConfig; patch: (fn: (c: SiteConfig) => void) => void }) {
  return (
    <div className="space-y-4">
      {cfg.testimonials.map((t, i) => (
        <Card key={i} title={`Testimonial ${i + 1}`} actions={<button className={btnGhost} onClick={() => patch((c) => { c.testimonials.splice(i, 1); })}>Șterge</button>}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Nume" value={t.name} onChange={(v) => patch((c) => { c.testimonials[i].name = v; })} />
            <Field label="Rol" value={t.role || ""} onChange={(v) => patch((c) => { c.testimonials[i].role = v; })} />
            <div>
              <label className={lbl}>Stele</label>
              <select className={inp} value={t.rating} onChange={(e) => patch((c) => { c.testimonials[i].rating = parseInt(e.target.value, 10); })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stele</option>)}
              </select>
            </div>
          </div>
          <Area label="Text" value={t.text} onChange={(v) => patch((c) => { c.testimonials[i].text = v; })} />
        </Card>
      ))}
      <button className={btn} onClick={() => patch((c) => { c.testimonials.push({ name: "", role: "Client", text: "", rating: 5 }); })}>+ Adaugă testimonial</button>
    </div>
  );
}

// ======================= TAB: Galerie =======================
function GalerieTab({ cfg, patch, uploadImage }: { cfg: SiteConfig; patch: (fn: (c: SiteConfig) => void) => void; uploadImage: (f: File) => Promise<string> }) {
  const page = cfg.galleryPage.map((g) => (typeof g === "string" ? { url: g, cat: "" } : g));
  return (
    <div className="space-y-6">
      <Card title="Galerie prima pagină (teaser)" hint="Câteva imagini reprezentative.">
        <ImageList label="" images={cfg.gallery} uploadImage={uploadImage} onChange={(imgs) => patch((c) => { c.gallery = imgs; })} />
      </Card>
      <Card title="Pagina Galerie (completă)" hint="Poți adăuga o categorie pentru filtrare.">
        <div className="grid gap-3">
          {page.map((g, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-line">
              <ImageThumb url={g.url} uploadImage={uploadImage} onUpload={(url) => patch((c) => { const arr = c.galleryPage.map((x) => typeof x === "string" ? { url: x, cat: "" } : x); arr[i] = { ...arr[i], url }; c.galleryPage = arr; })} />
              <input className={`${inp} flex-1`} placeholder="Categorie filtru (ex: torturi)" value={g.cat || ""} onChange={(e) => patch((c) => { const arr = c.galleryPage.map((x) => typeof x === "string" ? { url: x, cat: "" } : x); arr[i] = { ...arr[i], cat: e.target.value }; c.galleryPage = arr; })} />
              <button className={btnGhost} onClick={() => patch((c) => { const arr = c.galleryPage.map((x) => typeof x === "string" ? { url: x, cat: "" } : x); arr.splice(i, 1); c.galleryPage = arr; })}>✕</button>
            </div>
          ))}
        </div>
        <UploadButton uploadImage={uploadImage} onUpload={(url) => patch((c) => { const arr = c.galleryPage.map((x) => typeof x === "string" ? { url: x, cat: "" } : x); arr.push({ url, cat: "" }); c.galleryPage = arr; })} label="+ Adaugă imagine în galerie" />
      </Card>
    </div>
  );
}

// ======================= TAB: Mesaje =======================
function MesajeTab({ messages, onDelete }: { messages: Msg[]; onDelete: (id: string) => Promise<void> }) {
  if (!messages.length) return <Card title="Mesaje primite"><p className="text-sm text-ink-soft">Niciun mesaj deocamdată.</p></Card>;
  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <Card key={m.id} title={m.name} actions={<button className={btnGhost} onClick={() => onDelete(m.id)}>Șterge</button>}>
          {m.subject && <p className="text-sm font-semibold text-ink">{m.subject}</p>}
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{m.message}</p>
          <p className="mt-2 text-xs text-ink-soft/70">{m.email} · {m.date ? new Date(m.date).toLocaleString("ro-RO") : ""}</p>
        </Card>
      ))}
    </div>
  );
}

// ======================= TAB: Recenzii =======================
function RecenziiTab({ reviews, onApprove, onDelete }: { reviews: Rev[]; onApprove: (id: string) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  if (!reviews.length) return <Card title="Recenzii"><p className="text-sm text-ink-soft">Nicio recenzie deocamdată.</p></Card>;
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <Card key={r.id} title={`${r.name} · ${"★".repeat(r.rating)}`}
          actions={<div className="flex gap-2">
            {r.approved === false && <button className={btn} onClick={() => onApprove(r.id)}>Aprobă</button>}
            <button className={btnGhost} onClick={() => onDelete(r.id)}>Șterge</button>
          </div>}>
          <p className="text-sm text-ink-soft">{r.text}</p>
          <p className="mt-2 text-xs">{r.approved === false ? <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">în așteptare</span> : <span className="rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-700">publicată</span>}</p>
        </Card>
      ))}
    </div>
  );
}

// ======================= TAB: Comenzi =======================
function ComenziTab({ cfg, patch, save, orders, onStatus, onDelete }: {
  cfg: SiteConfig; patch: (fn: (c: SiteConfig) => void) => void; save: () => void; orders: Order[];
  onStatus: (id: string, status: Order["status"]) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <Card title="Comenzi online" hint="Pornește sau oprește primirea comenzilor prin formularul de pe site.">
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" checked={!!cfg.ordersEnabled} onChange={(e) => patch((c) => { c.ordersEnabled = e.target.checked; })}
            className="h-5 w-5 accent-gold" />
          <span className="text-sm font-medium text-ink">
            {cfg.ordersEnabled ? "Pornit — site-ul primește comenzi" : "Oprit — formularul de comandă e ascuns pe site"}
          </span>
        </label>
        <button onClick={save} className={`${btn} mt-4`}>Salvează setarea</button>
      </Card>

      {orders.length === 0 ? (
        <Card title="Comenzi primite"><p className="text-sm text-ink-soft">Nicio comandă deocamdată.</p></Card>
      ) : (
        orders.map((o) => (
          <Card key={o.id} title={`${o.name} · ${o.product}`}
            actions={<button className={btnGhost} onClick={() => onDelete(o.id)}>Șterge</button>}>
            <p className="text-sm text-ink">📞 {o.phone}{o.date ? ` · 📅 ${o.date}` : ""}</p>
            {o.details && <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{o.details}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <select value={o.status || "noua"} onChange={(e) => onStatus(o.id, e.target.value as Order["status"])} className={`${inp} max-w-[170px]`}>
                <option value="noua">🆕 Nouă</option>
                <option value="confirmata">✅ Confirmată</option>
                <option value="finalizata">📦 Finalizată</option>
              </select>
              <span className="text-xs text-ink-soft/70">{o.createdAt ? new Date(o.createdAt).toLocaleString("ro-RO") : ""}</span>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// ======================= TAB: Aplicație =======================
function AplicatieTab() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [left, setLeft] = useState(0);
  const [err, setErr] = useState("");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const installUrl = `${origin}/admin`;

  async function genToken() {
    setLoading(true); setErr("");
    try {
      const r = (await api("/api/login-qr", { method: "POST" })) as { token: string; expiresIn: number };
      setToken(r.token); setLeft(r.expiresIn || 120);
    } catch (e) { setErr((e as Error).message); }
    setLoading(false);
  }

  useEffect(() => {
    if (!token || left <= 0) return;
    const t = setInterval(() => setLeft((s) => { if (s <= 1) { setToken(""); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [token, left]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Autentificare pe telefon (prin QR)" hint="Generează un cod, apoi scanează-l din aplicația de pe telefon pentru a te loga fără parolă.">
        {token ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <QrImage text={`${origin}/admin?qr=${token}`} size={220} />
            <p className="text-sm text-ink-soft">Codul expiră în <span className="font-semibold text-ink">{left}s</span>. Scanează-l din aplicație (ecranul „Autentificare prin cod QR").</p>
            <button onClick={genToken} className={btnGhost}>Generează cod nou</button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-ink-soft">Apasă pentru a genera un cod QR de autentificare valabil 2 minute.</p>
            <button onClick={genToken} disabled={loading} className={btn}>{loading ? "Se generează…" : "Generează cod QR de login"}</button>
            {err && <p className="text-sm text-red-600">{err}</p>}
          </div>
        )}
      </Card>

      <Card title="Instalează aplicația pe telefon" hint="Scanează cu telefonul pentru a instala aplicația de administrare pe ecranul principal.">
        <div className="flex flex-col items-center gap-3 text-center">
          <QrImage text={installUrl} size={220} />
          <p className="break-all text-xs text-ink-soft">{installUrl}</p>
          <p className="rounded-lg bg-cream-2 px-3 py-2 text-xs text-ink-soft">
            După scanare, deschide în <b>Chrome</b> și apasă meniul <b>⋮ → „Instalează aplicația"</b> (sau „Adaugă la ecranul principal"). Vei avea o iconiță care deschide adminul pe tot ecranul, ca o aplicație. Apoi te poți loga prin codul QR din stânga.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ======================= Bară navigare jos (aplicație) =======================
function BottomTabBar({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  const items: { k: string; label: string; icon: React.ReactNode }[] = [
    { k: "categorii", label: "Produse", icon: <IconCake /> },
    { k: "comenzi", label: "Comenzi", icon: <IconBag /> },
    { k: "mesaje", label: "Mesaje", icon: <IconMail /> },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map((it) => {
          const active = tab === it.k;
          return (
            <button key={it.k} type="button" onClick={() => setTab(it.k)}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${active ? "text-gold-deep" : "text-ink-soft"}`}>
              <span className={`grid h-9 w-16 place-items-center rounded-full transition-colors ${active ? "bg-gold/15" : ""}`}>{it.icon}</span>
              {it.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function IconCake() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3" /><path d="M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7" /><path d="M5 16c1.1 1 2.3 1 3.5 0s2.4-1 3.5 0 2.3 1 3.5 0 2.4-1 3.5 0" /><path d="M3.5 21h17" /></svg>);
}
function IconBag() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4z" /><path d="M4 6h16" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>);
}
function IconMail() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
}

// ======================= UI primitives =======================
function Card({ title, hint, actions, children }: { title: string; hint?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-line">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-ink">{title}</h2>
          {hint && <p className="text-xs text-ink-soft">{hint}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      {label && <label className={lbl}>{label}</label>}
      <input className={inp} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="mt-3">
      <label className={lbl}>{label}</label>
      <textarea className={inp} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function UploadButton({ uploadImage, onUpload, label }: { uploadImage: (f: File) => Promise<string>; onUpload: (url: string) => void; label: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <label className={`${btnGhost} mt-3 inline-block cursor-pointer ${busy ? "opacity-60" : ""}`}>
      {busy ? "Se încarcă…" : label}
      <input type="file" accept="image/*" hidden disabled={busy} onChange={async (e) => {
        const f = e.target.files?.[0]; if (!f) return;
        setBusy(true); try { onUpload(await uploadImage(f)); } catch { /* noop */ } setBusy(false); e.target.value = "";
      }} />
    </label>
  );
}

function ImageThumb({ url, uploadImage, onUpload }: { url: string; uploadImage: (f: File) => Promise<string>; onUpload: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="relative block h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-cream ring-1 ring-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center text-xs text-ink-soft">+ foto</span>}
      {busy && <span className="absolute inset-0 grid place-items-center bg-white/70 text-[10px]">…</span>}
      <input type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); try { onUpload(await uploadImage(f)); } catch { /* noop */ } setBusy(false); e.target.value = ""; }} />
    </label>
  );
}

function ImageList({ label, images, uploadImage, onChange }: { label: string; images: string[]; uploadImage: (f: File) => Promise<string>; onChange: (imgs: string[]) => void }) {
  return (
    <div className="mt-4">
      {label && <label className={lbl}>{label}</label>}
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative">
            <ImageThumb url={url} uploadImage={uploadImage} onUpload={(u) => onChange(images.map((x, k) => k === i ? u : x))} />
            <button onClick={() => onChange(images.filter((_, k) => k !== i))} className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-xs text-white">✕</button>
          </div>
        ))}
        <UploadButton uploadImage={uploadImage} onUpload={(u) => onChange([...images, u])} label="+ Foto" />
      </div>
    </div>
  );
}
