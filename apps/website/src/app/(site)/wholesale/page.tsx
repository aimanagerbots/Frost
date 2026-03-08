import Link from "next/link";

export default function WholesalePage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Wholesale Partnership
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Partner with Frost to bring premium craft cannabis to your dispensary.
        Learn about our wholesale program, pricing tiers, and dedicated account
        support.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
