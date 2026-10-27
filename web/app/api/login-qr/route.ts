import { kv, isAuthed } from "../../lib/cf";

// Admin autentificat (pe calculator) generează un cod de unică folosință
// pentru a loga telefonul prin scanarea unui QR. Expiră în 120s.
export async function POST(req: Request) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  await store.put("qrlogin:" + token, "1", { expirationTtl: 120 });
  return Response.json({ token, expiresIn: 120 });
}
