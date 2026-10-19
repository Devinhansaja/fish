"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { useSpecies } from "../SpeciesProvider";
import { FishCard } from "../catalog/FishCard";
import { Icon } from "../Icon";
import { useActive } from "../Underwater";
import { useMotionPrefs } from "../MotionProvider";

/** Auto-scroll speed in CSS pixels per second (about one card every 7 seconds). */
const SPEED = 52;

/**
 * Infinite, continuously auto-scrolling carousel.
 *
 * - The list is rendered twice (the second copy is inert) so it can loop seamlessly.
 * - It glides slowly on its own; it pauses while the pointer is over it, while it has focus,
 *   while the user drags / swipes / uses the wheel, and when it is off-screen or the tab is hidden.
 * - Prev/next arrows, the dots and mouse drag all still work. Reduced motion turns auto-scroll off.
 */
export function FishCarousel() {
  const { featured: featuredSpecies } = useSpecies();
  const n = featuredSpecies.length;
  const scroller = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const active = useActive(wrap);
  const { reduced } = useMotionPrefs();
  const [index, setIndex] = useState(0);

  const hover = useRef(false);
  const focused = useRef(false);
  const pauseUntil = useRef(0);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const cards = useCallback(() => Array.from(scroller.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []), []);

  /** Width of one full copy of the list (distance between a card and its clone). */
  const period = useCallback(() => {
    const c = cards();
    return c.length > n && n > 0 ? c[n].offsetLeft - c[0].offsetLeft : 0;
  }, [cards, n]);

  /** Absolute index (0..2n-1) of the card nearest the centre of the viewport. */
  const nearestAbs = useCallback(() => {
    const el = scroller.current;
    if (!el) return 0;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    cards().forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }, [cards]);

  const onScroll = useCallback(() => {
    if (n) setIndex(nearestAbs() % n);
  }, [nearestAbs, n]);

  /** Smoothly centre card k (absolute index), jumping a whole period first when k is off either end. */
  const goAbs = useCallback(
    (k: number) => {
      const el = scroller.current;
      const c = cards();
      const p = period();
      if (!el || !c.length || !p) return;
      if (k < 0) {
        el.scrollLeft += p;
        k += n;
      } else if (k >= c.length) {
        el.scrollLeft -= p;
        k -= n;
      }
      const target = c[k];
      el.scrollTo({ left: target.offsetLeft - (el.clientWidth - target.clientWidth) / 2, behavior: "smooth" });
    },
    [cards, period, n],
  );

  const goToIndex = useCallback(
    (i: number) => {
      // pick whichever copy of card i is closest to where we are now
      const cur = nearestAbs();
      goAbs(Math.abs(i - cur) <= Math.abs(i + n - cur) ? i : i + n);
      pauseUntil.current = performance.now() + 3500;
    },
    [nearestAbs, goAbs, n],
  );

  /* ---- continuous auto-scroll ---- */
  useEffect(() => {
    if (reduced || !active || n < 2) return;
    const el = scroller.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft; // float position (scrollLeft itself may round)
    let lastSet = el.scrollLeft;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const p = period();

      // someone else moved it (wheel, touch, drag, arrows): follow and rest for a moment
      if (Math.abs(el.scrollLeft - lastSet) > 2) {
        pos = el.scrollLeft;
        pauseUntil.current = Math.max(pauseUntil.current, now + 2500);
      }

      const paused = hover.current || focused.current || drag.current.down || now < pauseUntil.current;
      if (!paused && p > 0) {
        pos += SPEED * dt;
        if (pos >= p) pos -= p; // seamless wrap: the second copy looks identical to the first
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
        // keep manual scrolling inside the looping window as well
        if (p > 0 && pos >= p + 2) {
          pos -= p;
          el.scrollLeft = pos;
        }
      }
      lastSet = el.scrollLeft;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, active, n, period]);

  /* ---- mouse drag (touch uses native scrolling) ---- */
  const down = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { down: true, startX: e.clientX, startLeft: scroller.current?.scrollLeft ?? 0, moved: false };
  };
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down || !scroller.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    scroller.current.scrollLeft = d.startLeft - dx;
  };
  const up = () => {
    if (drag.current.down) {
      drag.current.down = false;
      pauseUntil.current = performance.now() + 1500;
    }
  };

  const slide = (s: (typeof featuredSpecies)[number], i: number, clone: boolean) => {
    const isActive = i === index;
    return (
      <div
        key={`${clone ? "c" : "o"}-${s.id}`}
        data-card
        {...(clone ? { inert: true, "aria-hidden": true } : { "aria-roledescription": "slide", "aria-label": `${i + 1} of ${n}` })}
        className="w-[78vw] shrink-0 transition-[transform,opacity,filter] duration-700 ease-[var(--ease-out)] sm:w-[22rem]"
        style={{
          transform: isActive ? "scale(1.05)" : "scale(0.95)",
          opacity: isActive ? 1 : 0.62,
          filter: isActive ? "none" : "saturate(.8)",
        }}
      >
        <FishCard s={s} sizes="(min-width:640px) 352px, 78vw" />
      </div>
    );
  };

  return (
    <div
      ref={wrap}
      className="relative z-[2]"
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => {
        hover.current = false;
        up();
      }}
      onFocus={() => (focused.current = true)}
      onBlur={() => (focused.current = false)}
      onTouchStart={() => (pauseUntil.current = performance.now() + 4000)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured ornamental fish"
    >
      <div
        ref={scroller}
        onScroll={onScroll}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onWheel={() => (pauseUntil.current = performance.now() + 2500)}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        data-cursor="Drag"
        className="no-scrollbar flex gap-6 overflow-x-auto px-[max(1.25rem,calc((100vw-80rem)/2+2.5rem))] py-10 [cursor:grab] active:[cursor:grabbing]"
        tabIndex={0}
        aria-label="Scrollable list of featured fish"
      >
        {featuredSpecies.map((s, i) => slide(s, i, false))}
        {/* second copy for the seamless loop (hidden from assistive tech and not focusable) */}
        {featuredSpecies.map((s, i) => slide(s, i, true))}
      </div>

      <div className="container-x flex items-center justify-between gap-4">
        <div className="flex gap-2" role="group" aria-label="Carousel position">
          {featuredSpecies.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Show ${s.commonName}`}
              aria-current={i === index}
              onClick={() => goToIndex(i)}
              className="h-2.5 rounded-full bg-navy/25 transition-all duration-500 aria-[current=true]:w-8 aria-[current=true]:bg-aqua"
              style={{ width: i === index ? 32 : 10 }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous fish"
            onClick={() => {
              goAbs(nearestAbs() - 1);
              pauseUntil.current = performance.now() + 3500;
            }}
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 text-navy transition hover:border-aqua hover:bg-aqua/10"
          >
            <Icon name="arrow" size={18} style={{ transform: "scaleX(-1)" }} />
          </button>
          <button
            type="button"
            aria-label="Next fish"
            onClick={() => {
              goAbs(nearestAbs() + 1);
              pauseUntil.current = performance.now() + 3500;
            }}
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 text-navy transition hover:border-aqua hover:bg-aqua/10"
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
