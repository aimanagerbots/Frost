"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import type { DispensaryLocation } from "@/types";
import type { StoreInventoryItem } from "@/mocks/store-inventory";
import { useOrderStore } from "@/stores/order-store";
import { CartDrawer } from "@/components/order/CartDrawer";
import { CartBadge } from "@/components/order/CartBadge";
import { ConciergeFAB } from "@/components/order/ConciergeFAB";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_TABS = [
  { key: "all", label: "All" },
  { key: "flower", label: "Flower" },
  { key: "preroll", label: "Pre-Rolls" },
  { key: "vaporizer", label: "Vaporizers" },
  { key: "concentrate", label: "Concentrates" },
  { key: "edible", label: "Edibles" },
  { key: "beverage", label: "Beverages" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  flower: "Flower",
  preroll: "Pre-Roll",
  vaporizer: "Vaporizer",
  concentrate: "Concentrate",
  edible: "Edible",
  beverage: "Beverage",
};

const STRAIN_COLORS: Record<string, string> = {
  indica: "bg-[#8B5CF6]/15 text-[#8B5CF6]",
  sativa: "bg-[#F97316]/15 text-[#F97316]",
  hybrid: "bg-[#22C55E]/15 text-[#22C55E]",
  cbd: "bg-[#5BB8E6]/15 text-[#5BB8E6]",
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StockBadge({ status }: { status: StoreInventoryItem["stockStatus"] }) {
  const config = {
    "in-stock": { dot: "bg-emerald-400", text: "text-emerald-400", label: "In Stock" },
    "low-stock": { dot: "bg-amber-400", text: "text-amber-400", label: "Low Stock" },
    "out-of-stock": { dot: "bg-red-400", text: "text-red-400/60", label: "Out of Stock" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-sans font-medium ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function StoreProductCard({
  item,
  onAddToCart,
  isInCart,
}: {
  item: StoreInventoryItem;
  dispensary: DispensaryLocation;
  onAddToCart: (item: StoreInventoryItem) => void;
  isInCart: boolean;
}) {
  const [justAdded, setJustAdded] = useState(false);
  const isOutOfStock = item.stockStatus === "out-of-stock";
  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;
  const strainColor = item.strainType
    ? STRAIN_COLORS[item.strainType.toLowerCase()] ?? "bg-white/10 text-white/60"
    : null;

  const handleAdd = () => {
    onAddToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      className={`group relative bg-card rounded-xl border border-white/[0.06] p-5 flex flex-col gap-3 transition-all duration-300 hover:border-white/[0.12] hover:bg-card-hover ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      <div className="space-y-1">
        <h3 className="font-display text-lg leading-snug text-text-default tracking-[-0.01em]">
          {item.productName}
        </h3>
        <p className="text-sm text-text-muted font-sans">{item.brand}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="inline-block bg-white/[0.06] text-text-muted text-[11px] uppercase tracking-wider rounded-full px-2.5 py-0.5 font-sans font-medium">
          {categoryLabel}
        </span>
        {item.strainType && strainColor && (
          <span
            className={`inline-block text-[11px] uppercase tracking-wider rounded-full px-2.5 py-0.5 font-sans font-medium ${strainColor}`}
          >
            {item.strainType}
          </span>
        )}
      </div>

      {(item.thcRange || item.strainName) && (
        <div className="flex items-center gap-3 text-sm font-sans">
          {item.thcRange && (
            <span className="text-text-muted">
              THC <span className="text-text-default">{item.thcRange}</span>
            </span>
          )}
          {item.strainName && (
            <span className="text-text-muted truncate">{item.strainName}</span>
          )}
        </div>
      )}

      <div className="mt-auto pt-2 flex items-end justify-between">
        <div className="space-y-1">
          <p className="font-display text-2xl text-text-bright tracking-tight">
            ${item.price.toFixed(2)}
          </p>
          <StockBadge status={item.stockStatus} />
        </div>
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`px-4 py-2 rounded-lg text-sm font-sans font-semibold transition-all duration-200 ${
            isOutOfStock
              ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
              : justAdded
                ? "bg-emerald-500/20 text-emerald-400"
                : isInCart
                  ? "bg-[#5BB8E6]/10 text-[#5BB8E6]/80 hover:bg-[#5BB8E6]/20"
                  : "bg-[#5BB8E6]/15 text-[#5BB8E6] hover:bg-[#5BB8E6]/25 active:bg-[#5BB8E6]/35"
          }`}
        >
          {justAdded ? "Added!" : isInCart ? "+ Add More" : "+ Add"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface StoreMenuClientProps {
  dispensary: DispensaryLocation;
  inventory: StoreInventoryItem[];
}

export function StoreMenuClient({ dispensary, inventory }: StoreMenuClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { addItem, items } = useOrderStore();

  const filteredInventory = useMemo(() => {
    if (activeCategory === "all") return inventory;
    return inventory.filter((item) => item.category === activeCategory);
  }, [inventory, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: inventory.length };
    for (const item of inventory) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [inventory]);

  const cartSlugsAtStore = useMemo(() => {
    const slugs = new Set<string>();
    for (const item of items) {
      if (item.storeId === dispensary.id) {
        slugs.add(item.productSlug);
      }
    }
    return slugs;
  }, [items, dispensary.id]);

  const handleAddToCart = useCallback(
    (item: StoreInventoryItem) => {
      addItem({
        productSlug: item.productSlug,
        productName: item.productName,
        category: item.category,
        brand: item.brand,
        price: item.price,
        storeId: dispensary.id,
        storeName: dispensary.name,
        storeSlug: dispensary.slug,
        strainName: item.strainName,
        strainType: item.strainType,
        thcRange: item.thcRange,
        stockStatus: item.stockStatus,
      });
    },
    [addItem, dispensary],
  );

  const { address } = dispensary;

  return (
    <div className="min-h-screen bg-base">
      {/* Breadcrumb */}
      <div className="pt-6 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-text-muted font-sans">
            <Link href="/order" className="text-[#5BB8E6] hover:underline">
              Order
            </Link>
            {" / "}
            <span className="text-text-default">{dispensary.name}</span>
          </p>
        </div>
      </div>

      {/* Store Hero */}
      <section className="relative pt-10 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(91,184,230,0.06) 0%, rgba(91,184,230,0.02) 40%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(91,184,230,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] text-text-bright">
              {dispensary.name}
            </h1>
            {dispensary.dba && dispensary.dba !== dispensary.name && (
              <p className="text-lg text-text-muted font-sans">{dispensary.dba}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-sans">
            <span className="inline-flex items-center gap-2 text-text-default">
              <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {address.street}, {address.city}, {address.state} {address.zip}
            </span>
            <span className="inline-flex items-center gap-2 text-text-default">
              <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {dispensary.phone}
            </span>
            <span className="inline-flex items-center gap-2 text-text-default">
              <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {dispensary.hours}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {dispensary.frostPartnerSince && (
              <span className="inline-flex items-center gap-1.5 bg-[#5BB8E6]/10 text-[#5BB8E6] text-xs uppercase tracking-wider rounded-full px-3 py-1.5 font-sans font-semibold">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Partner since {dispensary.frostPartnerSince}
              </span>
            )}
          </div>

          {dispensary.description && (
            <p className="max-w-2xl text-base leading-relaxed text-text-muted font-sans">
              {dispensary.description}
            </p>
          )}
        </div>
      </section>

      {/* Featured Deal */}
      {dispensary.featuredDeal && (
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-xl overflow-hidden">
              <div
                className="absolute -inset-[1px] rounded-xl opacity-70"
                style={{
                  background: "linear-gradient(135deg, #5BB8E6, #4AE0D6, #5BB8E6, #7EC8F0)",
                }}
              />
              <div className="relative bg-card rounded-xl p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#5BB8E6] font-sans font-semibold">
                      Frost Exclusive Deal
                    </p>
                    <p className="font-display text-2xl md:text-3xl text-text-bright tracking-tight leading-snug">
                      {dispensary.featuredDeal}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Menu */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-1">
            <h2 className="font-display text-2xl md:text-3xl text-text-default tracking-tight">
              Frost Products at {dispensary.name}
            </h2>
            <p className="text-sm text-text-muted font-sans">
              {inventory.length} product{inventory.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* Category tabs */}
          <div className="overflow-x-auto -mx-6 px-6 scrollbar-none">
            <div className="flex gap-2 min-w-max pb-1">
              {CATEGORY_TABS.map((tab) => {
                const count = categoryCounts[tab.key] ?? 0;
                if (tab.key !== "all" && count === 0) return null;
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-sans font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#5BB8E6] text-black"
                        : "bg-white/[0.04] text-text-muted hover:bg-white/[0.08] hover:text-text-default"
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[11px] ${isActive ? "text-black/60" : "text-text-muted"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product grid */}
          {filteredInventory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInventory.map((item) => (
                <StoreProductCard
                  key={item.productSlug}
                  item={item}
                  dispensary={dispensary}
                  onAddToCart={handleAddToCart}
                  isInCart={cartSlugsAtStore.has(item.productSlug)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-text-muted font-sans">
                No products in this category at {dispensary.name}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Back link */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Link href="/order" className="text-sm text-[#5BB8E6] font-sans hover:underline">
            &larr; Back to Order
          </Link>
        </div>
      </div>

      {/* Cart + Concierge */}
      <CartDrawer />
      <CartBadge />
      <ConciergeFAB />
    </div>
  );
}
