import { kv, CONFIG_KEY } from "../../lib/cf";

const ORDERS_KEY = "orders";

export async function POST(req: Request) {
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });

  // comenzile sunt acceptate doar dacă funcția e pornită din admin
  const cfg = (await store.get(CONFIG_KEY, "json")) as { ordersEnabled?: boolean } | null;
  if (!cfg?.ordersEnabled) return Response.json({ error: "Momentan nu preluăm comenzi online." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name || "").trim().slice(0, 120);
  const phone = String(body.phone || "").trim().slice(0, 60);
  const product = String(body.product || "").trim().slice(0, 200);
  const date = String(body.date || "").trim().slice(0, 40);
  const details = String(body.details || "").trim().slice(0, 2000);
  if (!name || !phone || !product) {
    return Response.json({ error: "Numele, telefonul și produsul sunt obligatorii." }, { status: 400 });
  }

  const list = ((await store.get(ORDERS_KEY, "json")) as unknown[]) || [];
  list.unshift({ id: crypto.randomUUID(), name, phone, product, date, details, status: "noua", createdAt: new Date().toISOString() });
  if (list.length > 500) list.length = 500;
  await store.put(ORDERS_KEY, JSON.stringify(list));
  return Response.json({ ok: true });
}
