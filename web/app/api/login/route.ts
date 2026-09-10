import { cfEnv, createSession, timingSafeEqual, COOKIE_NAME, SESSION_TTL } from "../../lib/cf";

export async function POST(req: Request) {
  const pw = cfEnv().ADMIN_PASSWORD as string | undefined;
  if (!pw) return Response.json({ error: "ADMIN_PASSWORD nu este configurat" }, { status: 500 });
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof body.password === "string" && timingSafeEqual(body.password, pw)) {
    const token = await createSession(pw);
    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL}` } },
    );
  }
  return Response.json({ error: "Parolă incorectă" }, { status: 401 });
}
