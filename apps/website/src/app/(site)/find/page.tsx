import { Suspense } from "react";
import { HeroSection } from "@/components";
import { getAllProducts } from "@/mocks/products";
import { getAllDispensaries } from "@/mocks/dispensaries";
import FindPageClient from "./FindPageClient";

export default function FindPage() {
  return (
    <main>
      <HeroSection
        height="half"
        title="Find Your Product"
        subtitle="Check which dispensaries near you carry your favorite Frost products"
      />
      <Suspense
        fallback={
          <div className="section-pad max-w-7xl mx-auto px-6 text-text-muted">
            Loading...
          </div>
        }
      >
        <FindPageClient
          products={getAllProducts()}
          dispensaries={getAllDispensaries()}
        />
      </Suspense>
    </main>
  );
}
