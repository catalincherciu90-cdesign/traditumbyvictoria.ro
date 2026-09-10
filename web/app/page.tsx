import Image from "next/image";
import Link from "next/link";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

const categorii = [
  { slug: "torturi", titlu: "Torturi", text: "Torturi personalizate pentru aniversări, nunți și botezuri.", img: "/img/product-1.jpg" },
  { slug: "candy-bar", titlu: "Candy Bar", text: "Mese dulci pentru evenimente, aranjate cu grijă.", img: "/img/product-3.jpg" },
  { slug: "traditional", titlu: "Tradițional", text: "Cozonaci, dulciuri de casă și rețete de altădată.", img: "/img/product-2.jpg" },
];

export default function Home() {
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
          {categorii.map((c) => (
            <Link key={c.slug} href={`/produse/${c.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="overflow-hidden">
                <Image src={c.img} alt={c.titlu} width={480} height={340} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl text-ink">{c.titlu}</h3>
                <p className="mt-2 text-sm text-ink-soft">{c.text}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-deep">Vezi categoria →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CANDY BAR */}
      <section className="bg-cream-2">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] shadow-lg">
            <Image src="/img/product-3.jpg" alt="Candy bar pentru evenimente în București" width={640} height={460} className="h-72 w-full object-cover md:h-96" />
          </div>
          <div>
            <p className="eyebrow mb-3">Candy Bar pentru evenimente</p>
            <h2 className="text-3xl text-ink sm:text-4xl">Un colț al evenimentului pe care invitații îl țin minte</h2>
            <p className="mt-4 text-ink-soft">
              Varietate, prezentare și deserturi artizanale — ne ocupăm de sortimente, suporturi,
              amenajare, transport și montaj, pentru nuntă, botez sau eveniment corporate.
            </p>
            <Link href="/contact#oferta" className="mt-7 inline-block rounded-full bg-gold px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5">
              Solicită o ofertă
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
