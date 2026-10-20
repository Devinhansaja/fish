"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { nav, site } from "@/lib/site";
import { Logo } from "./Logo";
import { Icon, type IconName } from "./Icon";
import { NewsletterForm } from "./NewsletterForm";
import { BubbleField, FishIllustration, useActive } from "./Underwater";
import { WaveDivider } from "./ui";
import { useMotionPrefs } from "./MotionProvider";
import { useTheme } from "./ThemeToggle";
import { useRef } from "react";
import { Stagger, StaggerItem } from "./Reveal";

const socials: { key: keyof typeof site.social; icon: IconName; label: string }[] = [
  { key: "facebook", icon: "facebook", label: "Facebook" },
  { key: "instagram", icon: "instagram", label: "Instagram" },
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
  { key: "youtube", icon: "youtube", label: "YouTube" },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const active = useActive(ref);
  const { manual, setManual } = useMotionPrefs();
  const { theme, toggle: toggleTheme } = useTheme();
  const configured = socials.filter((s) => site.social[s.key]);

  return (
    <footer ref={ref} className="on-dark relative mt-0 overflow-hidden bg-navy-900 text-white/85">
      <div className="absolute inset-x-0 top-0 -translate-y-[calc(100%-1px)]">
        <WaveDivider fill="#071a33" />
      </div>
      <BubbleField count={14} seed={31} />
      {/* an occasional fish crossing the footer */}
      <div aria-hidden="true" className="motion-decor pointer-events-none absolute inset-x-0 bottom-24 h-20 overflow-hidden">
        <div
          style={{
            animation: "swim-across 38s linear 4s infinite",
            animationPlayState: active ? "running" : "paused",
          }}
        >
          <FishIllustration color="#00b4c6" fin="#6fd8e3" className="h-10 w-auto opacity-40" />
        </div>
      </div>

      <div className="container-x relative pb-10 pt-20">
        <Stagger className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr]">
          <StaggerItem>
            <Logo />
            <p className="mt-5 max-w-xs text-[0.95rem] text-white/75">{site.tagline}</p>
            <p className="mt-3 max-w-xs text-sm text-white/65">
              Government-registered exporter of high-quality live ornamental freshwater fish from Sri Lanka.
              {/* TODO: confirm registration wording + licence number */}
            </p>
            {configured.length > 0 && (
              <ul className="mt-6 flex gap-3" aria-label="Social media">
                {configured.map((s) => (
                  <li key={s.key}>
                    <a
                      href={site.social[s.key] as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition hover:-translate-y-1 hover:bg-aqua hover:text-navy"
                    >
                      <Icon name={s.icon} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </StaggerItem>

          <StaggerItem>
            <h2 className="mb-5 text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              Explore
            </h2>
            <ul className="space-y-2.5 text-[0.95rem]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-white/80 no-underline transition hover:text-aqua-300">
                    {n.label}
                    {n.soon && <span className="ml-2 rounded-full bg-sun px-2 py-0.5 align-middle text-[0.6rem] font-extrabold uppercase tracking-wider text-navy">Soon</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mb-5 text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              Contact
            </h2>
            <address className="space-y-3 text-[0.95rem] not-italic">
              <p className="flex gap-3">
                <Icon name="pin" size={20} className="mt-0.5 shrink-0 text-aqua-300" />
                <span>
                  Aquazone Ornamental Fish Farm (Pvt) Ltd
                  <br />
                  {site.address.line1}, {site.address.country}
                </span>
              </p>
              <p className="flex gap-3">
                <Icon name="phone" size={20} className="mt-0.5 shrink-0 text-aqua-300" />
                {site.phone ? <a href={`tel:${site.phone}`}>{site.phone}</a> : <span className="text-white/60">Telephone - to be confirmed</span>}
              </p>
              <p className="flex gap-3">
                <Icon name="mail" size={20} className="mt-0.5 shrink-0 text-aqua-300" />
                {site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : <span className="text-white/60">Email - to be confirmed</span>}
              </p>
            </address>
            {site.profilePdf ? (
              <a href={site.profilePdf} download className="mt-5 inline-flex items-center gap-2 font-semibold text-aqua-300">
                <Icon name="download" size={18} /> Download company profile
              </a>
            ) : (
              <p className="mt-5 text-sm text-white/55">Company profile PDF - coming soon</p>
            )}
          </StaggerItem>

          <StaggerItem>
            <NewsletterForm />
            <div className="mt-8 flex items-center gap-3 text-sm">
              <button
                type="button"
                role="switch"
                aria-checked={manual}
                onClick={() => setManual(!manual)}
                className="relative h-6 w-11 rounded-full bg-white/20 transition-colors aria-checked:bg-aqua"
              >
                <span
                  className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                  style={{ transform: manual ? "translateX(20px)" : "none" }}
                />
                <span className="sr-only">Reduce motion</span>
              </button>
              <span>Reduce motion</span>
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <button
                type="button"
                role="switch"
                aria-checked={theme === "dark"}
                onClick={toggleTheme}
                className="relative h-6 w-11 rounded-full bg-white/20 transition-colors aria-checked:bg-aqua"
              >
                <span
                  className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                  style={{ transform: theme === "dark" ? "translateX(20px)" : "none" }}
                />
                <span className="sr-only">Dark mode</span>
              </button>
              <span>Dark mode</span>
            </div>
          </StaggerItem>
        </Stagger>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p>
              &copy; {new Date().getFullYear()} Aquazone Ornamental Fish Farm (Pvt) Ltd. All rights reserved.
            </p>
            <p>
              Website designed &amp; built by <span className="font-semibold text-aqua-300">{site.builder}</span>
            </p>
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="relative grid h-14 w-14 place-items-center rounded-full text-navy"
      style={{
        background: "radial-gradient(circle at 30% 28%, #ffffff, #6fd8e3 55%, #00b4c6)",
        boxShadow: "0 10px 30px -8px rgba(0,180,198,.7)",
      }}
    >
      <Icon name="arrow" size={22} strokeWidth={2.4} style={{ transform: "rotate(-90deg)" }} />
    </motion.button>
  );
}
