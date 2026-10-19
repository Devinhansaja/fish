"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { Icon } from "./Icon";
import { QUOTE_HREF } from "@/lib/site";
import { Reveal } from "./Reveal";
import { useMotionPrefs } from "./MotionProvider";

/** Primary conversion button. Coral is reserved for this component only. */
export function PrimaryCTA({
  children = "Request a Quotation",
  href = QUOTE_HREF,
  small,
  pulse,
  className = "",
  arrow = true,
  type,
  onClick,
  disabled,
  magnetic = true,
}: {
  children?: ReactNode;
  href?: string;
  small?: boolean;
  pulse?: boolean;
  className?: string;
  arrow?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  magnetic?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced } = useMotionPrefs();
  const cls = `btn-cta ${small ? "btn-cta--sm" : ""} ${pulse ? "btn-cta--pulse" : ""} ${className}`;

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced || !magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (el && !reduced) {
      const r = el.getBoundingClientRect();
      const d = Math.max(r.width, r.height);
      const s = document.createElement("span");
      s.className = "btn-ripple";
      s.style.width = s.style.height = `${d / 2}px`;
      s.style.left = `${e.clientX - r.left - d / 4}px`;
      s.style.top = `${e.clientY - r.top - d / 4}px`;
      el.appendChild(s);
      window.setTimeout(() => s.remove(), 700);
    }
    onClick?.();
  };

  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Icon name="arrow" size={18} strokeWidth={2.2} />}
    </>
  );

  if (type) {
    return (
      <button
        ref={(n) => {
          ref.current = n;
        }}
        type={type}
        className={cls}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        disabled={disabled}
      >
        {inner}
      </button>
    );
  }
  return (
    <Link
      ref={(n) => {
        ref.current = n;
      }}
      href={href}
      className={cls}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-track="quote-cta"
    >
      {inner}
    </Link>
  );
}

export function GhostButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`btn-ghost ${className}`}>
      {children}
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  dark,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  dark?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${dark ? "on-dark" : ""}`}>
      <Reveal>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <Tag className="h2">{title}</Tag>
        <span
          aria-hidden="true"
          className={`mt-5 block h-[6px] w-24 rounded-full ${align === "center" ? "mx-auto" : ""}`}
          style={{
            background: "var(--sun)",
            maskImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 6'%3E%3Cpath d='M0 3 Q12 -1 24 3 T48 3 T72 3 T96 3' stroke='black' stroke-width='3' fill='none'/%3E%3C/svg%3E\")",
            WebkitMaskImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 6'%3E%3Cpath d='M0 3 Q12 -1 24 3 T48 3 T72 3 T96 3' stroke='black' stroke-width='3' fill='none'/%3E%3C/svg%3E\")",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          }}
        />
        {text && <p className={`mt-6 text-lg ${dark ? "text-white/85" : "text-muted"}`}>{text}</p>}
      </Reveal>
    </div>
  );
}

const WAVE_PATH = "M0 60 C 150 100 300 20 450 60 S 750 100 900 60 S 1050 20 1200 60 V120 H0 Z";

function WaveLayer({ speed, opacity, offset, fill }: { speed: string; opacity: number; offset: number; fill: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: "100%" }}>
      <div
        className="wave-layer h-full"
        style={{ ["--wave-speed" as string]: speed, transform: `translateX(${offset}%)` }}
      >
        {[0, 1].map((i) => (
          <svg key={i} viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-1/2 shrink-0" aria-hidden="true">
            <path d={WAVE_PATH} fill={fill} fillOpacity={opacity} />
          </svg>
        ))}
      </div>
    </div>
  );
}

/** Two-layer animated SVG wave. `fill` is the colour of the NEXT section. */
export function WaveDivider({
  fill = "var(--mint)",
  flip,
  className = "",
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-14 w-full sm:h-20 md:h-28 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <WaveLayer speed="30s" opacity={0.45} offset={0} fill={fill} />
      <WaveLayer speed="19s" opacity={1} offset={-8} fill={fill} />
    </div>
  );
}
export function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-aqua/20 text-aqua-700">
        <Icon name="check" size={14} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-deep pt-36 pb-28 sm:pt-44 sm:pb-36">
      {image && (
        <>
          <Image src={image} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover" />
          {/* navy veil: strongest behind the left-aligned text, lighter on the right so the picture still shows */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, rgba(7,26,51,.9) 0%, rgba(11,37,69,.72) 42%, rgba(11,37,69,.3) 100%), linear-gradient(180deg, rgba(7,26,51,.55) 0%, rgba(7,26,51,0) 35%, rgba(7,26,51,.35) 100%)",
            }}
          />
        </>
      )}
      {!image && <div className="absolute inset-0" style={{ background: "var(--grad-glow)" }} aria-hidden="true" />}
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="h1 max-w-4xl text-white">{title}</h1>
          {text && <p className="mt-6 max-w-2xl text-lg text-white/85 sm:text-xl">{text}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </Reveal>
      </div>
      <div className="absolute inset-x-0 bottom-[-1px]">
        <WaveDivider fill="#ffffff" />
      </div>
    </section>
  );
}

