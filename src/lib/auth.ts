/**
 * Self-contained session auth for the WellPass admin portal.
 *
 * A signed (HMAC-SHA256) stateless token is stored in an httpOnly cookie. The
 * same verify path runs in both the Node route handlers and the Edge
 * middleware, so it relies only on the Web Crypto API (`crypto.subtle`) and
 * `btoa`/`atob`, which are available in both runtimes.
 */

export const SESSION_COOKIE = "wp_admin_session";

const enc = new TextEncoder();
const dec = new TextDecoder();

function getSecret(): string {
  return process.env.SESSION_SECRET || "wp-admin-insecure-default-secret";
}

export function getSessionMaxAge(): number {
  const raw = Number(process.env.SESSION_MAX_AGE);
  return Number.isFinite(raw) && raw > 0 ? raw : 60 * 60 * 8; // 8h default
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function strToB64url(str: string): string {
  return bytesToB64url(enc.encode(str));
}

function b64urlToStr(b64url: string): string {
  let s = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4;
  if (pad) s += "=".repeat(4 - pad);
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return dec.decode(bytes);
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return new Uint8Array(sig);
}

type SessionPayload = { sub: string; iat: number; exp: number };

/** Mint a signed session token for the given subject (admin email). */
export async function createSessionToken(subject: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { sub: subject, iat: now, exp: now + getSessionMaxAge() };
  const body = strToB64url(JSON.stringify(payload));
  const sig = bytesToB64url(await hmac(body));
  return `${body}.${sig}`;
}

/** Verify a token's signature + expiry. Returns the payload or null. */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = bytesToB64url(await hmac(body));
  // Length-checked constant-ish comparison.
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;

  try {
    const payload = JSON.parse(b64urlToStr(body)) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Validate submitted credentials against the configured admin account. */
export function verifyCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedEmail || !expectedPassword) return false;
  return (
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
    password === expectedPassword
  );
}
