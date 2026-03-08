import { HeroSection, ScrollReveal } from "@/components";
import FaqPageClient from "./FaqPageClient";

export default function FaqPage() {
  return (
    <main>
      <HeroSection
        height="half"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Frost products and services"
      />

      <ScrollReveal>
        <FaqPageClient />
      </ScrollReveal>
    </main>
  );
}
