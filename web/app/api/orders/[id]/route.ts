import { kv, isAuthed } from "../../../lib/cf";

const ORDERS_KEY = "orders";
const VALID = ["noua", "confirmata", "finalizata"];

export async function PATCH(req: Request, ctx: RouteContext<"/api/orders/[id]">) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { status?: string };
  const status = VALID.includes(String(body.status)) ? body.status : null;
  if (!status) return Response.json({ error: "Stare invalidă" }, { status: 400 });
  const list = ((await store.get(ORDERS_KEY, "json")) as { id: string; status?: string }[]) || [];
  const item = list.find((o) => o.id === id);
  if (item) item.status = status;
  await store.put(ORDERS_KEY, JSON.stringify(list));
  return Response.json({ ok: true });
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/orders/[id]">) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const { id } = await ctx.params;
  let list = ((await store.get(ORDERS_KEY, "json")) as { id: string }[]) || [];
  list = list.filter((o) => o.id !== id);
  await store.put(ORDERS_KEY, JSON.stringify(list));
  return Response.json({ ok: true });
}
