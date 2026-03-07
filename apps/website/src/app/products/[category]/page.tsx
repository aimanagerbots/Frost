import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Browsing products in the{" "}
        <span className="text-text-bright">{category}</span> category. This page
        will display a filterable grid of all products in this category.
      </p>
      <Link href="/products" className="text-accent-primary hover:underline">
        Back to Products
      </Link>
    </main>
  );
}
