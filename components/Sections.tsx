"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BubbleField, LightRays } from "./Underwater";
import { GhostButton, PrimaryCTA, WaveDivider } from "./ui";
import { Reveal, Stagger, StaggerItem, WaterReveal } from "./Reveal";
import { Icon, type IconName } from "./Icon";
import { site } from "@/lib/site";

export function FinalCTA({ fill = "#ffffff" }: { fill?: string }) {
  return (
    <section className="on-dark relative overflow-hidden bg-deep" aria-labelledby="final-cta">
      <div className="absolute inset-x-0 top-0 rotate-180">
        <WaveDivider fill={fill} />
      </div>
      <LightRays />
      <BubbleField count={22} seed={5} />
      <div className="container-x relative py-28 text-center sm:py-36">
        <Reveal>
          <h2 id="final-cta" className="h2 mx-auto max-w-3xl text-white">
            Ready to Source Premium Tropical Fish from Sri Lanka?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/90">
            Connect with Aquazone and explore ornamental fish supply opportunities for your business.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <PrimaryCTA pulse />
            <GhostButton href="/contact">Contact Our Export Team</GhostButton>
            {site.whatsapp && (
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                data-track="whatsapp-click"
              >
                <Icon name="whatsapp" size={20} /> WhatsApp
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const pillars: { icon: IconName; label: string }[] = [
  { icon: "people", label: "Community partnerships" },
  { icon: "fish", label: "Local outgrower development" },
  { icon: "leaf", label: "Woman-headed enterprises" },
  { icon: "doc", label: "Technical guidance & training" },
  { icon: "star", label: "Sustainable household income" },
  { icon: "drop", label: "Responsible water use" },
  { icon: "paw", label: "Animal welfare" },
  { icon: "globe", label: "Environmental conservation" },
];

export function SustainabilityPreview() {
  return (
    <section className="section overflow-hidden" style={{ background: "linear-gradient(180deg,#ffffff 0%,#eefffc 40%,#dff8ea 100%)" }} aria-labelledby="sust-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow mb-4">Sustainability &amp; Community</p>
            <h2 id="sust-title" className="h2">
              Growing Together. Protecting Tomorrow.
            </h2>
            <p className="mt-6 text-lg text-muted">
              Aquazone is built on a rural outgrower network. Local families, including woman-headed enterprises,
              receive technical training, quality breeding stock and a guaranteed buy-back market - turning home-based
              aquarium setups into sustainable micro-businesses.
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 sm:grid-cols-2" gap={0.07}>
            {pillars.map((p, i) => (
              <StaggerItem key={p.label}>
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-navy/5 backdrop-blur">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                    style={{ background: i % 2 ? "#00b4c6" : "#2aa876", animation: `float-y ${4 + (i % 3)}s ease-in-out ${i * 0.3}s infinite` }}
                  >
                    <Icon name={p.icon} size={20} />
                  </span>
                  <span className="font-semibold text-navy">{p.label}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <GhostButton href="/sustainability">Our Sustainability Commitment</GhostButton>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          {/* ripple illustration */}
          <div className="motion-decor pointer-events-none absolute -right-10 -top-10 h-56 w-56" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute inset-0 rounded-full border-2 border-aqua/50"
                style={{ animation: `pulse-dot 4.5s ease-out ${i * 1.5}s infinite` }}
              />
            ))}
          </div>
          <div className="grid grid-cols-6 grid-rows-6 gap-4">
            <WaterReveal className="relative col-span-4 row-span-4 aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/community-training.jpg" alt="Community members at a practical aquaculture training session" fill sizes="(min-width:1024px) 34vw, 70vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative col-span-2 row-span-3 overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/farm-landscape.jpg" alt="Blue aquaculture tanks surrounded by green hills" fill sizes="(min-width:1024px) 17vw, 30vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative col-span-2 row-span-3 overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/outgrower-visit.jpg" alt="Outgrower group visiting the tanks" fill sizes="(min-width:1024px) 17vw, 30vw" className="object-cover" />
            </WaterReveal>
            <WaterReveal className="relative col-span-4 row-span-2 overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/farm-training.jpg" alt="Participants gathered around grow-out tanks during training" fill sizes="(min-width:1024px) 34vw, 70vw" className="object-cover" />
            </WaterReveal>
          </div>
          <motion.div
            className="glass absolute -bottom-6 left-4 hidden px-5 py-4 text-sm font-semibold text-navy sm:block"
            style={{ background: "rgba(255,255,255,.85)" }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            Impact figures will be added once verified.
          </motion.div>
        </div>
      </div>
    </section>
  );
}
