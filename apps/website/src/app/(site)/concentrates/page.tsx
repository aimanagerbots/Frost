import { CATEGORIES } from "@/lib/constants";
import { getProductsByCategory } from "@/mocks/products";
import { CategoryBrowseClient } from "@/components/category/CategoryBrowseClient";

export const metadata = { title: "Concentrates | Frost" };

export default function ConcentratesPage() {
  const products = getProductsByCategory("concentrate");
  const brands = [...new Set(products.map((p) => p.brand))];
  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <CategoryBrowseClient category="concentrate" meta={CATEGORIES.concentrate} products={products} brands={brands} />
      </div>
    </section>
  );
}
