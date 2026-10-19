"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Species } from "@/lib/species";

/**
 * Gives client components the fish catalog (read on the server from data/species.json,
 * which the admin panel edits). Rendered once in the public site layout.
 */
type Ctx = { species: Species[]; bySlug: (slug: string) => Species | undefined; featured: Species[] };
const SpeciesCtx = createContext<Ctx>({ species: [], bySlug: () => undefined, featured: [] });

export function SpeciesProvider({ species, children }: { species: Species[]; children: ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({
      species,
      bySlug: (slug) => species.find((s) => s.slug === slug),
      featured: species.filter((s) => s.featured),
    }),
    [species],
  );
  return <SpeciesCtx.Provider value={value}>{children}</SpeciesCtx.Provider>;
}

export const useSpecies = () => useContext(SpeciesCtx);
