import type { Metadata } from "next";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Icon, type IconName } from "@/components/Icon";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Export Inquiry - Request a Quotation",
  description:
    "Contact Aquazone Ornamental Fish Farm (Pvt) Ltd in Nelawa, Kohilegedara, Sri Lanka. Request a quotation for live ornamental fish export.",
  alternates: { canonical: "/contact" },
};

function Row({ icon, label, children }: { icon: IconName; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-aqua-300">
        <Icon name={icon} size={22} />
      </span>
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-aqua-700">{label}</p>
        <div className="mt-0.5 text-ink">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const tbc = <span className="text-muted">To be confirmed by Aquazone</span>;
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact" }])} />
      <PageHero
        eyebrow="Contact us"
        title="Let's Talk About Your Next Shipment"
        text="Send an export inquiry and our team will respond with a quotation tailored to your market."
        image="/images/bg/contact.jpg"
      />
      <section className="section bg-alt !pt-6">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <InquiryForm />

          <div className="space-y-6">
            <Reveal dir="right">
              <div className="card space-y-6 p-6 sm:p-8">
                <h2 className="h3">Company details</h2>
                <Row icon="pin" label="Address">
                  Aquazone Ornamental Fish Farm (Pvt) Ltd
                  <br />
                  {site.address.line1}, {site.address.country}
                </Row>
                <Row icon="phone" label="Telephone">
                  {site.phone ? <a className="link-aqua" href={`tel:${site.phone}`}>{site.phone}</a> : tbc}
                </Row>
                <Row icon="mail" label="Email">
                  {site.email ? <a className="link-aqua" href={`mailto:${site.email}`}>{site.email}</a> : tbc}
                </Row>
                <Row icon="whatsapp" label="WhatsApp">
                  {site.whatsapp ? (
                    <a className="link-aqua" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" data-track="whatsapp-click">
                      Chat on WhatsApp
                    </a>
                  ) : (
                    tbc
                  )}
                </Row>
                {site.profilePdf && (
                  <a href={site.profilePdf} download className="btn-ghost w-full">
                    <Icon name="download" size={18} /> Download company profile
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal dir="right" delay={0.1}>
              <div className="card overflow-hidden">
                {site.mapEmbedUrl ? (
                  <iframe
                    title="Aquazone location map"
                    src={site.mapEmbedUrl}
                    className="h-72 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="grid h-72 place-items-center bg-deep p-6 text-center text-white">
                    <div>
                      <Icon name="pin" size={36} className="mx-auto text-sun" />
                      <p className="mt-3 font-semibold">{site.address.line1}, {site.address.country}</p>
                      <p className="mt-1 text-sm text-white/75">
                        Google Map will appear here once the official location is confirmed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
