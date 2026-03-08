import Image from "next/image";
import Link from "next/link";
import { Leaf, Droplets, Heart, ArrowRight, Sprout, Factory, Package, Store } from "lucide-react";
import { unsplashUrl, PHOTOS } from "@/lib/constants";
import { HeroSection } from "@/components/ui/HeroSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const VALUES = [
  {
    icon: Leaf,
    title: "Craft Quality",
    description:
      "Every harvest is hand-trimmed and small-batch cured. We never rush the process — our flower is dried slowly, cured patiently, and inspected by people who genuinely care about the plant. The result is a product that speaks for itself.",
  },
  {
    icon: Droplets,
    title: "Sustainable Cultivation",
    description:
      "Our facility runs on full-spectrum LED lighting, closed-loop water reclamation, and integrated pest management. We believe cannabis cultivation should leave the land better than we found it — not strip it bare.",
  },
  {
    icon: Heart,
    title: "Community First",
    description:
      "We partner with locally-owned dispensaries, support expungement initiatives, and reinvest in the communities where our team members live. Cannabis should lift everyone up, not just the bottom line.",
  },
];

const TEAM = [
  {
    name: "Elena Rodriguez",
    role: "Head Cultivator",
    bio: "Fifteen years of growing expertise distilled into every Frost harvest. Elena oversees our living soil program and phenotype selection.",
    photo: "WNoLnJo7tS8",
  },
  {
    name: "Marcus Chen",
    role: "Director of Operations",
    bio: "Former supply-chain lead at a Pacific Northwest brewery, Marcus brings precision logistics to every stage of our seed-to-shelf pipeline.",
    photo: "sibVwORYqs0",
  },
  {
    name: "Sarah Okafor",
    role: "Brand Director",
    bio: "Sarah shapes how the world experiences Frost — from packaging to partnerships — with an eye for storytelling that feels honest.",
    photo: "rDEOVtE7vOs",
  },
  {
    name: "James Whitfield",
    role: "Head of Quality",
    bio: "A former analytical chemist, James designed our in-house testing protocols to ensure every batch meets Frost standards before it leaves the facility.",
    photo: "d2MSDujJl2g",
  },
];

const PROCESS_STEPS = [
  {
    icon: Sprout,
    step: "Step 01",
    name: "Cultivation",
    description: "Living soil, hand-watered, full-spectrum LED",
  },
  {
    icon: Factory,
    step: "Step 02",
    name: "Manufacturing",
    description: "Small-batch extraction and formulation",
  },
  {
    icon: Package,
    step: "Step 03",
    name: "Packaging",
    description: "Sustainable materials, tamper-evident seals",
  },
  {
    icon: Store,
    step: "Step 04",
    name: "Dispensary",
    description: "Delivered fresh to local retail partners",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <HeroSection
        title="Our Story"
        subtitle="Frost was born in Washington State from a simple conviction: cannabis deserves the same craft attention as fine wine or single-origin coffee. We grow with intention, cure with patience, and never cut corners."
        imageUrl={unsplashUrl(PHOTOS.about.hero, 1920, 1080)}
        height="half"
        align="center"
      />

      {/* ── 2. Mission ──────────────────────────────────────── */}
      <section className="section-pad-lg px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          <ScrollReveal className="lg:col-span-3">
            <h2 className="font-display text-[36px] leading-tight text-text-default mb-8">
              Rooted in the Pacific Northwest
            </h2>
            <div className="space-y-6 font-sans text-lg text-text-muted max-w-prose leading-relaxed">
              <p>
                We started in 2019 with a single grow room and an obsession with
                terpene profiles. While the rest of the industry scaled up, we
                scaled down — smaller batches, longer cure times, and a team
                that treats every plant like it matters. Because it does.
              </p>
              <p>
                Our home in the Pacific Northwest gives us access to clean water,
                temperate growing conditions, and a community that values
                sustainability as much as we do. The region&apos;s craft culture
                — from coffee roasters to micro-breweries — is in our DNA.
              </p>
              <p>
                Today, Frost supplies a curated network of dispensaries across
                Washington State. We remain founder-operated, privately held, and
                stubbornly focused on quality over volume. We believe the best
                cannabis companies will be the ones that never forgot why they
                started growing in the first place.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal staggerDelay={150} className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
              <Image
                src={unsplashUrl(PHOTOS.about.greenhouse, 800, 1067)}
                alt="Frost greenhouse in the Pacific Northwest"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. Values ───────────────────────────────────────── */}
      <section className="section-pad px-6 bg-cream">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="font-display text-[40px] leading-tight text-text-default text-center mb-16">
              What We Stand For
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.title} staggerDelay={i * 120}>
                <div className="bg-card rounded-xl p-8 h-full">
                  <value.icon className="w-8 h-8 text-accent-primary mb-4" strokeWidth={1.5} />
                  <h3 className="font-display text-2xl text-text-default mb-3">
                    {value.title}
                  </h3>
                  <p className="font-sans text-text-muted leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Team ─────────────────────────────────────────── */}
      <section className="section-pad px-6">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="font-display text-[40px] leading-tight text-text-default text-center mb-16">
              The People Behind Frost
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {TEAM.map((member, i) => (
              <ScrollReveal key={member.name} staggerDelay={i * 100}>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden">
                    <Image
                      src={unsplashUrl(member.photo, 200, 200)}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <h3 className="font-display text-[22px] text-text-default">
                    {member.name}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-text-muted mt-1 mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Process ──────────────────────────────────────── */}
      <section className="section-pad px-6 bg-cream">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="font-display text-[40px] leading-tight text-text-default text-center mb-16">
              From Seed to Shelf
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.name} staggerDelay={i * 120}>
                <div className="relative flex flex-col items-center text-center px-6">
                  {/* Connecting line (hidden on first item and mobile) */}
                  {i > 0 && (
                    <div className="hidden lg:block absolute top-6 -left-4 w-8 border-t border-text-muted/30" />
                  )}

                  <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-accent-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-text-muted mb-2 font-sans">
                    {step.step}
                  </span>
                  <h3 className="font-display text-xl text-text-default mb-2">
                    {step.name}
                  </h3>
                  <p className="text-sm text-text-muted font-sans leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow between steps on desktop */}
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:flex absolute top-6 -right-4 items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-text-muted/40" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA ──────────────────────────────────────────── */}
      <section className="section-pad-lg px-6 bg-accent-primary">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <h2 className="font-display text-[48px] leading-tight text-text-on-dark mb-6">
              Find Our Products
            </h2>
            <p className="font-sans text-lg text-text-on-dark/80 leading-relaxed mb-10 max-w-xl mx-auto">
              Frost is available at select dispensaries across Washington State.
              Explore our full lineup of flower, pre-rolls, concentrates, and more.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-text-on-dark text-text-on-dark px-8 py-3 text-sm uppercase tracking-widest font-sans font-medium transition-colors duration-200 hover:bg-text-on-dark/10"
            >
              Browse Products
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
