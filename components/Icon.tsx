import type { SVGProps } from "react";

export type IconName =
  | "fish" | "grade" | "shield" | "bag" | "plane" | "doc" | "box" | "chat"
  | "diamond" | "people" | "leaf" | "handshake" | "check" | "arrow" | "phone"
  | "mail" | "pin" | "whatsapp" | "facebook" | "instagram" | "linkedin"
  | "youtube" | "globe" | "drop" | "thermo" | "ph" | "oxygen" | "search"
  | "plus" | "minus" | "star" | "download" | "close" | "menu" | "list"
  | "microscope" | "water" | "trace" | "paw" | "cart";

const paths: Record<IconName, React.ReactNode> = {
  fish: (
    <>
      <path d="M2.5 12c3-4.5 7-6.5 11-6 2.7.3 5 1.8 7 4.5l1.5-2v7l-1.5-2c-2 2.7-4.3 4.2-7 4.5-4 .5-8-1.5-11-6Z" />
      <circle cx="16.5" cy="10.8" r=".8" fill="currentColor" />
    </>
  ),
  grade: (
    <>
      <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12 2.3 2.3 4.3-4.6" />
    </>
  ),
  bag: (
    <>
      <path d="M8 3h8l1 4c1.7 1.2 3 3.2 3 5.5C20 17 16.4 21 12 21S4 17 4 12.5C4 10.2 5.300 8.200 7 7l1-4Z" />
      <path d="M9 12.500c1 1 2 1 3 0s2-1 3 0" />
    </>
  ),
  plane: (
    <path d="M21 4.500 10.500 15.500M21 4.500l-6.500 16-4-5-5-4 15.500-7Z" />
  ),
  doc: (
    <>
      <path d="M6 3h8l5 5v13H6V3Z" />
      <path d="M14 3v5h5M9 13h7M9 17h7" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8.500 4.500v9L12 21l-8.500-4.500v-9L12 3Z" />
      <path d="m3.500 7.500 8.500 4.500 8.500-4.500M12 12v9" />
    </>
  ),
  chat: (
    <path d="M4 5h16v11H9.500L5 20v-4H4V5Z" />
  ),
  diamond: (
    <>
      <path d="M6 4h12l3.500 5.500L12 21 2.500 9.500 6 4Z" />
      <path d="M2.500 9.500h19M9 4l3 5.500L15 4M12 9.500V21" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.200" />
      <path d="M3 20c0-3.300 2.700-6 6-6s6 2.700 6 6" />
      <circle cx="17.500" cy="9" r="2.500" />
      <path d="M17 14.200c2.500.3 4.500 2.700 4.500 5.800" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 4-14 15-15 0 11-6 15-13 15" />
      <path d="M5 19c3-5 6-8 10-10" />
    </>
  ),
  handshake: (
    <>
      <path d="m2 12 4-4 4 1.500 3.500-1.500L18 10l4-1" />
      <path d="m2 12 6 6c1 1 2 .8 3 0l1-1m-1 1c.800.800 2 .8 3 0l2-2c.800-.800.800-2 0-2.800L15 11l-3.500 2" />
    </>
  ),
  check: <path d="m4.500 12.500 5 5L19.500 6.500" />,
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  phone: (
    <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10.300 21 3 13.700 3 6a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.500 7 8.500 6 8.500-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.200 7-11.500A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z" />
      <circle cx="12" cy="9.500" r="2.500" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.500 20.500 5 16a8.500 8.500 0 1 1 3 3l-4.500 1.500Z" />
      <path d="M9 8.500c0 3.500 3 6.500 6.500 6.500l1-1.500-2-1-1 .800c-1-.4-2-1.400-2.400-2.400l.800-1-1-2L9 8.500Z" />
    </>
  ),
  facebook: <path d="M14 21v-8h2.700l.5-3.300H14V7.600c0-1 .4-1.700 1.800-1.700h1.500V3.100A19 19 0 0 0 15 3c-2.500 0-4 1.500-4 4.200v2.500H8.300V13H11v8h3Z" />,
  instagram: (
    <>
      <rect x="3.500" y="3.500" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r=".8" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <path d="M5 9v10M5 5.200v.1M10 19V9m0 4c0-2.500 1.500-4 3.500-4S17 10.500 17 13v6" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.500" y="5.500" width="19" height="13" rx="4" />
      <path d="m10 9.500 5 2.500-5 2.500v-5Z" fill="currentColor" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  drop: <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" />,
  thermo: (
    <>
      <path d="M10 14.500V5a2 2 0 0 1 4 0v9.500a4 4 0 1 1-4 0Z" />
      <path d="M12 9v7" />
    </>
  ),
  ph: (
    <>
      <path d="M4 20V5h4.500a3 3 0 0 1 0 6H4" />
      <path d="M13 20V5m0 7h6m0-7v15" />
    </>
  ),
  oxygen: (
    <>
      <circle cx="8" cy="15" r="5" />
      <circle cx="17" cy="8" r="3" />
      <circle cx="18" cy="17" r="1.500" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.500" />
      <path d="m16 16 4.500 4.500" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  star: <path d="m12 3 2.700 5.600 6.100.8-4.500 4.200 1.200 6L12 16.800 6.500 19.600l1.200-6L3.200 9.400l6.100-.8L12 3Z" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  list: <path d="M9 6h11M9 12h11M9 18h11M4.500 6h.1M4.500 12h.1M4.500 18h.1" />,
  microscope: (
    <>
      <path d="M8 3h4v8H8zM10 11v3M6 21h12M8 17h6a4 4 0 0 0 0-8" />
    </>
  ),
  water: <path d="M2 9c2.500-2 4.500-2 7 0s4.500 2 7 0 4-2 6-1M2 15c2.500-2 4.500-2 7 0s4.500 2 7 0 4-2 6-1" />,
  trace: (
    <>
      <circle cx="6" cy="6" r="2.500" />
      <circle cx="18" cy="12" r="2.500" />
      <circle cx="7" cy="19" r="2.500" />
      <path d="m8.200 7.200 7.600 3.600M8.800 17.800l7-4" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.2l2.300 11h10.300l2.200-8H6.200" />
      <circle cx="9.500" cy="19.500" r="1.500" />
      <circle cx="17" cy="19.500" r="1.500" />
    </>
  ),
  paw: (
    <>
      <circle cx="6.500" cy="10" r="1.800" />
      <circle cx="10" cy="6" r="1.800" />
      <circle cx="14.500" cy="6" r="1.800" />
      <circle cx="18" cy="10" r="1.800" />
      <path d="M12 12c-3 0-5.500 3-4.500 5.500 1 2 3.500 1 4.500 1s3.500 1 4.500-1C17.500 15 15 12 12 12Z" />
    </>
  ),
};

export function Icon({
  name,
  size = 24,
  strokeWidth = 1.7,
  ...rest
}: { name: IconName; size?: number; strokeWidth?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

