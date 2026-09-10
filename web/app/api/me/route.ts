import { isAuthed } from "../../lib/cf";

export async function GET(req: Request) {
  return Response.json({ authed: await isAuthed(req) });
}
