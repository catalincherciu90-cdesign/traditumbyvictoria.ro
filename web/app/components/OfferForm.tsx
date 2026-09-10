"use client";

import { useState } from "react";

export default function OfferForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      subject: String(fd.get("subject") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };
    if (!payload.name || !payload.message) {
      setState("err");
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setState("ok");
      (e.target as HTMLFormElement).reset();
    } catch {
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-line">
        <p className="font-display text-xl text-ink">Mulțumim! Mesajul a fost trimis. 🎂</p>
        <p className="mt-2 text-sm text-ink-soft">Revenim cu o ofertă cât mai curând posibil.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line sm:p-8">
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Nume</label>
            <input name="name" required className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Numele tău" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Email sau telefon</label>
            <input name="email" className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Cum te contactăm" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Tip eveniment / produs</label>
          <input name="subject" className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Ex: tort aniversar, candy bar nuntă" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Detalii</label>
          <textarea name="message" required rows={5} className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Spune-ne data, numărul de porții, tema, preferințe..." />
        </div>
        {state === "err" && <p className="text-sm text-red-600">Te rugăm completează numele și detaliile.</p>}
        <button type="submit" disabled={state === "sending"} className="rounded-full bg-gold px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {state === "sending" ? "Se trimite..." : "Trimite cererea de ofertă"}
        </button>
      </div>
    </form>
  );
}
