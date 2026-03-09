import { CATEGORIES } from "@/lib/constants";
import { getProductsByCategory } from "@/mocks/products";
import { CategoryBrowseClient } from "@/components/category/CategoryBrowseClient";

export const metadata = { title: "Pre-Rolls | Frost" };

export default function PreRollsPage() {
  const products = getProductsByCategory("preroll");
  const brands = [...new Set(products.map((p) => p.brand))];
  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <CategoryBrowseClient category="preroll" meta={CATEGORIES.preroll} products={products} brands={brands} />
      </div>
    </section>
  );
}
