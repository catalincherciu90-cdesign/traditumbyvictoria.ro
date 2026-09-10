"use client";

import { useState } from "react";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      text: String(fd.get("text") || "").trim(),
      rating,
    };
    if (!payload.name || !payload.text) {
      setState("err");
      return;
    }
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setState("ok");
      (e.target as HTMLFormElement).reset();
      setRating(5);
    } catch {
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-line">
        <p className="font-display text-xl text-ink">Mulțumim pentru recenzie! 🌟</p>
        <p className="mt-2 text-sm text-ink-soft">Recenzia ta va apărea pe site după ce este aprobată.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line sm:p-8">
      <h3 className="font-display text-xl text-ink">Lasă o recenzie</h3>
      <div className="mt-5 grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Numele tău</label>
          <input name="name" required className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Ex: Andreea M." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Evaluare</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stele`} className={`text-2xl leading-none transition-colors ${n <= rating ? "text-gold" : "text-line"}`}>
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Recenzia ta</label>
          <textarea name="text" required rows={4} className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Spune-ne despre experiența ta..." />
        </div>
        {state === "err" && <p className="text-sm text-red-600">Te rugăm completează numele și textul recenziei.</p>}
        <button type="submit" disabled={state === "sending"} className="rounded-full bg-gold px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {state === "sending" ? "Se trimite..." : "Trimite recenzia"}
        </button>
      </div>
    </form>
  );
}
