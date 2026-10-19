"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { categories, type Availability, type CategoryId } from "@/lib/species";
import { useSpecies } from "../SpeciesProvider";
import { FishCard } from "./FishCard";
import { Icon } from "../Icon";
import { FishIllustration } from "../Underwater";
import { ease } from "@/lib/motion";

type SizeBand = "all" | "small" | "medium" | "large";
const sizeBands: { id: SizeBand; label: string }[] = [
  { id: "all", label: "Any size" },
  { id: "small", label: "Small (< 6 cm)" },
  { id: "medium", label: "Medium (6-12 cm)" },
  { id: "large", label: "Large / grades" },
];

/** Rough size band from the draft size text (for filtering only). */
function sizeBand(text: string): SizeBand {
  const nums = (text.match(/\d+(\.\d+)?/g) ?? []).map(Number);
  if (!nums.length) return "large"; // "Enquire for sizes" -> grade-based (koi/goldfish)
  const max = Math.max(...nums);
  if (max < 6) return "small";
  if (max <= 12) return "medium";
  return "large";
}

const groups = ["All", "Tropical Freshwater Fish", "Koi & Goldfish", "Sri Lankan Native Species"] as const;

export function FishGrid() {
  const { species } = useSpecies();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<(typeof groups)[number]>("All");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [size, setSize] = useState<SizeBand>("all");
  const [avail, setAvail] = useState<Availability | "all">("all");
  const [origin, setOrigin] = useState<"all" | "sri-lanka">("all");
  const [searchOpen, setSearchOpen] = useState(false);

  const visibleCats = categories.filter((c) => group === "All" || c.group === group);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return species.filter((s) => {
      const catDef = categories.find((c) => c.id === s.category);
      if (group !== "All" && catDef?.group !== group) return false;
      if (cat !== "all" && s.category !== cat) return false;
      if (size !== "all" && sizeBand(s.adultSize) !== size) return false;
      if (avail !== "all" && s.availability !== avail) return false;
      if (origin === "sri-lanka" && !s.naturalRange.toLowerCase().includes("sri lanka")) return false;
      if (needle) {
        const hay = `${s.commonName} ${s.scientificName} ${s.naturalRange} ${catDef?.label ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [species, q, group, cat, size, avail, origin]);

  const activeCount = [q, group !== "All", cat !== "all", size !== "all", avail !== "all", origin !== "all"].filter(Boolean).length;

  const clear = () => {
    setQ("");
    setGroup("All");
    setCat("all");
    setSize("all");
    setAvail("all");
    setOrigin("all");
  };

  return (
    <div>
      {/* search + selects */}
      <div className="flex flex-wrap items-center gap-3">
        <motion.div
          className="relative flex items-center"
          animate={{ width: searchOpen || q ? "min(100%, 26rem)" : "min(100%, 15rem)" }}
          transition={{ duration: 0.45, ease: ease.out }}
        >
          <Icon name="search" size={20} className="pointer-events-none absolute left-4 text-aqua-700" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
            placeholder="Search fish..."
            aria-label="Search fish by name"
            className="w-full rounded-full border-2 border-navy/15 bg-white py-3 pl-12 pr-4 text-navy shadow-sm transition focus:border-aqua focus:outline-none focus:ring-4 focus:ring-aqua/20"
          />
        </motion.div>

        {[
          { label: "Size", value: size, set: (v: string) => setSize(v as SizeBand), opts: sizeBands.map((s) => [s.id, s.label] as const) },
          {
            label: "Availability",
            value: avail,
            set: (v: string) => setAvail(v as Availability | "all"),
            opts: [["all", "Any availability"], ["on-request", "Enquire for availability"], ["available", "Available"], ["limited", "Limited stock"], ["pending", "To be confirmed"]] as const,
          },
          {
            label: "Origin",
            value: origin,
            set: (v: string) => setOrigin(v as "all" | "sri-lanka"),
            opts: [["all", "Any origin"], ["sri-lanka", "Sri Lankan native"]] as const,
          },
        ].map((f) => (
          <label key={f.label} className="relative">
            <span className="sr-only">{f.label}</span>
            <select
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="appearance-none rounded-full border-2 border-navy/15 bg-white py-3 pl-5 pr-10 font-medium text-navy shadow-sm transition focus:border-aqua focus:outline-none focus:ring-4 focus:ring-aqua/20"
            >
              {f.opts.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 12 8" className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-navy" aria-hidden="true">
              <path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </label>
        ))}

        {activeCount > 0 && (
          <button type="button" onClick={clear} className="rounded-full px-4 py-3 font-semibold text-aqua-700 underline-offset-4 hover:underline">
            Clear filters ({activeCount})
          </button>
        )}
      </div>

      {/* group tabs (sliding active pill) */}
      <LayoutGroup id="groups">
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Collection group">
          {groups.map((g) => (
            <button
              key={g}
              role="tab"
              aria-selected={group === g}
              type="button"
              onClick={() => {
                setGroup(g);
                setCat("all");
              }}
              className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${group === g ? "text-white" : "text-navy hover:text-aqua-700"}`}
            >
              {group === g && (
                <motion.span layoutId="group-pill" className="absolute inset-0 -z-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="relative">{g}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      {/* category chips */}
      <LayoutGroup id="chips">
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Species category">
          {[{ id: "all" as const, label: "All categories" }, ...visibleCats].map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
              className={`relative rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors ${cat === c.id ? "border-aqua text-navy" : "border-navy/15 text-muted hover:border-aqua/60"}`}
            >
              {cat === c.id && (
                <motion.span layoutId="chip-pill" className="absolute inset-0 rounded-full bg-aqua/20" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <p className="mt-6 text-sm font-medium text-muted" role="status" aria-live="polite">
        Showing {results.length} of {species.length} species
      </p>

      {/* grid with animated reordering */}
      <motion.div layout className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {results.map((s) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.5, ease: ease.out }}
            >
              <FishCard s={s} sizes="(min-width:1280px) 22vw, (min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <div className="mx-auto mt-10 max-w-md rounded-3xl bg-mint p-10 text-center">
          <div className="mx-auto w-32" style={{ animation: "swim-bob 5s ease-in-out infinite", ["--amp" as string]: "10px" }}>
            <FishIllustration color="#00b4c6" fin="#6fd8e3" className="h-auto w-full" />
          </div>
          <h3 className="mt-6 text-xl">No fish match those filters</h3>
          <p className="mt-2 text-muted">The fish swam away! Try a different search, or ask us - we may be able to source it.</p>
          <button type="button" onClick={clear} className="btn-ghost mt-6">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
