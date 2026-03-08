import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getAllPosts } from "@/mocks/blog-posts";
import { BlogPageClient } from "./BlogPageClient";

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div>
      {/* Header section */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-[64px] leading-[1.1] tracking-[-0.02em] text-text-default">
            The Frost Journal
          </h1>
          <p className="mt-4 text-lg text-text-muted font-sans max-w-2xl">
            Stories, strain spotlights, and insights from the world of craft cannabis.
          </p>
        </div>
      </div>
      <ScrollReveal>
        <section className="section-pad px-6">
          <div className="max-w-7xl mx-auto">
            <BlogPageClient posts={posts} />
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
