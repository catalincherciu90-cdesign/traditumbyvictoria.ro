import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name || "").trim().slice(0, 80);
  const text = String(body.text || "").trim().slice(0, 600);
  const rating = Math.min(5, Math.max(1, parseInt(String(body.rating), 10) || 5));
  if (!name || !text) {
    return Response.json({ error: "Numele și textul recenziei sunt obligatorii." }, { status: 400 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kv = (getCloudflareContext().env as any).PRODUCTS as KVNamespace | undefined;
  if (!kv) return Response.json({ error: "Indisponibil" }, { status: 503 });

  const list = ((await kv.get("reviews", "json")) as unknown[]) || [];
  list.unshift({ id: crypto.randomUUID(), name, text, rating, date: new Date().toISOString() });
  if (list.length > 200) list.length = 200;
  await kv.put("reviews", JSON.stringify(list));
  return Response.json({ ok: true });
}
