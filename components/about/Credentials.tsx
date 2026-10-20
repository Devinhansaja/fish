"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import { Stagger, StaggerItem } from "../Reveal";

type Credential = {
  id: string;
  title: string;
  issuer: string;
  src: string;
  alt: string;
  facts: { label: string; value: string }[];
};

/** Details read from the supplied certificate scans. Keep in sync with the originals. */
const credentials: Credential[] = [
  {
    id: "incorporation",
    title: "Certificate of Incorporation",
    issuer: "Registrar General of Companies, Sri Lanka",
    src: "/certificates/certificate-of-incorporation.jpg",
    alt: "Certificate of Incorporation of a Private Company for Aquazone Ornamental Fish Farm (Private) Limited",
    facts: [
      { label: "Company number", value: "PV 00204034" },
      { label: "Incorporated", value: "9 September 2018" },
      { label: "Registered as", value: "Aquazone Ornamental Fish Farm (Private) Limited" },
    ],
  },
  {
    id: "aquaculture",
    title: "Aquaculture Management Licence",
    issuer: "National Aquaculture Development Authority of Sri Lanka (NAQDA)",
    src: "/certificates/aquaculture-management-licence.jpg",
    alt: "Aquaculture Management Licence issued by NAQDA to Aquazone Ornamental Fish Farm",
    facts: [
      { label: "Licence no.", value: "AQSL 23567" },
      { label: "Valid", value: "1 January 2026 - 31 December 2026" },
      { label: "Premises", value: "222/1, Nelawa, Kohilegedara" },
    ],
  },
  {
    id: "environmental",
    title: "Environmental Protection Licence",
    issuer: "Provincial Environmental Authority, North Western Province",
    src: "/certificates/environmental-protection-licence.jpg",
    alt: "Environmental Protection Licence issued to Aquazone Ornamental Fish Farm",
    facts: [
      { label: "Licence no.", value: "20907" },
      { label: "Valid", value: "10 June 2026 - 9 June 2027" },
      { label: "Premises", value: "222/1, Nelawa, Kohilegedara" },
    ],
  },
];

export function Credentials() {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + credentials.length) % credentials.length)), []);

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

  const current = open !== null ? credentials[open] : null;

  return (
    <>
      <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
        {credentials.map((c, i) => (
          <StaggerItem key={c.id}>
            <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
              <button
                type="button"
                data-cursor="View"
                aria-label={`View certificate: ${c.title}`}
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setOpen(i);
                }}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-navy"
              >
                <Image src={c.src} alt={c.alt} fill sizes="(min-width:768px) 30vw, 90vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 grid place-items-center bg-navy/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-aqua text-navy-900">
                    <Icon name="plus" size={26} strokeWidth={2.4} />
                  </span>
                </span>
              </button>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl">{c.title}</h3>
                <p className="mt-1 text-sm text-muted">{c.issuer}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  {c.facts.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{f.label}</dt>
                      <dd className="font-semibold text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence>
        {current && (
          <motion.div
            key="cert-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={`Certificate viewer: ${current.title}`}
            className="on-dark fixed inset-0 z-[400] flex flex-col bg-navy-900/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="flex items-center justify-between p-4 text-white">
              <p className="px-2 text-sm font-semibold">
                {open! + 1} / {credentials.length} - {current.title}
              </p>
              <button type="button" autoFocus onClick={close} aria-label="Close certificate viewer" className="grid h-12 w-12 place-items-center rounded-full border border-white/30 hover:bg-white/10">
                <Icon name="close" size={22} />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16" onClick={(e) => e.stopPropagation()}>
              <button type="button" aria-label="Previous certificate" onClick={() => step(-1)} className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-navy/50 text-white hover:bg-white/15 sm:left-5">
                <Icon name="arrow" size={22} style={{ transform: "scaleX(-1)" }} />
              </button>
              <div className="relative h-full max-h-[82vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white/5">
                <Image key={current.id} src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" priority />
              </div>
              <button type="button" aria-label="Next certificate" onClick={() => step(1)} className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-navy/50 text-white hover:bg-white/15 sm:right-5">
                <Icon name="arrow" size={22} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
