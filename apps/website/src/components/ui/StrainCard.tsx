import Link from "next/link";
import { Badge } from "./Badge";

type StrainType = "indica" | "sativa" | "hybrid" | "cbd";

interface StrainCardProps {
  name: string;
  slug: string;
  type: StrainType;
  lineage: string;
  thcRange: string;
  terpeneProfile: string[];
  description: string;
}

const BORDER_CLASSES: Record<StrainType, string> = {
  indica: "border-l-strain-indica",
  sativa: "border-l-strain-sativa",
  hybrid: "border-l-strain-hybrid",
  cbd: "border-l-strain-cbd",
};

export function StrainCard({
  name,
  slug,
  type,
  lineage,
  thcRange,
  terpeneProfile,
  description,
}: StrainCardProps) {
  return (
    <Link
      href={`/strains/${slug}`}
      className={`group block rounded-xl border border-border-default bg-card p-6 border-l-4 ${BORDER_CLASSES[type]} transition-colors hover:border-border-hover`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl text-text-default">{name}</h3>
        <Badge label={type} variant={type} />
      </div>

      <p className="mt-1 text-xs text-text-muted font-sans">{lineage}</p>

      <p className="mt-3 text-sm text-text-muted font-sans leading-relaxed line-clamp-2">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-xs text-text-muted font-sans">THC {thcRange}</span>
        <div className="flex flex-wrap gap-1.5">
          {terpeneProfile.map((terpene) => (
            <span
              key={terpene}
              className="text-xs rounded-full px-2 py-0.5 bg-elevated text-text-muted font-sans"
            >
              {terpene}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
