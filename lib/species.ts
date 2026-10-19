/**
 * Fish catalog types and labels (safe for server AND client components).
 *
 * The species DATA lives in data/species.json and is edited from the admin panel
 * (/admin). Server code reads it through lib/speciesStore.ts; client components get it
 * from <SpeciesProvider> (components/SpeciesProvider.tsx).
 *
 * Availability, sizes and care ranges are draft reference data until Aquazone confirms them
 * (see `careVerified`). Native/endemic species need legal export confirmation.
 */

export type CategoryId =
  | "livebearers"
  | "cichlids"
  | "anabantoids"
  | "characins"
  | "catfish"
  | "rainbowfish"
  | "koi-goldfish"
  | "native";

export const categories: { id: CategoryId; label: string; group: "Tropical Freshwater Fish" | "Koi & Goldfish" | "Sri Lankan Native Species" }[] = [
  { id: "livebearers", label: "Livebearers", group: "Tropical Freshwater Fish" },
  { id: "cichlids", label: "Cichlids", group: "Tropical Freshwater Fish" },
  { id: "anabantoids", label: "Bettas & Gouramis", group: "Tropical Freshwater Fish" },
  { id: "characins", label: "Tetras", group: "Tropical Freshwater Fish" },
  { id: "catfish", label: "Catfish & Plecos", group: "Tropical Freshwater Fish" },
  { id: "rainbowfish", label: "Rainbowfish", group: "Tropical Freshwater Fish" },
  { id: "koi-goldfish", label: "Koi & Goldfish", group: "Koi & Goldfish" },
  { id: "native", label: "Sri Lankan Native", group: "Sri Lankan Native Species" },
];

export type Availability = "on-request" | "available" | "limited" | "pending";

export const availabilityLabel: Record<Availability, string> = {
  "on-request": "Enquire for availability",
  available: "Available",
  limited: "Limited stock",
  pending: "Availability to be confirmed",
};

export type Species = {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  category: CategoryId;
  /** Natural range of the species (not the place of supply) */
  naturalRange: string;
  description: string;
  /** Image URLs: /images/... (site photos) or /uploads/... (uploaded in the admin panel). Empty = illustration */
  images: string[];
  adultSize: string;
  temperature: string;
  ph: string;
  hardness: string;
  feeding: string;
  colorVarieties: string;
  availability: Availability;
  featured: boolean;
  /** Draft = care data is general reference, not yet confirmed by Aquazone */
  careVerified: boolean;
  /** Accent colour used by the illustration placeholder */
  accent: string;
  /** Species flagged here need legal export confirmation before publishing */
  exportCheckRequired?: boolean;
};

export function categoryLabel(id: CategoryId) {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function getFeatured(list: Species[]) {
  return list.filter((s) => s.featured);
}

export function findSpecies(list: Species[], slug: string) {
  return list.find((s) => s.slug === slug);
}

export function relatedSpecies(list: Species[], s: Species, count = 3) {
  return list
    .filter((x) => x.slug !== s.slug && x.category === s.category)
    .concat(list.filter((x) => x.slug !== s.slug && x.category !== s.category && x.featured))
    .slice(0, count);
}
