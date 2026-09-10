import { isAuthed } from "../../lib/cf";
import { generateBanner } from "../../lib/ai";

export async function POST(req: Request) {
  if (!(await isAuthed(req))) return Response.json({ error: "Neautorizat" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { kind?: string; hint?: string };
  try {
    const out = await generateBanner(String(body.kind || "").slice(0, 30), String(body.hint || "").slice(0, 200));
    return Response.json(out);
  } catch (e) {
    return Response.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}
