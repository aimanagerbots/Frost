import Image from "next/image";
import Link from "next/link";

interface StrainCardProps {
  slug: string;
  imageUrl?: string;
  name: string;
}

export function StrainCard({ slug, imageUrl, name }: StrainCardProps) {
  return (
    <Link
      href={`/strains/${slug}`}
      className="group relative block aspect-square rounded-lg overflow-hidden bg-elevated transition-shadow duration-300 hover:shadow-[0_0_20px_4px_rgba(91,184,230,0.5)] active:shadow-[0_0_12px_2px_rgba(91,184,230,0.3)]"
    >
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
    </Link>
  );
}
