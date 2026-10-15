import "server-only";

/**
 * Delivery layer for form submissions (inquiries + newsletter).
 *
 * Configure at least one of:
 *   - RESEND_API_KEY + INQUIRY_TO_EMAIL (+ INQUIRY_FROM_EMAIL)  -> email notification
 *   - CRM_WEBHOOK_URL                                            -> POST JSON to your CRM / Zapier / Make
 *
 * With nothing configured:
 *   - development: the submission is logged to the server console and reported as a dev-mode success
 *   - production : the API returns 503 so the visitor is never told a lost inquiry succeeded
 */

export class NotConfiguredError extends Error {
  constructor() {
    super("Submission delivery is not configured");
  }
}

export type DeliverResult = { mode: "email" | "webhook" | "email+webhook" | "dev-log" };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export async function deliver(
  kind: "inquiry" | "newsletter",
  subject: string,
  fields: Record<string, string | string[]>,
): Promise<DeliverResult> {
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL ?? "Aquazone Website <onboarding@resend.dev>";
  const webhook = process.env.CRM_WEBHOOK_URL;

  const used: string[] = [];

  if (resendKey && to) {
    const rows = Object.entries(fields)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${esc(k)}</td><td>${esc(Array.isArray(v) ? v.join(", ") : v)}</td></tr>`)
      .join("");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: typeof fields.email === "string" ? fields.email : undefined,
        subject,
        html: `<h2>${esc(subject)}</h2><table>${rows}</table>`,
      }),
    });
    if (!res.ok) throw new Error(`Email provider error (${res.status})`);
    used.push("email");
  }

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, subject, receivedAt: new Date().toISOString(), fields }),
    });
    if (!res.ok) throw new Error(`Webhook error (${res.status})`);
    used.push("webhook");
  }

  if (used.length) return { mode: used.join("+") as DeliverResult["mode"] };

  if (process.env.NODE_ENV !== "production") {
    console.info(`[aquazone] ${kind} received (dev mode, not delivered):`, JSON.stringify(fields, null, 2));
    return { mode: "dev-log" };
  }
  throw new NotConfiguredError();
}

/** Tiny in-memory rate limiter (per server instance). Use Redis/Upstash for multi-instance deployments. */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > limit;
}

/** Optional Cloudflare Turnstile verification. Enabled when TURNSTILE_SECRET_KEY is set. */
export async function verifyTurnstile(token: unknown, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const json = (await res.json()) as { success?: boolean };
  return json.success === true;
}
