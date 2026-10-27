"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Acasă" },
  { href: "/despre", label: "Despre noi" },
  { href: "/produse", label: "Produse" },
  { href: "/galerie", label: "Galerie" },
  { href: "/recenzii", label: "Recenzii" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState<string>("");
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((c) => { const l = (c as { logo?: string })?.logo; if (typeof l === "string") setLogo(l); })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-dark/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2.5">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-cream" onClick={() => setOpen(false)}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Traditum By Victoria" className="h-14 w-auto sm:h-16" />
          ) : (
            <span>Traditum <span className="text-gold">By Victoria</span></span>
          )}
        </Link>

        {/* Meniu desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white ${
                  isActive(l.href) ? "bg-white/10 text-gold" : "text-cream/80"
                }`}
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

        {/* Buton meniu mobil */}
        <button
          type="button"
          aria-label="Meniu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>

      {/* Panou meniu mobil */}
      {open && (
        <div className="border-t border-white/10 bg-dark md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(l.href) ? "text-gold" : "text-cream/85"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="py-2">
              <Link
                href="/contact#oferta"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-gold px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Solicită ofertă
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
