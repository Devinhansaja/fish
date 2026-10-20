"use client";

import Image from "next/image";
import Link from "next/link";
import { type Species, availabilityLabel, categoryLabel } from "@/lib/species";
import { FishIllustration } from "../Underwater";
import { Icon } from "../Icon";
import { useState, useRef } from "react";
import { DEFAULT_QTY, useQuoteList } from "../InquiryList";
import { QuantityDialog } from "../QuantityDialog";
import { flyFishToQuote } from "@/lib/flyFish";

export function AvailabilityBadge({ value }: { value: Species["availability"] }) {
  const dot =
    value === "available" ? "bg-emerald-500" : value === "limited" ? "bg-sun" : value === "pending" ? "bg-slate-400" : "bg-aqua";
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy shadow">
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full ${dot}`} style={{ animation: "pulse-dot 2s ease-out infinite" }} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      {availabilityLabel[value]}
    </span>
  );
}

/** Photo if available, otherwise a clearly-labelled illustration. */
export function SpeciesVisual({ s, sizes, priority }: { s: Species; sizes: string; priority?: boolean }) {
  if (s.images[0]) {
    return (
      <Image
        src={s.images[0]}
        alt={`${s.commonName} (${s.scientificName})`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-110"
      />
    );
  }
  return (
    <div
      className="absolute inset-0 grid place-items-center overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0a4a6b 0%,#00b4c6 100%)" }}
      role="img"
      aria-label={`Illustration of ${s.commonName} - photograph coming soon`}
    >
      <div className="absolute inset-0 opacity-40" style={{ background: "var(--grad-glow)" }} />
      <div style={{ animation: "float-y 6s ease-in-out infinite" }} className="w-3/5 transition-transform duration-700 group-hover:scale-110">
        <FishIllustration color={s.accent === "#071a33" ? "#6fd8e3" : s.accent} fin="#ffffff" className="h-auto w-full drop-shadow-xl" />
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-navy/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white">
        Photo coming soon
      </span>
    </div>
  );
}

export function FishCard({ s, sizes = "(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" }: { s: Species; sizes?: string }) {
  const { has, qtyOf, setItem, add, remove } = useQuoteList();
  const inList = has(s.slug);
  const qty = qtyOf(s.slug);
  const [dialog, setDialog] = useState(false);
  const addBtn = useRef<HTMLButtonElement>(null);

  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <SpeciesVisual s={s} sizes={sizes} />
        <div className="absolute left-3 top-3 z-10">
          <AvailabilityBadge value={s.availability} />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-gradient-to-t from-navy-900 via-navy-900/85 to-transparent p-4 pt-12 text-sm text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <p className="line-clamp-3">{s.description}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-aqua-700">{categoryLabel(s.category)}</p>
        <h3 className="mt-1 text-xl font-bold">
          <Link href={`/fish-collection/${s.slug}`} className="text-ink no-underline after:absolute after:inset-0 after:content-['']" style={{ fontFamily: "var(--font-poppins)" }}>
            {s.commonName}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm italic text-muted">{s.scientificName}</p>
        <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 pt-1 sm:mt-auto">
          <Link
            href="/contact#inquiry"
            onClick={() => add(s.slug, DEFAULT_QTY)}
            className="inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-sm font-bold text-navy-900 no-underline transition hover:bg-coral-600"
            data-track="species-inquire"
          >
            Inquire <Icon name="arrow" size={15} strokeWidth={2.4} />
          </Link>
          <button
            ref={addBtn}
            type="button"
            onClick={() => setDialog(true)}
            aria-pressed={inList}
            aria-haspopup="dialog"
            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition ${inList ? "border-aqua bg-aqua/15 text-aqua-700" : "border-ink/20 text-ink hover:border-aqua"}`}
          >
            <Icon name={inList ? "check" : "plus"} size={15} strokeWidth={2.4} />
            {inList ? `In quote · ${qty.toLocaleString("en-US")} pcs` : "Add to quote"}
          </button>
        </div>
      </div>
      <QuantityDialog
        open={dialog}
        title={s.commonName}
        subtitle={s.scientificName}
        initialQty={inList ? qty : DEFAULT_QTY}
        editing={inList}
        onClose={() => setDialog(false)}
        onRemove={() => {
          remove(s.slug);
          setDialog(false);
        }}
        onConfirm={(q) => {
          if (!inList && addBtn.current) flyFishToQuote(addBtn.current);
          setItem(s.slug, q);
          setDialog(false);
        }}
      />
    </article>
  );
}

