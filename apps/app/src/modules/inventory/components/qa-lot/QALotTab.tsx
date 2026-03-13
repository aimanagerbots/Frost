'use client';

import { useState } from 'react';
import { useQALots } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';

const ACCENT = '#8B5CF6';

type FilterTab = 'all' | 'passed' | 'failed' | 'pending';
const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'passed', label: 'Passed' },
  { id: 'failed', label: 'Failed' },
  { id: 'pending', label: 'Pending' },
];

export function QALotTab() {
  const [tab, setTab] = useState<FilterTab>('all');
  const { data: lots, isLoading } = useQALots();

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const filtered = (lots ?? []).filter(l => {
    if (tab === 'all') return true;
    return l.resultStatus === tab;
  });

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-default bg-base p-1">
          {FILTER_TABS.map(f => (
            <button
              key={f.id}
              onClick={() => setTab(f.id)}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors"
              style={tab === f.id ? { backgroundColor: ACCENT + '20', color: ACCENT } : { color: 'var(--text-muted)' }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-text-muted">{filtered.length} QA lot{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Lot Number', 'Assigned Batches', 'Test Lab', 'Submitted Date', 'Result Status', 'Expiration Date'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(lot => (
                <tr key={lot.id} className="border-b border-default transition-colors hover:bg-card-hover">
                  <td className="px-4 py-2 font-mono text-[13px] text-text-default">{lot.lotNumber}</td>
                  <td className="px-4 py-2 text-center text-[13px] tabular-nums text-text-default">{lot.assignedBatches}</td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{lot.testLab}</td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{lot.submittedDate}</td>
                  <td className="px-4 py-2"><InvStatusBadge status={lot.resultStatus} /></td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{lot.expirationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && <div className="py-12 text-center text-sm text-text-muted">No QA lots found.</div>}
      </div>
    </div>
  );
}
