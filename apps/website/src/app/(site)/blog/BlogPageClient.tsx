"use client";

import { useState, useMemo } from "react";
import { FilterBar } from "@/components/ui/FilterBar";
import { SearchInput } from "@/components/ui/SearchInput";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import type { BlogPost } from "@/types";

const CATEGORIES = ["All", "Strain Spotlights", "Education", "Company", "Culture"];

interface BlogPageClientProps {
  posts: BlogPost[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      if (activeFilter !== "All" && post.category !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !post.title.toLowerCase().includes(q) &&
          !post.excerpt.toLowerCase().includes(q) &&
          !post.author.toLowerCase().includes(q) &&
          !post.category.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [posts, activeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filter bar + search — matches category page layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <FilterBar options={CATEGORIES} active={activeFilter} onChange={setActiveFilter} />
        </div>
        <div className="flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search stories..." />
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-text-muted">
        {filtered.length} {filtered.length === 1 ? "story" : "stories"}
      </p>

      {/* 5-up grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((post) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-2xl text-text-default mb-2">No stories found</p>
          <p className="text-sm text-text-muted">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
