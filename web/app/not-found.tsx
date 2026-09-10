import Link from "next/link";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="eyebrow mb-3">Eroare 404</p>
        <h1 className="text-4xl text-ink sm:text-5xl">Pagina nu a fost găsită</h1>
        <p className="mt-4 text-ink-soft">Se pare că pagina căutată nu există sau a fost mutată.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-gold px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5">
          Înapoi la pagina principală
        </Link>
      </section>
      <SiteFooter />
    </>
  );
}
