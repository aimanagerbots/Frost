'use client';

import { cn } from '@/lib/utils';
import { PipelineAccountCard } from './PipelineAccountCard';
import type { PipelineCellData, PipelineStatus } from '../types';

interface StatusConfig {
  label: string;
  borderColor: string;
}

interface PipelineMatrixCellProps {
  cell: PipelineCellData;
  statusConfig: StatusConfig;
  status: PipelineStatus;
  isSelected: boolean;
  onClick: () => void;
}

function cellOpacity(count: number): number {
  if (count === 0) return 0.3;
  if (count === 1) return 0.5;
  if (count <= 3) return 0.65;
  if (count <= 5) return 0.8;
  return 1;
}

export function PipelineMatrixCell({ cell, statusConfig, status, isSelected, onClick }: PipelineMatrixCellProps) {
  const count = cell.count;
  const shown = cell.accounts.slice(0, 3);
  const remaining = count - shown.length;
  const opacity = cellOpacity(count);

  const prefix = status === 'active' ? 'A' : status === 'inactive' ? 'I' : 'R';
  const code = `${prefix}${cell.phase}`;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex min-h-[110px] flex-col rounded-lg border p-2 text-left transition-all',
        isSelected
          ? 'border-[var(--cell-color)] bg-elevated ring-1 ring-[var(--cell-color)]'
          : 'border-default bg-elevated/50 hover:bg-accent-hover',
      )}
      style={{
        '--cell-color': statusConfig.borderColor,
        opacity,
      } as React.CSSProperties}
    >
      {/* Header: code badge + count */}
      <div className="mb-1.5 flex items-center justify-between">
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: `${statusConfig.borderColor}20`, color: statusConfig.borderColor }}
        >
          {code}
        </span>
        <span
          className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
          style={{
            backgroundColor: count > 0 ? `${statusConfig.borderColor}20` : 'transparent',
            color: count > 0 ? statusConfig.borderColor : 'var(--color-text-muted)',
          }}
        >
          {count}
        </span>
      </div>

      {/* Revenue */}
      {cell.totalRevenue > 0 && (
        <div className="mb-1.5 text-[10px] text-text-muted">
          ${(cell.totalRevenue / 1000).toFixed(1)}k/mo
        </div>
      )}

      {/* Account cards */}
      <div className="flex flex-1 flex-col gap-1">
        {shown.map((acct) => (
          <PipelineAccountCard
            key={acct.id}
            id={acct.id}
            name={acct.name}
            healthScore={acct.healthScore}
            thirtyDayRevenue={acct.thirtyDayRevenue}
          />
        ))}
        {count === 0 && (
          <div className="flex flex-1 items-center justify-center text-[10px] text-text-muted">
            --
          </div>
        )}
        {remaining > 0 && (
          <div className="text-center text-[10px] text-text-muted">
            +{remaining} more
          </div>
        )}
      </div>
    </button>
  );
}
