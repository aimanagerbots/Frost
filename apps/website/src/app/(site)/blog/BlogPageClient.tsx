"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FilterBar } from "@/components/ui/FilterBar";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import type { BlogPost } from "@/types";

const CATEGORIES = ["All", "Strain Spotlights", "Education", "Company", "Culture"];

interface BlogPageClientProps {
  posts: BlogPost[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? posts
      : posts.filter((post) => post.category === activeFilter);

  const [featured, ...remaining] = filtered;

  return (
    <div className="space-y-12">
      {/* Category filter tabs */}
      <FilterBar options={CATEGORIES} active={activeFilter} onChange={setActiveFilter} />

      {/* Featured / newest post */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group block rounded-xl border border-border-default bg-card overflow-hidden hover-lift"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              className="object-cover img-hover"
              sizes="(max-width: 768px) 100vw, 100vw"
              priority
            />
            <span className="absolute top-4 left-4 bg-accent-primary/90 text-text-on-dark text-xs uppercase tracking-wider rounded-full px-3 py-1 font-sans font-medium">
              {featured.category}
            </span>
          </div>
          <div className="p-6 space-y-3">
            <h2 className="font-display text-3xl leading-snug text-text-default">
              {featured.title}
            </h2>
            <p className="text-base text-text-muted font-sans leading-relaxed max-w-3xl">
              {featured.excerpt}
            </p>
            <p className="text-sm text-text-muted font-sans">
              {featured.author} &middot; {featured.date} &middot; {featured.readTime} min read
            </p>
          </div>
        </Link>
      )}

      {/* Remaining posts grid */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {remaining.map((post) => (
            <BlogPostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              author={post.author}
              date={post.date}
              readTime={post.readTime}
              category={post.category}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
