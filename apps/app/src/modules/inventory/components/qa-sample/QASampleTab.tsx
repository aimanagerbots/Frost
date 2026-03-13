'use client';

import { useState } from 'react';
import { useQASamples } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';

const ACCENT = '#8B5CF6';

type FilterTab = 'all' | 'submitted' | 'in-testing' | 'passed' | 'failed';
const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'in-testing', label: 'In Testing' },
  { id: 'passed', label: 'Passed' },
  { id: 'failed', label: 'Failed' },
];

export function QASampleTab() {
  const [tab, setTab] = useState<FilterTab>('all');
  const { data: samples, isLoading } = useQASamples();

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const filtered = (samples ?? []).filter(s => {
    if (tab === 'all') return true;
    return s.status === tab;
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
        <p className="text-[13px] text-text-muted">{filtered.length} sample{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Sample ID', 'Product', 'Batch Number', 'Lab', 'Submitted', 'Expected Return', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-default transition-colors hover:bg-card-hover">
                  <td className="px-4 py-2 font-mono text-[13px] text-text-muted">{s.sampleId}</td>
                  <td className="max-w-[200px] px-4 py-2 text-[13px] text-text-default"><span className="line-clamp-1">{s.productName}</span></td>
                  <td className="px-4 py-2 font-mono text-[13px] text-text-muted">{s.batchNumber}</td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{s.lab}</td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{s.submissionDate}</td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{s.expectedReturn}</td>
                  <td className="px-4 py-2"><InvStatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && <div className="py-12 text-center text-sm text-text-muted">No QA samples found.</div>}
      </div>
    </div>
  );
}
