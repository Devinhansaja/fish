"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { ease } from "@/lib/motion";

// Module-level flag: false on the server and on the first client render, true after any
// in-app navigation. The wave wipe therefore only plays between pages, never on first load.
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const [wipe] = useState(hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <>
      {wipe && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[250]"
          initial={{ y: "0%" }}
          animate={{ y: "-105%" }}
          transition={{ duration: 0.7, ease: ease.inOut }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-700 to-aqua" />
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="absolute left-0 top-full h-16 w-full">
            <path d="M0 0H1200V30C1000 80 800 0 600 40S200 80 0 30Z" fill="#00b4c6" />
          </svg>
        </motion.div>
      )}
      <motion.div
        initial={wipe ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: wipe ? 0.25 : 0, ease: ease.out }}
      >
        {children}
      </motion.div>
    </>
  );
}
