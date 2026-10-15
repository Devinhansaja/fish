/**
 * "Swim to cart": a small fish leaves the clicked button, swims along a wavy
 * curve to the quote-list chip, and the chip bumps when it arrives.
 * Client-only. Skipped when motion is reduced.
 */

export const QUOTE_BUMP_EVENT = "aqz:quote-bump";

function motionReduced() {
  return (
    document.documentElement.dataset.reduceMotion === "true" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const SHOW_HEADER_EVENT = "aqz:show-header";

/** Centre of the header cart icon, as it will be once the (possibly hidden) header slides back in. */
function targetCenter() {
  const cart = document.getElementById("quote-cart");
  if (cart) {
    const r = cart.getBoundingClientRect();
    const header = document.getElementById("site-header");
    // the header slides up out of view while scrolling down; undo that offset
    const hiddenOffset = header ? new DOMMatrix(getComputedStyle(header).transform).m42 : 0;
    return { x: r.left + r.width / 2, y: r.top - hiddenOffset + r.height / 2 };
  }
  return { x: window.innerWidth - 60, y: 40 };
}

export function flyFishToQuote(from: Element) {
  if (typeof window === "undefined" || motionReduced()) {
    window.dispatchEvent(new Event(QUOTE_BUMP_EVENT));
    return;
  }

  const r = from.getBoundingClientRect();
  const start = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  const end = targetCenter();
  window.dispatchEvent(new Event(SHOW_HEADER_EVENT)); // bring the header (and cart) back into view
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);
  const dir = dx < 0 ? -1 : 1; // the fish artwork faces right

  const startSize = 64; // px wide, shrinks to a tiny fish
  const endSize = 20;

  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText = `position:fixed;left:0;top:0;width:${startSize}px;height:${startSize * 0.755}px;z-index:9997;pointer-events:none;will-change:transform,opacity;filter:drop-shadow(0 6px 10px rgba(7,26,51,.35));`;
  el.innerHTML = `<img src="/media/blue-tang.webp" alt="" draggable="false" style="display:block;width:100%;height:auto"/>`; // artwork faces left
  document.body.appendChild(el);

  // swim along a wavy path: straight line + sine wobble perpendicular to travel
  const steps = 28;
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);
  const amp = Math.min(46, dist * 0.12);
  const lift = Math.min(70, dist * 0.18) * (dy < 0 ? -0.4 : 1); // gentle arc
  const keyframes: Keyframe[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const wob = Math.sin(t * Math.PI * 4) * amp * (1 - t * 0.6);
    const arc = Math.sin(t * Math.PI) * lift;
    const x = start.x + dx * ease + nx * wob;
    const y = start.y + dy * ease + ny * wob - arc;
    // heading from the next sample, so the fish points where it swims
    const t2 = Math.min(1, t + 1 / steps);
    const e2 = t2 < 0.5 ? 2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 2) / 2;
    const x2 = start.x + dx * e2 + nx * Math.sin(t2 * Math.PI * 4) * amp * (1 - t2 * 0.6);
    const y2 = start.y + dy * e2 + ny * Math.sin(t2 * Math.PI * 4) * amp * (1 - t2 * 0.6) - Math.sin(t2 * Math.PI) * lift;
    let ang = (Math.atan2(y2 - y, (x2 - x) * dir) * 180) / Math.PI;
    ang = Math.max(-40, Math.min(40, ang));
    const size = startSize + (endSize - startSize) * ease;
    const s = size / startSize;
    keyframes.push({
      transform: `translate(${x - startSize / 2}px, ${y - startSize * 0.3775}px) scale(${-dir * s}, ${s}) rotate(${-ang * dir}deg)`,
      opacity: i === 0 ? 0 : i > steps - 3 ? 0.9 : 1,
      offset: t,
    });
  }

  const anim = el.animate(keyframes, { duration: Math.max(750, Math.min(1300, 500 + dist * 0.7)), easing: "linear", fill: "forwards" });

  // little bubbles left in the wake
  const wake = window.setInterval(() => {
    const m = el.getBoundingClientRect();
    const b = document.createElement("span");
    b.style.cssText = `position:fixed;left:${m.left + m.width / 2}px;top:${m.top + m.height / 2}px;width:7px;height:7px;border-radius:50%;border:1px solid rgba(0,180,198,.8);background:rgba(255,255,255,.55);z-index:9996;pointer-events:none;`;
    document.body.appendChild(b);
    b.animate(
      [{ transform: "translateY(0) scale(1)", opacity: 0.9 }, { transform: "translateY(-26px) scale(1.5)", opacity: 0 }],
      { duration: 650, easing: "ease-out" },
    ).onfinish = () => b.remove();
  }, 70);

  anim.onfinish = () => {
    window.clearInterval(wake);
    el.remove();
    window.dispatchEvent(new Event(QUOTE_BUMP_EVENT));
  };
  anim.oncancel = () => {
    window.clearInterval(wake);
    el.remove();
  };
}
