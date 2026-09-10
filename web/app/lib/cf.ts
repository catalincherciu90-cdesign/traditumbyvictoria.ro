import { getCloudflareContext } from "@opennextjs/cloudflare";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEnv = Record<string, any>;

export function cfEnv(): AnyEnv {
  try {
    return (getCloudflareContext().env as AnyEnv) || {};
  } catch {
    return {};
  }
}

export function kv(): KVNamespace | null {
  return (cfEnv().PRODUCTS as KVNamespace) || null;
}

export const COOKIE_NAME = "tv_session";
export const SESSION_TTL = 60 * 60 * 8; // 8 ore
export const IMG_PREFIX = "img:";
export const CONFIG_KEY = "siteconfig";
export const MESSAGES_KEY = "messages";
export const REVIEWS_KEY = "reviews";

// ---- base64url + HMAC (identic cu worker-ul) ----
function b64urlEncode(bytes: ArrayBuffer): string {
  let bin = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function hmac(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return b64urlEncode(sig);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function createSession(password: string): Promise<string> {
  const payload = JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL });
  const p = b64urlEncode(new TextEncoder().encode(payload).buffer as ArrayBuffer);
  const sig = await hmac(password, p);
  return `${p}.${sig}`;
}

export async function verifySession(password: string, token: string | null): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [p, sig] = token.split(".");
  const expected = await hmac(password, p);
  if (!timingSafeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function getCookie(req: Request, name: string): string | null {
  const header = req.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

export async function isAuthed(req: Request): Promise<boolean> {
  const pw = cfEnv().ADMIN_PASSWORD as string | undefined;
  if (!pw) return false;
  return verifySession(pw, getCookie(req, COOKIE_NAME));
}
