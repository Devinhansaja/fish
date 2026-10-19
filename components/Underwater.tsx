"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useSyncExternalStore, type CSSProperties, type RefObject } from "react";
import { mulberry32 } from "@/lib/random";
import { useMotionPrefs } from "./MotionProvider";
import { SwimFish } from "./SwimFish";
import type { FishKind } from "@/lib/swimfish";

/* ------------------------------------------------------------------ */
/* Pause decorative loops when the tab or section is off-screen        */
/* ------------------------------------------------------------------ */
function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}
export function useActive(ref: RefObject<Element | null>) {
  const inView = useInView(ref, { margin: "120px" });
  const tabHidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);
  return inView && !tabHidden;
}

/* ------------------------------------------------------------------ */
/* Mouse parallax shared by fish layers                                */
/* ------------------------------------------------------------------ */
export function useMouseParallax(enabled: boolean) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 18, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 40, damping: 18, mass: 0.8 });
  useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);
  return { x: sx, y: sy };
}

/* ------------------------------------------------------------------ */
/* Bubbles                                                             */
/* ------------------------------------------------------------------ */
export function BubbleField({
  count = 32,
  seed = 7,
  interactive = false,
  className = "",
  tone = "light",
}: {
  count?: number;
  seed?: number;
  interactive?: boolean;
  className?: string;
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive(ref);
  const { reduced } = useMotionPrefs();

  const bubbles = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      const size = 6 + r() * 30;
      return {
        i,
        left: r() * 100,
        size,
        dur: 11 + r() * 16,
        delay: -r() * 24,
        sway: 8 + r() * 26,
        swayDur: 3 + r() * 4,
        op: 0.25 + r() * 0.5,
        depth: size > 24 ? 1 : 0.5,
      };
    });
  }, [count, seed]);

  /* Cursor repulsion (desktop only) */
  useEffect(() => {
    if (!interactive || reduced) return;
    const root = ref.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    let raf = 0;
    let mx = -999;
    let my = -999;
    const tick = () => {
      raf = 0;
      root.querySelectorAll<HTMLElement>("[data-bubble]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) {
          const f = (120 - d) / 120;
          el.style.translate = `${(dx / d) * f * 70}px ${(dy / d) * f * 70}px`;
        } else if (el.style.translate) {
          el.style.translate = "0px 0px";
        }
      });
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactive, reduced]);

  const bg =
    tone === "light"
      ? "radial-gradient(circle at 30% 28%, rgba(255,255,255,.95), rgba(255,255,255,.18) 38%, rgba(255,255,255,.04) 62%, rgba(255,255,255,.25) 100%)"
      : "radial-gradient(circle at 30% 28%, rgba(0,180,198,.8), rgba(0,180,198,.15) 40%, rgba(0,180,198,.04) 65%, rgba(0,180,198,.3) 100%)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`motion-decor pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {bubbles.map((b) => (
        <span
          key={b.i}
          data-bubble
          className={`absolute bottom-0 block ${b.i >= 12 ? "hidden md:block" : ""}`}
          style={
            {
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              transition: "translate .6s cubic-bezier(.22,1,.36,1)",
              animation: `bubble-rise ${b.dur}s linear ${b.delay}s infinite`,
              animationPlayState: active ? "running" : "paused",
              ["--b-op" as string]: b.op,
              willChange: "transform",
            } as CSSProperties
          }
        >
          <span
            className="block h-full w-full rounded-full"
            style={
              {
                background: bg,
                boxShadow: "inset 0 0 6px rgba(255,255,255,.35)",
                border: "1px solid rgba(255,255,255,.35)",
                animation: `bubble-sway ${b.swayDur}s ease-in-out ${b.delay}s infinite`,
                animationPlayState: active ? "running" : "paused",
                ["--sway" as string]: `${b.sway}px`,
              } as CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fish illustration (decorative, NOT product photography)             */
/* ------------------------------------------------------------------ */
export function FishIllustration({
  color = "#ff7b63",
  fin = "#ffd166",
  className = "",
  wag = true,
  style,
}: {
  color?: string;
  fin?: string;
  className?: string;
  wag?: boolean;
  style?: CSSProperties;
}) {
  const id = useMemo(() => `fg${color.replace("#", "")}${fin.replace("#", "")}`, [color, fin]);
  return (
    <svg viewBox="0 0 120 70" className={className} style={style} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity=".72" />
        </linearGradient>
      </defs>
      <g
        style={{
          transformOrigin: "34px 35px",
          animation: wag ? "tail-wag 0.9s ease-in-out infinite" : undefined,
        }}
      >
        <path d="M36 35 L5 11 Q15 35 5 59 Z" fill={fin} opacity=".95" />
      </g>
      <path d="M50 14 Q66 -2 82 12 Z" fill={fin} opacity=".9" />
      <path d="M52 56 Q66 70 80 56 Z" fill={fin} opacity=".8" />
      <path d="M30 35 C 45 6, 92 6, 110 35 C 92 64, 45 64, 30 35 Z" fill={`url(#${id})`} />
      <path d="M44 22 Q70 12 98 30" stroke="#fff" strokeOpacity=".4" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="95" cy="30" r="5" fill="#fff" />
      <circle cx="96" cy="30" r="2.6" fill="#071a33" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Swimming fish: the 3D cartoon blue tang (video with alpha)          */
/* ------------------------------------------------------------------ */
type Swimmer = {
  kind: FishKind;
  top: number;
  dur: number;
  delay: number;
  /** width in px (kept small so fish never crowd the headline) */
  size: number;
  /** true = swims right-to-left */
  rtl: boolean;
  amp: number;
  depth: number;
};

const swimmers: Swimmer[] = [
  { kind: "tang", top: 20, dur: 46, delay: -8, size: 96, rtl: false, amp: 20, depth: 1.2 },
  { kind: "clown", top: 60, dur: 58, delay: -30, size: 88, rtl: true, amp: 14, depth: 0.9 },
  { kind: "angel", top: 40, dur: 66, delay: -42, size: 92, rtl: true, amp: 12, depth: 0.6 },
  { kind: "ray", top: 86, dur: 80, delay: -22, size: 150, rtl: false, amp: 10, depth: 0.5 },
];

const wide = "(min-width: 768px)";
const subscribeWide = (cb: () => void) => {
  const m = window.matchMedia(wide);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

function Swim({ s, px, py, paused }: { s: Swimmer; px: MotionValue<number>; py: MotionValue<number>; paused: boolean }) {
  const x = useTransform(px, [-1, 1], [-26 * s.depth, 26 * s.depth]);
  const y = useTransform(py, [-1, 1], [-16 * s.depth, 16 * s.depth]);
  const far = s.depth < 0.7;
  return (
    <motion.div className="absolute left-0" style={{ top: `${s.top}%`, x, y }}>
      <div
        style={{
          animation: `${s.rtl ? "swim-across-rtl" : "swim-across"} ${s.dur}s linear ${s.delay}s infinite`,
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        <div
          className="relative"
          style={{
            animation: `swim-bob ${6 + s.depth * 3}s ease-in-out infinite`,
            animationPlayState: paused ? "paused" : "running",
            ["--amp" as string]: `${s.amp}px`,
            width: s.size,
          }}
        >
          <div
            style={{
              width: s.size,
              opacity: far ? 0.4 : 0.6,
              filter: far ? "blur(0.5px) saturate(.9)" : "drop-shadow(0 8px 14px rgba(7,26,51,.35))",
            }}
          >
            <SwimFish kind={s.kind} heading={s.rtl ? "left" : "right"} paused={paused} playbackRate={0.85 + s.depth * 0.15} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FishSwarm({ className = "", max = 5 }: { className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive(ref);
  const { reduced } = useMotionPrefs();
  const { x, y } = useMouseParallax(!reduced);
  const isWide = useSyncExternalStore(subscribeWide, () => window.matchMedia(wide).matches, () => true);
  // phones: only two fish to keep things light
  const list = swimmers.slice(0, isWide ? max : 2);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`motion-decor pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {list.map((s, i) => (
        <Swim key={i} s={s} px={x} py={y} paused={!active} />
      ))}
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* Light rays + caustics                                               */
/* ------------------------------------------------------------------ */
export function LightRays({ className = "" }: { className?: string }) {
  const rays = [
    { left: "4%", w: "12vw", r0: "-10deg", d: "15s", dl: "0s", o0: 0.2 },
    { left: "22%", w: "7vw", r0: "-6deg", d: "19s", dl: "-4s", o0: 0.16 },
    { left: "40%", w: "15vw", r0: "-9deg", d: "17s", dl: "-8s", o0: 0.22 },
    { left: "62%", w: "9vw", r0: "-5deg", d: "21s", dl: "-2s", o0: 0.15 },
    { left: "80%", w: "13vw", r0: "-11deg", d: "16s", dl: "-11s", o0: 0.2 },
  ];
  return (
    <div aria-hidden="true" className={`motion-decor pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {rays.map((r, i) => (
        <span
          key={i}
          className="ray"
          style={
            {
              left: r.left,
              ["--w" as string]: r.w,
              ["--r0" as string]: r.r0,
              ["--d" as string]: r.d,
              ["--dl" as string]: r.dl,
              ["--o0" as string]: r.o0,
            } as CSSProperties
          }
        />
      ))}
      <div
        className="absolute -inset-[10%] opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 120px 70px at 20% 30%, rgba(255,255,255,.9), transparent 70%), radial-gradient(ellipse 160px 90px at 65% 20%, rgba(255,255,255,.8), transparent 70%), radial-gradient(ellipse 110px 60px at 85% 65%, rgba(255,255,255,.8), transparent 70%), radial-gradient(ellipse 150px 80px at 35% 75%, rgba(255,255,255,.7), transparent 70%)",
          animation: "drift 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}
