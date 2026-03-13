'use client';

import { useProductionRuns } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';

export function ProductionTab() {
  const { data: runs, isLoading } = useProductionRuns();
  if (isLoading) return <LoadingSkeleton variant="table" />;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">{runs?.length ?? 0} production runs</p>
      </div>
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-default">
              {['Run ID', 'Product', 'BOM Components', 'Qty Produced', 'Date', 'Status'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(runs ?? []).map(run => (
              <tr key={run.id} className="border-b border-default transition-colors hover:bg-card-hover">
                <td className="px-4 py-2 font-mono text-[13px] text-text-muted">{run.runId}</td>
                <td className="max-w-[200px] px-4 py-2 text-[13px] font-medium text-text-default"><span className="line-clamp-1">{run.productName}</span></td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {run.bomComponents.map((c, i) => (
                      <span key={i} className="rounded border border-default px-1.5 py-0.5 text-[11px] text-text-muted">{c}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{run.quantityProduced || '—'}</td>
                <td className="px-4 py-2 text-[13px] text-text-muted">{run.date}</td>
                <td className="px-4 py-2"><InvStatusBadge status={run.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {!(runs ?? []).length && (
          <div className="py-12 text-center text-sm text-text-muted">No production runs found.</div>
        )}
      </div>
    </div>
  );
}
