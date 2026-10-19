import { NextResponse } from "next/server";
import { NotConfiguredError, deliver, rateLimited, verifyTurnstile } from "@/lib/deliver";
import { readSpecies } from "@/lib/speciesStore";
import { buyerTypes } from "@/lib/site";

export const runtime = "nodejs";

type Body = Record<string, unknown>;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Spam defences: honeypot, minimum fill time, rate limit, optional Turnstile
  if (str(body.website, 100)) return NextResponse.json({ ok: true }); // silently drop bots
  const started = Number(body.startedAt);
  if (!Number.isFinite(started) || Date.now() - started < 2500) {
    return NextResponse.json({ ok: false, message: "Please take a moment to complete the form and try again." }, { status: 429 });
  }
  if (rateLimited(`inq:${ip}`)) {
    return NextResponse.json({ ok: false, message: "Too many submissions. Please try again later." }, { status: 429 });
  }
  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, message: "Spam check failed. Please try again." }, { status: 400 });
  }

  // Server-side validation
  const data = {
    fullName: str(body.fullName, 120),
    company: str(body.company, 160),
    country: str(body.country, 80),
    email: str(body.email, 200),
    phone: str(body.phone, 40),
    buyerType: str(body.buyerType, 60),
    quantity: str(body.quantity, 120),
    destination: str(body.destination, 160),
    message: str(body.message, 4000),
  };
  // species: [{ slug, qty }] (a plain slug string is also accepted, quantity then unspecified)
  const rawItems = Array.isArray(body.species) ? (body.species as unknown[]) : [];
  const species = await readSpecies();
  const requested = rawItems
    .map((x) =>
      typeof x === "string"
        ? { slug: x, qty: 0 }
        : { slug: typeof (x as { slug?: unknown })?.slug === "string" ? (x as { slug: string }).slug : "", qty: Math.round(Number((x as { qty?: unknown })?.qty)) || 0 },
    )
    .filter((x) => x.slug)
    .slice(0, 50);
  const selected = requested.flatMap((x) => {
    const s = species.find((sp) => sp.slug === x.slug);
    if (!s) return [];
    const qty = Math.min(1_000_000, Math.max(0, x.qty));
    return [`${s.commonName} (${s.scientificName}) - ${qty ? `${qty.toLocaleString("en-US")} pcs` : "quantity not stated"}`];
  });
  const totalPcs = requested.reduce((n, x) => n + Math.min(1_000_000, Math.max(0, x.qty)), 0);

  const errors: Record<string, string> = {};
  if (data.fullName.length < 2) errors.fullName = "Please enter your full name.";
  if (data.company.length < 2) errors.company = "Please enter your company name.";
  if (data.country.length < 2) errors.country = "Please enter your country.";
  if (!EMAIL.test(data.email)) errors.email = "Please enter a valid email address.";
  if (!(buyerTypes as readonly string[]).includes(data.buyerType)) errors.buyerType = "Please choose a buyer type.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, message: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  try {
    const result = await deliver("inquiry", `New export inquiry from ${data.company} (${data.country})`, {
      Name: data.fullName,
      Company: data.company,
      Country: data.country,
      email: data.email,
      Phone: data.phone || "-",
      "Buyer type": data.buyerType,
      "Species of interest": selected.length ? selected : "-",
      "Total pieces (indicative)": totalPcs ? totalPcs.toLocaleString("en-US") : "-",
      "Other quantity notes": data.quantity || "-",
      "Shipping destination": data.destination || "-",
      Message: data.message || "-",
    });
    return NextResponse.json({
      ok: true,
      message:
        result.mode === "dev-log"
          ? "Development mode: your inquiry was logged on the server but not emailed. Configure delivery before launch."
          : "Thank you. Our export team has received your inquiry and will respond with a quotation.",
      devMode: result.mode === "dev-log",
    });
  } catch (err) {
    if (err instanceof NotConfiguredError) {
      return NextResponse.json(
        { ok: false, message: "Our inquiry form is temporarily unavailable. Please contact us by email or WhatsApp instead." },
        { status: 503 },
      );
    }
    console.error("[aquazone] inquiry delivery failed", err);
    return NextResponse.json({ ok: false, message: "We could not send your inquiry. Please try again shortly." }, { status: 502 });
  }
}
