import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";
import OfferForm from "../components/OfferForm";
import JsonLd from "../components/JsonLd";
import { getConfig } from "../lib/site-data";
import { faqLd } from "../lib/jsonld";

const faq = [
  { q: "Cu cât timp înainte trebuie să comand un tort?", a: "Recomandăm plasarea comenzii cu 3-14 zile înainte, în funcție de complexitatea tortului sau a candy bar-ului." },
  { q: "Livrați în București și Ilfov?", a: "Da, livrăm torturi, candy bar și deserturi în București și în localitățile din Ilfov." },
  { q: "Cum se stabilește prețul?", a: "Prețul depinde de compoziție, gramaj, numărul de porții și complexitatea decorului. Pentru candy bar și evenimente oferim o ofertă personalizată." },
];

export const metadata: Metadata = {
  title: "Contact & Ofertă",
  description: "Contactează Traditum by Victoria pentru o ofertă personalizată — torturi, candy bar și deserturi pentru evenimente în București și Ilfov.",
};

const zile: { k: keyof Awaited<ReturnType<typeof getConfig>>["hours"]; label: string }[] = [
  { k: "mon", label: "Luni" }, { k: "tue", label: "Marți" }, { k: "wed", label: "Miercuri" },
  { k: "thu", label: "Joi" }, { k: "fri", label: "Vineri" }, { k: "sat", label: "Sâmbătă" }, { k: "sun", label: "Duminică" },
];

export default async function ContactPage() {
  const cfg = await getConfig();
  const c = cfg.contact;

  return (
    <>
      <JsonLd data={faqLd(faq)} />
      <SiteNav />
      <PageHeader eyebrow="Contact" title="Solicită o ofertă" subtitle="Spune-ne despre evenimentul tău și îți pregătim o ofertă personalizată." />

      <section id="oferta" className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl text-ink">Date de contact</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <p className="font-semibold text-ink">Telefon</p>
                <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="text-gold-deep hover:underline">{c.phone}</a>
              </li>
              <li>
                <p className="font-semibold text-ink">Email</p>
                <a href={`mailto:${c.email}`} className="text-gold-deep hover:underline">{c.email}</a>
              </li>
              <li>
                <p className="font-semibold text-ink">Adresă</p>
                <p className="text-ink-soft">{c.address}</p>
              </li>
            </ul>

            <h3 className="mt-8 text-lg text-ink">Program</h3>
            <ul className="mt-3 divide-y divide-line text-sm">
              {zile.map((z) => (
                <li key={z.k} className="flex justify-between py-2">
                  <span className="text-ink">{z.label}</span>
                  <span className={cfg.hours[z.k] ? "text-ink-soft" : "text-ink-soft/60"}>{cfg.hours[z.k] || "Închis"}</span>
                </li>
              ))}
            </ul>

            {c.phone && (
              <a
                href={`https://wa.me/${c.phone.replace(/[^\d]/g, "").replace(/^0/, "40")}`}
                target="_blank"
                rel="noopener"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Scrie-ne pe WhatsApp
              </a>
            )}
          </div>

          <OfferForm />
        </div>
      </section>

      <section className="bg-cream-2">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-2">Întrebări frecvente</p>
            <h2 className="text-3xl text-ink">Bine de știut înainte să comanzi</h2>
          </div>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-line">
                <summary className="cursor-pointer list-none font-display text-lg text-ink marker:hidden">{f.q}</summary>
                <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
