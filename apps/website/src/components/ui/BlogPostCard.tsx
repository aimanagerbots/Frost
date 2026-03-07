import Image from "next/image";
import Link from "next/link";

interface BlogPostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  imageUrl: string;
}

export function BlogPostCard({
  title,
  slug,
  excerpt,
  author,
  date,
  readTime,
  category,
  imageUrl,
}: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block rounded-xl border border-border-default bg-card overflow-hidden hover-lift"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover img-hover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute top-3 left-3 bg-accent-primary/90 text-text-on-dark text-xs uppercase tracking-wider rounded-full px-3 py-1 font-sans font-medium">
          {category}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-display text-[22px] leading-snug text-text-default">
          {title}
        </h3>

        <p className="text-sm text-text-muted font-sans leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        <p className="text-[13px] text-text-muted font-sans">
          {author} &middot; {date} &middot; {readTime} min read
        </p>
      </div>
    </Link>
  );
}
