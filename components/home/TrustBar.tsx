"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../Icon";
import { Stagger, StaggerItem } from "../Reveal";
import { stats, type Stat } from "@/lib/site";
import { useMotionPrefs } from "../MotionProvider";

const trust: { icon: IconName; label: string; note: string }[] = [
  { icon: "shield", label: "Government-Registered Exporter", note: "Licence details to be confirmed" },
  { icon: "microscope", label: "Fish Health & Quality Focus", note: "Strict health checks and grading" },
  { icon: "water", label: "Quarantine & Biosecurity Procedures", note: "Conditioning before dispatch" },
  { icon: "plane", label: "International Air Freight", note: "Rapid, time-sensitive routes" },
  { icon: "leaf", label: "Responsible Aquaculture", note: "Water-wise, community-minded" },
];

/** Animates only CONFIRMED values. Unconfirmed stats show "TBC" and never count up. */
export function AnimatedCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const { reduced } = useMotionPrefs();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || stat.value === null) return;
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setN(stat.value);
      return;
    }
    const c = animate(0, stat.value, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, stat.value, reduced]);

  if (stat.value === null) {
    return (
      <span ref={ref} className="font-heading text-3xl font-extrabold text-sun" style={{ fontFamily: "var(--font-poppins)" }}>
        TBC
      </span>
    );
  }
  return (
    <span ref={ref} className="font-heading text-4xl font-extrabold text-sun tabular-nums" style={{ fontFamily: "var(--font-poppins)" }}>
      {n}
      {stat.suffix}
    </span>
  );
}

export function TrustBar() {
  return (
    <section className="relative bg-mint pb-8 pt-4" aria-label="Company highlights">
      <div className="container-x">
        <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" gap={0.09}>
          {trust.map((t) => (
            <StaggerItem key={t.label}>
              <div className="card group relative flex h-full items-start gap-4 overflow-hidden p-5">
                <span className="shine pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true" />
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy text-aqua-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                  <Icon name={t.icon} size={24} style={{ animation: "float-y 5s ease-in-out infinite" }} />
                </span>
                <span>
                  <span className="block text-[0.95rem] font-bold leading-snug text-navy">{t.label}</span>
                  <span className="mt-1 block text-sm text-muted">{t.note}</span>
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="on-dark relative mt-8 overflow-hidden rounded-[2rem] bg-deep p-8 sm:p-10">
          <div className="absolute inset-0" style={{ background: "var(--grad-glow)" }} aria-hidden="true" />
          <dl className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse items-center text-center">
                <dt className="mt-1 text-sm font-medium text-white/85">
                  {s.label}
                  {s.value === null && <span className="draft-badge ml-2 align-middle">Pending</span>}
                </dt>
                <dd>
                  <AnimatedCounter stat={s} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
