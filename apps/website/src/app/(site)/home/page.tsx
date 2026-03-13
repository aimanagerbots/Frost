import Link from "next/link";
import Image from "next/image";
import {
  CategoryCard,
  BlogPostCard,
  ScrollReveal,
} from "@/components";
import { CATEGORIES, CATEGORY_SLUGS, unsplashUrl, PHOTOS } from "@/lib/constants";
import { getProductsByCategory } from "@/mocks/products";
import { blogPosts } from "@/mocks/blog-posts";
import { MapPin, Leaf, FlaskConical, Package, Truck } from "lucide-react";
import { ReviewCarousel } from "./ReviewCarousel";

/* ── Social proof reviews ── */
const REVIEWS = [
  {
    quote: "Frost's flower is on another level. The Blue Frost OG had me relaxed without being locked to the couch. Incredible terps.",
    name: "Marcus T.",
    location: "Seattle, WA",
    rating: 5,
  },
  {
    quote: "Finally a brand that takes edibles seriously. The Frost Bite Gummies hit perfectly every time — consistent dosing is hard to find.",
    name: "Sarah K.",
    location: "Tacoma, WA",
    rating: 5,
  },
  {
    quote: "I've tried every pre-roll brand in Washington. Frost's infused joints are the only ones I'll buy now. Smooth, potent, and they actually taste good.",
    name: "Derek L.",
    location: "Spokane, WA",
    rating: 5,
  },
  {
    quote: "The Gelato #41 from Frost is hands down the best I've had in Washington. Creamy, smooth, and the high is perfectly balanced.",
    name: "Jenna M.",
    location: "Olympia, WA",
    rating: 5,
  },
  {
    quote: "Switched to Frost's beverages for social events. Five milligrams is the perfect dose — I feel great without overdoing it.",
    name: "Carlos R.",
    location: "Bellingham, WA",
    rating: 5,
  },
  {
    quote: "Their budtenders actually know what they're talking about. Got a terpene-based recommendation and it was spot on. Customer for life.",
    name: "Anika P.",
    location: "Everett, WA",
    rating: 5,
  },
  {
    quote: "I appreciate that Frost lists full terpene profiles on every product. No other brand in the state does that consistently.",
    name: "Tyrell W.",
    location: "Vancouver, WA",
    rating: 5,
  },
  {
    quote: "The Wedding Cake is unreal. Slow-cured and you can taste the difference. This is what craft cannabis should be.",
    name: "Megan F.",
    location: "Kennewick, WA",
    rating: 5,
  },
  {
    quote: "Frost's sustainability practices actually back up their claims. The container return program is a nice touch most brands skip.",
    name: "Noah J.",
    location: "Redmond, WA",
    rating: 5,
  },
  {
    quote: "Best concentrates in the Pacific Northwest. Their live rosin is clean, flavorful, and hits like nothing else on the shelf.",
    name: "Lily C.",
    location: "Tacoma, WA",
    rating: 5,
  },
];

/* ── How It's Made steps ── */
const PROCESS_STEPS = [
  {
    icon: Leaf,
    title: "Cultivated",
    description: "Small-batch, hand-trimmed flower grown in controlled environments across Washington State.",
  },
  {
    icon: FlaskConical,
    title: "Crafted",
    description: "Extracted, infused, and formulated by our in-house team using solventless and live resin methods.",
  },
  {
    icon: Package,
    title: "Packaged",
    description: "Lab-tested, compliance-verified, and sealed in sustainable packaging designed to preserve freshness.",
  },
  {
    icon: Truck,
    title: "Delivered",
    description: "Distributed to select dispensaries across Washington with full chain-of-custody tracking.",
  },
];

export default function HomePage() {
  const recentPosts = blogPosts.slice(0, 15);

  return (
    <div>
      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden bg-black -mt-[88px]">
        {/* Mobile hero (9:16) — shown below 640px */}
        <div className="relative block sm:hidden aspect-[9/16]">
          <Image
            src="/Frost-hero-mobile.png"
            alt="Frosty Nugs"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        {/* Desktop hero (16:9) — shown at 640px+ */}
        <div className="relative hidden sm:block sm:aspect-[2/1] lg:aspect-auto lg:h-screen">
          <Image
            src="/Frost-hero-desktop.png"
            alt="Frosty Nugs"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>
      </section>

      {/* ── 2. Shop by Category ── */}
      <section className="section-pad">
        <h2 className="mb-4 text-center font-display text-[48px] text-text-default">
          Shop by Category
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-text-muted">
          Six product lines, one standard of quality. Explore what Frost has to offer.
        </p>
        <ScrollReveal>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 lg:grid-cols-3 lg:gap-8">
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
        <ScrollReveal>
          <div className="mx-auto max-w-7xl px-6 mt-4 lg:mt-8">
            <Link
              href="/strains"
              className="group relative flex items-center overflow-hidden rounded-xl border border-[#5BB8E6]/40 shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] transition-shadow duration-300 hover:shadow-[0_0_20px_4px_rgba(91,184,230,0.6),0_0_40px_8px_rgba(91,184,230,0.3)]"
              style={{ aspectRatio: "8 / 3" }}
            >
              {/* Logo placeholder */}
              <div className="absolute inset-0">
                <Image
                  src="/FrostLogo_SnowflakeOnly.png"
                  alt="Explore our strain library"
                  fill
                  sizes="100vw"
                  className="object-contain p-16 opacity-20 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-primary">
                  Strain Library
                </p>
                <h2 className="max-w-lg font-display text-3xl text-text-default sm:text-4xl lg:text-5xl">
                  Explore Our Genetics
                </h2>
                <p className="mt-3 max-w-md text-sm text-text-muted sm:text-base">
                  Indica, Sativa, and Hybrid cultivars bred for flavor, potency, and consistency. Browse by type or effect.
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-text-on-dark transition-colors group-hover:bg-accent-primary-hover">
                    Browse Strains
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Order Frost ── */}
      <section className="section-pad-lg bg-accent-primary">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <MapPin className="mx-auto mb-6 h-10 w-10 text-text-on-dark opacity-60" />
          <h2 className="mb-6 font-display text-[48px] text-text-on-dark">
            Order Frost
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-text-on-dark/80">
            We partner with select dispensaries across Washington State. Find the
            closest location carrying Frost products and order today.
          </p>
          <Link
            href="/order"
            className="inline-block rounded-full border-2 border-text-on-dark px-8 py-3 font-medium text-text-on-dark transition-colors hover:bg-text-on-dark/10"
          >
            Order Now
          </Link>
        </div>
      </section>

      {/* ── 4. Social Proof ── */}
      <section className="section-pad">
        <h2 className="mb-4 text-center font-display text-[40px] text-text-default">
          What People Are Saying
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-text-muted">
          Real reviews from real customers across Washington State.
        </p>
        <ReviewCarousel reviews={REVIEWS} />
      </section>

      {/* ── 7. How It's Made ── */}
      <section className="section-pad">
        <h2 className="mb-4 text-center font-display text-[40px] text-text-default">
          How It&apos;s Made
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-text-muted">
          From seed to shelf, every Frost product follows the same uncompromising process.
        </p>
        <ScrollReveal>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border-default bg-elevated/50">
                  <step.icon className="h-7 w-7 text-accent-primary" />
                </div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                  Step {i + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-default">{step.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted font-sans">{step.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Blog ── */}
      <section className="section-pad">
        <ScrollReveal>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-block rounded-full border border-border-default px-8 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-text-default transition-colors hover:bg-card-hover"
              >
                View All Stories
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
