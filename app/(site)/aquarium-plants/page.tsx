import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Aquarium Plants - Coming Soon",
  description:
    "Aquazone's aquarium plant range is coming soon. Leave your email to be notified when live aquatic plants are available for wholesale and export.",
  alternates: { canonical: "/aquarium-plants" },
};

export default function AquariumPlantsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Aquarium Plants", path: "/aquarium-plants" }])} />
      <ComingSoon kind="plants" />
    </>
  );
}
