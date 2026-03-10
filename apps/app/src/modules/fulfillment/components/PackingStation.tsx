'use client';

import { useState } from 'react';
import { User, Clock, Box, Weight, FileText } from 'lucide-react';
import { StatusBadge, LoadingSkeleton, ErrorState } from '@/components';
import { usePackingOperations } from '../hooks';
import type { PackingOperation } from '../types';
import { ACCENT } from '@/design/colors';


const packingStatusVariant = (s: PackingOperation['status']) => {
  const map: Record<PackingOperation['status'], 'default' | 'info' | 'warning' | 'success'> = {
    verifying: 'info',
    boxing: 'warning',
    labeling: 'default',
    sealed: 'success',
  };
  return map[s];
};

const QC_ITEMS = [
  { id: 'qc-1', label: 'Items verified against pick list' },
  { id: 'qc-2', label: 'Compliance labels attached' },
  { id: 'qc-3', label: 'Weight verification complete' },
  { id: 'qc-4', label: 'Manifest document included' },
  { id: 'qc-5', label: 'Temperature-sensitive items packed correctly' },
  { id: 'qc-6', label: 'Box sealed and tamper-evident' },
];

export function PackingStation() {
  const { data: operations, isLoading, error, refetch } = usePackingOperations();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (error) {
    return (
      <ErrorState
        title="Failed to load packing operations"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Packing Cards */}
      <div>
        <h3 className="text-sm font-semibold text-text-bright mb-4">Active Packing Operations</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {operations?.map((op) => {
            const progressPct = op.totalItems > 0 ? (op.itemsPacked / op.totalItems) * 100 : 0;
            const isSealed = op.status === 'sealed';
            return (
              <div key={op.id} className="rounded-xl bg-card p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-bright">{op.orderNumber}</p>
                    <p className="text-xs text-text-muted">{op.accountName}</p>
                  </div>
                  <StatusBadge
                    label={op.status}
                    variant={packingStatusVariant(op.status)}
                    size="sm"
                  />
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">
                      {op.itemsPacked}/{op.totalItems} items packed
                    </span>
                    <span className="font-medium" style={{ color: ACCENT }}>
                      {progressPct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%`, backgroundColor: ACCENT }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Box size={12} />
                    <span>{op.boxCount} boxes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Weight size={12} />
                    <span>{op.weight}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <User size={12} />
                    <span>{op.packerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Clock size={12} />
                    <span>
                      {new Date(op.startedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Generate Manifest button */}
                <button
                  disabled={!isSealed}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: isSealed ? ACCENT : 'var(--bg-elevated)',
                    color: isSealed ? 'white' : 'var(--text-text-muted)',
                    cursor: isSealed ? 'pointer' : 'not-allowed',
                    opacity: isSealed ? 1 : 0.5,
                  }}
                >
                  <FileText size={14} />
                  Generate Manifest
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* QC Checklist Card */}
      <div className="rounded-xl bg-card p-5">
        <h3 className="text-sm font-semibold text-text-bright mb-4">Quality Control Checklist</h3>
        <div className="space-y-3">
          {QC_ITEMS.map((item) => {
            const isChecked = checkedItems.has(item.id);
            return (
              <label
                key={item.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors"
                  style={{
                    borderColor: isChecked ? ACCENT : 'var(--border-default)',
                    backgroundColor: isChecked ? ACCENT : 'transparent',
                  }}
                >
                  {isChecked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => toggleCheck(item.id)}
                />
                <span
                  className={`text-sm transition-colors ${
                    isChecked ? 'text-text-muted line-through' : 'text-text-default group-hover:text-text-bright'
                  }`}
                >
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-default">
          <p className="text-xs text-text-muted">
            {checkedItems.size}/{QC_ITEMS.length} checks completed
          </p>
        </div>
      </div>
    </div>
  );
}
