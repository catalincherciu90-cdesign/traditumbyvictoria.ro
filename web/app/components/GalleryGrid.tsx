"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type GalItem = { url: string; cat?: string };

export default function GalleryGrid({ items }: { items: GalItem[] }) {
  const cats = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.cat && set.add(i.cat));
    return Array.from(set);
  }, [items]);
  const [active, setActive] = useState<string>("toate");

  const shown = active === "toate" ? items : items.filter((i) => i.cat === active);

  return (
    <div>
      {cats.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["toate", ...cats].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                active === c ? "bg-gold text-white" : "bg-cream-2 text-ink-soft hover:bg-gold/15 hover:text-gold-deep"
              }`}
            >
              {c === "toate" ? "Toate" : c}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((it, i) => (
          <div key={`${it.url}-${i}`} className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm ring-1 ring-line">
            <Image src={it.url} alt={it.cat || "Galerie Traditum By Victoria"} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        ))}
      </div>
    </div>
  );
}
