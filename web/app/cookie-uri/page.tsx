import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = { title: "Politica de cookie-uri" };

export default function Page() {
  return (
    <>
      <SiteNav />
      <PageHeader title="Politica de cookie-uri" />
      <section className="mx-auto max-w-3xl px-5 py-14 text-ink-soft [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:text-ink [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <p>Această politică explică ce sunt cookie-urile și cum le folosim pe site-ul Traditum By Victoria.</p>
        <h2>1. Ce sunt cookie-urile</h2>
        <p>Cookie-urile sunt fișiere text de mici dimensiuni salvate de browserul tău atunci când vizitezi un site. Ele ajută site-ul să funcționeze corect și să rețină anumite preferințe.</p>
        <h2>2. Ce cookie-uri folosim</h2>
        <p>Folosim un număr minim de cookie-uri:</p>
        <ul>
          <li>Cookie-uri strict necesare — pentru funcționarea corectă a site-ului.</li>
          <li>Preferință consimțământ — reținem, la nivel local în browserul tău, faptul că ai închis bannerul de cookie-uri, ca să nu îl reafișăm.</li>
        </ul>
        <h2>3. Gestionarea cookie-urilor</h2>
        <p>Poți șterge sau bloca cookie-urile din setările browserului tău. Dezactivarea anumitor cookie-uri poate afecta funcționarea site-ului.</p>
      </section>
      <SiteFooter />
    </>
  );
}
