import Image from "next/image";
import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";
import { getConfig } from "../lib/site-data";

export const metadata: Metadata = {
  title: "Despre noi",
  description: "Povestea Traditum by Victoria — o cofetărie artizanală din București, cu peste 15 ani de pasiune pentru deserturi făcute în casă.",
};

export default async function DesprePage() {
  const { content } = await getConfig();
  const ap = content.aboutPage;
  const paras = ap.story.split("\n").filter((p) => p.trim());

  return (
    <>
      <SiteNav />
      <PageHeader eyebrow={ap.eyebrow} title={ap.title} />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid items-start gap-12 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 text-ink-soft">
            {paras.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lg text-ink" : ""}>{p}</p>
            ))}
            <p className="mt-6 border-l-4 border-gold bg-cream-2 px-5 py-4 font-display text-lg text-ink">
              {ap.highlight}
            </p>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] shadow-lg">
              <Image src="/img/about-1.jpg" alt="Laboratorul Traditum By Victoria" width={560} height={420} className="h-64 w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-[2rem] shadow-lg">
              <Image src="/img/about-2.jpg" alt="Deserturi artizanale Traditum By Victoria" width={560} height={420} className="h-64 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICII */}
      <section className="bg-cream-2">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <p className="eyebrow mb-2">{content.services.eyebrow}</p>
            <h2 className="text-3xl text-ink sm:text-4xl">{content.services.title}</h2>
            <p className="mt-3 text-ink-soft">{content.services.intro}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.services.items.map((s) => (
              <div key={s.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-deep">✦</div>
                <h3 className="text-lg text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
