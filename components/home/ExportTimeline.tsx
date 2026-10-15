"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { exportSteps } from "@/lib/content";
import { FishIllustration } from "../Underwater";
import { Stagger, StaggerItem } from "../Reveal";

/** Small looping illustrations, one per step. Decorative (aria-hidden). */
function StepArt({ name }: { name: (typeof exportSteps)[number]["icon"] }) {
  const common = "h-24 w-24";
  switch (name) {
    case "fish": // breeding / hatching
      return (
        <svg viewBox="0 0 96 96" className={common} aria-hidden="true">
          <ellipse cx="48" cy="56" rx="22" ry="26" fill="#eefffc" opacity=".9" style={{ animation: "inflate 3.4s ease-in-out infinite", transformOrigin: "48px 56px" }} />
          <g style={{ animation: "float-y 4s ease-in-out infinite" }}>
            <foreignObject x="26" y="40" width="46" height="30">
              <FishIllustration color="#ffd166" fin="#ff7b63" className="h-full w-full" />
            </foreignObject>
          </g>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={30 + i * 18} cy="82" r="3" fill="#6fd8e3" style={{ animation: `bubble-rise 3s linear ${i * 0.8}s infinite`, ["--b-op" as string]: 0.8 }} />
          ))}
        </svg>
      );
    case "shield": // quarantine / inspection
      return (
        <svg viewBox="0 0 96 96" className={common} aria-hidden="true">
          <circle cx="42" cy="42" r="22" fill="none" stroke="#6fd8e3" strokeWidth="5" />
          <path d="m58 58 18 18" stroke="#6fd8e3" strokeWidth="7" strokeLinecap="round" />
          <g style={{ animation: "float-y 3s ease-in-out infinite" }}>
            <foreignObject x="28" y="34" width="28" height="18">
              <FishIllustration color="#ff7b63" fin="#ffd166" className="h-full w-full" />
            </foreignObject>
          </g>
          <rect x="22" y="40" width="40" height="3" rx="1.5" fill="#00b4c6" opacity=".7" style={{ animation: "float-y 2.2s ease-in-out infinite" }} />
        </svg>
      );
    case "grade": // sieve / sizes
      return (
        <svg viewBox="0 0 96 96" className={common} aria-hidden="true">
          <path d="M14 22h68L58 52v22l-20 8V52L14 22Z" fill="none" stroke="#6fd8e3" strokeWidth="5" strokeLinejoin="round" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={34 + i * 14} cy={14} r={3 + i * 1.5} fill="#ffd166" style={{ animation: `drop-fall 2.4s ease-in ${i * 0.5}s infinite` }} />
          ))}
        </svg>
      );
    case "bag": // oxygen bag inflating
      return (
        <svg viewBox="0 0 96 96" className={common} aria-hidden="true">
          <g style={{ animation: "inflate 3s ease-in-out infinite", transformOrigin: "48px 56px" }}>
            <path d="M32 14h32l4 14c6 5 10 12 10 20 0 17-14 32-30 32S18 65 18 48c0-8 4-15 10-20l4-14Z" fill="#6fd8e3" fillOpacity=".35" stroke="#6fd8e3" strokeWidth="4" strokeLinejoin="round" />
            <foreignObject x="30" y="46" width="36" height="22">
              <FishIllustration color="#ffd166" fin="#ff7b63" className="h-full w-full" />
            </foreignObject>
          </g>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={36 + i * 8} cy="70" r="2.4" fill="#fff" style={{ animation: `bubble-rise 2.6s linear ${i * 0.55}s infinite`, ["--b-op" as string]: 0.9 }} />
          ))}
        </svg>
      );
    default: // plane
      return (
        <svg viewBox="0 0 96 96" className={common} aria-hidden="true">
          <path id="plane-path" d="M8 78 Q 48 10 88 30" fill="none" stroke="#6fd8e3" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" style={{ animation: "dash-flow 1.2s linear infinite" }} />
          <path d="M0 -8 L6 8 L0 4 L-6 8 Z" fill="#ffd166" transform="rotate(90)">
            <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
              <mpath href="#plane-path" />
            </animateMotion>
          </path>
        </svg>
      );
  }
}

export function ExportTimeline({ dark = true }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [active, setActive] = useState(-1);
  const fishLeft = useTransform(progress, [0, 1], ["0%", "100%"]);
  const fishTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.min(exportSteps.length - 1, Math.floor(v * (exportSteps.length - 0.0001) + 0.05));
    setActive(v <= 0.001 ? -1 : idx);
  });

  return (
    <div ref={ref} className="relative">
      {/* connector - desktop (horizontal) */}
      <div className="absolute left-[10%] right-[10%] top-[2.25rem] hidden h-1 rounded-full bg-white/15 md:block" aria-hidden="true">
        <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-aqua-300 to-sun" style={{ scaleX: progress }} />
        <motion.div className="absolute -top-3.5 w-12 -translate-x-1/2" style={{ left: fishLeft }}>
          <FishIllustration color="#ffd166" fin="#ff7b63" className="h-auto w-full drop-shadow-lg" />
        </motion.div>
      </div>
      {/* connector - mobile (vertical) */}
      <div className="absolute bottom-6 left-[2.25rem] top-6 w-1 rounded-full bg-white/15 md:hidden" aria-hidden="true">
        <motion.div className="h-full origin-top rounded-full bg-gradient-to-b from-aqua-300 to-sun" style={{ scaleY: progress }} />
        <motion.div className="absolute -left-3.5 w-12 -translate-y-1/2 rotate-90" style={{ top: fishTop }}>
          <FishIllustration color="#ffd166" fin="#ff7b63" className="h-auto w-full" />
        </motion.div>
      </div>

      <Stagger className="relative grid gap-10 md:grid-cols-5 md:gap-5" gap={0.14}>
        {exportSteps.map((s, i) => {
          const on = i <= active;
          return (
            <StaggerItem key={s.n}>
              <div>
                <div className="flex gap-5 md:flex-col md:items-center md:text-center">
                  <div className="relative z-10 grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center">
                    {on && (
                      <span
                        className="absolute inset-0 rounded-full bg-sun/60"
                        style={{ animation: "pulse-dot 1.4s ease-out 1", ["--x" as string]: 0 }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border-4 text-lg font-extrabold transition-all duration-700 ${
                        on
                          ? "scale-105 border-sun bg-aqua text-navy-900"
                          : dark
                            ? "border-white/25 bg-navy-900 text-white"
                            : "border-navy/20 bg-white text-navy"
                      }`}
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {s.n}
                    </span>
                  </div>
                  <div className="md:mt-4">
                    <div className="mb-3 hidden justify-center md:flex">
                      <StepArt name={s.icon} />
                    </div>
                    <h3 className={`text-xl ${dark ? "text-white" : ""}`}>{s.title}</h3>
                    <p className={`mt-2 text-[0.95rem] ${dark ? "text-white/80" : "text-muted"}`}>{s.body}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

