import type { Metadata } from "next";
import { FishGrid } from "@/components/catalog/FishGrid";
import { FinalCTA } from "@/components/Sections";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { readSpecies } from "@/lib/speciesStore";

export const metadata: Metadata = {
  title: "Ornamental Fish Collection - Koi, Goldfish & Tropical Freshwater Fish",
  description:
    "Browse Aquazone's ornamental fish collection: koi, goldfish, tropical freshwater species and Sri Lankan native fish. Search, filter and request a consolidated export quotation.",
  alternates: { canonical: "/fish-collection" },
};

export default async function FishCollectionPage() {
  const species = await readSpecies();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Fish Collection", path: "/fish-collection" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: species.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/fish-collection/${s.slug}`,
              name: s.commonName,
            })),
          },
        ]}
      />
      <PageHero
        eyebrow="Our fish collection"
        title="A Living Collection for International Buyers"
        text="Koi, goldfish, tropical freshwater fish and selected Sri Lankan native species. Add the species you need to your quote list and request one consolidated quotation."
        image="/images/bg/fish-collection.jpg"
      />
      <section className="section bg-surface !pt-10" aria-label="Fish catalog">
        <div className="container-x">
          <Reveal>
            <p className="mb-8 max-w-3xl text-muted">
              Availability changes with each production cycle, so every species is offered on an enquire-for-availability
              basis. Species marked &ldquo;photo coming soon&rdquo; will be illustrated with Aquazone photography as it is added.
            </p>
          </Reveal>
          <FishGrid />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
