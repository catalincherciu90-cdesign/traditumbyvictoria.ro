import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 160);
  const subject = String(body.subject || "").trim().slice(0, 160);
  const message = String(body.message || "").trim().slice(0, 4000);
  if (!name || !message) {
    return Response.json({ error: "Numele și mesajul sunt obligatorii." }, { status: 400 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kv = (getCloudflareContext().env as any).PRODUCTS as KVNamespace | undefined;
  if (!kv) return Response.json({ error: "Indisponibil" }, { status: 503 });

  const list = ((await kv.get("messages", "json")) as unknown[]) || [];
  list.unshift({ id: crypto.randomUUID(), name, email, subject, message, date: new Date().toISOString() });
  if (list.length > 500) list.length = 500;
  await kv.put("messages", JSON.stringify(list));
  return Response.json({ ok: true });
}
