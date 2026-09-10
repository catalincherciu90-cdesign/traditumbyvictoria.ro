import { COOKIE_NAME } from "../../lib/cf";

export async function POST() {
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0` } },
  );
}
