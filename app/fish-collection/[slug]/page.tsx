import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { species, getSpecies, categoryLabel, relatedSpecies } from "@/lib/species";
import { SpeciesGallery, SpeciesInquiryPanel, SpeciesSpecs } from "@/components/catalog/SpeciesDetail";
import { FishCard } from "@/components/catalog/FishCard";
import { FinalCTA } from "@/components/Sections";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return species.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSpecies(slug);
  if (!s) return {};
  return {
    title: `${s.commonName} (${s.scientificName}) - Export Supplier`,
    description: `${s.description} Request an export quotation for ${s.commonName} from Aquazone, Sri Lanka.`,
    alternates: { canonical: `/fish-collection/${s.slug}` },
    openGraph: s.images[0] ? { images: [{ url: s.images[0] }] } : undefined,
  };
}

export default async function SpeciesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSpecies(slug);
  if (!s) notFound();
  const related = relatedSpecies(s);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Fish Collection", path: "/fish-collection" },
            { name: s.commonName, path: `/fish-collection/${s.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: s.commonName,
            alternateName: s.scientificName,
            description: s.description,
            category: categoryLabel(s.category),
            ...(s.images[0] ? { image: s.images.map((i) => `${SITE_URL}${i}`) } : {}),
            brand: { "@type": "Brand", name: "Aquazone" },
          },
        ]}
      />
      <section className="on-dark relative bg-deep pb-16 pt-32 sm:pt-40">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="text-sm text-white/80">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="link-aqua">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/fish-collection" className="link-aqua">Fish Collection</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">{s.commonName}</li>
            </ol>
          </nav>
          <Reveal>
            <p className="eyebrow mt-8">{categoryLabel(s.category)}</p>
            <h1 className="h1 mt-3 text-white">{s.commonName}</h1>
            <p className="mt-3 text-xl italic text-white/85">{s.scientificName}</p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white !pt-12">
        <div className="container-x grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-12">
            <SpeciesGallery s={s} />
            <Reveal>
              <h2 className="h3">About this fish</h2>
              <p className="mt-3 text-lg text-muted">{s.description}</p>
            </Reveal>
            <SpeciesSpecs s={s} />
          </div>
          <div>
            <SpeciesInquiryPanel s={s} />
          </div>
        </div>
      </section>

      <section className="section bg-mint !py-16">
        <div className="container-x">
          <h2 className="h3 mb-8">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <FishCard key={r.id} s={r} />
            ))}
          </div>
        </div>
      </section>
      <FinalCTA fill="#eefffc" />
    </>
  );
}
