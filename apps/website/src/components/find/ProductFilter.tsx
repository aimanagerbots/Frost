'use client';

import { useCallback, useMemo } from 'react';

interface Product {
  slug: string;
  name: string;
  category: string;
}

interface ProductFilterProps {
  products: Product[];
  selectedProduct: string | null;
  onProductSelect: (slug: string | null) => void;
}

const CATEGORY_ORDER = [
  'Flower',
  'Pre-Rolls',
  'Vaporizers',
  'Concentrates',
  'Edibles',
  'Beverages',
];

export default function ProductFilter({
  products,
  selectedProduct,
  onProductSelect,
}: ProductFilterProps) {
  /* group products by category */
  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();

    for (const product of products) {
      const existing = map.get(product.category) ?? [];
      map.set(product.category, [...existing, product]);
    }

    /* sort categories by defined order, unknown categories go last */
    const sorted = [...map.entries()].sort(([a], [b]) => {
      const idxA = CATEGORY_ORDER.indexOf(a);
      const idxB = CATEGORY_ORDER.indexOf(b);
      const valA = idxA === -1 ? 999 : idxA;
      const valB = idxB === -1 ? 999 : idxB;
      return valA - valB;
    });

    return sorted;
  }, [products]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onProductSelect(value === '' ? null : value);
    },
    [onProductSelect],
  );

  return (
    <div className="relative w-full">
      <select
        value={selectedProduct ?? ''}
        onChange={handleChange}
        className="w-full appearance-none bg-[#0A0A0F] border border-white/[0.08] rounded-lg px-4 py-3 pr-10 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-[#5BB8E6]/50 focus:border-[#5BB8E6]/50 transition-all cursor-pointer"
      >
        <option value="">All Products</option>
        {grouped.map(([category, items]) => (
          <optgroup key={category} label={category}>
            {items.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* custom dropdown chevron */}
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
