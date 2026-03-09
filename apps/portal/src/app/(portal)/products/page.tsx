'use client';

import { Search, SlidersHorizontal, Plus } from 'lucide-react';

const PRODUCTS = [
  { name: 'Blue Dream Pre-Roll 5pk', category: 'Preroll', sku: 'FR-PR-BD5', price: '$15.00', stock: 342, status: 'active' },
  { name: 'Frost Bite Live Resin 1g', category: 'Concentrate', sku: 'FR-CN-FB1', price: '$40.00', stock: 218, status: 'active' },
  { name: 'Glacier Mint Gummies 10pk', category: 'Edible', sku: 'FR-ED-GM10', price: '$20.00', stock: 186, status: 'active' },
  { name: 'Northern Lights 3.5g', category: 'Flower', sku: 'FR-FL-NL35', price: '$35.00', stock: 164, status: 'active' },
  { name: 'Frost Fizz Lemon Seltzer', category: 'Beverage', sku: 'FR-BV-FFL', price: '$15.00', stock: 128, status: 'active' },
  { name: 'OG Kush 1g Cartridge', category: 'Vape', sku: 'FR-VP-OGK1', price: '$45.00', stock: 96, status: 'active' },
  { name: 'Sunset Sherbet 7g', category: 'Flower', sku: 'FR-FL-SS7', price: '$55.00', stock: 74, status: 'active' },
  { name: 'Mango Haze Gummies 5pk', category: 'Edible', sku: 'FR-ED-MH5', price: '$12.00', stock: 0, status: 'out_of_stock' },
  { name: 'Pineapple Express Pre-Roll', category: 'Preroll', sku: 'FR-PR-PE1', price: '$6.00', stock: 410, status: 'active' },
  { name: 'CBD Relief Tincture 30ml', category: 'Concentrate', sku: 'FR-CN-CBD30', price: '$50.00', stock: 52, status: 'active' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Flower: 'bg-[#22C55E]/15 text-[#22C55E]',
  Concentrate: 'bg-[#F59E0B]/15 text-[#F59E0B]',
  Vape: 'bg-[#3B82F6]/15 text-[#3B82F6]',
  Preroll: 'bg-[#F97316]/15 text-[#F97316]',
  Edible: 'bg-[#8B5CF6]/15 text-[#8B5CF6]',
  Beverage: 'bg-[#14B8A6]/15 text-[#14B8A6]',
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-bright font-display">Products</h1>
          <p className="text-sm text-text-muted mt-1">Manage your product catalog</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-text-bright hover:bg-accent-primary-hover transition-colors">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Search & filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border border-border-default bg-elevated pl-9 pr-4 py-2.5 text-sm text-text-default placeholder:text-text-muted outline-none focus:border-accent-primary/50"
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-2.5 text-xs text-text-muted hover:bg-card-hover transition-colors">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PRODUCTS.map((product) => (
          <div
            key={product.sku}
            className="rounded-xl border border-border-default bg-card p-5 hover:bg-card-hover transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-text-bright group-hover:text-accent-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-text-muted font-mono mt-0.5">{product.sku}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[product.category] ?? 'bg-white/10 text-text-muted'}`}>
                {product.category}
              </span>
            </div>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-lg font-bold text-text-bright">{product.price}</p>
                <p className="text-xs text-text-muted">wholesale price</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-text-default' : 'text-danger'}`}>
                  {product.stock > 0 ? product.stock : 'Out of stock'}
                </p>
                <p className="text-xs text-text-muted">in stock</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
