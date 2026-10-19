"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { nav, productNav } from "@/lib/site";
import { Logo } from "./Logo";
import { PrimaryCTA } from "./ui";
import { Icon } from "./Icon";
import { HeaderCart } from "./HeaderCart";
import { SHOW_HEADER_EVENT } from "@/lib/flyFish";
import { ease } from "@/lib/motion";

/** Desktop "Products" dropdown (CSS only: opens on hover and on keyboard focus). */
function ProductsMenu({ isActive }: { isActive: (href: string) => boolean }) {
  const active = productNav.some((p) => isActive(p.href));
  return (
    <div className="group relative">
      <Link href="/fish-collection" className="nav-link inline-flex items-center gap-1" aria-haspopup="true" aria-current={active ? "page" : undefined}>
        Products
        <svg viewBox="0 0 12 8" className="h-2 w-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true">
          <path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {active && <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sun" />}
      </Link>
      <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <ul className="overflow-hidden rounded-2xl bg-white p-2 text-navy shadow-2xl ring-1 ring-navy/10">
          {productNav.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-[0.95rem] font-semibold text-navy no-underline transition hover:bg-mint ${isActive(p.href) ? "bg-mint" : ""}`}
              >
                {p.label}
                {p.soon && <span className="rounded-full bg-sun px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider">Soon</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu when the route changes (state adjusted during render, per React docs)
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const pinnedUntil = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 80);
    setHidden(y > 360 && y > prev && Date.now() > pinnedUntil.current);
  });

  // keep the header (and its cart) visible while a fish swims to it
  useEffect(() => {
    const show = () => {
      pinnedUntil.current = Date.now() + 2200;
      setHidden(false);
    };
    window.addEventListener(SHOW_HEADER_EVENT, show);
    return () => window.removeEventListener(SHOW_HEADER_EVENT, show);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.header
        id="site-header"
        className="on-dark fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: ease.out }}
      >
        <div
          className="transition-all duration-300"
          style={{
            background: scrolled ? "rgba(11,37,69,0.88)" : "transparent",
            backdropFilter: scrolled ? "blur(14px) saturate(150%)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(14px) saturate(150%)" : "none",
            boxShadow: scrolled ? "0 8px 30px -12px rgba(7,26,51,.6)" : "none",
            paddingBlock: scrolled ? "0.55rem" : "1.1rem",
          }}
        >
          <div className="container-x flex items-center justify-between gap-4">
            <Logo />

            <nav aria-label="Main" className="hidden items-center gap-x-5 xl:flex">
              {nav
                .filter((n) => n.href !== "/contact" && !productNav.some((p) => p.href === n.href))
                .map((n) => (
                  <Fragment key={n.href}>
                    <Link href={n.href} className="nav-link" aria-current={isActive(n.href) ? "page" : undefined}>
                      {n.label === "Export & Services" ? "Export" : n.label === "Quality Assurance" ? "Quality" : n.label === "News & Blog" ? "News" : n.label}
                      {isActive(n.href) && (
                        <motion.span
                          layoutId="nav-bubble"
                          className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sun"
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        />
                      )}
                    </Link>
                    {/* Products dropdown sits right after "About Us" */}
                    {n.href === "/about" && <ProductsMenu isActive={isActive} />}
                  </Fragment>
                ))}
              <Link href="/contact" className="nav-link" aria-current={isActive("/contact") ? "page" : undefined}>
                Contact
                {isActive("/contact") && (
                  <motion.span
                    layoutId="nav-bubble"
                    className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sun"
                  />
                )}
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* TODO: multi-language support. Placeholder selector, intentionally inert. */}
              <span
                className="hidden cursor-not-allowed select-none rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold tracking-wider text-white/85 sm:inline-block"
                title="Additional languages coming soon"
                aria-label="Language: English. More languages coming soon."
              >
                EN
              </span>
              <HeaderCart />
              <PrimaryCTA small pulse arrow={false} className="whitespace-nowrap">
                <span className="hidden sm:inline">Request a Quote</span>
                <span className="sm:hidden">Quote</span>
              </PrimaryCTA>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white sm:h-11 sm:w-11 xl:hidden"
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="relative block h-4 w-5" aria-hidden="true">
                  <motion.span
                    className="absolute left-0 top-0 block h-0.5 w-5 rounded bg-white"
                    animate={open ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
                  />
                  <motion.span
                    className="absolute left-0 top-[7px] block h-0.5 w-5 rounded bg-white"
                    animate={{ opacity: open ? 0 : 1 }}
                  />
                  <motion.span
                    className="absolute left-0 top-[14px] block h-0.5 w-5 rounded bg-white"
                    animate={open ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="on-dark fixed inset-0 z-40 overflow-y-auto bg-navy-900 xl:hidden"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
              className="absolute left-0 top-full h-10 w-full"
            >
              <path d="M0 0 H1200 V20 C1000 60 800 -10 600 25 S200 60 0 20 Z" fill="#071a33" />
            </svg>
            <div className="bg-deep absolute inset-0 opacity-60" aria-hidden="true" />
            <nav aria-label="Mobile" className="container-x relative flex min-h-full flex-col justify-center gap-1 pb-16 pt-28">
              {nav.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: ease.out }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between border-b border-white/10 py-3 text-2xl font-semibold no-underline ${isActive(n.href) ? "text-sun" : "text-white"}`}
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    <span className="flex items-center gap-3">
                      {n.label}
                      {n.soon && <span className="rounded-full bg-sun px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-navy">Soon</span>}
                    </span>
                    <Icon name="arrow" size={20} />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + nav.length * 0.06 }}
              >
                <PrimaryCTA className="w-full" />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

