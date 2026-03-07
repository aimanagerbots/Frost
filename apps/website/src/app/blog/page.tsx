import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Blog
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Articles, strain spotlights, and industry insights from the Frost team.
        Stay up to date with the latest in craft cannabis.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
