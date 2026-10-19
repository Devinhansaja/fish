import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, SectionHeading, PrimaryCTA, GhostButton } from "@/components/ui";
import { Reveal, Stagger, StaggerItem, WaterReveal } from "@/components/Reveal";
import { ExportTimeline } from "@/components/home/ExportTimeline";
import { FinalCTA } from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { services, buyerJourney } from "@/lib/content";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Export & Services - Live Ornamental Fish Packing, Air Freight & Documentation",
  description:
    "Aquazone's export services: breeding and sourcing, grading, quarantine, live-fish packing, air freight, export documentation and custom consolidation orders for international buyers.",
  alternates: { canonical: "/export-services" },
};

export default function ExportServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Export & Services", path: "/export-services" }])} />
      <PageHero
        eyebrow="Export & services"
        title="From Our Farm to Your Aquarium"
        text="Every stage - breeding, grading, quarantine, packing, documentation and air freight - is coordinated by one team, so you deal with one trusted partner."
        image="/images/bg/export.jpg"
      >
        <PrimaryCTA />
        <GhostButton href="/quality-assurance">Quality Assurance</GhostButton>
      </PageHero>

      <section className="section bg-white !pt-10">
        <div className="container-x">
          <SectionHeading eyebrow="What we offer" title="End-to-End Support for International Buyers" align="center" />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <div className="card group h-full p-6 transition duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-aqua-300 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Icon name={s.icon} size={26} />
                  </span>
                  <h3 className="mt-5 text-lg">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="on-dark relative overflow-hidden bg-deep">
        <div className="container-x relative py-24 sm:py-32">
          <SectionHeading eyebrow="The export process" title="Five Careful Steps, One Healthy Shipment" align="center" dark />
          <div className="mt-16">
            <ExportTimeline />
          </div>
        </div>
      </section>

      <section className="section bg-mint">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <WaterReveal className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image src="/images/oxygen-packing.jpg" alt="Clear packing bags floating in a tank, ready for live-fish packing" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
          </WaterReveal>
          <Reveal dir="right">
            <p className="eyebrow mb-4">Professional live-fish packaging</p>
            <h2 className="h2">Packed for Arrival, Not Just Departure</h2>
            <p className="mt-6 text-lg text-muted">
              Fish are conditioned, graded and packed in appropriately sized bags with calibrated oxygen, then protected in
              outer packaging for transit. Packing is adapted to species, size and journey time.
            </p>
            <p className="mt-4 text-sm text-muted">
              <span className="draft-badge mr-2">Confirm</span>
              Packing specifications, transit-time handling and live-arrival terms to be confirmed by Aquazone.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="Buyer journey" title="From Inquiry to Dispatch" align="center" />
          <ol className="relative mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {buyerJourney.map((b, i) => (
              <li key={b} className="relative text-center">
                <Reveal delay={i * 0.1}>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-lg font-extrabold text-sun" style={{ fontFamily: "var(--font-poppins)" }}>
                    {i + 1}
                  </span>
                  <p className="mt-3 font-semibold text-navy">{b}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <PrimaryCTA />
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
