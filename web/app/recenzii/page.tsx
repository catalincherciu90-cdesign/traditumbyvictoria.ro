import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";
import Stars from "../components/Stars";
import ReviewForm from "../components/ReviewForm";
import { getConfig, getReviews } from "../lib/site-data";

export const metadata: Metadata = {
  title: "Recenzii",
  description: "Recenzii și testimoniale de la clienții Traditum by Victoria — torturi personalizate și candy bar pentru evenimente în București.",
};

export default async function RecenziiPage() {
  const cfg = await getConfig();
  const reviews = await getReviews();
  const all = [...reviews, ...cfg.testimonials];
  const avg = all.length ? all.reduce((s, r) => s + (r.rating || 5), 0) / all.length : 5;

  return (
    <>
      <SiteNav />
      <PageHeader eyebrow="Recenzii" title="Ce spun clienții noștri" />

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-10 flex flex-col items-center gap-2">
          <Stars rating={Math.round(avg)} />
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">{avg.toFixed(1)}</span> din 5 · {all.length} recenzii
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {all.map((t, i) => (
            <figure key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line">
              <Stars rating={t.rating} />
              <blockquote className="mt-3 text-sm text-ink-soft">“{t.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink">
                {t.name} {t.role && <span className="font-normal text-ink-soft">· {t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-cream-2">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <ReviewForm />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
