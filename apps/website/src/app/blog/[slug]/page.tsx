import Link from "next/link";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Blog Post
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Reading: <span className="text-text-bright">{slug}</span>. This page
        will render the full article content, author info, and related posts.
      </p>
      <Link href="/blog" className="text-accent-primary hover:underline">
        Back to Blog
      </Link>
    </main>
  );
}
