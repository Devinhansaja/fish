"use client";

import { AnimatePresence, motion } from "framer-motion";
import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buyerTypes, site } from "@/lib/site";
import { useSpecies } from "../SpeciesProvider";
import { DEFAULT_QTY, useQuoteList } from "../InquiryList";
import { QtyStepper } from "../QtyStepper";
import { PrimaryCTA } from "../ui";
import { Icon } from "../Icon";
import { ease } from "@/lib/motion";

type Errors = Partial<Record<string, string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Builds a wa.me link with the inquiry pre-written, or null when no WhatsApp number is configured. */
function whatsappUrl(v: (k: string) => string, picks: { name: string; qty: number }[]) {
  if (!site.whatsapp) return null;
  const lines = [
    "*New inquiry from the Aquazone website*",
    `Name: ${v("fullName")}`,
    `Company: ${v("company")}`,
    `Country: ${v("country")}`,
    `Email: ${v("email")}`,
    v("phone") && `Phone: ${v("phone")}`,
    `Buyer type: ${v("buyerType")}`,
    picks.length && `Species:\n${picks.map((p) => `- ${p.name}${p.qty ? ` x ${p.qty.toLocaleString("en-US")} pcs` : ""}`).join("\n")}`,
    v("quantity") && `Quantity notes: ${v("quantity")}`,
    v("destination") && `Destination: ${v("destination")}`,
    v("message") && `Message: ${v("message")}`,
  ].filter(Boolean);
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field" data-invalid={error ? "true" : "false"}>
      {children}
      <label htmlFor={id}>{label}</label>
      {error && (
        <p className="field-error" id={`${id}-err`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function InquiryForm() {
  const { items, list, remove, add, clear, setItem } = useQuoteList();
  const { species, bySlug } = useSpecies();
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [waLink, setWaLink] = useState<string | null>(null);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();

    const errs: Errors = {};
    if (v("fullName").length < 2) errs.fullName = "Please enter your full name.";
    if (v("company").length < 2) errs.company = "Please enter your company name.";
    if (v("country").length < 2) errs.country = "Please enter your country.";
    if (!EMAIL.test(v("email"))) errs.email = "Please enter a valid email address.";
    if (!v("buyerType")) errs.buyerType = "Please choose a buyer type.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Open WhatsApp straight from the click so browsers don't treat it as a blocked popup.
    const waUrl = whatsappUrl(v, items.flatMap((q) => { const s = bySlug(q.slug); return s ? [{ name: s.commonName, qty: q.qty }] : []; }));
    if (waUrl) window.open(waUrl, "_blank", "noopener,noreferrer");
    setWaLink(waUrl);

    setState("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: v("fullName"),
          company: v("company"),
          country: v("country"),
          email: v("email"),
          phone: v("phone"),
          buyerType: v("buyerType"),
          quantity: v("quantity"),
          destination: v("destination"),
          message: v("message"),
          species: items,
          website: v("website"),
          startedAt: startedAt.current,
          turnstileToken: v("cf-turnstile-response"),
        }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string; errors?: Errors };
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.message ?? "Submission failed");
      }
      setMessage(waUrl ? "Your inquiry is ready in WhatsApp. Press Send there to deliver it to our team." : (json.message ?? "Thank you. We have received your inquiry."));
      setState("ok");
      clear();
      // Analytics hook - connect to GA4 / your tag manager
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "inquiry_submitted" });
    } catch (err) {
      // WhatsApp is the delivery channel when configured, so a failed email/webhook is not fatal.
      if (waUrl) {
        setMessage("Your inquiry is ready in WhatsApp. Press Send there to deliver it to our team.");
        setState("ok");
        clear();
        return;
      }
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  const available = species.filter((s) => !list.includes(s.slug));

  return (
    <div id="inquiry" className="card relative scroll-mt-28 overflow-hidden p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {state === "ok" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative grid min-h-[26rem] place-items-center text-center"
            role="status"
          >
            {/* restrained bubble celebration */}
            <span aria-hidden="true" className="motion-decor pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 14 }, (_, i) => (
                <span
                  key={i}
                  className="absolute bottom-0 block rounded-full border border-aqua/60 bg-aqua/20"
                  style={{ left: `${(i * 37) % 100}%`, width: 10 + (i % 4) * 6, height: 10 + (i % 4) * 6, animation: `bubble-rise ${2.2 + (i % 5) * 0.5}s ease-out ${i * 0.08}s 1 both`, ["--b-op" as string]: 0.9 }}
                />
              ))}
            </span>
            <div className="relative">
              <svg viewBox="0 0 80 80" className="mx-auto h-24 w-24" aria-hidden="true">
                <motion.circle cx="40" cy="40" r="34" fill="none" stroke="#00b4c6" strokeWidth="5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: ease.out }} />
                <motion.path d="m24 41 11 11 22-24" fill="none" stroke="#ffd166" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6, ease: ease.out }} />
              </svg>
              <h3 className="mt-6 text-3xl">{waLink ? "One last step" : "Inquiry received"}</h3>
              <p className="mx-auto mt-3 max-w-md text-lg text-muted">{message}</p>
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-cta mt-6 inline-flex items-center gap-2" data-track="whatsapp-click">
                  <Icon name="whatsapp" size={20} /> Open WhatsApp to send
                </a>
              )}
              <button type="button" className="btn-ghost mt-8" onClick={() => { setState("idle"); formRef.current?.reset(); }}>
                Send another inquiry
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-labelledby="inq-title"
          >
            <h2 id="inq-title" className="h3">Request a Quotation</h2>
            <p className="mt-2 text-muted">Tell us what you need and we will prepare a quotation for your business.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field id="fullName" label="Full name *" error={errors.fullName}>
                <input id="fullName" name="fullName" placeholder=" " autoComplete="name" required aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-err" : undefined} />
              </Field>
              <Field id="company" label="Company name *" error={errors.company}>
                <input id="company" name="company" placeholder=" " autoComplete="organization" required aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-err" : undefined} />
              </Field>
              <Field id="country" label="Country *" error={errors.country}>
                <input id="country" name="country" placeholder=" " autoComplete="country-name" required aria-invalid={!!errors.country} aria-describedby={errors.country ? "country-err" : undefined} />
              </Field>
              <Field id="email" label="Email address *" error={errors.email}>
                <input id="email" name="email" type="email" placeholder=" " autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
              </Field>
              <Field id="phone" label="Telephone / WhatsApp">
                <input id="phone" name="phone" type="tel" placeholder=" " autoComplete="tel" />
              </Field>
              <Field id="buyerType" label="Buyer type *" error={errors.buyerType}>
                <select id="buyerType" name="buyerType" defaultValue="" required aria-invalid={!!errors.buyerType} aria-describedby={errors.buyerType ? "buyerType-err" : undefined}>
                  <option value="" disabled hidden />
                  {buyerTypes.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* species of interest (from quote list) */}
            <fieldset className="mt-6">
              <legend className="mb-2 font-semibold text-ink">Species of interest</legend>
              <div className="rounded-2xl bg-alt p-3">
                <ul className="space-y-2">
                  <AnimatePresence initial={false}>
                    {items.map((q) => {
                      const s = bySlug(q.slug);
                      if (!s) return null;
                      return (
                        <motion.li
                          key={q.slug}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface px-4 py-2.5 shadow-sm"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">{s.commonName}</span>
                            <span className="block truncate text-xs italic text-muted">{s.scientificName}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <QtyStepper value={q.qty} label={s.commonName} onChange={(n) => setItem(q.slug, n)} />
                            <span className="text-xs font-semibold text-muted">pcs</span>
                            <button type="button" onClick={() => remove(q.slug)} aria-label={`Remove ${s.commonName}`} className="grid h-8 w-8 place-items-center rounded-full text-ink/70 hover:bg-ink/10">
                              <Icon name="close" size={16} strokeWidth={2.4} />
                            </button>
                          </span>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
                {items.length === 0 && <p className="px-2 py-1 text-sm text-muted">No species selected yet - choose below or browse the collection.</p>}
                {items.length > 0 && (
                  <p className="mt-3 flex justify-between px-2 text-sm font-semibold">
                    <span>Total (indicative)</span>
                    <span>{items.reduce((n, i) => n + i.qty, 0).toLocaleString("en-US")} pcs</span>
                  </p>
                )}
              </div>
              <label className="mt-3 block">
                <span className="sr-only">Add a species</span>
                <select
                  className="w-full rounded-full border-2 border-ink/15 bg-surface px-4 py-2.5 text-ink focus:border-aqua focus:outline-none focus:ring-4 focus:ring-aqua/20 sm:w-auto"
                  value=""
                  onChange={(e) => e.target.value && add(e.target.value, DEFAULT_QTY)}
                >
                  <option value="">+ Add a species...</option>
                  {available.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.commonName}</option>
                  ))}
                </select>
              </label>
            </fieldset>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="quantity" label="Other quantity notes (optional)">
                <input id="quantity" name="quantity" placeholder=" " />
              </Field>
              <Field id="destination" label="Shipping destination (city / airport)">
                <input id="destination" name="destination" placeholder=" " />
              </Field>
              <div className="sm:col-span-2">
                <Field id="message" label="Additional requirements / message">
                  <textarea id="message" name="message" placeholder=" " rows={5} />
                </Field>
              </div>
            </div>

            {/* honeypot - hidden from people, visible to bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {TURNSTILE_KEY && (
              <>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
                <div className="cf-turnstile mt-5" data-sitekey={TURNSTILE_KEY} />
              </>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <PrimaryCTA type="submit" disabled={state === "loading"} arrow={state !== "loading"}>
                {state === "loading" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex gap-1" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="block h-2.5 w-2.5 rounded-full bg-navy-900" style={{ animation: `float-y .9s ease-in-out ${i * 0.15}s infinite` }} />
                      ))}
                    </span>
                    Sending...
                  </span>
                ) : (
                  "Send Inquiry"
                )}
              </PrimaryCTA>
              <p className="text-sm text-muted">No payment is taken online.</p>
            </div>

            <div aria-live="assertive" className="mt-4">
              {state === "error" && (
                <p role="alert" className="rounded-2xl bg-[#fde8e5] p-4 font-medium text-[#8c2118]">
                  {message}
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
