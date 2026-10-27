"use client";

import { useState } from "react";

export default function OrderForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      product: String(fd.get("product") || "").trim(),
      date: String(fd.get("date") || "").trim(),
      details: String(fd.get("details") || "").trim(),
    };
    if (!payload.name || !payload.phone || !payload.product) {
      setState("err"); setMsg("Completează numele, telefonul și produsul.");
      return;
    }
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error || "Eroare");
      setState("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setState("err"); setMsg((err as Error).message);
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-line">
        <p className="font-display text-xl text-ink">Comanda a fost trimisă! 🎂</p>
        <p className="mt-2 text-sm text-ink-soft">Te contactăm telefonic pentru confirmare.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line sm:p-8">
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Nume *</label>
            <input name="name" required className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Numele tău" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Telefon *</label>
            <input name="phone" required className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="07xx xxx xxx" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Produs / sortiment *</label>
            <input name="product" required className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Ex: tort aniversar 2kg" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Data dorită</label>
            <input name="date" type="date" className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Detalii</label>
          <textarea name="details" rows={4} className="w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold" placeholder="Temă, număr de porții, arome, alergii..." />
        </div>
        {state === "err" && <p className="text-sm text-red-600">{msg}</p>}
        <button type="submit" disabled={state === "sending"} className="rounded-full bg-gold px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {state === "sending" ? "Se trimite…" : "Trimite comanda"}
        </button>
      </div>
    </form>
  );
}
