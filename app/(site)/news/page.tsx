import type { Metadata } from "next";
import { NewsList } from "@/components/news/NewsList";
import { PageHero } from "@/components/ui";
import { FinalCTA } from "@/components/Sections";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "News & Blog - Ornamental Fish Care, Export and Aquaculture",
  description:
    "Articles on ornamental fish care, grading, live-fish export, sustainable aquaculture and community development from Aquazone, Sri Lanka.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "News & Blog", path: "/news" }])} />
      <PageHero
        eyebrow="News & blog"
        title="Insights from the Farm"
        text="Fish care, grading, export know-how and sustainable aquaculture."
        image="/images/bg/news.jpg"
      />
      <section className="section bg-white !pt-10">
        <div className="container-x">
          <NewsList />
          <p className="mt-10 text-sm text-muted">
            <span className="draft-badge mr-2">Draft</span>
            These articles are educational drafts. Company news, announcements and event updates will be published here
            once supplied by Aquazone.
          </p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
