'use client';

import { LoadingSkeleton } from '@/components';
import { useInventoryAlerts } from '@/modules/inventory/hooks';
import { AlertCard } from './AlertCard';

export function InventoryAlerts() {
  const { data: alerts, isLoading } = useInventoryAlerts();

  if (isLoading) return <LoadingSkeleton variant="list" />;

  const sorted = [...(alerts ?? [])].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const criticalCount = sorted.filter((a) => a.severity === 'critical').length;
  const warningCount = sorted.filter((a) => a.severity === 'warning').length;
  const infoCount = sorted.filter((a) => a.severity === 'info').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#FB7185]/10 px-2.5 py-1 text-xs font-medium text-[#FB7185]">{criticalCount} Critical</span>
        <span className="rounded-full bg-[#FBBF24]/10 px-2.5 py-1 text-xs font-medium text-[#FBBF24]">{warningCount} Warning</span>
        <span className="rounded-full bg-[#38BDF8]/10 px-2.5 py-1 text-xs font-medium text-[#38BDF8]">{infoCount} Info</span>
      </div>
      <div className="space-y-3">
        {sorted.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
