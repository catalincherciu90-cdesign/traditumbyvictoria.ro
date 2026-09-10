import { kv, IMG_PREFIX } from "../../../lib/cf";

export async function GET(_req: Request, ctx: RouteContext<"/api/img/[id]">) {
  const store = kv();
  if (!store) return new Response("Not found", { status: 404 });
  const { id } = await ctx.params;
  const obj = await store.getWithMetadata(IMG_PREFIX + id, "arrayBuffer");
  if (!obj || !obj.value) return new Response("Not found", { status: 404 });
  const ct = (obj.metadata as { ct?: string } | null)?.ct || "application/octet-stream";
  return new Response(obj.value as ArrayBuffer, {
    headers: { "content-type": ct, "cache-control": "public, max-age=31536000, immutable" },
  });
}
