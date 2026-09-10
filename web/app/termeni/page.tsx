import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = { title: "Termeni și condiții" };

export default function Page() {
  return (
    <>
      <SiteNav />
      <PageHeader title="Termeni și condiții" />
      <section className="mx-auto max-w-3xl px-5 py-14 text-ink-soft [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:text-ink [&_p]:mt-3">
        <p>Prezentele condiții reglementează utilizarea site-ului Traditum By Victoria și plasarea comenzilor de produse de cofetărie. Prin utilizarea site-ului și plasarea unei comenzi, ești de acord cu acești termeni.</p>
        <h2>1. Comenzi</h2>
        <p>Comenzile se plasează prin telefon, WhatsApp, e-mail sau prin formularul de pe site. O comandă este confirmată doar după ce primești confirmarea noastră privind disponibilitatea, prețul și data livrării. Pentru torturi personalizate și candy bar recomandăm plasarea comenzii cu 3-14 zile înainte, în funcție de complexitate.</p>
        <h2>2. Prețuri și plată</h2>
        <p>Prețurile se stabilesc în funcție de compoziție, gramaj, număr de porții și complexitatea decorului. Pentru candy bar și evenimente, prețul se comunică prin ofertă personalizată. Modalitatea și termenul de plată (avans/plată integrală) se stabilesc la confirmarea comenzii.</p>
        <h2>3. Alergeni</h2>
        <p>Produsele pot conține sau pot intra în contact cu alergeni (gluten, ouă, lapte, fructe cu coajă lemnoasă etc.). Te rugăm să ne comunici eventualele restricții alimentare la plasarea comenzii.</p>
        <h2>4. Proprietate intelectuală</h2>
        <p>Marca „Traditum By Victoria”, textele și fotografiile de pe site sunt protejate și nu pot fi utilizate fără acordul nostru.</p>
        <h2>5. Reclamații și ANPC</h2>
        <p>Eventualele reclamații se transmit la datele de contact de mai jos. Consumatorii pot apela la Autoritatea Națională pentru Protecția Consumatorilor (ANPC) și la platforma europeană de soluționare online a litigiilor (SOL/ODR).</p>
        <p className="mt-8 rounded-xl bg-cream-2 px-5 py-4 text-sm">Acesta este un model informativ general. Pentru conformitate deplină, adaptează-l cu datele reale ale firmei (denumire legală, CUI, adresă) împreună cu un consilier juridic.</p>
      </section>
      <SiteFooter />
    </>
  );
}
