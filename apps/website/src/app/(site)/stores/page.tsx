import { HeroSection } from "@/components";
import { getAllDispensaries } from "@/mocks/dispensaries";
import StoresPageClient from "./StoresPageClient";

export default function StoresPage() {
  return (
    <main>
      <HeroSection
        height="half"
        title="Find Frost Near You"
        subtitle="Visit one of our retail partners across Washington State"
      />

      <StoresPageClient dispensaries={getAllDispensaries()} />
    </main>
  );
}
