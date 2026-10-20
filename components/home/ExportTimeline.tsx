"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { exportSteps } from "@/lib/content";
import { SwimFish } from "../SwimFish";
import { Stagger, StaggerItem } from "../Reveal";

/** Real farm photo for each step (keyed by the step's `icon` in lib/content.ts). */
const stepPhotos: Record<string, { src: string; alt: string }> = {
  fish: { src: "/images/tank-hall-b.jpg", alt: "Multi-level glass tank racks used for breeding and conditioning" },
  shield: { src: "/images/tank-hall-a.jpg", alt: "A worker inspecting rows of glass aquariums" },
  grade: { src: "/images/grading-fry.jpg", alt: "A worker hand-grading young fish in a tank" },
  bag: { src: "/images/oxygen-packing.jpg", alt: "Clear packing bags floating in a tank before oxygen packing" },
  plane: { src: "/images/packing-station.jpg", alt: "Workers at the packing station preparing bags for dispatch" },
};

function StepPhoto({ name }: { name: (typeof exportSteps)[number]["icon"] }) {
  const photo = stepPhotos[name] ?? stepPhotos.plane;
  return (
    <div className="relative aspect-[4/3] w-full max-w-[11rem] overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/25">
      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:768px) 12vw, 45vw" className="object-cover" />
    </div>
  );
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
        <motion.div className="absolute -top-6 w-16 -translate-x-1/2" style={{ left: fishLeft }}>
          <SwimFish kind="clown" heading="right" className="drop-shadow-lg" />
        </motion.div>
      </div>
      {/* connector - mobile (vertical) */}
      <div className="absolute bottom-6 left-[2.25rem] top-6 w-1 rounded-full bg-white/15 md:hidden" aria-hidden="true">
        <motion.div className="h-full origin-top rounded-full bg-gradient-to-b from-aqua-300 to-sun" style={{ scaleY: progress }} />
        <motion.div className="absolute -left-6 w-16 -translate-y-1/2 rotate-90" style={{ top: fishTop }}>
          <SwimFish kind="clown" heading="right" />
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
                            : "border-ink/20 bg-surface text-ink"
                      }`}
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {s.n}
                    </span>
                  </div>
                  <div className="md:mt-4">
                    <div className="mb-3 flex md:justify-center">
                      <StepPhoto name={s.icon} />
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

