'use client';

import { DrawerPanel, CategoryChip, InlineDataBox } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';
import { INVENTORY_TYPE_LABELS } from '@/modules/inventory/types';
import type { Product } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

interface ProductDetailDrawerProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailDrawer({ product, onClose }: ProductDetailDrawerProps) {
  return (
    <DrawerPanel
      open={!!product}
      onClose={onClose}
      title={product?.labelName ?? 'Product Detail'}
      width="md"
    >
      {product && (
        <div className="space-y-6 p-5">
          {/* Header info */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CategoryChip category={product.category} />
                <InvStatusBadge status={product.status} />
                {product.showAsDOHCompliant && (
                  <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                    DOH Compliant
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold text-text-default">{product.name}</h3>
              <p className="text-xs text-text-muted">{product.sku}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold tabular-nums" style={{ color: ACCENT }}>
                ${product.unitPrice}
              </div>
              <div className="text-[10px] text-text-muted">unit price</div>
            </div>
          </div>

          {/* Inventory counts */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Inventory
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <InlineDataBox label="Available For Sale" value={String(product.availableForSale)} />
              <InlineDataBox label="Allocated" value={String(product.allocated)} />
              <InlineDataBox label="On Hold" value={String(product.onHold)} />
              <InlineDataBox label="Total In Stock" value={String(product.totalInStock)} />
            </div>
          </div>

          {/* QA / Cannabinoid values */}
          {product.qaValues.total > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                QA Values
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-elevated px-3 py-2 text-center">
                  <div className="text-[10px] text-text-muted">THC</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: ACCENT }}>
                    {product.qaValues.thc.toFixed(2)}%
                  </div>
                </div>
                <div className="rounded-lg bg-elevated px-3 py-2 text-center">
                  <div className="text-[10px] text-text-muted">THCA</div>
                  <div className="text-sm font-semibold tabular-nums text-text-default">
                    {product.qaValues.thca.toFixed(2)}%
                  </div>
                </div>
                <div className="rounded-lg bg-elevated px-3 py-2 text-center">
                  <div className="text-[10px] text-text-muted">CBD</div>
                  <div className="text-sm font-semibold tabular-nums text-text-default">
                    {product.qaValues.cbd.toFixed(2)}%
                  </div>
                </div>
                <div className="rounded-lg bg-elevated px-3 py-2 text-center">
                  <div className="text-[10px] text-text-muted">CBDA</div>
                  <div className="text-sm font-semibold tabular-nums text-text-muted">
                    {product.qaValues.cbda.toFixed(2)}%
                  </div>
                </div>
                <div className="col-span-2 rounded-lg bg-elevated px-3 py-2 text-center">
                  <div className="text-[10px] text-text-muted">Total Cannabinoids</div>
                  <div className="text-sm font-bold tabular-nums text-text-bright">
                    {product.qaValues.total.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product details */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Details
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <InlineDataBox label="Inventory Type" value={INVENTORY_TYPE_LABELS[product.inventoryType] ?? `Type ${product.inventoryType}`} />
              <InlineDataBox label="Package Size" value={product.packageSize} />
              <InlineDataBox label="Product Line" value={product.productLine} />
              <InlineDataBox label="Sub-Line" value={product.subProductLine} />
              <InlineDataBox label="Strain" value={product.strain} />
              <InlineDataBox label="Category" value={product.category} />
              <InlineDataBox label="Catalog Group" value={product.catalogGroup} />
              <InlineDataBox label="Expiry" value={`${product.expiryMonths} months`} />
              <InlineDataBox label="Min Order" value={String(product.minOrderLimit)} />
              <InlineDataBox label="Increment" value={String(product.marketIncrementQuantity)} />
            </div>
          </div>

          {/* Description */}
          {product.productDescription && (
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Description
              </h4>
              <p className="text-xs leading-relaxed text-text-default">{product.productDescription}</p>
            </div>
          )}

          {/* Disclaimer */}
          {product.productDisclaimer && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-[10px] text-amber-400/80">{product.productDisclaimer}</p>
            </div>
          )}
        </div>
      )}
    </DrawerPanel>
  );
}
