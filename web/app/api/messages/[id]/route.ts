import { kv, isAuthed, MESSAGES_KEY } from "../../../lib/cf";

export async function DELETE(req: Request, ctx: RouteContext<"/api/messages/[id]">) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const { id } = await ctx.params;
  let list = ((await store.get(MESSAGES_KEY, "json")) as { id: string }[]) || [];
  list = list.filter((m) => m.id !== id);
  await store.put(MESSAGES_KEY, JSON.stringify(list));
  return Response.json({ ok: true });
}
