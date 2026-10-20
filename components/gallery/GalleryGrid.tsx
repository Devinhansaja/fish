"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { gallery, galleryCategories, type GalleryCategory } from "@/lib/content";
import { Icon } from "../Icon";
import { ease } from "@/lib/motion";

const ratios = ["aspect-[4/3]", "aspect-[4/5]", "aspect-[16/10]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"];

export function GalleryGrid() {
  const [cat, setCat] = useState<GalleryCategory | "All">("All");
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const items = cat === "All" ? gallery : gallery.filter((g) => g.category === cat);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open !== null ? items[open] : null;

  return (
    <div>
      <LayoutGroup id="gallery-filters">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Gallery categories">
          {(["All", ...galleryCategories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`relative rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${cat === c ? "border-navy text-white" : "border-ink/15 text-ink hover:border-aqua"}`}
            >
              {cat === c && <motion.span layoutId="gal-pill" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <p className="mt-4 text-sm text-muted" role="status" aria-live="polite">
        {items.length} photos
      </p>

      <div key={cat} className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((g, i) => (
          <motion.figure
            key={g.id}
            className="group mb-5 break-inside-avoid"
            initial={{ clipPath: "inset(100% 0 0 0 round 1.25rem)", opacity: 0.4 }}
            whileInView={{ clipPath: "inset(0% 0 0 0 round 1.25rem)", opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: ease.out }}
          >
            <button
              type="button"
              data-cursor="View"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              className={`relative block w-full overflow-hidden rounded-[1.25rem] bg-navy ${ratios[i % ratios.length]}`}
              aria-label={`Open photo: ${g.caption}`}
            >
              <motion.div layoutId={`gal-${g.id}`} className="absolute inset-0">
                <Image src={g.src} alt={g.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-110" />
              </motion.div>
              <span className="absolute inset-0 grid place-items-center bg-navy/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-aqua text-navy-900 transition-transform duration-500 group-hover:rotate-90">
                  <Icon name="plus" size={26} strokeWidth={2.4} />
                </span>
              </span>
            </button>
            <figcaption className="mt-2 px-1 text-sm text-muted">{g.caption}</figcaption>
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo viewer: ${current.caption}`}
            className="on-dark fixed inset-0 z-[400] flex flex-col bg-navy-900/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="flex items-center justify-between p-4 text-white">
              <p className="px-2 text-sm font-semibold">
                {open! + 1} / {items.length} - {current.caption}
              </p>
              <button
                type="button"
                autoFocus
                onClick={close}
                aria-label="Close photo viewer"
                className="grid h-12 w-12 place-items-center rounded-full border border-white/30 hover:bg-white/10"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16" onClick={(e) => e.stopPropagation()}>
              <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-navy/50 text-white hover:bg-white/15 sm:left-5">
                <Icon name="arrow" size={22} style={{ transform: "scaleX(-1)" }} />
              </button>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  layoutId={`gal-${current.id}`}
                  className="relative h-full max-h-[78vh] w-full max-w-6xl overflow-hidden rounded-2xl"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) step(1);
                    else if (info.offset.x > 80) step(-1);
                  }}
                  transition={{ duration: 0.5, ease: ease.out }}
                >
                  <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" priority />
                </motion.div>
              </AnimatePresence>
              <button type="button" aria-label="Next photo" onClick={() => step(1)} className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-navy/50 text-white hover:bg-white/15 sm:right-5">
                <Icon name="arrow" size={22} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
