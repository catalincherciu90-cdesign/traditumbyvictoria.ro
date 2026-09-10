import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import PageHeader from "../components/PageHeader";
import { getConfig } from "../lib/site-data";

export const metadata: Metadata = { title: "Politica de confidențialitate" };

export default async function Page() {
  const { contact } = await getConfig();
  return (
    <>
      <SiteNav />
      <PageHeader title="Politica de confidențialitate" />
      <section className="mx-auto max-w-3xl px-5 py-14 text-ink-soft [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:text-ink [&_p]:mt-3">
        <p>Prezenta politică explică modul în care Traditum By Victoria colectează și utilizează datele cu caracter personal ale vizitatorilor site-ului, în conformitate cu Regulamentul (UE) 2016/679 (GDPR).</p>
        <h2>1. Cine suntem</h2>
        <p>Traditum By Victoria este un laborator de cofetărie artizanală. Ne poți contacta la adresa de e-mail {contact.email} sau la telefon {contact.phone}.</p>
        <h2>2. Ce date colectăm</h2>
        <p>Colectăm doar datele pe care ni le transmiți voluntar prin formularul de contact: numele, adresa de e-mail, subiectul și mesajul. Aceste date sunt folosite exclusiv pentru a răspunde solicitărilor tale (comenzi, întrebări, oferte).</p>
        <h2>3. Temeiul și scopul prelucrării</h2>
        <p>Prelucrăm datele pe baza consimțământului tău și a interesului legitim de a răspunde mesajelor primite. Nu folosim datele în scopuri de marketing fără acordul tău explicit și nu le vindem către terți.</p>
        <h2>4. Cât timp păstrăm datele</h2>
        <p>Mesajele primite prin formular sunt păstrate doar cât este necesar pentru a-ți răspunde și a gestiona eventuala comandă. Poți solicita oricând ștergerea lor.</p>
        <h2>5. Drepturile tale</h2>
        <p>Ai dreptul de acces, rectificare, ștergere, restricționare și opoziție cu privire la datele tale. Pentru exercitarea acestor drepturi, ne poți contacta la datele de mai sus.</p>
        <p className="mt-8 rounded-xl bg-cream-2 px-5 py-4 text-sm">Acesta este un model informativ general. Pentru conformitate deplină, adaptează-l cu datele reale ale firmei (denumire legală, CUI, adresă) împreună cu un consilier juridic.</p>
      </section>
      <SiteFooter />
    </>
  );
}
