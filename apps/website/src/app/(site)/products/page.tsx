import { HeroSection } from "@/components/ui/HeroSection";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CATEGORIES, unsplashUrl, PHOTOS } from "@/lib/constants";
import { getFeaturedProducts, getProductsByCategory } from "@/mocks/products";
import type { ProductCategory } from "@/types";

export default function ProductsPage() {
  const featuredProducts = getFeaturedProducts();
  const categoryEntries = Object.entries(CATEGORIES) as [
    ProductCategory,
    (typeof CATEGORIES)[ProductCategory],
  ][];

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="Our Products"
        subtitle="Explore our full range of craft cannabis — from hand-trimmed flower and artisan pre-rolls to precision vaporizers, concentrates, edibles, and infused beverages."
        height="half"
        imageUrl={unsplashUrl(PHOTOS.hero[0])}
      />

      {/* Categories Grid */}
      <ScrollReveal>
        <section className="section-pad">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categoryEntries.map(([slug, meta]) => (
                <CategoryCard
                  key={slug}
                  slug={slug}
                  label={meta.label}
                  tagline={meta.tagline}
                  productCount={getProductsByCategory(slug).length}
                  imageUrl={unsplashUrl(
                    PHOTOS.categories[slug as keyof typeof PHOTOS.categories]
                  )}
                />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Products */}
      <ScrollReveal>
        <section className="section-pad">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-10 font-display text-3xl text-text-default">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.slice(0, 6).map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  brand={p.brand}
                  strainName={p.strainName ?? ""}
                  strainType={(p.strainType ?? "hybrid") as "indica" | "sativa" | "hybrid" | "cbd"}
                  thcRange={p.thcRange}
                  cbdRange={p.cbdRange}
                  imageUrl={p.imageUrl}
                  slug={p.slug}
                  category={p.category}
                />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
