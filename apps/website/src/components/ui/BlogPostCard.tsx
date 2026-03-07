import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";

type BlogCategory =
  | "flower"
  | "concentrate"
  | "vape"
  | "preroll"
  | "edible"
  | "beverage";

interface BlogPostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: BlogCategory;
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
      className="group block rounded-xl border border-border-default bg-card overflow-hidden transition-colors hover:border-border-hover"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-5 space-y-3">
        <Badge label={category} variant={category} />

        <h3 className="font-display text-xl text-text-default leading-snug">
          {title}
        </h3>

        <p className="text-sm text-text-muted font-sans leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        <p className="text-xs text-text-muted font-sans">
          {author} &middot; {date} &middot; {readTime}
        </p>
      </div>
    </Link>
  );
}
