'use client';

import { AlertTriangle } from 'lucide-react';
import { useNonCannabisInventory } from '../hooks';

export function MaterialAlerts() {
  const { data: inventory } = useNonCannabisInventory();

  const alerts = (inventory ?? []).filter(
    (item) => item.status === 'low' || item.status === 'critical' || item.status === 'out-of-stock'
  );

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-bright">Material Alerts</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map((item) => {
          const isOut = item.status === 'out-of-stock';
          const isCritical = item.status === 'critical';
          const borderColor = isOut || isCritical ? 'border-danger/40' : 'border-warning/40';
          const bgColor = isOut || isCritical ? 'bg-danger/5' : 'bg-warning/5';
          const textColor = isOut || isCritical ? 'text-danger' : 'text-warning';

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-xl border ${borderColor} ${bgColor} p-3`}
            >
              <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${textColor}`} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-bright">{item.name}</div>
                <div className="mt-0.5 text-xs text-muted">
                  Stock: <span className={textColor}>{item.currentStock}</span>
                  {' / '}Reorder at: {item.reorderPoint}
                </div>
                <div className="mt-0.5 text-xs text-muted">
                  Supplier: {item.supplier}
                </div>
                <button className={`mt-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${textColor} ${isOut || isCritical ? 'bg-danger/10' : 'bg-warning/10'} transition-colors hover:opacity-80`}>
                  Order More
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
