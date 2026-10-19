"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { useSpecies } from "../SpeciesProvider";
import { FishCard } from "../catalog/FishCard";
import { Icon } from "../Icon";
import { useActive } from "../Underwater";
import { useMotionPrefs } from "../MotionProvider";

/**
 * Native scroll-snap carousel (momentum + keyboard + touch for free) enhanced with
 * mouse drag, an "active card" emphasis effect and a slow autoplay that pauses on interaction.
 */
export function FishCarousel() {
  const { featured: featuredSpecies } = useSpecies();
  const scroller = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const active = useActive(wrap);
  const { reduced } = useMotionPrefs();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const cards = useCallback(() => Array.from(scroller.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []), []);

  const goTo = useCallback(
    (i: number) => {
      const c = cards();
      const el = scroller.current;
      if (!el || !c.length) return;
      const n = (i + c.length) % c.length;
      const target = c[n];
      el.scrollTo({ left: target.offsetLeft - (el.clientWidth - target.clientWidth) / 2, behavior: "smooth" });
    },
    [cards],
  );

  // find the card closest to the centre
  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
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
    setIndex(best);
  }, [cards]);

  // slow autoplay
  useEffect(() => {
    if (paused || reduced || !active) return;
    const id = window.setInterval(() => goTo(index + 1), 4800);
    return () => window.clearInterval(id);
  }, [paused, reduced, active, index, goTo]);

  const down = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { down: true, startX: e.clientX, startLeft: scroller.current?.scrollLeft ?? 0, moved: false };
    setPaused(true);
  };
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down || !scroller.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    scroller.current.style.scrollSnapType = "none";
    scroller.current.scrollLeft = d.startLeft - dx;
  };
  const up = () => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (scroller.current) {
      scroller.current.style.scrollSnapType = "";
      onScroll();
      goTo(index);
    }
  };

  return (
    <div
      ref={wrap}
      className="relative z-[2]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        up();
      }}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
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
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        data-cursor="Drag"
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(1.25rem,calc((100vw-80rem)/2+2.5rem))] py-10 [cursor:grab] active:[cursor:grabbing]"
        tabIndex={0}
        aria-label="Scrollable list of featured fish"
      >
        {featuredSpecies.map((s, i) => {
          const isActive = i === index;
          return (
            <div
              key={s.id}
              data-card
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${featuredSpecies.length}`}
              className="w-[78vw] shrink-0 snap-center transition-all duration-700 ease-[var(--ease-out)] sm:w-[22rem]"
              style={{
                transform: isActive ? "scale(1.05)" : "scale(0.95)",
                opacity: isActive ? 1 : 0.62,
                filter: isActive ? "none" : "saturate(.8)",
              }}
            >
              <FishCard s={s} sizes="(min-width:640px) 352px, 78vw" />
            </div>
          );
        })}
      </div>

      <div className="container-x flex items-center justify-between gap-4">
        <div className="flex gap-2" role="group" aria-label="Carousel position">
          {featuredSpecies.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Show ${s.commonName}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className="h-2.5 rounded-full bg-navy/25 transition-all duration-500 aria-[current=true]:w-8 aria-[current=true]:bg-aqua"
              style={{ width: i === index ? 32 : 10 }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous fish"
            onClick={() => goTo(index - 1)}
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 text-navy transition hover:border-aqua hover:bg-aqua/10"
          >
            <Icon name="arrow" size={18} style={{ transform: "scaleX(-1)" }} />
          </button>
          <button
            type="button"
            aria-label="Next fish"
            onClick={() => goTo(index + 1)}
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 text-navy transition hover:border-aqua hover:bg-aqua/10"
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
