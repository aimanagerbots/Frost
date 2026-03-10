'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { MerchItem } from '@/types/merch';

const SUBCATEGORY_LABELS: Record<string, string> = {
  apparel: 'Apparel',
  accessories: 'Accessories',
  smoking: 'Smoking',
};

const SUBCATEGORY_COLORS: Record<string, string> = {
  apparel: 'bg-[#5BB8E6]/15 text-[#5BB8E6]',
  accessories: 'bg-amber-500/15 text-amber-400',
  smoking: 'bg-purple-500/15 text-purple-400',
};

interface MerchTileProps {
  item: MerchItem;
  redeemMode?: boolean;
}

export function MerchTile({ item, redeemMode = false }: MerchTileProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-[#5BB8E6]/40 bg-white/[0.02] shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] transition-all duration-200 hover:shadow-[0_0_20px_4px_rgba(91,184,230,0.6),0_0_40px_8px_rgba(91,184,230,0.3)] hover:bg-white/[0.04] hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-t-xl bg-white/[0.02] p-8">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={120}
          height={120}
          className="h-24 w-24 object-contain opacity-30 transition-opacity group-hover:opacity-50"
        />
        {item.isNew && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-[#5BB8E6]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#5BB8E6]">
            <Star className="h-3 w-3" />
            New
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Subcategory badge */}
        <span
          className={`mb-2 w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            SUBCATEGORY_COLORS[item.subcategory] ?? 'bg-white/[0.06] text-white/40'
          }`}
        >
          {SUBCATEGORY_LABELS[item.subcategory] ?? item.subcategory}
        </span>

        <h3 className="mb-1 text-sm font-semibold text-white">{item.name}</h3>
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-white/40">
          {item.description}
        </p>

        {/* Sizes */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {item.sizes.map((size) => (
              <span
                key={size}
                className="rounded border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-white/50"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-center justify-between">
          {redeemMode ? (
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#5BB8E6]">
                {item.pointsCost.toLocaleString()} pts
              </span>
              <span className="text-[11px] text-white/30">
                or ${item.price}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-base font-bold text-white">
                ${item.price}
              </span>
              <span className="text-[11px] text-white/30">
                or {item.pointsCost.toLocaleString()} pts
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link
              href={`/merch/${item.slug}`}
              className="rounded-full bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/[0.12]"
            >
              View
            </Link>
            <button
              type="button"
              className="rounded-full bg-[#5BB8E6]/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#5BB8E6] transition-colors hover:bg-[#5BB8E6]/25"
            >
              {redeemMode ? 'Redeem' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
