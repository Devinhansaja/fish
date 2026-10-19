/**
 * Central company + navigation configuration.
 *
 * TODO markers: every value flagged `null` or "TBC" must be confirmed by
 * Aquazone before launch. Nothing here is invented.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "Aquazone Ornamental Fish Farm (Pvt) Ltd",
  shortName: "Aquazone",
  /** Web design & development credit shown in the footer */
  builder: "Gloma International",
  tagline: "Sri Lanka's Living Reef, Delivered Worldwide.",
  description:
    "Aquazone Ornamental Fish Farm (Pvt) Ltd is a Sri Lankan exporter of high-quality live ornamental freshwater fish for wholesalers, distributors, retailers and public aquariums worldwide.",
  address: {
    line1: "Nelawa, Kohilagethera",
    country: "Sri Lanka",
  },
  /** TODO: confirm with Aquazone */
  phone: process.env.NEXT_PUBLIC_PHONE ?? null,
  email: process.env.NEXT_PUBLIC_EMAIL ?? null,
  /** International format digits only, e.g. 94771234567. TODO: confirm */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  /** TODO: add the verified Google Maps embed URL */
  mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL ?? null,
  /** TODO: add official profile URLs */
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? null,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? null,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? null,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? null,
  },
  /** TODO: upload the official company profile PDF to /public and set this path */
  profilePdf: process.env.NEXT_PUBLIC_PROFILE_PDF ?? null,
} as const;

export type NavItem = { label: string; href: string; /** page exists but the range is not launched yet */ soon?: boolean };

/** Product ranges. Shown as a "Products" dropdown in the header and flat in the footer / mobile menu. */
export const productNav: NavItem[] = [
  { label: "Fish Collection", href: "/fish-collection" },
  { label: "Aquarium Plants", href: "/aquarium-plants", soon: true },
  { label: "Aquarium Accessories", href: "/aquarium-accessories", soon: true },
];

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  ...productNav,
  { label: "Export & Services", href: "/export-services" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Quality Assurance", href: "/quality-assurance" },
  { label: "Gallery", href: "/gallery" },
  { label: "News & Blog", href: "/news" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

export const QUOTE_HREF = "/contact#inquiry";

/**
 * Company statistics. `value: null` means "not yet confirmed" -
 * the counter will NOT animate a fake number; it renders "TBC".
 */
export type Stat = { label: string; value: number | null; suffix?: string };
export const stats: Stat[] = [
  { label: "Fish species", value: null }, // TODO confirm
  { label: "Export destinations", value: null }, // TODO confirm
  { label: "Outgrower families", value: null }, // TODO confirm
  { label: "Live-arrival performance", value: null, suffix: "%" }, // TODO confirm
];

/**
 * Placeholder export regions for the world map. These are NOT confirmed
 * destinations. Replace with verified countries when supplied.
 */
export type Destination = {
  id: string;
  label: string;
  /** longitude, latitude */
  lon: number;
  lat: number;
  confirmed: boolean;
};
export const origin = { label: "Nelawa, Sri Lanka", lon: 80.4, lat: 7.4 };
export const destinations: Destination[] = [
  { id: "eu", label: "Europe (placeholder)", lon: 10, lat: 50, confirmed: false },
  { id: "me", label: "Middle East (placeholder)", lon: 48, lat: 26, confirmed: false },
  { id: "ea", label: "East Asia (placeholder)", lon: 118, lat: 34, confirmed: false },
  { id: "na", label: "North America (placeholder)", lon: -90, lat: 40, confirmed: false },
  { id: "oc", label: "Oceania (placeholder)", lon: 145, lat: -28, confirmed: false },
];

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  draft: boolean;
};
/** TODO: replace with genuine, permission-cleared testimonials. */
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "Placeholder: add a genuine comment from an aquarium wholesaler about fish quality and packing.",
    author: "Customer name TBC",
    role: "Aquarium wholesaler",
    draft: true,
  },
  {
    id: "t2",
    quote: "Placeholder: add a genuine comment from an import partner about communication and export documentation.",
    author: "Customer name TBC",
    role: "International distributor",
    draft: true,
  },
  {
    id: "t3",
    quote: "Placeholder: add a genuine comment from a retailer about species variety and consistency.",
    author: "Customer name TBC",
    role: "Aquarium retailer",
    draft: true,
  },
];

export const buyerTypes = [
  "Wholesaler",
  "Distributor",
  "Retailer / aquarium store",
  "Public aquarium",
  "Trading company",
  "Online aquarium business",
  "Other",
] as const;
