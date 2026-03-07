import Image from "next/image";
import Link from "next/link";

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
  imageUrl,
}: CategoryCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group relative block rounded-xl overflow-hidden aspect-[4/5]"
    >
      <Image
        src={imageUrl}
        alt={label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 space-y-1">
        <h3 className="font-display text-3xl text-text-on-dark">{label}</h3>
        <p className="text-sm text-text-on-dark-muted font-sans">{tagline}</p>
        <p className="text-xs text-text-on-dark-muted font-sans pt-1">
          {productCount} products
        </p>
      </div>
    </Link>
  );
}
