"use client";

import { useState, useMemo } from "react";
import { SearchInput, FilterBar, StoreCard, ScrollReveal } from "@/components";
import { MapPin } from "lucide-react";
import type { DispensaryLocation } from "@/types";

interface StoresPageClientProps {
  dispensaries: DispensaryLocation[];
}

export default function StoresPageClient({
  dispensaries,
}: StoresPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");

  const regions = useMemo(() => {
    const unique = Array.from(new Set(dispensaries.map((d) => d.region))).sort();
    return ["All", ...unique];
  }, [dispensaries]);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return dispensaries.filter((d) => {
      const matchesRegion =
        activeRegion === "All" || d.region === activeRegion;
      const matchesSearch =
        !query ||
        d.name.toLowerCase().includes(query) ||
        d.address.city.toLowerCase().includes(query) ||
        d.address.zip.includes(query);
      return matchesRegion && matchesSearch;
    });
  }, [dispensaries, searchQuery, activeRegion]);

  return (
    <div className="section-pad max-w-7xl mx-auto px-6">
      {/* Map placeholder */}
      <div className="rounded-xl border border-border-default bg-card p-12 flex flex-col items-center justify-center text-center mb-12">
        <MapPin className="h-12 w-12 text-accent-primary opacity-40 mb-4" />
        <h2 className="font-display text-xl text-text-default mb-2">
          Interactive Map Coming Soon
        </h2>
        <p className="text-sm text-text-muted font-sans">
          In the meantime, browse our partner dispensaries below
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by city or store name..."
          />
        </div>
        <FilterBar
          options={regions}
          active={activeRegion}
          onChange={setActiveRegion}
        />
      </div>

      {/* Result count */}
      <p className="text-sm text-text-muted mb-6">
        Showing {filtered.length} dispensaries
      </p>

      {/* Store cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-text-muted font-sans">
            No dispensaries found
          </p>
          <p className="text-sm text-text-muted/60 font-sans mt-2">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dispensary, index) => (
            <ScrollReveal key={dispensary.id} staggerDelay={index * 50}>
              <StoreCard
                name={dispensary.name}
                address={dispensary.address}
                hours={dispensary.hours}
                categoriesCarried={dispensary.categoriesCarried}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
