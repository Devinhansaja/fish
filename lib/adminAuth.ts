import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal admin authentication: one account, signed httpOnly session cookie.
 *
 * Defaults are admin / 123 (as requested for local use). BEFORE DEPLOYING set
 * ADMIN_USER, ADMIN_PASSWORD and a long random ADMIN_SECRET in the environment.
 */
const COOKIE = "aqz_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

const user = () => process.env.ADMIN_USER ?? "admin";
const pass = () => process.env.ADMIN_PASSWORD ?? "123";
const secret = () => process.env.ADMIN_SECRET ?? "aquazone-local-dev-secret-change-me";

const sha = (s: string) => createHash("sha256").update(s).digest();
const safeEqual = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));

export function credentialsValid(username: unknown, password: unknown) {
  if (typeof username !== "string" || typeof password !== "string") return false;
  // evaluate both so timing does not reveal which field was wrong
  const u = safeEqual(username, user());
  const p = safeEqual(password, pass());
  return u && p;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${user()}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [name, exp, sig] = parts;
  const expected = sign(`${name}.${exp}`);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return name === user() && Number(exp) > Math.floor(Date.now() / 1000);
}

export async function isAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE)?.value);
}

export const sessionCookie = {
  name: COOKIE,
  options: {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  },
};
