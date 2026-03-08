import Link from "next/link";
import {
  HeroSection,
  CategoryCard,
  ProductCard,
  StrainCard,
  BlogPostCard,
  CTAButton,
  ScrollReveal,
} from "@/components";
import { CATEGORIES, CATEGORY_SLUGS, unsplashUrl, PHOTOS } from "@/lib/constants";
import { getFeaturedProducts, getProductsByCategory } from "@/mocks/products";
import { getAllStrains } from "@/mocks/strains";
import { blogPosts } from "@/mocks/blog-posts";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const strains = getAllStrains().slice(0, 3);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div>
      {/* ── 1. Hero ── */}
      <HeroSection
        title="Craft Cannabis, Cultivated with Care"
        subtitle="Small-batch flower, concentrates, edibles, and more — grown with intention in the Pacific Northwest."
        imageUrl={unsplashUrl(PHOTOS.hero[0], 1920, 1080)}
        height="full"
        align="center"
      >
        <div
          className="flex flex-wrap justify-center gap-4 mt-8"
          style={{ animation: "fadeInUp 0.6s ease-out" }}
        >
          <CTAButton variant="primary" href="/products">
            Explore Products
          </CTAButton>
          <CTAButton variant="primary" href="/find">
            Find Near You
          </CTAButton>
        </div>
      </HeroSection>

      {/* ── 2. Categories ── */}
      <section className="section-pad">
        <h2 className="font-display text-[48px] text-center text-text-default mb-12">
          Explore Our Products
        </h2>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            {CATEGORY_SLUGS.map((key) => {
              const cat = CATEGORIES[key];
              const count = getProductsByCategory(key).length;
              return (
                <CategoryCard
                  key={key}
                  label={cat.label}
                  slug={cat.slug}
                  tagline={cat.tagline}
                  productCount={count}
                  imageUrl={unsplashUrl(
                    PHOTOS.categories[key as keyof typeof PHOTOS.categories],
                    800,
                    1000
                  )}
                />
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* ── 3. Featured / Staff Picks ── */}
      <section className="section-pad">
        <h2 className="font-display text-[40px] text-center text-text-default mb-12">
          Staff Picks
        </h2>
        <ScrollReveal staggerDelay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                brand={p.brand}
                strainName={p.strainName ?? ""}
                strainType={p.strainType as "indica" | "sativa" | "hybrid" | "cbd"}
                thcRange={p.thcRange}
                cbdRange={p.cbdRange}
                imageUrl={p.imageUrl}
                slug={p.slug}
                category={p.category}
              />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── 4. Strains / Our Genetics ── */}
      <section className="section-pad bg-cream">
        <h2 className="font-display text-[40px] text-center text-text-default mb-12">
          Our Genetics
        </h2>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            {strains.map((s) => (
              <StrainCard
                key={s.id}
                name={s.name}
                slug={s.slug}
                type={s.type as "indica" | "sativa" | "hybrid" | "cbd"}
                lineage={s.lineage}
                thcRange={s.thcRange}
                terpeneProfile={s.terpeneProfile}
                description={s.description}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <CTAButton variant="outline" href="/strains">
              View All Strains
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 5. Journal ── */}
      <section className="section-pad">
        <h2 className="font-display text-[40px] text-center text-text-default mb-12">
          From the Journal
        </h2>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            {recentPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                author={post.author}
                date={post.date}
                readTime={post.readTime}
                category={post.category}
                imageUrl={post.imageUrl}
              />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── 6. Find CTA ── */}
      <section className="section-pad-lg bg-accent-primary">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="font-display text-[48px] text-text-on-dark mb-6">
            Find Frost Near You
          </h2>
          <p className="text-text-on-dark/80 text-lg mb-10 max-w-xl mx-auto">
            We partner with select dispensaries across Washington state. Find the
            closest location carrying Frost products and stop by today.
          </p>
          <Link
            href="/find"
            className="inline-block rounded-xl border-2 border-text-on-dark px-8 py-3 font-medium text-text-on-dark transition-colors hover:bg-text-on-dark/10"
          >
            Find a Store
          </Link>
        </div>
      </section>
    </div>
  );
}
