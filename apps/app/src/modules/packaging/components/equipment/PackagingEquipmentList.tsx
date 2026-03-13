'use client';

import { useState, useMemo } from 'react';
import { MetricCard, LoadingSkeleton } from '@/components';
import { usePackagingEquipment } from '../../hooks';
import { PackagingEquipmentCard } from './PackagingEquipmentCard';
import { PackagingMaintenanceSchedule } from './PackagingMaintenanceSchedule';

const ACCENT = '#84CC16';

export function PackagingEquipmentList() {
  const { data: allEquipment, isLoading } = usePackagingEquipment();
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLine, setFilterLine] = useState('');

  const filtered = useMemo(() => {
    if (!allEquipment) return [];
    let result = [...allEquipment];
    if (filterStatus) result = result.filter((e) => e.status === filterStatus);
    if (filterLine) result = result.filter((e) => e.packagingLineId === filterLine);
    return result;
  }, [allEquipment, filterStatus, filterLine]);

  // Group by packaging line name
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const existing = map.get(item.packagingLineName) ?? [];
      existing.push(item);
      map.set(item.packagingLineName, existing);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Summary stats
  const stats = useMemo(() => {
    if (!allEquipment) return null;
    const operational = allEquipment.filter((e) => e.status === 'operational').length;
    const needsMaint = allEquipment.filter((e) => e.status === 'needs-maintenance').length;
    const downOrService = allEquipment.filter(
      (e) => e.status === 'down' || e.status === 'in-maintenance'
    ).length;
    return { total: allEquipment.length, operational, needsMaint, downOrService };
  }, [allEquipment]);

  // Unique lines for filter dropdown
  const lineOptions = useMemo(() => {
    if (!allEquipment) return [];
    const seen = new Map<string, string>();
    for (const e of allEquipment) {
      if (!seen.has(e.packagingLineId)) seen.set(e.packagingLineId, e.packagingLineName);
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [allEquipment]);

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;

  return (
    <div className="space-y-6">
      {/* Summary metric cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="Total Equipment" value={stats.total} accentColor={ACCENT} />
          <MetricCard label="Operational" value={stats.operational} accentColor="#22C55E" />
          <MetricCard label="Needs Maintenance" value={stats.needsMaint} accentColor="#FBBF24" />
          <MetricCard label="Down / In Service" value={stats.downOrService} accentColor="#EF4444" />
        </div>
      )}

      {/* Maintenance schedule */}
      {allEquipment && allEquipment.length > 0 && (
        <PackagingMaintenanceSchedule equipment={allEquipment} />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl bg-card px-3 py-1.5 text-xs text-text-default"
        >
          <option value="">All Status</option>
          <option value="operational">Operational</option>
          <option value="needs-maintenance">Needs Maintenance</option>
          <option value="down">Down</option>
          <option value="in-maintenance">In Maintenance</option>
        </select>
        <select
          value={filterLine}
          onChange={(e) => setFilterLine(e.target.value)}
          className="rounded-xl bg-card px-3 py-1.5 text-xs text-text-default"
        >
          <option value="">All Lines</option>
          {lineOptions.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grouped by packaging line */}
      {grouped.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-default bg-card">
          <p className="text-sm text-text-muted">No equipment matches the current filters</p>
        </div>
      ) : (
        grouped.map(([lineName, items]) => (
          <div key={lineName}>
            <h3 className="mb-2 text-sm font-semibold text-text-bright">
              {lineName}
              <span className="ml-2 text-xs font-normal text-text-muted">({items.length})</span>
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <PackagingEquipmentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
