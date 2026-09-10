import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";
import OfferForm from "../components/OfferForm";
import { getConfig } from "../lib/site-data";

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

      <SiteFooter />
    </>
  );
}
