import { CATEGORIES } from "@/lib/constants";
import { getProductsByCategory } from "@/mocks/products";
import { CategoryBrowseClient } from "@/components/category/CategoryBrowseClient";

export const metadata = { title: "Vaporizers | Frost" };

export default function VaporizersPage() {
  const products = getProductsByCategory("vaporizer");
  const brands = [...new Set(products.map((p) => p.brand))];
  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <CategoryBrowseClient category="vaporizer" meta={CATEGORIES.vaporizer} products={products} brands={brands} />
      </div>
    </section>
  );
}
