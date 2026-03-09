import { CATEGORIES } from "@/lib/constants";
import { getProductsByCategory } from "@/mocks/products";
import { CategoryBrowseClient } from "@/components/category/CategoryBrowseClient";

export const metadata = { title: "Drinks | Frost" };

export default function DrinksPage() {
  const products = getProductsByCategory("beverage");
  const brands = [...new Set(products.map((p) => p.brand))];
  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <CategoryBrowseClient category="beverage" meta={CATEGORIES.beverage} products={products} brands={brands} />
      </div>
    </section>
  );
}
