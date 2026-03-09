'use client';

import { useState, useMemo } from 'react';
import { Search, Download, FlaskConical, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PORTAL_COAS } from '@/modules/portal/shared/mock-data';

interface AccountCOAsProps {
  className?: string;
}

export function AccountCOAs({ className }: AccountCOAsProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return PORTAL_COAS;
    const q = search.toLowerCase();
    return PORTAL_COAS.filter(
      (coa) =>
        coa.batchNumber.toLowerCase().includes(q) ||
        coa.productName.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by batch number or product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border-default bg-card py-2.5 pl-10 pr-4 text-sm text-text-default outline-none transition-colors placeholder:text-text-muted focus:border-accent-primary"
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted">
        {filtered.length} certificate{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* COA grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((coa) => (
          <div
            key={coa.id}
            className="rounded-xl border border-border-default bg-card transition-colors hover:border-border-default/80"
          >
            {/* Card header */}
            <div className="flex items-start justify-between border-b border-border-default/50 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-bright">
                  {coa.productName}
                </p>
                <p className="mt-0.5 font-mono text-xs text-text-muted">{coa.batchNumber}</p>
              </div>
              {coa.passStatus === 'pass' ? (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Pass
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                  <XCircle className="h-3 w-3" />
                  Fail
                </span>
              )}
            </div>

            {/* Card body */}
            <div className="space-y-3 px-4 py-3">
              {/* Test info */}
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{coa.lab}</span>
                <span>{coa.testDate}</span>
              </div>

              {/* THC / CBD */}
              <div className="flex gap-4">
                <div className="flex-1 rounded-lg bg-elevated px-3 py-2 text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                    THC
                  </p>
                  <p className="text-lg font-semibold text-text-bright">{coa.thcResult}%</p>
                </div>
                <div className="flex-1 rounded-lg bg-elevated px-3 py-2 text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                    CBD
                  </p>
                  <p className="text-lg font-semibold text-text-bright">{coa.cbdResult}%</p>
                </div>
              </div>

              {/* Terpenes (top 3) */}
              {coa.terpenes.length > 0 && (
                <div>
                  <div className="mb-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">
                    <FlaskConical className="h-3 w-3" />
                    Top Terpenes
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {coa.terpenes.slice(0, 3).map((terp) => (
                      <span
                        key={terp.name}
                        className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-[11px] font-medium text-accent-primary"
                      >
                        {terp.name} {terp.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card footer */}
            <div className="border-t border-border-default/50 px-4 py-2.5">
              <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-default bg-elevated py-1.5 text-xs font-medium text-text-default transition-colors hover:border-accent-primary hover:text-accent-primary">
                <Download className="h-3.5 w-3.5" />
                Download COA
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-border-default bg-card px-6 py-12 text-center">
          <FlaskConical className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-3 text-sm text-text-muted">
            No certificates match your search
          </p>
        </div>
      )}
    </div>
  );
}
