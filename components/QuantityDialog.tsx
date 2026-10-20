"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { MAX_QTY, clampQty } from "./InquiryList";
import { ease } from "@/lib/motion";

const noop = () => () => {};

/** Quick quantity shortcuts for wholesale buyers (they can type any number). */
const presets = [10, 50, 100, 500, 1000];

/**
 * Asks "how many?" when a fish is added to the quote list.
 * Rendered in a portal so card overflow/transforms never clip it.
 */
export function QuantityDialog({
  open,
  title,
  subtitle,
  initialQty = 1,
  editing = false,
  onConfirm,
  onRemove,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  initialQty?: number;
  editing?: boolean;
  onConfirm: (qty: number) => void;
  onRemove?: () => void;
  onClose: () => void;
}) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [qty, setQty] = useState(String(initialQty));
  const input = useRef<HTMLInputElement>(null);
  const [wasOpen, setWasOpen] = useState(open);

  // reset the field each time the dialog opens (state adjusted during render, per React docs)
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQty(String(initialQty));
  }

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => input.current?.select(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const n = clampQty(Number(qty));
  const bump = (d: number) => setQty(String(clampQty((Number(qty) || 0) + d)));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(n);
  };

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] grid place-items-center bg-navy-900/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="qty-title"
            onSubmit={submit}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.35, ease: ease.out }}
            className="w-full max-w-sm rounded-3xl bg-surface p-6 text-ink shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p id="qty-title" className="text-xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
                  {title}
                </p>
                {subtitle && <p className="text-sm italic text-muted">{subtitle}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-ink/10">
                <Icon name="close" size={18} strokeWidth={2.4} />
              </button>
            </div>

            <label htmlFor="qty-input" className="mt-5 block text-sm font-bold uppercase tracking-wider text-aqua-700">
              Quantity (pieces)
            </label>
            <div className="mt-2 flex items-stretch gap-2">
              <button type="button" onClick={() => bump(-10)} aria-label="Decrease by 10" className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink/15 text-lg font-bold hover:border-aqua">
                &minus;
              </button>
              <input
                id="qty-input"
                ref={input}
                inputMode="numeric"
                type="number"
                min={1}
                max={MAX_QTY}
                step={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-ink/15 bg-alt text-center text-xl font-bold focus:border-aqua focus:outline-none focus:ring-4 focus:ring-aqua/20"
              />
              <button type="button" onClick={() => bump(10)} aria-label="Increase by 10" className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink/15 text-lg font-bold hover:border-aqua">
                +
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick quantities">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setQty(String(p))}
                  aria-pressed={n === p}
                  className={`rounded-full border-2 px-3.5 py-1 text-sm font-semibold transition ${n === p ? "border-aqua bg-aqua/15" : "border-ink/15 hover:border-aqua"}`}
                >
                  {p.toLocaleString("en-US")}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">Indicative quantity only - final quantities and prices are confirmed in your quotation.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" className="btn-cta flex-1 justify-center">
                {editing ? "Update quantity" : "Add to quote"}
              </button>
              {editing && onRemove && (
                <button type="button" onClick={onRemove} className="rounded-full px-4 py-3 font-semibold text-[#a82a20] hover:bg-[#fde8e5]">
                  Remove
                </button>
              )}
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
