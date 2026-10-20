"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { posts, type Post } from "@/lib/content";
import { Icon } from "../Icon";
import { ease } from "@/lib/motion";

export function BlogCard({ p, large }: { p: Post; large?: boolean }) {
  return (
    <article className={`card group relative flex h-full overflow-hidden transition duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)] ${large ? "flex-col lg:flex-row" : "flex-col"}`}>
      <div className={`relative overflow-hidden bg-navy ${large ? "aspect-[16/10] lg:w-1/2" : "aspect-[16/10]"}`}>
        <Image src={p.image} alt="" fill sizes={large ? "(min-width:1024px) 40vw, 90vw" : "(min-width:1024px) 30vw, 90vw"} className="object-cover transition-transform duration-[900ms] group-hover:scale-110" />
      </div>
      <div className={`flex flex-1 flex-col p-6 ${large ? "lg:justify-center lg:p-10" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-aqua-700">
          <span>{p.category}</span>
          {p.draft && <span className="draft-badge">Draft</span>}
        </div>
        <h3 className={`mt-3 ${large ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          <Link href={`/news/${p.slug}`} className="text-ink no-underline after:absolute after:inset-0 after:content-['']" style={{ fontFamily: "var(--font-poppins)" }}>
            {p.title}
          </Link>
        </h3>
        <p className="mt-3 text-muted">{p.excerpt}</p>
        <p className="mt-auto inline-flex items-center gap-2 pt-5 font-semibold text-aqua-700">
          Read more
          <Icon name="arrow" size={18} className="transition-transform duration-300 group-hover:translate-x-2" />
        </p>
      </div>
    </article>
  );
}

const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))] as const;

export function NewsList() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const list = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  const featured = list.find((p) => p.featured) ?? list[0];
  const rest = list.filter((p) => p !== featured);

  return (
    <div>
      <LayoutGroup id="news">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Article categories">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`relative rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${cat === c ? "border-aqua text-ink" : "border-ink/15 text-muted hover:border-aqua/60"}`}
            >
              {cat === c && <motion.span layoutId="news-pill" className="absolute inset-0 rounded-full bg-aqua/20" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="popLayout">
        {featured && (
          <motion.div key={featured.slug} className="mt-8" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: ease.out }}>
            <BlogCard p={featured} large />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {rest.map((p, i) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, delay: i * 0.06, ease: ease.out }}>
              <BlogCard p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
