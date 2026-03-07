'use client';

import { useState } from 'react';
import { PieChart as PieChartIcon, FileText, Download, Clock, Play } from 'lucide-react';
import { SectionHeader, MetricCard, StatusBadge, DrawerPanel, LoadingSkeleton } from '@/components';
import { useReports } from '@/modules/reports/hooks';
import type { Report, ReportType } from '@/modules/reports/types';

const ACCENT = '#475569';

const TYPE_FILTERS: { label: string; value: ReportType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Sales', value: 'sales' },
  { label: 'Operations', value: 'operations' },
  { label: 'Compliance', value: 'compliance' },
  { label: 'Financial', value: 'financial' },
  { label: 'Performance', value: 'performance' },
];

const TYPE_VARIANT: Record<ReportType, 'info' | 'default' | 'warning' | 'success' | 'muted'> = {
  sales: 'info',
  operations: 'default',
  compliance: 'warning',
  financial: 'success',
  performance: 'muted',
};

const FORMAT_LABELS: Record<string, string> = {
  pdf: 'PDF',
  csv: 'CSV',
  excel: 'Excel',
};

export function ReportsPage() {
  const [typeFilter, setTypeFilter] = useState<ReportType | undefined>(undefined);
  const [selected, setSelected] = useState<Report | null>(null);

  const { data: reports, isLoading } = useReports(typeFilter ? { type: typeFilter } : undefined);

  const totalReports = reports?.length ?? 0;
  const scheduledCount = reports?.filter((r) => r.schedule).length ?? 0;
  const lastGenerated = reports?.reduce((latest, r) => {
    if (!r.lastRun) return latest;
    return r.lastRun > latest ? r.lastRun : latest;
  }, '') ?? '';

  const formattedLastGen = lastGenerated
    ? new Date(lastGenerated + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '--';

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={PieChartIcon}
        title="Reports"
        subtitle="Generate, schedule, and export operational reports"
        accentColor={ACCENT}
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Reports" value={totalReports} accentColor={ACCENT} />
        <MetricCard label="Scheduled" value={scheduledCount} accentColor={ACCENT} />
        <MetricCard label="Last Generated" value={formattedLastGen} accentColor={ACCENT} />
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setTypeFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              typeFilter === f.value
                ? 'text-white'
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-default)]'
            }`}
            style={typeFilter === f.value ? { backgroundColor: ACCENT } : undefined}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports?.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelected(report)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelected(report);
              }}
              className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 cursor-pointer transition-all duration-200 hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-2">
                <FileText className="h-5 w-5 text-[var(--text-muted)]" />
                <StatusBadge variant={TYPE_VARIANT[report.type]} label={report.type} size="sm" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-default)] mb-1">{report.name}</h3>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">{report.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {report.format.map((fmt) => (
                  <span
                    key={fmt}
                    className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] uppercase"
                  >
                    {FORMAT_LABELS[fmt] ?? fmt}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  {report.schedule && (
                    <>
                      <Clock className="h-3 w-3" />
                      <span className="capitalize">{report.schedule}</span>
                    </>
                  )}
                </div>
                {report.lastRun && (
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Last: {new Date(report.lastRun + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Running report: ${report.name}`);
                }}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors bg-[var(--bg-elevated)] text-[var(--text-default)] hover:bg-[var(--bg-base)]"
              >
                <Play className="h-3 w-3" />
                Run Report
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      <DrawerPanel open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? 'Report Details'}>
        {selected && (
          <div className="space-y-5">
            <div>
              <StatusBadge variant={TYPE_VARIANT[selected.type]} label={selected.type} size="sm" />
            </div>

            <div>
              <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Description</h4>
              <p className="text-sm text-[var(--text-default)]">{selected.description}</p>
            </div>

            {selected.schedule && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Schedule</h4>
                <p className="text-sm text-[var(--text-default)] capitalize">{selected.schedule}</p>
              </div>
            )}

            {selected.lastRun && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Last Run</h4>
                <p className="text-sm text-[var(--text-default)]">
                  {new Date(selected.lastRun + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Formats</h4>
              <div className="flex gap-2">
                {selected.format.map((fmt) => (
                  <span
                    key={fmt}
                    className="rounded bg-[var(--bg-elevated)] px-2 py-1 text-xs font-medium text-[var(--text-default)] uppercase"
                  >
                    {FORMAT_LABELS[fmt] ?? fmt}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Modules</h4>
              <div className="flex flex-wrap gap-2">
                {selected.modules.map((mod) => (
                  <StatusBadge key={mod} variant="default" label={mod} size="sm" />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => console.log(`Running report: ${selected.name}`)}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: ACCENT }}
              >
                <Play className="h-4 w-4" />
                Run Now
              </button>
              <button
                onClick={() => console.log(`Scheduling report: ${selected.name}`)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-default)] transition-colors hover:bg-[var(--bg-base)]"
              >
                <Clock className="h-4 w-4" />
                Schedule
              </button>
              <button
                onClick={() => console.log(`Downloading report: ${selected.name}`)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-default)] transition-colors hover:bg-[var(--bg-base)]"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
