import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL, site } from "@/lib/site";
import { MotionProvider } from "@/components/MotionProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aquazone | Sri Lankan Ornamental Fish Exporter - Premium Live Tropical Fish",
    template: "%s | Aquazone Ornamental Fish Farm",
  },
  description: site.description,
  applicationName: "Aquazone",
  keywords: [
    "tropical ornamental fish exporter Sri Lanka",
    "Sri Lankan aquarium fish supplier",
    "ornamental fish export company",
    "freshwater tropical fish exporter",
    "aquarium fish wholesaler",
    "live tropical fish export",
    "Sri Lanka ornamental fish",
    "ornamental fish farm Sri Lanka",
    "tropical freshwater fish supplier",
  ],
  openGraph: {
    type: "website",
    siteName: "Aquazone Ornamental Fish Farm (Pvt) Ltd",
    title: "Aquazone | Sri Lanka's Living Reef, Delivered Worldwide",
    description: site.description,
    images: [{ url: "/images/koi-pond.jpg", width: 1600, height: 900, alt: "Colourful koi at the Aquazone farm" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "./" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b2545",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}