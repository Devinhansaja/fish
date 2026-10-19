import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { availabilityLabel, categories, type Availability, type CategoryId, type Species } from "./species";

/**
 * File-based species store (data/species.json) - fine for a single Node server (local, VPS).
 * On read-only/serverless hosting (e.g. Vercel) swap these four functions for a database;
 * nothing else in the app needs to change.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "species.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export async function readSpecies(): Promise<Species[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Species[]) : [];
  } catch {
    return [];
  }
}

async function writeSpecies(list: Species[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2) + "\n", "utf8");
  await fs.rename(tmp, FILE); // atomic replace
}

export async function getSpeciesBySlug(slug: string) {
  return (await readSpecies()).find((s) => s.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COLOR = /^#[0-9a-fA-F]{6}$/;
const IMAGE_URL = /^\/(?:images|uploads)\/[A-Za-z0-9._-]+$/;
const availabilities = Object.keys(availabilityLabel) as Availability[];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export type ValidationResult = { ok: true; value: Omit<Species, "id"> } | { ok: false; errors: Record<string, string> };

export function validateSpecies(input: unknown): ValidationResult {
  const b = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const commonName = text(b.commonName, 120);
  const scientificName = text(b.scientificName, 160);
  const slug = text(b.slug, 60) || slugify(commonName);
  if (commonName.length < 2) errors.commonName = "Enter the common name.";
  if (scientificName.length < 2) errors.scientificName = "Enter the scientific name (or TBC).";
  if (!SLUG.test(slug)) errors.slug = "Use lowercase letters, numbers and hyphens only.";

  const category = text(b.category, 40) as CategoryId;
  if (!categories.some((c) => c.id === category)) errors.category = "Choose a category.";

  const availability = text(b.availability, 20) as Availability;
  if (!availabilities.includes(availability)) errors.availability = "Choose an availability.";

  const accent = text(b.accent, 7) || "#00b4c6";
  if (!COLOR.test(accent)) errors.accent = "Use a hex colour such as #00b4c6.";

  const images = Array.isArray(b.images) ? b.images.filter((x): x is string => typeof x === "string").slice(0, 12) : [];
  if (images.some((u) => !IMAGE_URL.test(u))) errors.images = "Invalid image path.";

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      slug,
      commonName,
      scientificName,
      category,
      naturalRange: text(b.naturalRange, 200) || "TBC",
      description: text(b.description, 1500),
      images,
      adultSize: text(b.adultSize, 160) || "TBC",
      temperature: text(b.temperature, 120) || "TBC",
      ph: text(b.ph, 80) || "TBC",
      hardness: text(b.hardness, 120) || "TBC",
      feeding: text(b.feeding, 400) || "TBC",
      colorVarieties: text(b.colorVarieties, 300) || "TBC",
      availability,
      featured: b.featured === true,
      careVerified: b.careVerified === true,
      accent,
      exportCheckRequired: b.exportCheckRequired === true,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Mutations (callers must be authenticated)                           */
/* ------------------------------------------------------------------ */
export type MutationResult<T> = { ok: true; value: T } | { ok: false; status: number; errors: Record<string, string> };

export async function createSpecies(input: unknown): Promise<MutationResult<Species>> {
  const v = validateSpecies(input);
  if (!v.ok) return { ok: false, status: 422, errors: v.errors };
  const list = await readSpecies();
  if (list.some((s) => s.slug === v.value.slug)) return { ok: false, status: 409, errors: { slug: "That URL name is already used." } };
  const created: Species = { id: `sp-${v.value.slug}-${Date.now().toString(36)}`, ...v.value };
  await writeSpecies([...list, created]);
  return { ok: true, value: created };
}

export async function updateSpecies(id: string, input: unknown): Promise<MutationResult<Species>> {
  const v = validateSpecies(input);
  if (!v.ok) return { ok: false, status: 422, errors: v.errors };
  const list = await readSpecies();
  const i = list.findIndex((s) => s.id === id);
  if (i < 0) return { ok: false, status: 404, errors: { _: "Fish not found." } };
  if (list.some((s) => s.slug === v.value.slug && s.id !== id)) return { ok: false, status: 409, errors: { slug: "That URL name is already used." } };
  const updated: Species = { id, ...v.value };
  list[i] = updated;
  await writeSpecies(list);
  return { ok: true, value: updated };
}

export async function deleteSpecies(id: string): Promise<boolean> {
  const list = await readSpecies();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) return false;
  await writeSpecies(next);
  return true;
}
