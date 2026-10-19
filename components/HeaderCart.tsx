"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useQuoteList } from "./InquiryList";
import { QtyStepper } from "./QtyStepper";
import type { Species } from "@/lib/species";
import { useSpecies } from "./SpeciesProvider";
import { QUOTE_BUMP_EVENT } from "@/lib/flyFish";
import { ease } from "@/lib/motion";

/** Header "cart" = the buyer's quote list. Click to review, remove or send the quote request. */
export function HeaderCart() {
  const { items: quote, list, remove, clear, setItem } = useQuoteList();
  const { bySlug } = useSpecies();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const items = quote
    .map((q) => ({ s: bySlug(q.slug), qty: q.qty }))
    .filter((x): x is { s: Species; qty: number } => !!x.s);
  const totalPcs = items.reduce((n, x) => n + x.qty, 0);

  // bump when a swimming fish arrives
  useEffect(() => {
    const bump = () => {
      document.getElementById("quote-cart")?.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.28) rotate(-6deg)" },
          { transform: "scale(0.94) rotate(3deg)" },
          { transform: "scale(1)" },
        ],
        { duration: 520, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    };
    window.addEventListener(QUOTE_BUMP_EVENT, bump);
    return () => window.removeEventListener(QUOTE_BUMP_EVENT, bump);
  }, []);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        id="quote-cart"
        type="button"
        aria-expanded={open}
        aria-controls="quote-cart-panel"
        aria-label={`Quote list, ${list.length} selected`}
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white/10 sm:h-11 sm:w-11"
      >
        <Icon name="cart" size={22} />
        <AnimatePresence>
          {list.length > 0 && (
            <motion.span
              key={list.length}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-sun px-1 text-[0.7rem] font-extrabold text-navy"
            >
              {list.length}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="quote-cart-panel"
            role="dialog"
            aria-label="Your quote list"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.3, ease: ease.out }}
            className="absolute right-0 top-full z-50 mt-3 w-[min(92vw,22rem)] origin-top-right rounded-3xl bg-white p-5 text-navy shadow-2xl ring-1 ring-navy/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
                Your quote list
              </p>
              {items.length > 0 && (
                <button type="button" onClick={clear} className="text-sm font-semibold text-aqua-700 hover:underline">
                  Clear all
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-muted">No fish selected yet.</p>
                <Link href="/fish-collection" onClick={() => setOpen(false)} className="link-aqua mt-2 inline-block">
                  Browse the fish collection
                </Link>
              </div>
            ) : (
              <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {items.map(({ s, qty }) => (
                    <motion.li
                      key={s.slug}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="rounded-2xl bg-mint px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{s.commonName}</span>
                          <span className="block truncate text-xs italic text-muted">{s.scientificName}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(s.slug)}
                          aria-label={`Remove ${s.commonName}`}
                          className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-navy/70 hover:bg-navy/10"
                        >
                          <Icon name="close" size={16} strokeWidth={2.4} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QtyStepper value={qty} label={s.commonName} onChange={(n) => setItem(s.slug, n)} />
                        <span className="text-xs font-semibold text-muted">pcs</span>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {items.length > 0 && (
              <p className="mt-3 flex justify-between text-sm font-semibold">
                <span>Total (indicative)</span>
                <span>{totalPcs.toLocaleString("en-US")} pcs</span>
              </p>
            )}

            <Link
              href="/contact#inquiry"
              onClick={() => setOpen(false)}
              className="btn-cta mt-4 w-full no-underline"
              data-track="cart-quote-cta"
            >
              Request Quotation{items.length ? ` (${items.length})` : ""}
              <Icon name="arrow" size={18} strokeWidth={2.2} />
            </Link>
            <p className="mt-3 text-center text-xs text-muted">No payment is taken online.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

