import { HeroSection } from "@/components/ui/HeroSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { unsplashUrl, PHOTOS } from "@/lib/constants";
import { getAllStrains } from "@/mocks/strains";
import { StrainsPageClient } from "./StrainsPageClient";

export default function StrainsPage() {
  const strains = getAllStrains();

  return (
    <div>
      <HeroSection
        title="Strain Library"
        subtitle="Explore our genetics — from classic cultivars to modern hybrids. Each strain hand-selected for flavor, potency, and character."
        height="half"
        imageUrl={unsplashUrl(PHOTOS.strains.hero)}
      />

      <ScrollReveal>
        <section className="section-pad">
          <div className="mx-auto max-w-7xl px-6">
            <StrainsPageClient strains={strains} />
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
