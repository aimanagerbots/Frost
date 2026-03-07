import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";

type StrainType = "indica" | "sativa" | "hybrid" | "cbd";

interface ProductCardProps {
  name: string;
  brand: string;
  strainName: string;
  strainType: StrainType;
  thcRange: string;
  cbdRange: string;
  imageUrl: string;
  slug: string;
  category: string;
}

export function ProductCard({
  name,
  brand,
  strainName,
  strainType,
  thcRange,
  cbdRange,
  imageUrl,
  slug,
  category,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${category}/${slug}`}
      className="group block rounded-xl border border-border-default bg-card overflow-hidden transition-colors hover:border-border-hover"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-5 space-y-2">
        <p className="text-xs uppercase tracking-wider text-text-muted font-sans">
          {brand}
        </p>

        <h3 className="font-display text-xl text-text-default">{name}</h3>

        <div className="flex items-center gap-2">
          <Badge label={strainType} variant={strainType} />
          <span className="text-xs text-text-muted font-sans">{strainName}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-muted font-sans pt-1">
          <span>THC {thcRange}</span>
          <span>CBD {cbdRange}</span>
        </div>
      </div>
    </Link>
  );
}
