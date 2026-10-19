"use client";

import { useId, useState, type FormEvent } from "react";
import { Icon } from "./Icon";

/** "Tell me when it launches" e-mail capture for the coming-soon pages. */
export function NotifyForm({ topic }: { topic: "plants" | "accessories" }) {
  const id = useId();
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
        body: JSON.stringify({ email: data.get("email"), website: data.get("website"), topic }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Sign-up failed");
      setState("ok");
      setMsg(json.message ?? "Thank you.");
      form.reset();
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (state === "ok") {
    return (
      <p role="status" className="flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-4 font-semibold text-white">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-aqua text-navy-900">
          <Icon name="check" size={18} strokeWidth={3} />
        </span>
        {msg}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={`${id}-status`}>
      <label htmlFor={`${id}-email`} className="sr-only">
        Your email address
      </label>
      <div className="flex max-w-lg flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className="min-w-0 flex-1 rounded-full border-2 border-white/30 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/65 focus:border-aqua-300 focus:outline-none focus:ring-4 focus:ring-aqua/25"
        />
        {/* honeypot */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={state === "loading"} className="btn-cta justify-center">
          {state === "loading" ? "Sending..." : "Notify me"}
        </button>
      </div>
      <p id={`${id}-status`} role="status" className={`mt-3 min-h-5 text-sm ${state === "error" ? "font-semibold text-sun" : "text-white/70"}`}>
        {state === "error" ? msg : "No spam - one email when it launches."}
      </p>
    </form>
  );
}
