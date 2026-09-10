import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";
import GalleryGrid from "../components/GalleryGrid";
import { getConfig, galItem } from "../lib/site-data";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Galerie foto cu torturi personalizate, candy bar și deserturi artizanale realizate de Traditum by Victoria în București și Ilfov.",
};

export default async function GaleriePage() {
  const cfg = await getConfig();
  const items = cfg.galleryPage.map(galItem);
  return (
    <>
      <SiteNav />
      <PageHeader eyebrow="Portofoliu" title="Galeria noastră" subtitle="O selecție din deserturile pe care le-am pregătit pentru evenimentele clienților noștri." />
      <section className="mx-auto max-w-6xl px-5 py-16">
        <GalleryGrid items={items} />
      </section>
      <SiteFooter />
    </>
  );
}
