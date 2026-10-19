import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, SectionHeading, Check, GhostButton, PrimaryCTA } from "@/components/ui";
import { Reveal, Stagger, StaggerItem, WaterReveal } from "@/components/Reveal";
import { FeatureCards } from "@/components/home/FeatureCards";
import { StoryTimeline } from "@/components/StoryTimeline";
import { FinalCTA } from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About Aquazone - Sri Lankan Ornamental Fish Exporter",
  description:
    "Learn about Aquazone Ornamental Fish Farm (Pvt) Ltd: our vision, mission, story, values, management expertise, rural outgrower community and export experience.",
  alternates: { canonical: "/about" },
};

// TODO: replace placeholders with real management profiles (names, photos, bios) supplied by Aquazone.
const team = [
  { role: "Ichthyology & aquaculture lead", note: "Breeding programmes and species expertise" },
  { role: "Veterinary & fish-health lead", note: "Health monitoring, quarantine and biosecurity" },
  { role: "International logistics lead", note: "Packing, air freight and customs clearance" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }])} />
      <PageHero
        eyebrow="About Aquazone"
        title="A Sri Lankan Exporter Built on Fish Health and Community"
        text="Aquazone Ornamental Fish Farm (Pvt) Ltd breeds, conditions and exports high-quality live freshwater ornamental fish to wholesalers, distributors and retailers across the globe."
        image="/images/shade-house.jpg"
      >
        <PrimaryCTA />
        <GhostButton href="/export-services">Our Export Services</GhostButton>
      </PageHero>

      {/* Introduction */}
      <section className="section bg-white !pt-10">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal dir="left">
            <p className="eyebrow mb-4">Company profile</p>
            <h2 className="h2">Premier, Government-Registered, Export-Ready</h2>
            <p className="mt-6 text-lg text-muted">
              Capitalising on Sri Lanka&apos;s ideal tropical climate, abundant natural water resources and rich biodiversity,
              we specialise in breeding, conditioning and exporting a diverse array of vibrant aquatic life.
            </p>
            <p className="mt-4 text-lg text-muted">
              Our advanced biosecurity facilities and quarantine stations are designed to meet international standards,
              so that we deliver exceptionally healthy livestock to buyers worldwide.
            </p>
            <p className="mt-4 text-sm text-muted">
              <span className="draft-badge mr-2">Confirm</span>
              Registration number and licence details to be added by Aquazone.
            </p>
          </Reveal>
          <WaterReveal className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image src="/images/tank-hall-b.jpg" alt="Multi-level glass tank racks inside a bright, shaded Aquazone facility" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
          </WaterReveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="on-dark relative overflow-hidden bg-deep py-24 sm:py-28">
        <div className="absolute inset-0" style={{ background: "var(--grad-glow)" }} aria-hidden="true" />
        <div className="container-x relative grid gap-8 md:grid-cols-2">
          <Reveal dir="left">
            <div className="glass h-full p-8 sm:p-10">
              <p className="eyebrow mb-3">Our vision</p>
              <p className="text-xl leading-relaxed text-white sm:text-2xl">
                To be the global benchmark for excellence in the ornamental fish export industry, celebrated for our
                commitment to quality, community empowerment and environmental sustainability.
              </p>
            </div>
          </Reveal>
          <Reveal dir="right">
            <div className="glass h-full p-8 sm:p-10">
              <p className="eyebrow mb-3">Our mission</p>
              <p className="text-lg leading-relaxed text-white/95">
                To enrich the global aquarium hobbyist community by consistently supplying a diverse range of premium,
                healthy and sustainably raised freshwater fish. We achieve this by fostering strategic partnerships with
                local outgrowers, utilising cutting-edge aquaculture technology and creating resilient rural livelihoods.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-mint">
        <div className="container-x">
          <SectionHeading eyebrow="Our story" title="From a Few Breeding Tanks to a Modern Export Enterprise" align="center" />
          <div className="mt-14">
            <StoryTimeline />
          </div>
          <p className="mt-10 text-center text-sm text-muted">
            <span className="draft-badge mr-2">Draft</span>
            Founding dates and milestones to be confirmed by Aquazone.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="Core values" title="What Guides Every Shipment" align="center" />
          <FeatureCards />
        </div>
      </section>

      {/* Management */}
      <section className="section bg-mint">
        <div className="container-x">
          <SectionHeading
            eyebrow="Management & expertise"
            title="Decades of Collective Aquatic and Export Experience"
            text="Our leadership team combines seasoned ichthyologists, veterinary experts and international logistics professionals who oversee every phase of operations - from managing outgrower networks to customs clearance."
          />
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {team.map((t) => (
              <StaggerItem key={t.role}>
                <div className="card group h-full overflow-hidden p-6 text-center transition hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                  <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-deep text-aqua-300 transition-transform duration-500 group-hover:scale-110">
                    <Icon name="people" size={46} />
                  </div>
                  <h3 className="mt-5 text-lg">{t.role}</h3>
                  <p className="mt-1 text-sm text-muted">{t.note}</p>
                  <span className="draft-badge mt-4">Profile to be added</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Community */}
      <section className="section bg-white">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <WaterReveal className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/community-visit.jpg" alt="Visitors and community members walking between aquaculture tanks" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative aspect-square overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/outgrower-visit.jpg" alt="An outgrower group visiting tanks" fill sizes="20vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative aspect-square overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/farm-training.jpg" alt="Participants around grow-out tanks during training" fill sizes="20vw" className="object-cover" />
            </WaterReveal>
          </div>
          <Reveal dir="right">
            <p className="eyebrow mb-4">Community &amp; livelihood impact</p>
            <h2 className="h2">Not Just Exporting Fish - Empowering Households</h2>
            <p className="mt-6 text-lg text-muted">
              At the heart of Aquazone&apos;s business model is a deep commitment to socio-economic development across Sri
              Lanka. We have built an outgrower ecosystem where local families and rural livelihoods grow alongside us.
            </p>
            <ul className="mt-6 space-y-3 text-lg">
              <Check>Specialised technical training for local women and families</Check>
              <Check>High-quality breeding stock</Check>
              <Check>A guaranteed buy-back market</Check>
              <Check>Home-based aquarium setups become sustainable micro-businesses</Check>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Export expertise + why */}
      <section className="section bg-mint">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal dir="left">
            <p className="eyebrow mb-4">Export experience</p>
            <h2 className="h2">Complex, Time-Sensitive Supply Chains - Handled</h2>
            <p className="mt-6 text-lg text-muted">
              Aquazone has experience managing time-sensitive international supply chains and navigating veterinary,
              customs and biosecurity regulations of diverse markets. Our logistics framework uses engineered packing
              systems with temperature-aware packaging, calibrated oxygenation and rapid transit routes to protect
              live-arrival survival.
            </p>
            <p className="mt-4 text-sm text-muted">
              <span className="draft-badge mr-2">Confirm</span>
              Live-arrival performance figure and destination markets to be provided by Aquazone.
            </p>
          </Reveal>
          <Reveal dir="right">
            <div className="card p-8">
              <h3 className="text-2xl">Why Choose Aquazone?</h3>
              <ul className="mt-6 space-y-3">
                <Check>A reliable supply of fine freshwater ornamental fish from Sri Lanka</Check>
                <Check>An ethical, socially responsible supply chain</Check>
                <Check>Highly competitive pricing and custom consolidation orders</Check>
                <Check>An exceptionally wide variety of species</Check>
                <Check>Rigorous quarantine protocols and proactive customer support</Check>
                <Check>Live-arrival commitment <span className="draft-badge ml-1">terms to confirm</span></Check>
              </ul>
              <div className="mt-8">
                <PrimaryCTA />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA fill="#eefffc" />
    </>
  );
}
