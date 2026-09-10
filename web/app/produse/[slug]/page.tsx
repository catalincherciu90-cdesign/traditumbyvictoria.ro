import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import PageHeader from "../../components/PageHeader";
import { getConfig, categoryPrice } from "../../lib/site-data";

async function findCat(slug: string) {
  const cfg = await getConfig();
  return cfg.categories.find((c) => c.slug === slug || c.id === slug) || null;
}

export async function generateMetadata({ params }: PageProps<"/produse/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await findCat(slug);
  if (!c) return { title: "Produs inexistent" };
  return {
    title: c.title,
    description: c.description.slice(0, 160),
  };
}

export default async function CategoryPage({ params }: PageProps<"/produse/[slug]">) {
  const { slug } = await params;
  const c = await findCat(slug);
  if (!c) notFound();

  const products: { title: string; image: string; description?: string }[] = c.products?.length
    ? c.products
    : c.images.map((img, i) => ({ title: `${c.title} ${i + 1}`, image: img }));

  return (
    <>
      <SiteNav />
      <PageHeader eyebrow="Categorie de produse" title={c.title} />

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] shadow-lg">
            <Image src={c.images[0] || "/img/product-1.jpg"} alt={c.title} width={640} height={520} className="h-80 w-full object-cover md:h-[26rem]" priority />
          </div>
          <div>
            <span className="inline-block rounded-full bg-cream-2 px-4 py-1.5 text-sm font-semibold text-gold-deep">{categoryPrice(c)}</span>
            <p className="mt-4 text-lg text-ink-soft">{c.description}</p>
            <Link href="/contact#oferta" className="mt-7 inline-block rounded-full bg-gold px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5">
              Solicită o ofertă pentru {c.title}
            </Link>
          </div>
        </div>
      </section>

      {/* Galerie produse din categorie */}
      <section className="bg-cream-2">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <p className="eyebrow mb-2">Galerie</p>
            <h2 className="text-3xl text-ink sm:text-4xl">Din realizările noastre</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <figure key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
                <Image src={p.image} alt={p.title} width={440} height={330} className="h-56 w-full object-cover" />
                {(p.title || p.description) && (
                  <figcaption className="p-4">
                    {p.title && <p className="font-display text-lg text-ink">{p.title}</p>}
                    {p.description && <p className="mt-1 text-sm text-ink-soft">{p.description}</p>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
