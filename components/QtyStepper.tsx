"use client";

import { useState } from "react";
import { MAX_QTY, clampQty } from "./InquiryList";

/** Compact − [number] + control. Typing is committed on blur/Enter so partial input never clobbers the value. */
export function QtyStepper({
  value,
  onChange,
  label,
  className = "",
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  className?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft !== null) onChange(clampQty(Number(draft)));
    setDraft(null);
  };
  const step = (d: number) => onChange(clampQty(value + d));
  const btn =
    "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-navy/20 text-base font-bold text-navy transition hover:border-aqua hover:bg-aqua/10";
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className={btn} aria-label={`Decrease ${label}`} onClick={() => step(value > 10 ? -10 : -1)}>
        &minus;
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QTY}
        value={draft ?? value}
        aria-label={`${label} quantity in pieces`}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className="h-8 w-16 rounded-lg border border-navy/20 bg-white text-center text-sm font-bold text-navy focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={btn} aria-label={`Increase ${label}`} onClick={() => step(value >= 10 ? 10 : 1)}>
        +
      </button>
    </div>
  );
}
