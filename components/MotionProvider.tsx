"use client";

import { MotionConfig } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const KEY = "aqz-reduce-motion";
const listeners = new Set<() => void>();

function readManual() {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
function subscribeManual(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function writeManual(v: boolean) {
  try {
    window.localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

const mq = "(prefers-reduced-motion: reduce)";
function subscribeOS(cb: () => void) {
  const m = window.matchMedia(mq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

type Ctx = { reduced: boolean; manual: boolean; setManual: (v: boolean) => void };
const MotionCtx = createContext<Ctx>({ reduced: false, manual: false, setManual: () => {} });

export function MotionProvider({ children }: { children: ReactNode }) {
  const os = useSyncExternalStore(subscribeOS, () => window.matchMedia(mq).matches, () => false);
  const manual = useSyncExternalStore(subscribeManual, readManual, () => false);
  const reduced = os || manual;

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduced);
  }, [reduced]);

  const setManual = useCallback((v: boolean) => writeManual(v), []);
  const value = useMemo(() => ({ reduced, manual, setManual }), [reduced, manual, setManual]);

  return (
    <MotionCtx.Provider value={value}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
    </MotionCtx.Provider>
  );
}

export const useMotionPrefs = () => useContext(MotionCtx);
