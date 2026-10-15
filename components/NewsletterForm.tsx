"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), website: data.get("website") }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Subscription failed");
      setState("ok");
      setMsg(json.message ?? "Thank you - you are subscribed.");
      form.reset();
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-sm" aria-describedby="nl-status">
      <label htmlFor="nl-email" className="mb-2 block text-sm font-semibold text-white">
        Newsletter
      </label>
      <div className="group flex overflow-hidden rounded-full border border-white/30 bg-white/5 focus-within:border-aqua-300">
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/60 focus:outline-none"
        />
        {/* honeypot */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={state === "loading"}
          className="relative overflow-hidden bg-white px-5 text-sm font-bold text-navy transition-colors duration-300 hover:bg-aqua-300 disabled:opacity-60"
        >
          {state === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      <p id="nl-status" role="status" className={`mt-2 min-h-5 text-sm ${state === "error" ? "text-sun" : "text-aqua-300"}`}>
        {state === "ok" || state === "error" ? msg : ""}
      </p>
    </form>
  );
}
