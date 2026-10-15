"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Icon } from "./Icon";
import { SwimFish } from "./SwimFish";
import type { FishKind } from "@/lib/swimfish";
import { useMotionPrefs } from "./MotionProvider";
import { site } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Thin scroll-progress bar                                             */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-sun"
      style={{ scaleX }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Custom cursor (fine pointers only; native cursor stays visible)      */
/* ------------------------------------------------------------------ */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const d = dot.current;
    const r = ring.current;
    const l = label.current;
    if (!d || !r || !l) return;
    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0,
      scale = 1;
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      d.style.transform = `translate3d(${x}px,${y}px,0)`;
      r.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      d.style.opacity = "1";
      r.style.opacity = "1";
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, input, select, textarea");
      const kind = t?.dataset.cursor;
      if (kind) {
        scale = 2.4;
        l.textContent = kind;
      } else if (t) {
        scale = 1.7;
        l.textContent = "";
      } else {
        scale = 1;
        l.textContent = "";
      }
    };
    const down = () => {
      const ripple = document.createElement("span");
      ripple.style.cssText = `position:fixed;left:${x - 20}px;top:${y - 20}px;width:40px;height:40px;border-radius:50%;border:2px solid rgba(0,180,198,.8);pointer-events:none;z-index:9998;transition:transform .7s cubic-bezier(.22,1,.36,1),opacity .7s;`;
      document.body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = "scale(3)";
        ripple.style.opacity = "0";
      });
      window.setTimeout(() => ripple.remove(), 750);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div aria-hidden="true" className="cursor-layer pointer-events-none fixed left-0 top-0 z-[9999]">
      <div
        ref={ring}
        className="absolute -left-5 -top-5 grid h-10 w-10 place-items-center rounded-full opacity-0 transition-opacity"
        style={{
          border: "1.5px solid rgba(0,180,198,.9)",
          background: "radial-gradient(circle at 30% 28%, rgba(255,255,255,.25), rgba(0,180,198,.12))",
          backdropFilter: "blur(1px)",
        }}
      >
        <span ref={label} className="text-[0.38rem] font-bold uppercase tracking-wider text-navy" />
      </div>
      <div ref={dot} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-aqua opacity-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floating WhatsApp / contact button                                   */
/* ------------------------------------------------------------------ */
export function FloatingWhatsApp() {
  const num = site.whatsapp;
  const href = num ? `https://wa.me/${num}?text=${encodeURIComponent("Hello Aquazone, I would like a quotation for ornamental fish.")}` : "/contact#inquiry";
  const label = num ? "Chat with us" : "Send an inquiry";
  const Cmp = num ? "a" : Link;
  return (
    <div className="fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
      <Cmp
        href={href}
        {...(num ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        data-track="whatsapp-click"
        aria-label={num ? "Chat with Aquazone on WhatsApp" : "Contact Aquazone (WhatsApp number not yet configured)"}
        className="group relative flex h-14 items-center overflow-hidden rounded-full bg-[#1fb855] pl-4 pr-4 text-white no-underline shadow-xl transition-all duration-500 hover:pr-6"
        style={{ animation: "float-y 5s ease-in-out infinite" }}
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#1fb855]/40 [animation-duration:3s]" aria-hidden="true" />
        <Icon name="whatsapp" size={28} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-sm font-semibold opacity-0 transition-all duration-500 group-hover:max-w-40 group-hover:pl-3 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:pl-3 group-focus-visible:opacity-100">
          {label}
        </span>
      </Cmp>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient swimming fish: crosses every page UNDER the words and images */
/* (decorative, never blocks clicks, hidden for reduced motion)         */
/* ------------------------------------------------------------------ */
const lanes: { kind: FishKind; top: string; width: number; dur: number; delay: number; rtl: boolean; amp: number }[] = [
  { kind: "orange", top: "58%", width: 68, dur: 52, delay: -12, rtl: false, amp: 18 },
  { kind: "tang", top: "80%", width: 58, dur: 74, delay: -40, rtl: true, amp: 12 },
  { kind: "clown", top: "36%", width: 64, dur: 64, delay: -26, rtl: false, amp: 14 },
  { kind: "angel", top: "70%", width: 66, dur: 88, delay: -58, rtl: true, amp: 10 },
];

const subscribeWide = (cb: () => void) => {
  const m = window.matchMedia("(min-width: 768px)");
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function AmbientFish() {
  // phones: a single small fish; larger screens: all four lanes
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia("(min-width: 768px)").matches, () => true);
  const active = wide ? lanes : lanes.slice(0, 1);
  const hidden = useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => document.hidden,
    () => false,
  );
  return (
    <div aria-hidden="true" className="motion-decor pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {active.map((l, i) => (
        <div key={i} className="absolute left-0" style={{ top: l.top }}>
          <div
            style={{
              animation: `${l.rtl ? "swim-across-rtl" : "swim-across"} ${l.dur}s linear ${l.delay}s infinite`,
              animationPlayState: hidden ? "paused" : "running",
              willChange: "transform",
            }}
          >
            <div
              style={{
                width: l.width,
                animation: "swim-bob 7s ease-in-out infinite",
                animationPlayState: hidden ? "paused" : "running",
                ["--amp" as string]: `${l.amp}px`,
                filter: "drop-shadow(0 8px 14px rgba(7,26,51,.3))",
                opacity: 0.45,
              }}
            >
              <SwimFish kind={l.kind} heading={l.rtl ? "left" : "right"} paused={hidden} playbackRate={0.9} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}