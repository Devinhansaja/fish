import Link from "next/link";
import { PageHero, PrimaryCTA, SectionHeading, GhostButton } from "./ui";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { FinalCTA } from "./Sections";
import { NotifyForm } from "./NotifyForm";
import { BubbleField } from "./Underwater";
import { Icon, type IconName } from "./Icon";
import { Hl } from "@/components/Hl";

type Kind = "plants" | "accessories";

/**
 * Planned ranges are PLACEHOLDERS until the client confirms what they will sell.
 * Edit the lists below (or replace this page with the real catalog when the range launches).
 */
const content: Record<
  Kind,
  {
    eyebrow: string;
    title: string;
    text: string;
    plannedTitle: string;
    image: string;
    planned: { icon: IconName; title: string; body: string }[];
    other: { href: string; label: string };
    note: string;
  }
> = {
  plants: {
    eyebrow: "Aquarium plants",
    title: "Aquarium Plants - Coming Soon",
    text: "Healthy, farm-grown aquatic plants to complete the aquariums your customers build. We are preparing the range now.",
    plannedTitle: "A planned range for every layer of the tank",
    planned: [
      { icon: "leaf", title: "Foreground & carpet plants", body: "Low-growing plants that cover the substrate." },
      { icon: "leaf", title: "Stem plants", body: "Fast-growing background plants for colour and density." },
      { icon: "leaf", title: "Rosette & sword plants", body: "Hardy centrepiece plants for community aquariums." },
      { icon: "drop", title: "Floating plants", body: "Surface cover that gives fish shade and shelter." },
      { icon: "water", title: "Mosses & ferns", body: "Easy plants for wood, rock and nano tanks." },
      { icon: "box", title: "Bulk & mixed packs", body: "Wholesale packing for importers and retailers." },
    ],
    image: "/images/bg/aquarium-plants.jpg",
    other: { href: "/aquarium-accessories", label: "See aquarium accessories" },
    note: "Live-plant exports usually need plant-health documentation for the destination market. Details will be confirmed before launch.",
  },
  accessories: {
    eyebrow: "Aquarium accessories",
    title: "Aquarium Accessories - Coming Soon",
    text: "Everything that goes with the fish: equipment and care products for aquarium retailers and wholesalers. The range is on its way.",
    plannedTitle: "A planned range for retailers and importers",
    planned: [
      { icon: "water", title: "Filters & pumps", body: "Filtration and circulation equipment." },
      { icon: "star", title: "Lighting", body: "Aquarium lighting for fish and planted tanks." },
      { icon: "thermo", title: "Heaters & thermometers", body: "Temperature control and monitoring." },
      { icon: "diamond", title: "Decor & hardscape", body: "Rocks, wood and ornaments." },
      { icon: "drop", title: "Water care & fish food", body: "Conditioners, test kits and nutrition." },
      { icon: "box", title: "Bulk & mixed orders", body: "Consolidated shipments alongside live fish." },
    ],
    image: "/images/bg/fish-collection.jpg", // TODO: add a dedicated accessories banner (e.g. public/images/bg/aquarium-accessories.jpg)
    other: { href: "/aquarium-plants", label: "See aquarium plants" },
    note: "Product specifications, brands and packing details will be published when the range is confirmed.",
  },
};

/** Decorative hero artwork: swaying plants / floating equipment icons. Pure CSS animation. */
function Art({ kind }: { kind: Kind }) {
  if (kind === "plants") {
    const blades = [
      { x: 30, h: 150, c: "#2aa876", d: 5.2, dl: 0 },
      { x: 62, h: 210, c: "#35c58a", d: 6.4, dl: -1.2 },
      { x: 94, h: 120, c: "#1f8f64", d: 4.8, dl: -2.4 },
      { x: 128, h: 240, c: "#2aa876", d: 7.1, dl: -0.6 },
      { x: 164, h: 170, c: "#6fd8a8", d: 5.8, dl: -3 },
      { x: 198, h: 130, c: "#1f8f64", d: 4.4, dl: -1.8 },
    ];
    return (
      <svg viewBox="0 0 230 260" className="h-auto w-full max-w-xs" aria-hidden="true">
        {blades.map((b) => (
          <path
            key={b.x}
            d={`M${b.x} 255 C ${b.x - 18} ${255 - b.h * 0.4}, ${b.x + 18} ${255 - b.h * 0.7}, ${b.x} ${255 - b.h} C ${b.x + 14} ${255 - b.h * 0.6}, ${b.x + 6} ${255 - b.h * 0.3}, ${b.x + 8} 255 Z`}
            fill={b.c}
            style={{ transformOrigin: `${b.x}px 255px`, animation: `plant-sway ${b.d}s ease-in-out ${b.dl}s infinite` }}
          />
        ))}
        <ellipse cx="115" cy="256" rx="110" ry="6" fill="rgba(255,255,255,.15)" />
      </svg>
    );
  }
  const items: { icon: IconName; x: string; y: string; d: number }[] = [
    { icon: "water", x: "8%", y: "10%", d: 5 },
    { icon: "thermo", x: "62%", y: "4%", d: 6.2 },
    { icon: "star", x: "36%", y: "42%", d: 4.6 },
    { icon: "box", x: "74%", y: "50%", d: 5.6 },
    { icon: "drop", x: "6%", y: "66%", d: 6.8 },
  ];
  return (
    <div className="relative h-60 w-full max-w-xs" aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={it.icon}
          className="absolute grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-white/10 text-aqua-300 backdrop-blur"
          style={{ left: it.x, top: it.y, animation: `float-y ${it.d}s ease-in-out ${-i}s infinite` }}
        >
          <Icon name={it.icon} size={30} />
        </span>
      ))}
    </div>
  );
}

export function ComingSoon({ kind }: { kind: Kind }) {
  const c = content[kind];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} text={c.text} image={c.image}>
        <span className="draft-badge !bg-sun !px-4 !py-1.5 !text-sm">Coming soon</span>
        <GhostButton href="/fish-collection">Browse our fish</GhostButton>
      </PageHero>

      {/* art + notify */}
      <section className="on-dark relative -mt-px overflow-hidden bg-deep">
        <BubbleField count={16} seed={kind === "plants" ? 41 : 43} />
        <div className="container-x relative grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal dir="left">
            <p className="eyebrow mb-4">Be the first to know</p>
            <h2 className="h2"><Hl>Launching in the coming months</Hl></h2>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Leave your email and we will tell you the moment {kind === "plants" ? "aquarium plants are" : "aquarium accessories are"} available to order.
            </p>
            <div className="mt-8">
              <NotifyForm topic={kind} />
            </div>
          </Reveal>
          <Reveal dir="right">
            <div className="flex justify-center">
              <Art kind={kind} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* planned range */}
      <section className="section bg-alt">
        <div className="container-x">
          <SectionHeading eyebrow="What is coming" title={c.plannedTitle} align="center" />
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted">
            <span className="draft-badge mr-2">Draft</span>Planned categories only. The final range will be confirmed by Aquazone.
          </p>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {c.planned.map((p, i) => (
              <StaggerItem key={p.title}>
                <div className="card group h-full p-6 transition duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl text-white transition-transform duration-500 group-hover:rotate-6"
                    style={{ background: kind === "plants" ? (i % 2 ? "#00b4c6" : "#2aa876") : "#0b2545", animation: `float-y ${4 + (i % 3)}s ease-in-out ${i * 0.3}s infinite` }}
                  >
                    <Icon name={p.icon} size={26} />
                  </span>
                  <h3 className="mt-5 text-lg">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">{c.note}</p>
        </div>
      </section>

      {/* meanwhile */}
      <section className="section bg-surface">
        <div className="container-x">
          <SectionHeading eyebrow="In the meantime" title="Aquazone fish are available to quote today" align="center" text="Koi, goldfish, tropical freshwater fish and selected Sri Lankan native species." />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <PrimaryCTA />
            <GhostButton href="/fish-collection">View the fish collection</GhostButton>
            <Link href={c.other.href} className="link-aqua">
              {c.other.label} &rarr;
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
