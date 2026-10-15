import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost } from "@/lib/content";
import { ReadingProgress } from "@/components/news/ReadingProgress";
import { BlogCard } from "@/components/news/NewsList";
import { FinalCTA } from "@/components/Sections";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";
import { SITE_URL, site } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/news/${p.slug}` },
    openGraph: { type: "article", images: [{ url: p.image }] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  const url = `${SITE_URL}/news/${p.slug}`;
  const share = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: "facebook" as const },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, icon: "linkedin" as const },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${p.title} ${url}`)}`, icon: "whatsapp" as const },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "News & Blog", path: "/news" },
            { name: p.title, path: `/news/${p.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.excerpt,
            image: `${SITE_URL}${p.image}`,
            author: { "@type": "Organization", name: site.name },
            publisher: { "@type": "Organization", name: site.name },
            ...(p.date ? { datePublished: p.date } : {}),
          },
        ]}
      />
      <ReadingProgress>
        <header className="on-dark relative bg-deep pb-24 pt-36 sm:pt-44">
          <div className="container-x max-w-3xl">
            <Link href="/news" className="link-aqua text-sm">&larr; All articles</Link>
            <p className="eyebrow mt-6">{p.category}</p>
            <h1 className="h2 mt-3 text-white">{p.title}</h1>
            <p className="mt-5 text-white/80">
              By {p.author}
              {p.date ? ` - ${new Date(p.date).toLocaleDateString("en-GB", { dateStyle: "long" })}` : ""}
              {p.draft && <span className="draft-badge ml-3">Draft</span>}
            </p>
          </div>
        </header>
        <article className="container-x max-w-3xl pb-16">
          <div className="relative -mt-12 aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl">
            <Image src={p.image} alt="" fill priority sizes="(min-width:768px) 48rem, 100vw" className="object-cover" />
          </div>
          <div className="mt-10 space-y-6 text-lg text-muted">
            {p.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-navy/10 pt-6">
            <span className="font-semibold text-navy">Share</span>
            {share.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${s.label}`}
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-navy/20 text-navy transition hover:-translate-y-1 hover:border-aqua hover:text-aqua-700"
              >
                <Icon name={s.icon} size={18} />
              </a>
            ))}
          </div>
        </article>
      </ReadingProgress>

      <section className="section bg-mint !py-16">
        <div className="container-x">
          <h2 className="h3 mb-8">Related articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <BlogCard key={r.slug} p={r} />
            ))}
          </div>
        </div>
      </section>
      <FinalCTA fill="#eefffc" />
    </>
  );
}
