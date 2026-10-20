"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type MouseEvent } from "react";
import { type Species, availabilityLabel, categoryLabel } from "@/lib/species";
import { AvailabilityBadge, SpeciesVisual } from "./FishCard";
import { Icon } from "../Icon";
import { DEFAULT_QTY, useQuoteList } from "../InquiryList";
import { QuantityDialog } from "../QuantityDialog";
import { flyFishToQuote } from "@/lib/flyFish";
import { PrimaryCTA } from "../ui";
import { Stagger, StaggerItem } from "../Reveal";
import { ease } from "@/lib/motion";

export function SpeciesGallery({ s }: { s: Species }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const imgs = s.images;

  if (!imgs.length) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
        <SpeciesVisual s={s} sizes="(min-width:1024px) 50vw, 100vw" priority />
      </div>
    );
  }

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div>
      <div
        className="relative aspect-[4/3] cursor-zoom-in touch-pan-y overflow-hidden rounded-3xl bg-navy shadow-xl"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        onTouchStart={(e) => setDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (dragStart === null) return;
          const dx = e.changedTouches[0].clientX - dragStart;
          if (Math.abs(dx) > 40) setI((p) => (p + (dx < 0 ? 1 : -1) + imgs.length) % imgs.length);
          setDragStart(null);
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={imgs[i]}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: ease.out }}
          >
            <Image
              src={imgs[i]}
              alt={`${s.commonName} - photo ${i + 1} of ${imgs.length}`}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              priority={i === 0}
              className="object-cover transition-transform duration-300 ease-out"
              style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {imgs.length > 1 && (
        <div className="mt-4 flex gap-3" role="group" aria-label="Photo thumbnails">
          {imgs.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show photo ${idx + 1}`}
              aria-current={idx === i}
              className={`relative h-20 w-28 overflow-hidden rounded-xl ring-4 transition ${idx === i ? "ring-aqua" : "opacity-70 ring-transparent hover:opacity-100"}`}
            >
              <Image src={src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SpeciesSpecs({ s }: { s: Species }) {
  const rows: [string, string][] = [
    ["Common name", s.commonName],
    ["Scientific name", s.scientificName],
    ["Category", categoryLabel(s.category)],
    ["Natural range", s.naturalRange],
    ["Adult size", s.adultSize],
    ["Water temperature", s.temperature],
    ["pH range", s.ph],
    ["Water hardness", s.hardness],
    ["Feeding", s.feeding],
    ["Colour varieties", s.colorVarieties],
    ["Availability", availabilityLabel[s.availability]],
  ];
  return (
    <div>
      <Stagger gap={0.06} className="overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm">
        {rows.map(([k, v], idx) => (
          <StaggerItem key={k} dir="fade">
            <div className={`grid gap-1 px-6 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 ${idx % 2 ? "bg-surface" : "bg-alt"}`}>
              <span className="text-sm font-bold uppercase tracking-wider text-aqua-700">{k}</span>
              <span className="text-ink">{v}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      {!s.careVerified && (
        <p className="mt-4 flex items-start gap-3 rounded-2xl bg-sun/30 p-4 text-sm text-ink">
          <span className="draft-badge shrink-0">Draft</span>
          Care and size information is a general reference range and has not yet been confirmed by Aquazone. Confirm
          specifications and availability in your quotation request.
        </p>
      )}
      {s.exportCheckRequired && (
        <p className="mt-3 flex items-start gap-3 rounded-2xl bg-aqua/10 p-4 text-sm text-ink">
          <span className="draft-badge shrink-0">Check</span>
          Native/endemic species are subject to legal export requirements. Export status will be confirmed before shipment.
        </p>
      )}
    </div>
  );
}

/** Sticky inquiry panel (desktop). Adds the species to the quote list and opens the form. */
export function SpeciesInquiryPanel({ s }: { s: Species }) {
  const { has, qtyOf, setItem, add, remove } = useQuoteList();
  const inList = has(s.slug);
  const qty = qtyOf(s.slug);
  const [dialog, setDialog] = useState(false);
  const addBtn = useRef<HTMLButtonElement>(null);
  return (
    <aside className="card p-6 lg:sticky lg:top-28" aria-label="Inquiry">
      <AvailabilityBadge value={s.availability} />
      <h2 className="mt-4 text-2xl">Interested in {s.commonName}?</h2>
      <p className="mt-2 text-muted">Request a quotation for this species, or build a consolidated list of several species.</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/contact#inquiry"
          onClick={() => add(s.slug, DEFAULT_QTY)}
          className="btn-cta justify-center no-underline"
          data-track="species-inquire"
        >
          Inquire About This Fish <Icon name="arrow" size={18} strokeWidth={2.2} />
        </Link>
        <button
          ref={addBtn}
          type="button"
          onClick={() => setDialog(true)}
          aria-pressed={inList}
          aria-haspopup="dialog"
          className={`inline-flex items-center justify-center gap-2 rounded-full border-2 px-5 py-3 font-semibold transition ${inList ? "border-aqua bg-aqua/15 text-aqua-700" : "border-ink/20 text-ink hover:border-aqua"}`}
        >
          <Icon name={inList ? "check" : "plus"} size={18} strokeWidth={2.4} />
          {inList ? `In your quote list · ${qty.toLocaleString("en-US")} pcs (edit)` : "Add to quote list"}
        </button>
      </div>
      <p className="mt-5 text-xs text-muted">No payment is taken online. Aquazone responds with a quotation.</p>
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
    </aside>
  );
}

export function SpeciesCTA() {
  return (
    <div className="text-center">
      <PrimaryCTA />
    </div>
  );
}


