import {
  HeroSection,
  ScrollReveal,
  CategoryCard,
  CTAButton,
} from "@/components";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  PHOTOS,
  unsplashUrl,
} from "@/lib/constants";
import {
  Leaf,
  Shield,
  Truck,
  BarChart3,
  Users,
  DollarSign,
} from "lucide-react";
import WholesaleFormClient from "./WholesaleFormClient";

const valueProps = [
  {
    icon: Leaf,
    title: "Craft Quality",
    description:
      "Hand-trimmed, small-batch cannabis grown in controlled indoor environments",
  },
  {
    icon: BarChart3,
    title: "Full Product Line",
    description: "Six categories across three specialized brands",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description:
      "Personal account managers for ordering and merchandising",
  },
  {
    icon: Truck,
    title: "VMI Program",
    description:
      "Automated restocking recommendations based on sell-through data",
  },
  {
    icon: Shield,
    title: "Marketing Assets",
    description:
      "POS materials, displays, and vendor day brand ambassadors",
  },
  {
    icon: DollarSign,
    title: "Competitive Margins",
    description:
      "Tiered wholesale pricing with volume incentives",
  },
];

const steps = [
  {
    num: 1,
    title: "Reach Out",
    description:
      "Fill out the inquiry form below or contact our sales team directly",
  },
  {
    num: 2,
    title: "Sample Our Products",
    description:
      "We'll schedule a product showcase and discuss the right mix for your store",
  },
  {
    num: 3,
    title: "Start Ordering",
    description:
      "Get set up with an account, delivery schedule, and dedicated support",
  },
];

export default function WholesalePage() {
  return (
    <main>
      <HeroSection
        height="half"
        title="Partner With Frost"
        subtitle="Premium craft cannabis for Washington's finest dispensaries"
      />

      {/* Value Propositions */}
      <div className="section-pad max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-display text-3xl text-text-default text-center mb-12">
            Why Carry Frost?
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valueProps.map((v, i) => (
            <ScrollReveal key={v.title} staggerDelay={i * 100}>
              <div className="rounded-xl border border-border-default bg-card p-8">
                <v.icon className="w-10 h-10 text-accent-primary mb-4" />
                <h3 className="font-display text-xl text-text-default mb-2">
                  {v.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Product Categories */}
      <div className="section-pad max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-display text-3xl text-text-default text-center mb-12">
            Our Product Lines
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORY_SLUGS.map((cat, i) => (
            <ScrollReveal key={cat} staggerDelay={i * 100}>
              <CategoryCard
                label={CATEGORIES[cat].label}
                slug={CATEGORIES[cat].slug}
                tagline={CATEGORIES[cat].tagline}
                productCount={7}
                imageUrl={unsplashUrl(
                  PHOTOS.categories[cat as keyof typeof PHOTOS.categories]
                )}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="section-pad max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-display text-3xl text-text-default text-center mb-12">
            How It Works
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <ScrollReveal key={s.num} staggerDelay={i * 150}>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-lg font-bold mx-auto">
                  {s.num}
                </div>
                <h3 className="font-display text-xl text-text-default">
                  {s.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="section-pad max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto rounded-xl border border-border-default bg-card p-8 text-center">
            <p className="text-lg text-text-muted italic leading-relaxed mb-4">
              &ldquo;Frost has been one of our best-performing brands since we
              started carrying them. The VMI program keeps our shelves stocked,
              and their vendor days always drive traffic. Their team actually
              cares about our success.&rdquo;
            </p>
            <p className="text-sm text-text-default font-medium">
              &mdash; Sarah Chen, Owner, Emerald City Cannabis
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Inquiry Form */}
      <WholesaleFormClient />

      {/* Bottom CTA */}
      <div className="section-pad max-w-7xl mx-auto px-6 text-center">
        <ScrollReveal>
          <p className="text-text-muted text-lg mb-6">
            Ready for a full partnership?
          </p>
          <CTAButton variant="outline" href="/register">
            Register Your Dispensary
          </CTAButton>
        </ScrollReveal>
      </div>
    </main>
  );
}
