import "server-only";

import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

/**
 * Minimal admin authentication: one account, signed httpOnly session cookie.
 *
 * Credentials come from, in order:
 *   1. data/admin.json  - written when the password is changed from the admin panel
 *                         (scrypt hash + salt; the file is git-ignored)
 *   2. ADMIN_USER / ADMIN_PASSWORD environment variables
 *   3. the local-testing defaults admin / 123
 *
 * Changing the password also invalidates every existing session cookie.
 * BEFORE DEPLOYING set ADMIN_SECRET to a long random string.
 */
const COOKIE = "aqz_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
const FILE = path.join(process.cwd(), "data", "admin.json");

type Stored = { username?: string; salt: string; hash: string; updatedAt: string };

function readStored(): Stored | null {
  try {
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as Partial<Stored>;
    return typeof parsed.salt === "string" && typeof parsed.hash === "string" ? (parsed as Stored) : null;
  } catch {
    return null;
  }
}

const user = () => readStored()?.username ?? process.env.ADMIN_USER ?? "admin";
const envPass = () => process.env.ADMIN_PASSWORD ?? "123";
const secret = () => process.env.ADMIN_SECRET ?? "aquazone-local-dev-secret-change-me";
/** Changes whenever the password changes, so old session cookies stop working. */
const fingerprint = () => readStored()?.hash.slice(0, 24) ?? "env";

const sha = (s: string) => createHash("sha256").update(s).digest();
const safeEqual = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));
const scrypt = (password: string, salt: string) => scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });

function passwordMatches(password: string) {
  const stored = readStored();
  if (!stored) return safeEqual(password, envPass());
  const expected = Buffer.from(stored.hash, "hex");
  const actual = scrypt(password, stored.salt);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function credentialsValid(username: unknown, password: unknown) {
  if (typeof username !== "string" || typeof password !== "string") return false;
  // evaluate both so timing does not reveal which field was wrong
  const u = safeEqual(username, user());
  const p = passwordMatches(password);
  return u && p;
}

export function currentPasswordValid(password: unknown) {
  return typeof password === "string" && passwordMatches(password);
}

export const MIN_PASSWORD_LENGTH = 8;

export function validateNewPassword(next: unknown, current: unknown): string | null {
  if (typeof next !== "string" || next.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (next.length > 128) return "Use 128 characters or fewer.";
  if (next === current) return "The new password must be different from the current one.";
  if (/^\s|\s$/.test(next)) return "The password cannot start or end with a space.";
  return null;
}

/** Store a new password (salted scrypt hash) in data/admin.json. */
export function setPassword(next: string) {
  const salt = randomBytes(16).toString("hex");
  const record: Stored = {
    username: user(),
    salt,
    hash: scrypt(next, salt).toString("hex"),
    updatedAt: new Date().toISOString(),
  };
  mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(record, null, 2) + "\n", "utf8");
  renameSync(tmp, FILE);
}

function sign(payload: string) {
  return createHmac("sha256", `${secret()}|${fingerprint()}`).update(payload).digest("base64url");
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
