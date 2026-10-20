"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";

const milestones = [
  { when: "Year TBC", title: "Humble beginnings", body: "Aquazone starts with a modest collection of breeding tanks and a passionate team of aquatic enthusiasts, sharing Sri Lanka's beautiful aquatic fauna with the world." },
  { when: "Year TBC", title: "Growth built on fish health", body: "A dedication to exceptional fish health drives rapid growth, turning a local farm into a fully scaled enterprise." },
  { when: "Year TBC", title: "A modern export business", body: "Advanced biosecurity facilities, quarantine stations and engineered packing systems support international buyers." },
  { when: "Ongoing", title: "Growing with our communities", body: "Growth runs parallel to the economic development of surrounding rural communities, making Aquazone a cornerstone of local aquaculture." },
];

export function StoryTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  return (
    <div ref={ref} className="relative mx-auto max-w-3xl">
      <div className="absolute bottom-0 left-4 top-2 w-1 rounded-full bg-ink/10 md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
        <motion.div className="h-full origin-top rounded-full bg-gradient-to-b from-aqua to-sun" style={{ scaleY }} />
      </div>
      <ol className="space-y-12">
        {milestones.map((m, i) => (
          <li key={m.title} className={`relative pl-14 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}>
            <span
              className={`absolute left-[0.6rem] top-1.5 h-5 w-5 rounded-full border-4 border-aqua bg-surface md:left-auto ${i % 2 ? "md:-left-[0.65rem]" : "md:-right-[0.65rem]"}`}
              aria-hidden="true"
            />
            <Reveal dir={i % 2 ? "right" : "left"}>
              <span className="draft-badge">{m.when}</span>
              <h3 className="mt-3 text-xl">{m.title}</h3>
              <p className="mt-2 text-muted">{m.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
