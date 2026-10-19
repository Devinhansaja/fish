import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AmbientFish, CustomCursor, FloatingWhatsApp, ScrollProgress } from "@/components/GlobalEffects";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { SpeciesProvider } from "@/components/SpeciesProvider";
import { readSpecies } from "@/lib/speciesStore";

/** Public website chrome. The admin panel (/admin) lives outside this group and has its own layout. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const species = await readSpecies();
  return (
    <SpeciesProvider species={species}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <AmbientFish />
      <FloatingWhatsApp />
      <CustomCursor />
      <JsonLd data={organizationLd} />
    </SpeciesProvider>
  );
}
