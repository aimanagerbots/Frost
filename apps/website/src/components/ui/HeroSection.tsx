import Image from "next/image";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  height?: "full" | "half";
  align?: "center" | "left";
  children?: React.ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  imageUrl,
  height = "full",
  align = "center",
  children,
}: HeroSectionProps) {
  const heightClass = height === "full" ? "min-h-screen" : "min-h-[50vh]";
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <section className={`relative flex ${heightClass} ${alignClass} justify-center overflow-hidden`}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark" />

      <div className={`relative z-10 px-6 py-24 max-w-4xl ${align === "center" ? "mx-auto" : ""}`}>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-text-on-dark leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 font-sans text-lg md:text-xl text-text-on-dark-muted max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
