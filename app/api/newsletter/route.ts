import { NextResponse } from "next/server";
import { NotConfiguredError, deliver, rateLimited } from "@/lib/deliver";

export const runtime = "nodejs";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  let body: { email?: unknown; website?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });
  if (rateLimited(`nl:${ip}`, 5)) return NextResponse.json({ ok: false, message: "Too many attempts. Please try later." }, { status: 429 });

  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, message: "Please enter a valid email address." }, { status: 422 });

  try {
    // TODO: swap for a newsletter provider (Mailchimp/Brevo/etc.) via CRM_WEBHOOK_URL or a dedicated integration.
    const r = await deliver("newsletter", "New newsletter subscriber", { email });
    return NextResponse.json({
      ok: true,
      message: r.mode === "dev-log" ? "Development mode: subscription logged, not stored." : "Thank you - you are subscribed.",
    });
  } catch (err) {
    if (err instanceof NotConfiguredError) {
      return NextResponse.json({ ok: false, message: "Newsletter sign-up is not available yet." }, { status: 503 });
    }
    return NextResponse.json({ ok: false, message: "Could not subscribe right now. Please try again." }, { status: 502 });
  }
}
