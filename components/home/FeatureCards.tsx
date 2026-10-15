"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Icon } from "../Icon";
import { Stagger, StaggerItem } from "../Reveal";
import { coreValues } from "@/lib/content";
import { useMotionPrefs } from "../MotionProvider";

function TiltCard({ title, body, icon }: { title: string; body: string; icon: (typeof coreValues)[number]["icon"] }) {
  const { reduced } = useMotionPrefs();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(circle at ${useTransform(mx, (v) => v * 100)}% ${useTransform(my, (v) => v * 100)}%, rgba(255,255,255,.55), transparent 55%)`;

  return (
    <motion.div
      className="group relative h-full [perspective:900px]"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      <motion.div
        className="card relative h-full overflow-hidden p-7 transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift)]"
        style={{ rotateX: reduced ? 0 : rx, rotateY: reduced ? 0 : ry, transformStyle: "preserve-3d" }}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-60" style={{ background: glare }} aria-hidden="true" />
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-navy text-aqua-300 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110">
          <Icon name={icon} size={28} />
        </span>
        <h3 className="relative mt-6 text-xl">{title}</h3>
        <p className="relative mt-3 text-muted">{body}</p>
        {/* floating bubbles from the bottom edge on hover */}
        <span aria-hidden="true" className="motion-decor pointer-events-none absolute bottom-0 left-0 right-0 h-24 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {[12, 34, 58, 80].map((l, i) => (
            <span
              key={l}
              className="absolute bottom-0 block rounded-full border border-aqua/50 bg-aqua/15"
              style={{ left: `${l}%`, width: 8 + i * 3, height: 8 + i * 3, animation: `bubble-rise ${3 + i * 0.7}s linear ${i * 0.5}s infinite`, ["--b-op" as string]: 0.9 }}
            />
          ))}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function FeatureCards() {
  return (
    <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.12}>
      {coreValues.map((v) => (
        <StaggerItem key={v.title} dir="scale">
          <TiltCard {...v} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
