import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, SectionHeading, GhostButton, PrimaryCTA } from "@/components/ui";
import { Reveal, Stagger, StaggerItem, WaterReveal } from "@/components/Reveal";
import { FinalCTA } from "@/components/Sections";
import { Icon, type IconName } from "@/components/Icon";
import { BubbleField } from "@/components/Underwater";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { Hl } from "@/components/Hl";

export const metadata: Metadata = {
  title: "Sustainability - Responsible Aquaculture & Community Partnerships",
  description:
    "Aquazone's commitment to responsible breeding, water recycling, biosecurity, animal welfare and community partnerships including woman-headed microenterprises in rural Sri Lanka.",
  alternates: { canonical: "/sustainability" },
};

const topics: { icon: IconName; title: string; body: string }[] = [
  { icon: "fish", title: "Responsible breeding", body: "Ethical breeding protocols and strict health checks for every fish." },
  { icon: "leaf", title: "Environmentally conscious aquaculture", body: "Eco-friendly production designed to protect local ecosystems." },
  { icon: "drop", title: "Water recycling & efficient usage", body: "Responsible water management across tanks and ponds." },
  { icon: "globe", title: "Aquatic ecosystem protection", body: "Conservation-minded practices for Sri Lanka's aquatic biodiversity." },
  { icon: "shield", title: "Biosecurity", body: "Quarantine and biosecurity procedures that protect fish and farms." },
  { icon: "paw", title: "Animal welfare", body: "Careful handling, conditioning and packing of live fish." },
  { icon: "check", title: "Ethical collection practices", body: "Native species are handled only within applicable legal frameworks." },
  { icon: "people", title: "Community partnerships", body: "Local outgrowers receive training, breeding stock and a buy-back market." },
  { icon: "star", title: "Rural economic empowerment", body: "Stable income for rural families, including woman-headed enterprises." },
];

export default function SustainabilityPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Sustainability", path: "/sustainability" }])} />
      <PageHero
        eyebrow="Sustainability"
        title="Growing Together. Protecting Tomorrow."
        text="Healthy fish, healthy waters and healthy communities: our supply chain is built so that growth benefits the people and places behind it."
        image="/images/bg/sustainability.jpg"
      />

      <section className="section overflow-hidden !pt-10" style={{ background: "linear-gradient(180deg,var(--surface),var(--alt) 60%,var(--green-wash))" }}>
        <div className="container-x">
          <SectionHeading eyebrow="Our commitments" title="Nine Ways We Look After Fish, Water and People" align="center" />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {topics.map((t, i) => (
              <StaggerItem key={t.title}>
                <div className="card group relative h-full overflow-hidden p-6 transition duration-500 hover:-translate-y-2">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl text-white"
                    style={{ background: i % 2 ? "#00b4c6" : "#2aa876", animation: `float-y ${4 + (i % 3)}s ease-in-out ${i * 0.25}s infinite` }}
                  >
                    <Icon name={t.icon} size={26} />
                  </span>
                  <h3 className="mt-5 text-lg">{t.title}</h3>
                  <p className="mt-2 text-muted">{t.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* water cycle */}
      <section className="on-dark relative overflow-hidden bg-deep py-24 sm:py-32">
        <BubbleField count={14} seed={23} />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal dir="left">
            <p className="eyebrow mb-4">Water stewardship</p>
            <h2 className="h2"><Hl>Water Is Our Most Valuable Resource</Hl></h2>
            <p className="mt-6 text-lg text-white/85">
              Aquaculture depends on clean, well-managed water. We prioritise responsible water management and efficient use
              so that the farm and the surrounding ecosystem stay healthy.
            </p>
            <p className="mt-4 text-sm text-white/65">
              <span className="draft-badge mr-2">Confirm</span>
              Specific recycling systems and volumes to be described by Aquazone.
            </p>
          </Reveal>
          <Reveal dir="right">
            <svg viewBox="0 -16 320 280" className="mx-auto w-full max-w-md overflow-visible" role="img" aria-label="Illustration of a continuous water cycle between tank, filtration and return flow">
              <circle cx="160" cy="120" r="84" fill="none" stroke="rgba(111,216,227,.35)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" style={{ animation: "dash-flow 1.6s linear infinite" }} />
              {[
                { x: 160, y: 36, l: "Clean water", c: "#00b4c6" },
                { x: 244, y: 120, l: "Tanks", c: "#ffd166" },
                { x: 160, y: 204, l: "Filtration", c: "#6fd8e3" },
                { x: 76, y: 120, l: "Return flow", c: "#2aa876" },
              ].map((n, i) => (
                <g key={n.l}>
                  <circle cx={n.x} cy={n.y} r="22" fill={n.c} style={{ animation: `inflate ${3 + i * 0.4}s ease-in-out infinite`, transformOrigin: `${n.x}px ${n.y}px` }} />
                  <path d={`M${n.x - 6} ${n.y - 2} q6 -12 12 0 a8 8 0 1 1 -12 0Z`} fill="#fff" />
                  <text x={n.x} y={n.y + (n.y > 120 ? 42 : n.y < 120 ? -30 : 42)} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
                    {n.l}
                  </text>
                </g>
              ))}
            </svg>
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal dir="left">
            <p className="eyebrow mb-4">Community &amp; livelihoods</p>
            <h2 className="h2"><Hl>Woman-Headed Enterprises at the Heart of Our Supply Chain</Hl></h2>
            <p className="mt-6 text-lg text-muted">
              We provide local women with specialised technical training, high-quality breeding stock and a guaranteed
              buy-back market - helping home-based aquarium setups grow into sustainable, higher-income micro-businesses.
            </p>
            <p className="mt-4 text-sm text-muted">
              <span className="draft-badge mr-2">Confirm</span>
              Impact numbers and, with permission, real participant stories will be added when verified.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryCTA />
              <GhostButton href="/about">About Aquazone</GhostButton>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            <WaterReveal className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/community-training.jpg" alt="Community members at an aquaculture training demonstration" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative aspect-square overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/pond-round.jpg" alt="A round pond with an aerator surrounded by trees" fill sizes="20vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative aspect-square overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/outgrower-visit.jpg" alt="Group visiting the farm tanks" fill sizes="20vw" className="object-cover" />
            </WaterReveal>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
