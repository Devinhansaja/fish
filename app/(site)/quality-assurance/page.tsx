import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, SectionHeading, PrimaryCTA } from "@/components/ui";
import { Reveal, Stagger, StaggerItem, WaterReveal } from "@/components/Reveal";
import { QualityChecklist, WaterQualityDashboard } from "@/components/Quality";
import { FinalCTA } from "@/components/Sections";
import { Icon, type IconName } from "@/components/Icon";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { CertCard } from "@/components/CertCard";
import { Hl } from "@/components/Hl";

export const metadata: Metadata = {
  title: "Quality Assurance - Quarantine, Biosecurity & Export Compliance",
  description:
    "How Aquazone protects fish health: quarantine and conditioning, disease prevention, water-quality monitoring, grading, oxygen packing, traceability and export documentation.",
  alternates: { canonical: "/quality-assurance" },
};

const pillars: { icon: IconName; title: string; body: string }[] = [
  { icon: "diamond", title: "Aquaculture quality standards", body: "Strict health checks, ethical breeding protocols and optimal conditioning for every fish." },
  { icon: "shield", title: "Quarantine processes", body: "Dedicated quarantine and conditioning before any fish is cleared for export." },
  { icon: "microscope", title: "Disease prevention", body: "Biosecurity practices designed to prevent disease entering or leaving the farm." },
  { icon: "water", title: "Water-quality checks", body: "Regular monitoring of temperature, pH and oxygen." },
  { icon: "grade", title: "Selection & grading", body: "Fish are selected and graded to agreed specifications." },
  { icon: "bag", title: "Oxygen packing systems", body: "Calibrated oxygenation and protective packaging for transit." },
  { icon: "trace", title: "Traceability", body: "Records that connect each shipment back to its source." },
  { icon: "doc", title: "Export documentation", body: "Applicable veterinary, customs and biosecurity documents." },
];

export default function QualityPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Quality Assurance", path: "/quality-assurance" }])} />
      <PageHero
        eyebrow="Quality assurance"
        title="Every Fish Matters. Every Shipment Counts."
        text="Confidence for importers starts with fish health. Here is how quality is built into each step at Aquazone."
        image="/images/bg/quality.jpg"
      >
        <PrimaryCTA>Request Export Information</PrimaryCTA>
      </PageHero>

      <section className="section bg-surface !pt-10">
        <div className="container-x">
          <SectionHeading eyebrow="Our quality system" title="Eight Pillars of Healthy Exports" align="center" />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
            {pillars.map((p) => (
              <StaggerItem key={p.title}>
                <div className="card group h-full p-6 transition duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-aqua-300 transition-transform duration-500 group-hover:rotate-6">
                    <Icon name={p.icon} size={26} />
                  </span>
                  <h3 className="mt-5 text-lg">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section bg-alt">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">Health-check routine</p>
              <h2 className="h2"><Hl>Checked Before It&apos;s Packed</Hl></h2>
            </Reveal>
            <div className="mt-8">
              <QualityChecklist
                items={[
                  "Visual health inspection",
                  "Quarantine and conditioning period",
                  "Water-quality verification",
                  "Grading to agreed specification",
                  "Oxygen packing and sealing",
                  "Documentation review before dispatch",
                ]}
              />
            </div>
            <p className="mt-6 text-sm text-muted">
              <span className="draft-badge mr-2">Confirm</span>
              Exact protocols, durations and thresholds to be provided by Aquazone.
            </p>
          </div>
          <WaterReveal className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image src="/images/numbered-tanks.jpg" alt="Numbered blue tanks used for organised stock management" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
          </WaterReveal>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-x">
          <SectionHeading eyebrow="Monitoring" title="Stable Water, Healthy Fish" align="center" text="Temperature, pH and dissolved oxygen are the numbers every aquaculture team watches." />
          <div className="mt-12">
            <WaterQualityDashboard />
          </div>
        </div>
      </section>

      <section className="section bg-alt">
        <div className="container-x">
          <SectionHeading eyebrow="Licences & certifications" title="Verified Credentials" align="center" text="Official certificates will appear here once supplied. Hover or focus a card to flip it." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: "Exporter registration", b: "Government registration number and issuing authority." },
              { t: "Health & veterinary documentation", b: "Documents provided for destination markets." },
              { t: "Quality / biosecurity credentials", b: "Any applicable accreditation or audit marks." },
            ].map((c) => (
              <CertCard key={c.t} title={c.t} detail={c.b} />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA fill="var(--alt)" />
    </>
  );
}
