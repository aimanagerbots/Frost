"use client";

import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Star Rating                                                        */
/* ------------------------------------------------------------------ */

interface StarRatingProps {
  rating: number;
  max?: number;
}

export function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={`h-3 w-3 ${filled ? "text-[#F59E0B]" : "text-white/10"}`}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Strain-type badge colors                                           */
/* ------------------------------------------------------------------ */

const STRAIN_COLORS: Record<string, string> = {
  indica: "#C084FC",
  sativa: "#FB923C",
  hybrid: "#34D399",
  cbd: "#38BDF8",
};

/* ------------------------------------------------------------------ */
/*  Shopping bag icon                                                   */
/* ------------------------------------------------------------------ */

function ShoppingBagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  ProductBrowseTile                                                  */
/* ------------------------------------------------------------------ */

interface ProductBrowseTileProps {
  slug: string;
  categoryRoute: string;
  name: string;
  imageUrl: string;
  strainName?: string;
  strainType?: string;
  thcRange: string;
  price: number;
  rating: number;
  reviewCount: number;
  brand: string;
  onAddToCart: () => void;
}

export default function ProductBrowseTile({
  slug,
  categoryRoute,
  name,
  imageUrl,
  strainName,
  strainType,
  thcRange,
  price,
  rating,
  reviewCount,
  brand: _brand,
  onAddToCart,
}: ProductBrowseTileProps) {
  const typeLower = strainType?.toLowerCase() ?? "";
  const badgeColor = STRAIN_COLORS[typeLower] ?? "#5BB8E6";

  return (
    <div className="group rounded-xl border border-[#5BB8E6]/20 shadow-[0_0_8px_1px_rgba(91,184,230,0.25)] transition-shadow duration-300 hover:shadow-[0_0_14px_2px_rgba(91,184,230,0.4)]">
      {/* Image area */}
      <Link
        href={`/${categoryRoute}/${slug}`}
        className="block overflow-hidden rounded-t-xl"
      >
        <div className="relative aspect-square bg-black/40 p-6 transition-transform duration-300 group-hover:scale-[1.03]">
          <Image
            src="/FrostLogo_SnowflakeOnly.png"
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-6 opacity-60"
          />
        </div>
      </Link>

      {/* Info bar */}
      <div className="space-y-1 px-3 py-3">
        {/* Product name */}
        <p className="font-display text-sm text-text-default line-clamp-1">
          {name}
        </p>

        {/* Strain name */}
        {strainName && (
          <p className="text-xs text-text-muted line-clamp-1">{strainName}</p>
        )}

        {/* Type badge + THC */}
        <div className="flex items-center gap-2">
          {strainType && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize leading-none"
              style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: badgeColor }}
              />
              {strainType}
            </span>
          )}
          <span className="text-xs text-text-muted">{thcRange}</span>
        </div>

        {/* Rating + review count */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={rating} />
          <span className="text-xs text-text-muted">({reviewCount})</span>
        </div>

        {/* Price */}
        <p className="font-display text-sm text-text-default">
          ${price.toFixed(2)}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/${categoryRoute}/${slug}`}
            className="flex-1 rounded-lg border border-white/10 px-3 py-1.5 text-center text-xs text-text-default transition-colors hover:bg-white/5"
          >
            View
          </Link>
          <button
            type="button"
            onClick={onAddToCart}
            className="flex items-center justify-center rounded-lg bg-[#5BB8E6] px-3 py-1.5 text-black transition-colors hover:bg-[#4DA8D6]"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingBagIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
