import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Aquarium Accessories - Coming Soon",
  description:
    "Aquazone's aquarium accessories range is coming soon. Leave your email to be notified when equipment and care products are available for wholesale and export.",
  alternates: { canonical: "/aquarium-accessories" },
};

export default function AquariumAccessoriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Aquarium Accessories", path: "/aquarium-accessories" }])} />
      <ComingSoon kind="accessories" />
    </>
  );
}
