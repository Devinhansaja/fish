"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

type Dir = "up" | "left" | "right" | "scale" | "fade";

const offsets: Record<Dir, { x?: number; y?: number; scale?: number }> = {
  up: { y: 40 },
  left: { x: -48 },
  right: { x: 48 },
  scale: { scale: 0.92 },
  fade: {},
};

/** Scroll-reveal wrapper. Triggers when ~85% of the element's top enters the viewport. */
export function Reveal({
  children,
  dir = "up",
  delay = 0,
  className,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  dir?: Dir;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
  once?: boolean;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offsets[dir] },
    show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.75, delay, ease: ease.out } },
  };
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "0px 0px -15% 0px" }}
    >
      {children}
    </M>
  );
}

/** Staggered container: children should be <StaggerItem>. */
export function Stagger({
  children,
  className,
  gap = 0.1,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  dir = "up",
}: {
  children: ReactNode;
  className?: string;
  dir?: Dir;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offsets[dir] },
        show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.7, ease: ease.out } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Image/card reveal using a bottom-to-top "water fill" clip-path. */
export function WaterReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0% round 1.5rem)", opacity: 0.6 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.5rem)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word headline reveal. */
export function SplitWords({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3";
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", filter: "blur(6px)" }}
            animate={{ y: "0%", filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: delay + i * 0.07, ease: ease.out }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
