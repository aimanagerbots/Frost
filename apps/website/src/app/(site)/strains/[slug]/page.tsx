import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getStrainBySlug } from "@/mocks/strains";
import { getProductsByStrain } from "@/mocks/products";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

function badgeVariant(type: string): "indica" | "sativa" | "hybrid" | "cbd" {
  if (type === "indica") return "indica";
  if (type === "sativa") return "sativa";
  if (type === "cbd") return "cbd";
  return "hybrid";
}

export default async function StrainDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const strain = getStrainBySlug(slug);

  if (!strain) {
    notFound();
  }

  const variant = badgeVariant(strain.type);
  const products = getProductsByStrain(strain.name);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="pt-24 pb-8 px-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-text-muted max-w-5xl mx-auto">
          <li>
            <Link href="/strains" className="hover:text-text-default transition-colors">
              Strains
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-default">{strain.name}</li>
        </ol>
      </nav>

      {/* Strain Art */}
      {strain.imageUrl && (
        <ScrollReveal className="px-6 pb-12">
          <div className="max-w-md mx-auto">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src={strain.imageUrl}
                alt={strain.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 448px"
                priority
              />
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Hero */}
      <ScrollReveal className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-[64px] leading-[1.1] tracking-[-0.02em] text-text-default mb-4">
            {strain.name}
          </h1>
          <div className="flex items-center gap-3 mb-2">
            <Badge label={strain.type} variant={variant} />
            <span className="text-sm italic text-text-muted font-sans">{strain.lineage}</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal className="px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { label: "THC", value: strain.thcRange },
            { label: "CBD", value: strain.cbdRange },
            { label: "Difficulty", value: strain.difficulty },
            { label: "Type", value: strain.type },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border-default rounded-xl p-4 text-center"
            >
              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">{stat.label}</p>
              <p className="font-display text-2xl text-text-default capitalize">{stat.value}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Terpene Profile */}
      {strain.terpeneProfile.length > 0 && (
        <ScrollReveal className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl text-text-default mb-6">Terpene Profile</h2>
            <div className="space-y-3 max-w-xl">
              {strain.terpeneProfile.map((terpene, i) => {
                const pct = 100 - i * 20;
                return (
                  <div key={terpene} className="space-y-1">
                    <span className="text-sm font-medium text-text-default capitalize font-sans">
                      {terpene}
                    </span>
                    <div className="w-full bg-elevated rounded-full h-2">
                      <div
                        className="bg-accent-primary rounded-full h-2"
                        style={{ width: `${Math.max(pct, 20)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Description */}
      <ScrollReveal className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-lg leading-relaxed text-text-muted max-w-2xl font-sans">
            {strain.description}
          </p>
        </div>
      </ScrollReveal>

      {/* Effects + Flavors + Aromas */}
      <ScrollReveal className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { title: "Effects", items: strain.effects },
            { title: "Flavor Notes", items: strain.flavorNotes },
            { title: "Aromas", items: strain.aromas },
          ].map(
            (section) =>
              section.items.length > 0 && (
                <div key={section.title} className="space-y-4">
                  <h2 className="font-display text-xl text-text-default">{section.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item) => (
                      <span
                        key={item}
                        className="bg-accent-primary/10 text-accent-primary rounded-full px-3 py-1 text-sm font-sans"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </ScrollReveal>

      {/* Products with this strain */}
      {products.length > 0 && (
        <section className="section-pad px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-2xl text-text-default mb-8">
                Products with {strain.name}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <ScrollReveal key={p.id} staggerDelay={i * 100}>
                  <ProductCard
                    name={p.name}
                    brand={p.brand}
                    strainName={p.strainName ?? ""}
                    strainType={badgeVariant(p.strainType ?? "hybrid")}
                    thcRange={p.thcRange}
                    cbdRange={p.cbdRange}
                    imageUrl={p.imageUrl}
                    slug={p.slug}
                    category={p.category}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Find CTA */}
      <section className="bg-accent-primary px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl text-text-on-dark">
            Find {strain.name} at a Dispensary
          </h2>
          <p className="text-text-on-dark/70 font-sans text-lg leading-relaxed max-w-xl mx-auto">
            Available at licensed retailers across Washington State.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center justify-center border border-text-on-dark text-text-on-dark rounded-full px-8 py-3 text-sm uppercase tracking-widest font-sans font-medium transition-colors duration-200 hover:bg-text-on-dark/10"
          >
            Order Now
          </Link>
        </div>
      </section>
    </>
  );
}
