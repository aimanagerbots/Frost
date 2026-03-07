'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import { MapPin, Calendar, FlaskConical, Package, Hash } from 'lucide-react';
import type { InventoryItem, StrainType } from '@/modules/inventory/types';

interface InventoryDrawerProps {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
}

const STRAIN_COLOR: Record<StrainType, string> = {
  indica: '#A855F7',
  sativa: '#F97316',
  hybrid: '#22C55E',
  cbd: '#3B82F6',
  balanced: '#06B6D4',
};

export function InventoryDrawer({ item, open, onClose }: InventoryDrawerProps) {
  if (!item) return null;

  return (
    <DrawerPanel open={open} onClose={onClose} title={item.productName} width="lg">
      <div className="space-y-5">
        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            variant="info"
            label={item.readinessState.replace(/-/g, ' ')}
          />
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: `${STRAIN_COLOR[item.strainType]}20`, color: STRAIN_COLOR[item.strainType] }}
          >
            {item.strainType}
          </span>
          <span className="rounded-full bg-elevated px-2 py-0.5 text-[10px] text-text-muted capitalize">
            {item.category}
          </span>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Strain</h4>
            <p className="mt-1 text-sm text-text-bright">{item.strainName}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Sub-Category</h4>
            <p className="mt-1 text-sm text-text-default">{item.subCategory}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">SKU</h4>
            <div className="mt-1 flex items-center gap-1">
              <Hash className="h-3 w-3 text-text-muted" />
              <span className="text-sm text-text-default font-mono">{item.sku}</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Batch</h4>
            <div className="mt-1 flex items-center gap-1">
              <Package className="h-3 w-3 text-text-muted" />
              <span className="text-sm text-text-default font-mono">{item.batchNumber}</span>
            </div>
          </div>
        </div>

        {/* Quantity & Value */}
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-default bg-elevated p-3">
          <div>
            <h4 className="text-xs text-text-muted">Quantity</h4>
            <p className="text-lg font-bold text-text-bright">
              {item.quantity.toLocaleString()} <span className="text-xs text-text-muted">{item.unit}</span>
            </p>
          </div>
          <div>
            <h4 className="text-xs text-text-muted">Value</h4>
            <p className="text-lg font-bold text-text-bright">${item.value.toLocaleString()}</p>
          </div>
        </div>

        {/* Lab Results */}
        {(item.thcPercent !== undefined || item.cbdPercent !== undefined) && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase text-text-muted tracking-wider">
              <FlaskConical className="mr-1 inline h-3 w-3" />
              Lab Results
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {item.thcPercent !== undefined && (
                <div className="rounded-lg border border-default bg-card p-3 text-center">
                  <p className="text-xs text-text-muted">THC</p>
                  <p className="text-xl font-bold text-text-bright">{item.thcPercent}%</p>
                </div>
              )}
              {item.cbdPercent !== undefined && (
                <div className="rounded-lg border border-default bg-card p-3 text-center">
                  <p className="text-xs text-text-muted">CBD</p>
                  <p className="text-xl font-bold text-text-bright">{item.cbdPercent}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location & Division */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Location</h4>
            <div className="mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-text-muted" />
              <span className="text-sm text-text-default">{item.location}</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Division</h4>
            <p className="mt-1 text-sm text-text-default capitalize">{item.division}</p>
          </div>
        </div>

        {/* Dates */}
        {(item.harvestDate || item.packagedDate || item.expirationDate) && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase text-text-muted tracking-wider">
              <Calendar className="mr-1 inline h-3 w-3" />
              Dates
            </h4>
            <div className="space-y-1.5">
              {item.harvestDate && (
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Harvested</span>
                  <span className="text-text-default">{item.harvestDate}</span>
                </div>
              )}
              {item.packagedDate && (
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Packaged</span>
                  <span className="text-text-default">{item.packagedDate}</span>
                </div>
              )}
              {item.expirationDate && (
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Expires</span>
                  <span className="text-text-default">{item.expirationDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Placeholder */}
        <div className="rounded-lg border border-default bg-elevated p-3">
          <p className="text-xs text-text-muted italic">State transition history coming soon.</p>
        </div>
      </div>
    </DrawerPanel>
  );
}
