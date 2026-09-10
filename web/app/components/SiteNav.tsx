import Link from "next/link";

const links = [
  { href: "/", label: "Acasă" },
  { href: "/despre", label: "Despre noi" },
  { href: "/produse", label: "Produse" },
  { href: "/galerie", label: "Galerie" },
  { href: "/recenzii", label: "Recenzii" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink">
          Traditum <span className="text-gold">By Victoria</span>
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-gold hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/contact#oferta"
          className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-block"
        >
          Solicită ofertă
        </Link>
      </nav>
    </header>
  );
}
