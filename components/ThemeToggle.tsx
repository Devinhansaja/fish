"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Icon } from "./Icon";

/**
 * Light / dark mode.
 *
 * - The first visit follows the visitor's device setting (prefers-color-scheme).
 * - The sun/moon button switches modes and the choice is remembered (localStorage "aqz-theme").
 * - A tiny inline script in the root layout sets data-theme before paint so there is no flash.
 */
type Theme = "light" | "dark";
const KEY = "aqz-theme";
const listeners = new Set<() => void>();

function current(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function apply(t: Theme, remember: boolean) {
  document.documentElement.dataset.theme = t;
  if (remember) {
    try {
      window.localStorage.setItem(KEY, t);
    } catch {
      /* storage unavailable */
    }
  }
  listeners.forEach((l) => l());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => "light" as Theme);
  const toggle = useCallback(() => apply(current() === "dark" ? "light" : "dark", true), []);
  return { theme, toggle };
}

/** Keeps following the device setting until the visitor makes their own choice. */
export function ThemeSync() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(KEY);
      } catch {
        /* ignore */
      }
      if (saved !== "light" && saved !== "dark") apply(mq.matches ? "dark" : "light", false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return null;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Light mode" : "Dark mode"}
      className={`relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/30 text-white transition hover:bg-white/10 sm:h-11 sm:w-11 ${className}`}
    >
      <span
        className="absolute inset-0 grid place-items-center transition-all duration-500"
        style={{ transform: dark ? "translateY(0) rotate(0)" : "translateY(120%) rotate(-90deg)", opacity: dark ? 1 : 0 }}
      >
        <Icon name="moon" size={20} />
      </span>
      <span
        className="absolute inset-0 grid place-items-center transition-all duration-500"
        style={{ transform: dark ? "translateY(-120%) rotate(90deg)" : "translateY(0) rotate(0)", opacity: dark ? 0 : 1 }}
      >
        <Icon name="sun" size={20} />
      </span>
    </button>
  );
}
