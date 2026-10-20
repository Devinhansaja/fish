import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/ui";
import { FinalCTA } from "@/components/Sections";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Gallery - Ornamental Fish, Facilities & Farm Operations",
  description:
    "Photographs from the Aquazone farm: koi and goldfish, breeding facilities, hatchery, farm operations, packing and community training sessions in Sri Lanka.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }])} />
      <PageHero
        eyebrow="Gallery"
        title="Inside the Aquazone Farm"
        text="Real photographs of our fish, tanks and people - from breeding facilities and fry grading to packing and community training."
        image="/images/bg/gallery.jpg"
      />
      <section className="section bg-surface !pt-10">
        <div className="container-x">
          <GalleryGrid />
          <p className="mt-10 text-sm text-muted">
            Quarantine and international exhibition photography will be added when supplied.
          </p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
