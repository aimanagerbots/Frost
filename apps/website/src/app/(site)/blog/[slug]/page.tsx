import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPostsByCategory, getAllPosts } from "@/mocks/blog-posts";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getPostsByCategory(post.category)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div>
      {/* Article header */}
      <header className="pt-8 pb-10 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-block bg-accent-primary/15 text-accent-primary text-xs uppercase tracking-wider rounded-full px-3 py-1 font-sans font-medium">
            {post.category}
          </span>
          <h1 className="font-display text-[48px] leading-[1.1] tracking-[-0.02em] text-text-default">
            {post.title}
          </h1>
          <p className="text-sm text-text-muted font-sans">
            {post.author} &middot; {post.date} &middot; {post.readTime} min read
          </p>
        </div>
      </header>

      {/* Hero image */}
      <ScrollReveal>
        <div className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Article body */}
      <ScrollReveal>
        <article className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            {post.content.map((paragraph, index) => (
              <p
                key={index}
                className="font-sans text-lg leading-relaxed text-text-muted mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </ScrollReveal>

      {/* Tags */}
      <div className="px-6 pb-12">
        <div className="max-w-2xl mx-auto flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-elevated rounded-full px-3 py-1 text-sm text-text-muted font-sans"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <ScrollReveal>
          <section className="px-6 pb-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-2xl text-text-default mb-8">
                More from {post.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((relatedPost) => (
                  <BlogPostCard
                    key={relatedPost.id}
                    title={relatedPost.title}
                    slug={relatedPost.slug}
                    excerpt={relatedPost.excerpt}
                    author={relatedPost.author}
                    date={relatedPost.date}
                    readTime={relatedPost.readTime}
                    category={relatedPost.category}
                    imageUrl={relatedPost.imageUrl}
                  />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Back link */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="text-sm text-accent-primary font-sans hover:underline"
          >
            &larr; Back to Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
