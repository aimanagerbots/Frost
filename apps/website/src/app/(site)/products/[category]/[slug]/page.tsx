import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/constants";
import { getProductBySlug, getProductsByCategory } from "@/mocks/products";
import { Badge } from "@/components/ui/Badge";
import { ComplianceWarning } from "@/components/ui/ComplianceWarning";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { ProductCategory } from "@/types";

/** Map product strainType to Badge variant */
function badgeVariant(
  strainType: string | undefined
): "indica" | "sativa" | "hybrid" | "cbd" {
  if (strainType === "indica") return "indica";
  if (strainType === "sativa") return "sativa";
  if (strainType === "cbd") return "cbd";
  return "hybrid";
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  /* Validate category */
  if (!CATEGORY_SLUGS.includes(category as ProductCategory)) {
    notFound();
  }

  const product = getProductBySlug(slug);
  if (!product || product.category !== category) {
    notFound();
  }

  const categoryMeta = CATEGORIES[category as ProductCategory];
  const variant = badgeVariant(product.strainType);

  /* Related products — same category, exclude current, take 3 */
  const related = getProductsByCategory(category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      {/* ── Hero Image ─────────────────────────────────────── */}
      <ScrollReveal className="px-6 pb-16">
        <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto rounded-xl overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1024px"
          />
        </div>
      </ScrollReveal>

      {/* ── Product Info ───────────────────────────────────── */}
      <section className="px-6 pb-16 max-w-5xl mx-auto space-y-10">
        <ScrollReveal>
          {/* Name */}
          <h1 className="font-display text-5xl tracking-[-0.02em] text-text-default mb-4">
            {product.name}
          </h1>

          {/* Brand + Strain Badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-text-muted font-sans">
              {product.brand}
            </span>
            {product.strainType && (
              <Badge label={product.strainType} variant={variant} />
            )}
          </div>
        </ScrollReveal>

        {/* ── Stats Bar ──────────────────────────────────── */}
        <ScrollReveal>
          <div className="grid grid-cols-3 gap-4 max-w-xl">
            <div className="bg-card border border-border-default rounded-xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                THC
              </p>
              <p className="font-display text-2xl text-text-default">
                {product.thcRange}
              </p>
            </div>
            <div className="bg-card border border-border-default rounded-xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                CBD
              </p>
              <p className="font-display text-2xl text-text-default">
                {product.cbdRange}
              </p>
            </div>
            <div className="bg-card border border-border-default rounded-xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                Type
              </p>
              <p className="font-display text-2xl text-text-default capitalize">
                {product.strainType ?? "—"}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Package Sizes ──────────────────────────────── */}
        <ScrollReveal>
          <div className="flex flex-wrap gap-3">
            {product.packageSizes.map((size) => (
              <span
                key={size}
                className="bg-elevated rounded-full px-4 py-2 text-sm text-text-default font-sans"
              >
                {size}
              </span>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Description ────────────────────────────────── */}
        <ScrollReveal>
          <p className="font-sans text-lg leading-relaxed text-text-muted max-w-2xl">
            {product.description}
          </p>
        </ScrollReveal>

        {/* ── Terpene Profile ────────────────────────────── */}
        {product.terpeneProfile.length > 0 && (
          <ScrollReveal>
            <div className="space-y-5 max-w-xl">
              <h2 className="font-display text-2xl text-text-default">
                Terpene Profile
              </h2>
              <div className="space-y-3">
                {product.terpeneProfile.map((terpene, i) => {
                  const percentage = 100 - i * 20;
                  return (
                    <div key={terpene} className="space-y-1">
                      <span className="text-sm font-medium text-text-default capitalize font-sans">
                        {terpene}
                      </span>
                      <div className="w-full bg-elevated rounded-full h-2">
                        <div
                          className="bg-accent-primary rounded-full h-2 transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 20)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ── Effects + Flavor Notes ─────────────────────── */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Effects */}
            {product.effects.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl text-text-default">
                  Effects
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.effects.map((effect) => (
                    <span
                      key={effect}
                      className="bg-accent-primary/10 text-accent-primary rounded-full px-3 py-1 text-sm font-sans"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Flavor Notes */}
            {product.flavorNotes.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl text-text-default">
                  Flavor Notes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="bg-accent-primary/10 text-accent-primary rounded-full px-3 py-1 text-sm font-sans"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Find CTA Section ─────────────────────────────── */}
      <section className="bg-accent-primary px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl text-text-on-dark">
            Find This Product Near You
          </h2>
          <p className="text-text-on-dark/70 font-sans text-lg leading-relaxed max-w-xl mx-auto">
            Visit one of our retail partners to experience {product.name} in
            person. Available at licensed dispensaries across the state.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center border border-text-on-dark text-text-on-dark rounded-full px-8 py-3 text-sm uppercase tracking-widest font-sans font-medium transition-colors duration-200 hover:bg-text-on-dark/10"
          >
            Find a Retailer
          </Link>
        </div>
      </section>

      {/* ── Compliance Warning ────────────────────────────── */}
      <div className="px-6 py-12 max-w-5xl mx-auto">
        <ComplianceWarning variant="product" />
      </div>

      {/* ── Related Products ─────────────────────────────── */}
      {related.length > 0 && (
        <section className="px-6 py-20 max-w-5xl mx-auto space-y-10">
          <ScrollReveal>
            <h2 className="font-display text-2xl text-text-default">
              You Might Also Like
            </h2>
          </ScrollReveal>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {related.map((p, i) => (
              <ScrollReveal key={p.id} staggerDelay={i * 100}>
                <ProductCard
                  name={p.name}
                  brand={p.brand}
                  strainName={p.strainName ?? ""}
                  strainType={badgeVariant(p.strainType)}
                  thcRange={p.thcRange}
                  cbdRange={p.cbdRange}
                  imageUrl={p.imageUrl}
                  slug={p.slug}
                  category={p.category}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
