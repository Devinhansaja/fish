"use client";

import { motion } from "framer-motion";
import { Icon } from "./Icon";
import { ease } from "@/lib/motion";

/** Checklist whose tick-marks draw themselves one after another when scrolled into view. */
export function QualityChecklist({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <motion.ul
      className="space-y-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
    >
      {items.map((t) => (
        <motion.li
          key={t}
          className="flex items-center gap-4"
          variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: ease.out } } }}
        >
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${dark ? "bg-aqua/25" : "bg-aqua/20"}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={dark ? "#6fd8e3" : "#00717f"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <motion.path
                d="m5 12.500 5 5L19.500 7"
                variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.5, delay: 0.15 } } }}
              />
            </svg>
          </span>
          <span className="font-medium">{t}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/**
 * Water-quality dashboard illustration. Values are DEMONSTRATION values,
 * not live or measured Aquazone data - labelled as such in the UI.
 */
export function WaterQualityDashboard() {
  const gauges = [
    { label: "Temperature", unit: "degC", value: 26, min: 18, max: 34, icon: "thermo" as const },
    { label: "pH", unit: "", value: 7.2, min: 5, max: 9, icon: "ph" as const },
    { label: "Dissolved oxygen", unit: "mg/L", value: 7.5, min: 0, max: 12, icon: "oxygen" as const },
  ];
  return (
    <div className="on-dark relative overflow-hidden rounded-[2rem] bg-deep p-6 sm:p-8">
      <div className="absolute inset-0" style={{ background: "var(--grad-glow)" }} aria-hidden="true" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl text-white">Water-quality monitoring</h3>
        <span className="draft-badge">Demonstration values</span>
      </div>
      <div className="relative mt-6 grid gap-5 sm:grid-cols-3">
        {gauges.map((g, i) => {
          const frac = (g.value - g.min) / (g.max - g.min);
          const angle = -90 + frac * 180;
          const R = 54;
          const C = Math.PI * R;
          return (
            <div key={g.label} className="glass p-5 text-center">
              <svg viewBox="0 0 140 90" className="mx-auto w-full max-w-[11rem]" role="img" aria-label={`${g.label} gauge showing demonstration value ${g.value} ${g.unit}`}>
                <path d="M16 74a54 54 0 0 1 108 0" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="11" strokeLinecap="round" />
                <motion.path
                  d="M16 74a54 54 0 0 1 108 0"
                  fill="none"
                  stroke="url(#gg)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  whileInView={{ strokeDashoffset: C * (1 - frac) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: i * 0.2, ease: ease.out }}
                />
                <defs>
                  <linearGradient id="gg" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#6fd8e3" />
                    <stop offset="1" stopColor="#ffd166" />
                  </linearGradient>
                </defs>
                <g style={{ transformOrigin: "70px 74px", transform: `rotate(${angle}deg)` }}>
                  <g style={{ transformOrigin: "70px 74px", animation: "gauge-wobble 4s ease-in-out infinite" }}>
                    <line x1="70" y1="74" x2="70" y2="30" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </g>
                </g>
                <circle cx="70" cy="74" r="6" fill="#ff7b63" />
              </svg>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-white/85">
                <Icon name={g.icon} size={16} /> {g.label}
              </p>
              <p className="text-2xl font-extrabold text-sun" style={{ fontFamily: "var(--font-poppins)" }}>
                {g.value}
                <span className="ml-1 text-sm font-medium text-white/70">{g.unit}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
