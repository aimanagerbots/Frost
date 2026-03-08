import { notFound } from "next/navigation";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/constants";
import { getProductsByCategory } from "@/mocks/products";
import type { ProductCategory } from "@/types";
import { CategoryPageClient } from "./CategoryPageClient";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  // Validate category
  if (!CATEGORY_SLUGS.includes(category as ProductCategory)) {
    notFound();
  }

  const cat = category as ProductCategory;
  const meta = CATEGORIES[cat];
  const products = getProductsByCategory(cat);

  return <CategoryPageClient category={cat} meta={meta} products={products} />;
}
