import { notFound } from "next/navigation";
import { getProductBySlug } from "@/mocks/products";
import { ProductDetailView } from "@/components/category/ProductDetailView";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== "vaporizer") notFound();
  return <ProductDetailView product={product} category="vaporizer" />;
}
