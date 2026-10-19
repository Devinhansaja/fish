import type { Metadata } from "next";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PageHero, PrimaryCTA } from "@/components/ui";
import { FinalCTA } from "@/components/Sections";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ - Ordering, Shipping & Importing Ornamental Fish from Sri Lanka",
  description:
    "Answers for international buyers: how to order, minimum quantities, live-fish packing, shipping, export documents, fish health, payment and import requirements.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  // Draft answers contain "[Aquazone to confirm ...]" placeholders, so only confirmed answers are in the structured data.
  const confirmed = faqs.filter((f) => !f.draft);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: confirmed.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <PageHero
        eyebrow="FAQ"
        title="Questions International Buyers Ask"
        text="Ordering, packing, shipping, documents and payment - in plain language."
        image="/images/bg/faq.jpg"
      />
      <section className="section bg-white !pt-10">
        <div className="container-x">
          <FAQAccordion items={faqs} />
          <div className="mt-12 text-center">
            <p className="mb-5 text-lg text-muted">Can&apos;t find your answer?</p>
            <PrimaryCTA href="/contact#inquiry">Ask Our Export Team</PrimaryCTA>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
