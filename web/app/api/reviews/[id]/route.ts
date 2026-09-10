import { kv, isAuthed, REVIEWS_KEY } from "../../../lib/cf";

export async function DELETE(req: Request, ctx: RouteContext<"/api/reviews/[id]">) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const { id } = await ctx.params;
  let list = ((await store.get(REVIEWS_KEY, "json")) as { id: string }[]) || [];
  list = list.filter((r) => r.id !== id);
  await store.put(REVIEWS_KEY, JSON.stringify(list));
  return Response.json({ ok: true });
}

// Aprobă (sau retrage aprobarea) unei recenzii.
export async function PATCH(req: Request, ctx: RouteContext<"/api/reviews/[id]">) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { approved?: boolean };
  const list = ((await store.get(REVIEWS_KEY, "json")) as { id: string; approved?: boolean }[]) || [];
  const item = list.find((r) => r.id === id);
  if (item) item.approved = body.approved !== false;
  await store.put(REVIEWS_KEY, JSON.stringify(list));
  return Response.json({ ok: true });
}
