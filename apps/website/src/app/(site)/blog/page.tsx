import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CategoryBanner } from "@/components/ui/CategoryBanner";
import { getAllPosts } from "@/mocks/blog-posts";
import { BlogPageClient } from "./BlogPageClient";

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div>
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <CategoryBanner alt="Blog" />
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
