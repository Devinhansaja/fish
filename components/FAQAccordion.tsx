"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import type { Faq } from "@/lib/content";
import { ease } from "@/lib/motion";

export function FAQAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={f.q} className="relative overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm">
            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-0 w-1 origin-top bg-aqua"
              initial={false}
              animate={{ scaleY: isOpen ? 1 : 0, height: "100%" }}
              transition={{ duration: 0.5, ease: ease.out }}
            />
            <h3 className="text-base">
              <button
                type="button"
                id={`${id}-btn`}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-ink"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                <span>{f.q}</span>
                <motion.span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-aqua/15 text-aqua-700"
                  animate={{ rotate: isOpen ? 135 : 0 }}
                  transition={{ duration: 0.4, ease: ease.out }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={`${id}-btn`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: ease.out }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-muted">
                    {f.a}
                    {f.draft && <span className="draft-badge ml-2 align-middle">Policy to confirm</span>}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
