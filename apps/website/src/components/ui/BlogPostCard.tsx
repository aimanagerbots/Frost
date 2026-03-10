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
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover img-hover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>

      <div className="p-4 space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-widest text-accent-primary font-sans">
          {category}
        </p>
        <h3 className="font-display text-base leading-snug text-text-default line-clamp-2">
          {title}
        </h3>

        <p className="text-xs text-text-muted font-sans leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        <p className="text-[11px] text-text-muted font-sans">
          {author} &middot; {date} &middot; {readTime} min read
        </p>
      </div>
    </Link>
  );
}
