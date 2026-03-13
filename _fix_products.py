import pathlib

f = pathlib.Path("apps/app/src/modules/inventory/components/products/ProductsTab.tsx")
content = f.read_text(encoding="utf-8")

# Replace imports
content = content.replace(
    "import { useState } from 'react';",
    "import { useState, useRef, useEffect } from 'react';"
)
content = content.replace(
    "import { useProducts } from '@/modules/inventory/hooks';",
    "import { useProducts, useProductLines } from '@/modules/inventory/hooks';"
)
content = content.replace(
    "import { ProductDetailDrawer } from './ProductDetailDrawer';",
    "import { ProductDetailDrawer } from './ProductDetailDrawer';\nimport { CreateProductForm } from './CreateProductForm';"
)

# Add portal filter tab
content = content.replace(
    "{ id: 'not-for-sale', label: 'Not For Sale' },\n  { id: 'active', label: 'Active' },",
    "{ id: 'not-for-sale', label: 'Not For Sale' },\n  { id: 'available-on-portal', label: 'Available For Portal' },\n  { id: 'active', label: 'Active' },"
)

# Replace ProductsTab function header
content = content.replace(
    """export function ProductsTab() {
  const [activeFilter, setActiveFilter] = useState<ProductFilterTab>('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: products, isLoading } = useProducts({ tab: activeFilter, search: search || undefined });""",
    """export function ProductsTab() {
  const [activeFilter, setActiveFilter] = useState<ProductFilterTab>('all');
  const [search, setSearch] = useState('');
  const [productLine, setProductLine] = useState('');
  const [nonCannabisOnly, setNonCannabisOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<'cannabis' | 'non-cannabis'>('cannabis');
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: products, isLoading } = useProducts({
    tab: activeFilter,
    search: search || undefined,
    productLine: productLine || undefined,
  });
  const { data: productLines } = useProductLines();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);"""
)

# Add non-cannabis client-side filter
content = content.replace(
    "if (isLoading) return <LoadingSkeleton variant=\"card\" />;",
    """if (isLoading) return <LoadingSkeleton variant="card" />;

  const filtered = nonCannabisOnly
    ? (products ?? []).filter(p => ['edible', 'beverage'].includes(p.category))
    : products;"""
)

# Replace search + create toolbar
content = content.replace(
    """        {/* Search + create */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter products\u2026"
              className="h-8 rounded-lg border border-default bg-card pl-8 pr-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>
          <button
            className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-white"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus size={14} />
            Create
            <ChevronDown size={12} />
          </button>
        </div>""",
    """        {/* Search + dropdowns + create */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter products\u2026"
              className="h-8 rounded-lg border border-default bg-card pl-8 pr-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>
          <select
            value={productLine}
            onChange={e => setProductLine(e.target.value)}
            className="h-8 appearance-none rounded-lg border border-default bg-card px-3 pr-7 text-xs text-text-muted focus:border-[#8B5CF6] focus:outline-none"
          >
            <option value="">All Product Lines</option>
            {(productLines ?? []).map(pl => (
              <option key={pl.id} value={pl.name}>{pl.name}</option>
            ))}
          </select>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={nonCannabisOnly}
              onChange={e => setNonCannabisOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-default accent-[#8B5CF6]"
            />
            <span className="text-xs text-text-muted">Non-Cannabis</span>
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
              className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-white"
              style={{ backgroundColor: ACCENT }}
            >
              <Plus size={14} />
              Create
              <ChevronDown size={12} />
            </button>
            {createDropdownOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-default bg-card py-1 shadow-xl">
                <button
                  onClick={() => { setCreateMode(\\'cannabis\\'); setShowCreate(true); setCreateDropdownOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-text-default hover:bg-card-hover"
                >
                  New Product
                </button>
                <button
                  onClick={() => { setCreateMode(\\'non-cannabis\\'); setShowCreate(true); setCreateDropdownOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-text-default hover:bg-card-hover"
                >
                  New Non-Cannabis Product
                </button>
              </div>
            )}
          </div>
        </div>"""
)

# Replace products with filtered in card grid
content = content.replace("!products?.length", "!filtered?.length")
content = content.replace("{products.map(product", "{filtered.map(product")

# Add CreateProductForm at end
content = content.replace(
    """      {/* Detail drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}""",
    """      {/* Detail drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CreateProductForm
        open={showCreate}
        onClose={() => setShowCreate(false)}
        mode={createMode}
      />
    </div>
  );
}"""
)

f.write_text(content, encoding="utf-8")
print("ProductsTab.tsx updated successfully")
