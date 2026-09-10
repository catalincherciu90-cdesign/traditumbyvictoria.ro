import { kv, isAuthed, MESSAGES_KEY } from "../../lib/cf";

export async function GET(req: Request) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json([]);
  return Response.json((await store.get(MESSAGES_KEY, "json")) || []);
}
