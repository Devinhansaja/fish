import Link from "next/link";

/** Logo placeholder - replace with the official Aquazone logo asset when supplied. TODO */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00b4c6" />
          <stop offset="1" stopColor="#0a4a6b" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#lg)" />
      <path
        d="M9 24c4-6 9-8.500 15-7.500 3.500.6 6.500 2.700 9 6.500l5-3.500v9l-5-3.500c-2.500 3.800-5.500 5.900-9 6.500-6 1-11-1.500-15-7.500Z"
        fill="#fff"
      />
      <circle cx="30" cy="22.500" r="1.400" fill="#0b2545" />
      <path d="M7 36c4 3 8 3 12 0s8-3 12 0 8 3 10 1" stroke="#ffd166" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = true, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Aquazone Ornamental Fish Farm - home"
      className={`inline-flex items-center gap-2 no-underline sm:gap-3 ${className}`}
    >
      <LogoMark className="h-8 w-8 sm:h-10 sm:w-10" />
      <span className="leading-none">
        <span
          className={`block font-heading text-base font-extrabold sm:text-xl tracking-wide ${light ? "text-white" : "text-navy"}`}
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          AQUAZONE
        </span>
        <span
          className={`mt-1 block whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.2em] max-[420px]:text-[0.5rem] max-[420px]:tracking-[0.1em] max-[380px]:hidden ${light ? "text-aqua-300" : "text-aqua-700"}`}
        >
          Ornamental Fish Farm
        </span>
      </span>
    </Link>
  );
}

