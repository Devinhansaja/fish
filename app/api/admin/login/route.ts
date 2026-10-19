import { NextResponse } from "next/server";
import { createSessionToken, credentialsValid, sessionCookie } from "@/lib/adminAuth";
import { rateLimited } from "@/lib/deliver";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  // brute-force guard: 8 attempts per 10 minutes per address
  if (rateLimited(`admin-login:${ip}`, 8)) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  let body: { username?: unknown; password?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  if (!credentialsValid(body.username, body.password)) {
    return NextResponse.json({ ok: false, message: "Wrong user name or password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie.name, createSessionToken(), sessionCookie.options);
  return res;
}
