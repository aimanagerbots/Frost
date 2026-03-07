import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Product Detail
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Viewing <span className="text-text-bright">{slug}</span> in{" "}
        <span className="text-text-bright">{category}</span>. This page will
        show product photos, terpene profiles, lab results, and dispensary
        availability.
      </p>
      <Link
        href={`/products/${category}`}
        className="text-accent-primary hover:underline"
      >
        Back to {category.charAt(0).toUpperCase() + category.slice(1)}
      </Link>
    </main>
  );
}
