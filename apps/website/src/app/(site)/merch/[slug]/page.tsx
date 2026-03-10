import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart } from "lucide-react";
import { getMerchBySlug, getMerchBySubcategory, getMerchItems } from "@/mocks/merch";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MerchTile } from "@/components/merch/MerchTile";
import { MerchDetailClient } from "@/components/merch/MerchDetailClient";

const SUBCATEGORY_LABELS: Record<string, string> = {
  apparel: "Apparel",
  accessories: "Accessories",
  smoking: "Smoking",
};

const SUBCATEGORY_COLORS: Record<string, string> = {
  apparel: "bg-[#5BB8E6]/15 text-[#5BB8E6]",
  accessories: "bg-amber-500/15 text-amber-400",
  smoking: "bg-purple-500/15 text-purple-400",
};

export function generateStaticParams() {
  return getMerchItems().map((item) => ({ slug: item.slug }));
}

export default async function MerchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMerchBySlug(slug);
  if (!item) notFound();

  const related = getMerchBySubcategory(item.subcategory)
    .filter((i) => i.slug !== item.slug)
    .slice(0, 4);

  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Back link */}
        <ScrollReveal>
          <Link
            href="/merch"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Merch
          </Link>
        </ScrollReveal>

        {/* Product hero */}
        <ScrollReveal>
          <div className="grid gap-10 md:grid-cols-2">
            {/* Image */}
            <div className="relative flex items-center justify-center overflow-hidden rounded-xl border border-[#5BB8E6]/40 bg-white/[0.02] shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] p-12">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={280}
                height={280}
                className="h-56 w-56 object-contain opacity-40"
                priority
              />
              {item.isNew && (
                <span className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-[#5BB8E6]/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#5BB8E6]">
                  <Star className="h-3.5 w-3.5" />
                  New
                </span>
              )}
              {!item.inStock && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
                  <span className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-red-400">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Subcategory badge */}
              <span
                className={`mb-3 w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                  SUBCATEGORY_COLORS[item.subcategory] ?? "bg-white/[0.06] text-white/40"
                }`}
              >
                {SUBCATEGORY_LABELS[item.subcategory] ?? item.subcategory}
              </span>

              <h1 className="mb-2 font-display text-4xl tracking-[-0.02em] text-white">
                {item.name}
              </h1>

              <p className="mb-6 text-base leading-relaxed text-white/50">
                {item.description}
              </p>

              {/* Price block */}
              <div className="mb-6 flex items-baseline gap-4">
                <span className="font-display text-3xl font-bold text-white">
                  ${item.price}
                </span>
                <span className="text-sm text-[#5BB8E6]">
                  or {item.pointsCost.toLocaleString()} pts
                </span>
              </div>

              {/* Size selector + Add to Cart (client component) */}
              <MerchDetailClient item={item} />
            </div>
          </div>
        </ScrollReveal>

        {/* Product details cards */}
        <ScrollReveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#5BB8E6]/40 bg-white/[0.02] p-5 shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-white/40">
                Category
              </p>
              <p className="font-display text-lg text-white capitalize">
                {SUBCATEGORY_LABELS[item.subcategory]}
              </p>
            </div>
            <div className="rounded-xl border border-[#5BB8E6]/40 bg-white/[0.02] p-5 shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-white/40">
                Item Type
              </p>
              <p className="font-display text-lg text-white capitalize">
                {item.itemType}
              </p>
            </div>
            <div className="rounded-xl border border-[#5BB8E6]/40 bg-white/[0.02] p-5 shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-white/40">
                Availability
              </p>
              <p className={`font-display text-lg ${item.inStock ? "text-green-400" : "text-red-400"}`}>
                {item.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Related items */}
        {related.length > 0 && (
          <div className="mt-20">
            <ScrollReveal>
              <h2 className="mb-6 font-display text-2xl text-white">
                More {SUBCATEGORY_LABELS[item.subcategory]}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((rel, i) => (
                <ScrollReveal key={rel.id} staggerDelay={i * 80}>
                  <MerchTile item={rel} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
