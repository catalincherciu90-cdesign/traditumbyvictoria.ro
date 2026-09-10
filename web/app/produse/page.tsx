import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";
import { getConfig, categoryPrice } from "../lib/site-data";

export const metadata: Metadata = {
  title: "Produse",
  description: "Torturi personalizate, candy bar și dulciuri tradiționale — descoperă categoriile de produse Traditum by Victoria, realizate la comandă în București și Ilfov.",
};

export default async function ProdusePage() {
  const cfg = await getConfig();
  return (
    <>
      <SiteNav />
      <PageHeader eyebrow="Produsele noastre" title="Ce pregătim pentru tine" subtitle="Alege o categorie și descoperă deserturile realizate la comandă, cu ingrediente atent alese." />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {cfg.categories.map((c) => (
            <Link key={c.slug} href={`/produse/${c.slug}`} className="group grid gap-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-lg sm:grid-cols-2">
              <div className="overflow-hidden">
                <Image src={c.images[0] || "/img/product-1.jpg"} alt={c.title} width={480} height={480} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-full" />
              </div>
              <div className="p-6">
                <span className="inline-block rounded-full bg-cream-2 px-3 py-1 text-xs font-semibold text-gold-deep">{categoryPrice(c)}</span>
                <h2 className="mt-3 text-2xl text-ink">{c.title}</h2>
                <p className="mt-2 line-clamp-4 text-sm text-ink-soft">{c.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-deep">Vezi categoria →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
