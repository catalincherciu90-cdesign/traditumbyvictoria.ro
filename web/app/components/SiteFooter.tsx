import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">
            Traditum <span className="text-gold">By Victoria</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-cream/70">
            Cofetărie artizanală în București — torturi personalizate, prăjituri de casă și candy bar
            pentru evenimente.
          </p>
        </div>
        <div className="text-sm">
          <h3 className="mb-4 font-display text-lg text-gold">Contact</h3>
          <p className="text-cream/80">Strada Libertății 53, București</p>
          <p className="mt-1 text-cream/80">0725 252 493</p>
          <p className="mt-1 text-cream/80">contact@traditumbyvictoria.ro</p>
        </div>
        <div className="text-sm">
          <h3 className="mb-4 font-display text-lg text-gold">Linkuri</h3>
          <ul className="space-y-2 text-cream/80">
            <li><Link href="/produse" className="hover:text-gold">Produse</Link></li>
            <li><Link href="/galerie" className="hover:text-gold">Galerie</Link></li>
            <li><Link href="/recenzii" className="hover:text-gold">Recenzii</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link href="/termeni" className="hover:text-gold">Termeni și condiții</Link></li>
            <li><Link href="/confidentialitate" className="hover:text-gold">Confidențialitate</Link></li>
            <li><Link href="/cookie-uri" className="hover:text-gold">Politica de cookie-uri</Link></li>
          </ul>
          <p className="mt-4 text-xs text-cream/50">
            <a href="https://anpc.ro/" target="_blank" rel="noopener" className="hover:text-gold">ANPC</a>
            {" · "}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" className="hover:text-gold">SOL/ODR</a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-cream/60 sm:flex-row">
          <span>© Traditum By Victoria. Toate drepturile rezervate.</span>
          <span>
            Designed By{" "}
            <a href="https://c-design.ro/" target="_blank" rel="noopener" className="text-gold">
              C Design
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
