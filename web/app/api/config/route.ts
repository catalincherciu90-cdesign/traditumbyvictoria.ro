import { kv, isAuthed, CONFIG_KEY } from "../../lib/cf";
import { sanitizeConfig } from "../../lib/sanitize";
import { DEFAULT_CONFIG } from "../../lib/site-data";

export async function GET() {
  const store = kv();
  if (!store) return Response.json(DEFAULT_CONFIG);
  const raw = (await store.get(CONFIG_KEY, "json")) as object | null;
  return Response.json(raw || DEFAULT_CONFIG);
}

export async function PUT(req: Request) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const config = sanitizeConfig(body);
  await store.put(CONFIG_KEY, JSON.stringify(config));
  return Response.json(config);
}
