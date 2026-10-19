import { NextResponse } from "next/server";
import {
  createSessionToken,
  currentPasswordValid,
  isAdmin,
  sessionCookie,
  setPassword,
  validateNewPassword,
} from "@/lib/adminAuth";
import { rateLimited } from "@/lib/deliver";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, message: "Please sign in." }, { status: 401 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(`admin-pw:${ip}`, 6)) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  let body: { current?: unknown; next?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!currentPasswordValid(body.current)) {
    return NextResponse.json({ ok: false, errors: { current: "The current password is not correct." } }, { status: 403 });
  }
  const problem = validateNewPassword(body.next, body.current);
  if (problem) return NextResponse.json({ ok: false, errors: { next: problem } }, { status: 422 });

  setPassword(body.next as string);

  // every old session is now invalid; keep this browser signed in with a fresh cookie
  const res = NextResponse.json({ ok: true, message: "Password changed. Other sessions were signed out." });
  res.cookies.set(sessionCookie.name, createSessionToken(), sessionCookie.options);
  return res;
}
