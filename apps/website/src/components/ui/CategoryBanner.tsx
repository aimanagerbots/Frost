import Image from "next/image";

interface CategoryBannerProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
}

export function CategoryBanner({
  src,
  alt,
  width = 1280,
  height = 100,
}: CategoryBannerProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border-default bg-elevated mb-8"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-2xl font-bold uppercase tracking-[0.15em] text-text-default">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}
