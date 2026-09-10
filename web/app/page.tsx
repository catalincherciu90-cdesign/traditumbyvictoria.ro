import Image from "next/image";
import Link from "next/link";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import Stars from "./components/Stars";
import { getConfig, categoryPrice } from "./lib/site-data";

export default async function Home() {
  const cfg = await getConfig();
  const { content } = cfg;

  return (
    <>
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 md:grid-cols-2 md:pt-20">
          <div>
            <p className="eyebrow mb-4">Cofetărie artizanală · București &amp; Ilfov</p>
            <h1 className="text-balance text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              Deserturi artizanale, cu gustul de&nbsp;altădată
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink-soft">
              Torturi personalizate, candy bar și dulciuri tradiționale, realizate la comandă în
              laboratorul Traditum by Victoria — pentru momentele care merită ceva cu adevărat special.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/produse" className="rounded-full bg-gold px-6 py-3.5 font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5">
                Vezi produsele
              </Link>
              <Link href="/contact#oferta" className="rounded-full border border-gold px-6 py-3.5 font-semibold text-gold-deep transition-colors hover:bg-gold hover:text-white">
                Solicită o ofertă
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 hidden h-40 w-40 rounded-3xl bg-gold/25 md:block" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-xl">
              <Image
                src="/img/carousel-1.jpg"
                alt="Torturi personalizate și candy bar Traditum By Victoria București"
                width={720}
                height={820}
                priority
                className="h-[24rem] w-full object-cover md:h-[30rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORII */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="eyebrow mb-2">Produsele noastre</p>
          <h2 className="text-3xl text-ink sm:text-4xl">Alege din categoriile noastre</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cfg.categories.map((c) => (
            <Link key={c.slug} href={`/produse/${c.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="overflow-hidden">
                <Image src={c.images[0] || "/img/product-1.jpg"} alt={c.title} width={480} height={340} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl text-ink">{c.title}</h3>
                  <span className="whitespace-nowrap rounded-full bg-cream-2 px-3 py-1 text-xs font-semibold text-gold-deep">{categoryPrice(c)}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{c.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-deep">Vezi categoria →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESPRE */}
      <section className="bg-cream-2">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="eyebrow mb-3">{content.homeAbout.eyebrow}</p>
            <h2 className="text-3xl text-ink sm:text-4xl">{content.homeAbout.title}</h2>
            <p className="mt-4 text-ink-soft">{content.homeAbout.p1}</p>
            <p className="mt-3 text-ink-soft">{content.homeAbout.p2}</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
              {content.homeAbout.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-ink">
                  <span className="text-gold">✦</span> {b}
                </li>
              ))}
            </ul>
            <Link href="/despre" className="mt-7 inline-block rounded-full border border-gold px-6 py-3 font-semibold text-gold-deep transition-colors hover:bg-gold hover:text-white">
              Povestea noastră
            </Link>
          </div>
          <div className="order-1 overflow-hidden rounded-[2rem] shadow-lg md:order-2">
            <Image src="/img/about-1.jpg" alt="Laboratorul Traditum By Victoria" width={640} height={480} className="h-72 w-full object-cover md:h-96" />
          </div>
        </div>
      </section>

      {/* CIFRE */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {content.facts.map((f) => (
            <div key={f.label} className="text-center">
              <p className="font-display text-4xl font-bold text-gold-deep">{f.value}+</p>
              <p className="mt-1 text-sm text-ink-soft">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALE */}
      <section className="bg-cream-2">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <p className="eyebrow mb-2">Ce spun clienții</p>
            <h2 className="text-3xl text-ink sm:text-4xl">Momente dulci, povestite de ei</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cfg.testimonials.slice(0, 4).map((t, i) => (
              <figure key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line">
                <Stars rating={t.rating} />
                <blockquote className="mt-3 text-sm text-ink-soft">“{t.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-ink">
                  {t.name} {t.role && <span className="font-normal text-ink-soft">· {t.role}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/recenzii" className="inline-block rounded-full border border-gold px-6 py-3 font-semibold text-gold-deep transition-colors hover:bg-gold hover:text-white">
              Vezi toate recenziile
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="rounded-[2rem] bg-dark px-8 py-14 text-center text-cream">
          <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl">
            Hai să pregătim împreună deserturile evenimentului tău
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/70">
            Torturi personalizate, candy bar și mese dulci pentru orice ocazie, în București și Ilfov.
          </p>
          <Link href="/contact#oferta" className="mt-8 inline-block rounded-full bg-gold px-8 py-4 font-semibold text-white transition-transform hover:-translate-y-0.5">
            Solicită o ofertă personalizată
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
