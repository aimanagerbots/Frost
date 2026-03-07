import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Products
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Browse all six product categories: flower, pre-rolls, vaporizers,
        concentrates, edibles, and beverages. Premium craft cannabis from seed to
        shelf.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
