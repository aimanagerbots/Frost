"use client";

import { useState, useMemo } from "react";
import type { WebsiteStrain } from "@/types";
import { FilterBar } from "@/components/ui/FilterBar";
import { SearchInput } from "@/components/ui/SearchInput";
import { StrainCard } from "@/components/ui/StrainCard";

const FILTER_OPTIONS = ["All", "Indica", "Sativa", "Hybrid", "CBD"];

interface StrainsPageClientProps {
  strains: WebsiteStrain[];
}

export function StrainsPageClient({ strains }: StrainsPageClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return strains.filter((strain) => {
      if (activeFilter !== "All") {
        if (strain.type.toLowerCase() !== activeFilter.toLowerCase()) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !strain.name.toLowerCase().includes(q) &&
          !strain.lineage.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [strains, activeFilter, searchQuery]);

  return (
    <>
      {/* Filter + Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8">
        <div className="shrink-0">
          <FilterBar options={FILTER_OPTIONS} active={activeFilter} onChange={setActiveFilter} />
        </div>
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search strains..."
          />
        </div>
      </div>

      {/* Count */}
      <p className="mb-6 text-sm text-text-muted">
        {filtered.length} {filtered.length === 1 ? "strain" : "strains"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StrainCard
              key={s.id}
              name={s.name}
              slug={s.slug}
              type={s.type as "indica" | "sativa" | "hybrid" | "cbd"}
              lineage={s.lineage}
              thcRange={s.thcRange}
              terpeneProfile={s.terpeneProfile}
              description={s.description}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-2xl text-text-default mb-2">No strains found</p>
          <p className="text-sm text-text-muted">Try adjusting your filters or search query.</p>
        </div>
      )}
    </>
  );
}
