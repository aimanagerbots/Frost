import Link from "next/link";

export default function FindPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Product Finder
      </h1>
      <p className="text-lg text-text-muted mb-8">
        AI-powered dispensary finder with live inventory data. Tell us what you
        are looking for and we will show you exactly where to find it in stock
        near you.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
