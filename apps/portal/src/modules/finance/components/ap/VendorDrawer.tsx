'use client';

import { DrawerPanel } from '@/components';
import type { Vendor } from '@/modules/finance/types';

interface VendorDrawerProps {
  vendor: Vendor | null;
  onClose: () => void;
}

export function VendorDrawer({ vendor, onClose }: VendorDrawerProps) {
  if (!vendor) return null;

  const scorecardItems = [
    { label: 'Reliability', value: vendor.scorecard.reliability },
    { label: 'Pricing', value: vendor.scorecard.pricing },
    { label: 'Quality', value: vendor.scorecard.quality },
  ];

  return (
    <DrawerPanel open={!!vendor} onClose={onClose} title={vendor.name} width="md">
      <div className="space-y-6">
        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4">
          <Detail label="Category" value={vendor.category} />
          <Detail label="Payment Terms" value={vendor.paymentTerms} />
          <Detail label="YTD Spend" value={`$${vendor.ytdSpend.toLocaleString()}`} />
          <Detail label="Avg Payment Days" value={`${vendor.avgPaymentDays} days`} />
          <Detail label="Last Order" value={vendor.lastOrderDate} />
        </div>

        {/* Scorecard */}
        <div>
          <p className="text-xs font-medium text-muted mb-3">Vendor Scorecard</p>
          <div className="space-y-3">
            {scorecardItems.map((item) => {
              const color = item.value >= 90 ? 'bg-green-500' : item.value >= 75 ? 'bg-amber-500' : 'bg-red-500';
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted">{item.label}</span>
                    <span className="text-xs font-mono text-default">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-elevated rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Estimate */}
        <div className="bg-elevated rounded-lg p-3">
          <p className="text-xs text-muted mb-1">Estimated Monthly Cost</p>
          <p className="text-lg font-bold text-default font-mono">
            ${Math.round(vendor.ytdSpend / 3).toLocaleString()}
          </p>
          <p className="text-xs text-muted">Based on YTD average (3 months)</p>
        </div>
      </div>
    </DrawerPanel>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted mb-0.5">{label}</p>
      <p className="text-sm text-default font-medium">{value}</p>
    </div>
  );
}
