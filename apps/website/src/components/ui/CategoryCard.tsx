import Image from "next/image";
import Link from "next/link";
import { CATEGORY_ROUTE_MAP } from "@/lib/constants";
import type { ProductCategory } from "@frost/types";

interface CategoryCardProps {
  label: string;
  slug: string;
  tagline: string;
  productCount: number;
  imageUrl: string;
}

export function CategoryCard({
  label,
  slug,
  tagline,
  productCount,
}: CategoryCardProps) {
  return (
    <Link
      href={`/${CATEGORY_ROUTE_MAP[slug as ProductCategory] ?? slug}`}
      className="group rounded-xl border border-[#5BB8E6]/40 shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] transition-shadow duration-300 hover:shadow-[0_0_20px_4px_rgba(91,184,230,0.6),0_0_40px_8px_rgba(91,184,230,0.3)] overflow-hidden block"
    >
      {/* Logo placeholder */}
      <div className="relative aspect-square bg-black/40">
        <Image
          src="/FrostLogo_SnowflakeOnly.png"
          alt={label}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-contain p-10 opacity-60 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-5 space-y-1">
        <h3 className="font-display text-2xl text-text-default">{label}</h3>
        <p className="text-sm text-text-muted font-sans">{tagline}</p>
        <p className="text-xs text-text-muted font-sans pt-1">
          {productCount} products
        </p>
      </div>
    </Link>
  );
}
