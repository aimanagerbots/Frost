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
import { Mail, MapPin, Leaf, FlaskConical, Package, Truck, Star, Quote } from "lucide-react";

/* ── Inline Newsletter CTA Strip ── */
function NewsletterStrip({ heading, subtext }: { heading: string; subtext: string }) {
  return (
    <section className="py-12 border-y border-border-default">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:text-left">
        <Mail className="h-8 w-8 shrink-0 text-accent-primary" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-default">{heading}</h3>
          <p className="text-sm text-text-muted">{subtext}</p>
        </div>
        <Link
          href="/newsletter"
          className="shrink-0 rounded-full bg-accent-primary px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-text-on-dark transition-colors hover:bg-accent-primary-hover"
        >
          Subscribe
        </Link>
      </div>
    </section>
  );
}

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
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div>
      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden bg-black">
        {/* Mobile hero (9:16) — shown below 640px */}
        <div className="block sm:hidden aspect-[9/16]">
          <Image
            src="/Frost-website-hero-mobile.png"
            alt="Frosty Nugs"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        {/* Desktop hero (16:9) — shown at 640px+ */}
        <div className="hidden sm:block sm:aspect-[2/1] lg:aspect-auto lg:h-[calc(100vh-56px)]">
          <Image
            src="/Frost-website-hero.png"
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
      </section>

      {/* ── 3. Newsletter CTA Strip ── */}
      <NewsletterStrip
        heading="New drops, straight to your inbox"
        subtext="Be the first to know when we release new strains, products, and dispensary partnerships."
      />

      {/* ── 4. Strain Library Hero ── */}
      <section className="section-pad">
        <ScrollReveal>
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/strains"
              className="group relative block overflow-hidden rounded-2xl"
              style={{ aspectRatio: "8 / 3" }}
            >
              {/* Placeholder image — wide cinematic */}
              <Image
                src={unsplashUrl(PHOTOS.strains.hero, 2560, 960)}
                alt="Explore our strain library"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-primary">
                  Strain Library
                </p>
                <h2 className="max-w-lg font-display text-3xl text-text-on-dark sm:text-4xl lg:text-5xl">
                  Explore Our Genetics
                </h2>
                <p className="mt-3 max-w-md text-sm text-text-on-dark-muted sm:text-base">
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

      {/* ── 5. Social Proof ── */}
      <section className="section-pad">
        <h2 className="mb-4 text-center font-display text-[40px] text-text-default">
          What People Are Saying
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-text-muted">
          Real reviews from real customers across Washington State.
        </p>
        <ScrollReveal>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="rounded-xl border border-border-default bg-card p-6"
              >
                <Quote className="mb-4 h-6 w-6 text-accent-primary opacity-40" />
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent-primary text-accent-primary"
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-text-default font-sans">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-text-default">{review.name}</p>
                  <p className="text-xs text-text-muted">{review.location}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── 6. Newsletter CTA Strip ── */}
      <NewsletterStrip
        heading="Get 10% off your first order"
        subtext="Sign up for the Frost newsletter and we'll send you a discount code for your local dispensary."
      />

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

      {/* ── 8. Find Near You ── */}
      <section className="section-pad-lg bg-accent-primary">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <MapPin className="mx-auto mb-6 h-10 w-10 text-text-on-dark opacity-60" />
          <h2 className="mb-6 font-display text-[48px] text-text-on-dark">
            Find Frost Near You
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-text-on-dark/80">
            We partner with select dispensaries across Washington State. Find the
            closest location carrying Frost products and stop by today.
          </p>
          <Link
            href="/find"
            className="inline-block rounded-full border-2 border-text-on-dark px-8 py-3 font-medium text-text-on-dark transition-colors hover:bg-text-on-dark/10"
          >
            Find a Store
          </Link>
        </div>
      </section>

      {/* ── 9. Newsletter CTA Strip ── */}
      <NewsletterStrip
        heading="Stay Frosty"
        subtext="Product drops, strain spotlights, and dispensary updates — no spam, just the good stuff."
      />

      {/* ── 10. From the Journal ── */}
      <section className="section-pad">
        <h2 className="mb-4 text-center font-display text-[40px] text-text-default">
          From the Journal
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-text-muted">
          Strain spotlights, industry insights, and stories from behind the scenes.
        </p>
        <ScrollReveal>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
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

      {/* ── 11. Newsletter CTA (full closing) ── */}
      <section className="section-pad-lg border-t border-border-default">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Mail className="mx-auto mb-6 h-10 w-10 text-accent-primary opacity-60" />
          <h2 className="mb-4 font-display text-[40px] text-text-default">
            Stay Frosty
          </h2>
          <p className="mx-auto mb-8 max-w-md text-text-muted">
            Get product drops, strain spotlights, and dispensary updates delivered
            to your inbox. No spam, just the good stuff.
          </p>
          <Link
            href="/newsletter"
            className="inline-block rounded-full bg-accent-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-text-on-dark transition-colors hover:bg-accent-primary-hover"
          >
            Sign Up for Updates
          </Link>
        </div>
      </section>
    </div>
  );
}
