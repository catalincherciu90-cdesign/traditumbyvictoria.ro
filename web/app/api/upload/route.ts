import { kv, isAuthed, IMG_PREFIX } from "../../lib/cf";

export async function POST(req: Request) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return Response.json({ error: "Fără fișier" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: "Imaginea depășește 5 MB" }, { status: 400 });
  const id = crypto.randomUUID();
  const buf = await file.arrayBuffer();
  await store.put(IMG_PREFIX + id, buf, { metadata: { ct: file.type || "image/jpeg" } });
  return Response.json({ url: `/api/img/${id}` });
}
