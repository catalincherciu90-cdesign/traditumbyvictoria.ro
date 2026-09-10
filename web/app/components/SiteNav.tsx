"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink" onClick={() => setOpen(false)}>
          Traditum <span className="text-gold">By Victoria</span>
        </Link>

        {/* Meniu desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-gold hover:text-white ${
                  isActive(l.href) ? "bg-gold/15 text-gold-deep" : "text-ink-soft"
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
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
        <div className="border-t border-line/60 bg-cream md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(l.href) ? "text-gold-deep" : "text-ink"
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
