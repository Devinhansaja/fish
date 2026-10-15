"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

/** Wraps the article body and shows a reading-progress bar just under the header. */
export function ReadingProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end 70%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return (
    <>
      <motion.div aria-hidden="true" className="fixed inset-x-0 top-[3px] z-[65] h-1 origin-left bg-aqua" style={{ scaleX }} />
      <div ref={ref}>{children}</div>
    </>
  );
}
