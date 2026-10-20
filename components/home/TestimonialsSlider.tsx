"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { testimonials } from "@/lib/site";
import { ease } from "@/lib/motion";

export function TestimonialsSlider() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  return (
    <div className="mx-auto max-w-3xl text-center" role="region" aria-roledescription="carousel" aria-label="Customer testimonials">
      <div className="relative min-h-[15rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: ease.out }}
          >
            <svg viewBox="0 0 48 36" className="mx-auto mb-6 h-9 text-aqua" fill="currentColor" aria-hidden="true">
              <path d="M0 36V20C0 8 7 1 19 0v7c-6 1-9 5-9 10h9v19H0Zm28 0V20C28 8 35 1 47 0v7c-6 1-9 5-9 10h9v19H28Z" />
            </svg>
            <blockquote className="text-xl font-medium leading-relaxed text-ink sm:text-2xl">{t.quote}</blockquote>
            <figcaption className="mt-6">
              <span className="font-bold text-ink">{t.author}</span>
              <span className="mx-2 text-muted">-</span>
              <span className="text-muted">{t.role}</span>
              {t.draft && <span className="draft-badge ml-3">Draft placeholder</span>}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-center gap-3" role="group" aria-label="Choose testimonial">
        {testimonials.map((x, idx) => (
          <button
            key={x.id}
            type="button"
            aria-label={`Show testimonial ${idx + 1}`}
            aria-current={idx === i}
            onClick={() => setI(idx)}
            className="h-2.5 rounded-full bg-ink/25 transition-all duration-500"
            style={{ width: idx === i ? 32 : 10, background: idx === i ? "var(--aqua)" : undefined }}
          />
        ))}
      </div>
    </div>
  );
}
