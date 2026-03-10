import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CategoryBanner } from "@/components/ui/CategoryBanner";
import { getAllPosts } from "@/mocks/blog-posts";
import { BlogPageClient } from "./BlogPageClient";

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <CategoryBanner alt="Blog" />
        <ScrollReveal>
          <BlogPageClient posts={posts} />
        </ScrollReveal>
      </div>
    </section>
  );
}
