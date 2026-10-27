import { kv, cfEnv, createSession, COOKIE_NAME, SESSION_TTL } from "../../../lib/cf";

// Telefonul trimite tokenul scanat din QR; dacă e valid, primește sesiune de admin.
export async function POST(req: Request) {
  const store = kv();
  if (!store) return Response.json({ error: "Indisponibil" }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { token?: string };
  const token = String(body.token || "").trim();
  if (!token || !/^[a-f0-9]{40,80}$/.test(token)) return Response.json({ error: "Cod invalid" }, { status: 400 });

  const key = "qrlogin:" + token;
  const found = await store.get(key);
  if (!found) return Response.json({ error: "Cod expirat sau deja folosit" }, { status: 401 });
  await store.delete(key); // o singură folosință

  const pw = cfEnv().ADMIN_PASSWORD as string | undefined;
  if (!pw) return Response.json({ error: "Server neconfigurat" }, { status: 500 });
  const session = await createSession(pw);
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": `${COOKIE_NAME}=${session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL}` } },
  );
}
