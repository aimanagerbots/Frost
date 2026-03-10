import Image from "next/image";
import Link from "next/link";

interface ProductTileCardProps {
  slug: string;
  categoryRoute: string;
  name: string;
  imageUrl: string;
  strainName?: string;
  rating: number;
  reviewCount: number;
  thcRange: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <svg
            key={star}
            viewBox="0 0 16 16"
            className="h-3 w-3"
            fill={filled ? "#F59E0B" : half ? "url(#half)" : "none"}
            stroke={filled || half ? "#F59E0B" : "rgba(255,255,255,0.2)"}
            strokeWidth={1}
          >
            {half && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path d="M8 1.12l1.95 3.95 4.36.63-3.15 3.07.74 4.35L8 10.93l-3.9 2.19.74-4.35L1.69 5.7l4.36-.63L8 1.12z" />
          </svg>
        );
      })}
    </span>
  );
}

export function ProductTileCard({
  slug,
  categoryRoute,
  name,
  imageUrl,
  strainName,
  rating,
  reviewCount,
  thcRange,
}: ProductTileCardProps) {
  return (
    <Link
      href={`/${categoryRoute}/${slug}`}
      className="group block rounded-xl overflow-hidden border border-[#5BB8E6]/40 bg-elevated shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_4px_rgba(91,184,230,0.6),0_0_40px_8px_rgba(91,184,230,0.3)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted text-sm">
            No image
          </div>
        )}
      </div>

      {/* Metadata strip */}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-display text-text-default line-clamp-1">
          {name}
        </h3>

        {strainName && (
          <p className="text-xs text-text-muted line-clamp-1">{strainName}</p>
        )}

        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-xs text-text-muted">({reviewCount})</span>
        </div>

        <p className="text-xs text-text-muted">THC {thcRange}</p>
      </div>
    </Link>
  );
}
