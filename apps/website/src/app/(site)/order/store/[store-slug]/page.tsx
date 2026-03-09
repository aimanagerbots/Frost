import { notFound } from "next/navigation";
import { getDispensaryBySlug, getAllDispensarySlugs } from "@/mocks/dispensaries";
import { getStoreInventory } from "@/mocks/store-inventory";
import { StoreMenuClient } from "./StoreMenuClient";

export function generateStaticParams() {
  const slugs = getAllDispensarySlugs();
  return slugs.map((slug) => ({ "store-slug": slug }));
}

interface PageProps {
  params: Promise<{ "store-slug": string }>;
}

export default async function StoreDetailPage({ params }: PageProps) {
  const resolved = await params;
  const slug = resolved["store-slug"];
  const dispensary = getDispensaryBySlug(slug);

  if (!dispensary) {
    notFound();
  }

  const inventory = getStoreInventory(dispensary.id);

  return <StoreMenuClient dispensary={dispensary} inventory={inventory} />;
}
