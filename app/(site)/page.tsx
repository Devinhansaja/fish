import Image from "next/image";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { FeatureCards } from "@/components/home/FeatureCards";
import { FishCarousel } from "@/components/home/FishCarousel";
import { WorldExportMap } from "@/components/home/WorldExportMap";
import { ExportTimeline } from "@/components/home/ExportTimeline";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { FinalCTA, SustainabilityPreview } from "@/components/Sections";
import { QualityChecklist } from "@/components/Quality";
import { GhostButton, PrimaryCTA, SectionHeading, WaveDivider } from "@/components/ui";
import { Reveal, WaterReveal } from "@/components/Reveal";
import { BubbleField } from "@/components/Underwater";
import { Hl } from "@/components/Hl";

export const metadata: Metadata = {
  title: { absolute: "Aquazone | Sri Lankan Ornamental Fish Exporter - Premium Live Tropical Fish" },
  description:
    "Aquazone is a Sri Lankan exporter of premium live ornamental freshwater fish - koi, goldfish and tropical species - for wholesalers, distributors and aquariums worldwide. Request a quotation.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />

      {/* 03 - Welcome */}
      <section className="section overflow-hidden bg-alt" aria-labelledby="welcome-title">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <WaterReveal className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/images/tank-hall-a.jpg"
              alt="A worker walking through racks of glass aquariums at the Aquazone farm"
              fill
              sizes="(min-width:1024px) 40vw, 90vw"
              className="object-cover"
            />
          </WaterReveal>
          <Reveal dir="right">
            <p className="eyebrow mb-4">Welcome to Aquazone</p>
            <h2 id="welcome-title" className="h2">
              <Hl>Bringing Sri Lanka&apos;s Finest Ornamental Fish to the World</Hl>
            </h2>
            <p className="mt-6 text-lg text-muted">
              Aquazone Ornamental Fish Farm (Pvt) Ltd is a government-registered exporter of high-quality live
              freshwater ornamental fish. Sri Lanka&apos;s tropical climate, abundant water and rich biodiversity give us
              an ideal home for breeding, conditioning and exporting vibrant aquatic life.
            </p>
            <p className="mt-4 text-lg text-muted">
              We combine aquaculture expertise, careful conditioning, responsible breeding and export coordination -
              while supporting rural outgrowers and inclusive local economic development.
            </p>
            <div className="mt-8">
              <GhostButton href="/about">Discover Our Story</GhostButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 - Why choose */}
      <section className="section bg-surface" aria-labelledby="why-title">
        <div className="container-x">
          <SectionHeading eyebrow="Why choose Aquazone?" title="Quality You Can Trust. Values You Can Share." align="center" />
          <FeatureCards />
        </div>
      </section>

      {/* 05 - Featured fish */}
      <section className="section overflow-hidden bg-alt !pb-10" aria-labelledby="featured-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Fish collection"
            title="Discover Our Living Collection"
            text="Explore vibrant, carefully selected ornamental freshwater fish for international markets."
          />
        </div>
        <div className="mt-6">
          <FishCarousel />
        </div>
        <div className="container-x mt-6 text-center">
          <GhostButton href="/fish-collection">View All Fish</GhostButton>
        </div>
      </section>

      {/* 06 - Global export network */}
      <section className="on-dark relative overflow-hidden bg-deep" aria-labelledby="map-title">
        <div className="absolute inset-x-0 top-0 rotate-180">
          <WaveDivider fill="var(--alt)" />
        </div>
        <BubbleField count={14} seed={11} />
        <div className="container-x relative py-28 sm:py-36">
          <SectionHeading
            eyebrow="Global export network"
            title="Connecting Sri Lankan Aquaculture to Global Markets"
            text="From Nelawa to aquariums worldwide: time-sensitive supply chains, rapid air-freight routes and export documentation handled by an experienced team."
            align="center"
            dark
          />
          <div className="mt-12">
            <WorldExportMap />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-white/75">
            <span className="draft-badge mr-2">Placeholder</span>
            Highlighted regions are illustrative. Confirmed export destinations will replace them once supplied by Aquazone.
          </p>
          <div className="mt-8 text-center">
            <PrimaryCTA pulse />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-[-1px]">
          <WaveDivider fill="var(--surface)" />
        </div>
      </section>

      {/* 07 - Quality preview */}
      <section className="section overflow-hidden bg-surface" aria-labelledby="quality-title">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">Quality assurance</p>
              <h2 id="quality-title" className="h2">
                <Hl>Every Fish Matters. Every Shipment Counts.</Hl>
              </h2>
              <p className="mt-6 text-lg text-muted">
                From the tank to the box, each stage is handled with care, so that healthy, well-conditioned fish reach
                your aquariums.
              </p>
            </Reveal>
            <div className="mt-8">
              <QualityChecklist
                items={[
                  "Fish health monitoring",
                  "Quarantine and conditioning",
                  "Water-quality monitoring",
                  "Quality grading",
                  "Professional oxygen packing",
                  "Export preparation",
                ]}
              />
            </div>
            <div className="mt-10">
              <GhostButton href="/quality-assurance">Explore Our Quality Standards</GhostButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <WaterReveal className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/glass-tanks.jpg" alt="Rows of glass tanks used for conditioning ornamental fish" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative aspect-square overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/grading-fry.jpg" alt="A worker handling young fish during grading" fill sizes="(min-width:1024px) 20vw, 45vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative aspect-square overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/oxygen-packing.jpg" alt="Packing bags floating in a tank before oxygen packing" fill sizes="(min-width:1024px) 20vw, 45vw" className="object-cover" />
            </WaterReveal>
          </div>
        </div>
      </section>

      {/* 08 - How we export */}
      <section className="on-dark relative overflow-hidden bg-navy-900" aria-labelledby="export-title">
        <div className="absolute inset-0 bg-deep opacity-70" aria-hidden="true" />
        <BubbleField count={16} seed={19} />
        <div className="container-x relative py-24 sm:py-32">
          <SectionHeading eyebrow="How we export" title="From Our Farm to Your Aquarium" align="center" dark />
          <div className="mt-16">
            <ExportTimeline />
          </div>
        </div>
      </section>

      {/* 09 - Sustainability */}
      <SustainabilityPreview />

      {/* 10 - Testimonials */}
      <section className="section bg-surface" aria-labelledby="testimonials-title">
        <div className="container-x">
          <SectionHeading eyebrow="What buyers say" title="Trusted by Aquarium Businesses" align="center" />
          <div className="mt-12">
            <TestimonialsSlider />
          </div>
        </div>
      </section>

      {/* 11 - Final CTA */}
      <FinalCTA />
    </>
  );
}
