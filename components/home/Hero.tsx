"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BubbleField, FishSwarm, LightRays, useActive } from "../Underwater";
import { useMotionPrefs } from "../MotionProvider";
import { SplitWords } from "../Reveal";
import { GhostButton, PrimaryCTA, WaveDivider } from "../ui";
import { ease } from "@/lib/motion";

/**
 * Full-bleed background. The poster frame is a real <Image> (fast first paint); the video fades in on top
 * once it is playing. With reduced motion only the still frame is shown. Pauses when scrolled away.
 */
function HeroBackdrop({ playing }: { playing: boolean }) {
  const { reduced } = useMotionPrefs();
  const [ready, setReady] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, reduced]);

  return (
    <>
      <Image src="/media/home-bg.jpg" alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover" />
      {!reduced && (
        <video
          ref={video}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/home-bg.jpg"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setReady(true)}
        >
          <source src="/media/home-bg.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useActive(ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="on-dark relative flex min-h-[100svh] items-center overflow-hidden bg-navy"
      aria-labelledby="hero-title"
    >
      {/* Background: looping underwater video (still frame shown first, and for reduced motion) */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <HeroBackdrop playing={inView} />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,26,51,.88) 0%, rgba(11,37,69,.62) 38%, rgba(10,74,107,.55) 70%, rgba(0,180,198,.5) 100%)",
        }}
      />
      <div className="absolute inset-0" style={{ background: "var(--grad-glow)" }} />

      <LightRays />
      <FishSwarm />
      <BubbleField count={32} interactive />

      <motion.div className="container-x relative z-10 pb-36 pt-36" style={{ y: fgY, opacity: fade }}>
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          Sri Lankan Ornamental Fish Exporter
        </motion.p>
        <h1 id="hero-title" className="h1 max-w-4xl text-white drop-shadow-[0_4px_30px_rgba(7,26,51,.55)]">
          <SplitWords text="Premium Tropical Fish from Sri Lanka to the World" delay={0.2} />
        </h1>
        <motion.p
          className="mt-7 max-w-2xl text-lg text-white/90 sm:text-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: ease.out }}
        >
          Discover exceptional freshwater ornamental fish, responsibly bred and carefully prepared for international
          markets. From Sri Lanka&apos;s tropical waters to aquariums around the world.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.35, ease: ease.out }}
        >
          <PrimaryCTA pulse />
          <GhostButton href="/fish-collection">Explore Our Fish Collection</GhostButton>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <div className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 sm:flex">
        <span>Scroll</span>
        <span className="relative block h-9 w-5 rounded-full border-2 border-white/60" aria-hidden="true">
          <span
            className="absolute left-1/2 top-1.5 h-2 w-1 -translate-x-1/2 rounded bg-white"
            style={{ animation: "scroll-cue 1.8s ease-in-out infinite" }}
          />
        </span>
      </div>

      <div className="absolute inset-x-0 -bottom-px z-10">
        <WaveDivider fill="#eefffc" />
      </div>
    </section>
  );
}
