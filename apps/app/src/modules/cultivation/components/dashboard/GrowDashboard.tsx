'use client';

import { useMemo } from 'react';
import {
  Warehouse,
  Sprout,
  Flower2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  MetricCard,
  DataTable,
  ChartWrapper,
  LoadingSkeleton,
  StatusBadge,
  CHART_THEME,
  CHART_COLORS,
} from '@/components';
import {
  useCultivationMetrics,
  useHarvestRecords,
  useGrowRooms,
} from '@/modules/cultivation/hooks';
import type { HarvestRecord, GrowRoom } from '@/modules/cultivation/types';

const CULTIVATION_ACCENT = '#22C55E';

const STAGE_COLORS: Record<string, string> = {
  clone: '#38BDF8',
  veg: '#22C55E',
  flower: '#F59E0B',
  harvest: '#EF4444',
  dry: '#A78BFA',
  cure: '#8B5CF6',
  propagation: '#14B8A6',
  mother: '#EC4899',
  maintenance: '#64748B',
};

/* ── Yield Chart ── */
function YieldChart({ harvests }: { harvests: HarvestRecord[] }) {
  const chartData = useMemo(() => {
    const recent = [...harvests]
      .filter((h) => h.status === 'complete')
      .sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime())
      .slice(0, 6)
      .reverse();

    return recent.map((h) => ({
      strain: h.strainName.length > 12 ? h.strainName.slice(0, 12) + '…' : h.strainName,
      dryWeight: h.dryWeight,
    }));
  }, [harvests]);

  return (
    <ChartWrapper
      title="Yield per Harvest"
      subtitle="Dry weight (lbs) — last 6 completed harvests"
      empty={chartData.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
          <XAxis
            dataKey="strain"
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 8,
              color: CHART_THEME.tooltipText,
              fontSize: 12,
            }}
            formatter={(value) => [`${value} lbs`, 'Dry Weight']}
          />
          <Bar dataKey="dryWeight" fill={CULTIVATION_ACCENT} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ── Stage Distribution Pie ── */
function StageDistribution({ rooms }: { rooms: GrowRoom[] }) {
  const chartData = useMemo(() => {
    const stageCounts: Record<string, number> = {};
    for (const room of rooms) {
      if (room.status !== 'active') continue;
      const stage = room.stage;
      stageCounts[stage] = (stageCounts[stage] || 0) + room.plantCount;
    }
    return Object.entries(stageCounts)
      .map(([stage, count]) => ({
        name: stage.charAt(0).toUpperCase() + stage.slice(1),
        value: count,
        key: stage,
      }))
      .sort((a, b) => b.value - a.value);
  }, [rooms]);

  return (
    <ChartWrapper
      title="Plant Distribution by Stage"
      subtitle="Active plants across all rooms"
      empty={chartData.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            paddingAngle={2}
            stroke="none"
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.key}
                fill={STAGE_COLORS[entry.key] || CHART_COLORS.primary}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 8,
              color: CHART_THEME.tooltipText,
              fontSize: 12,
            }}
            formatter={(value) => [`${value} plants`, 'Count']}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: CHART_THEME.legendColor, fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ── Harvest Table Columns ── */
function buildHarvestColumns(roomMap: Map<string, string>) {
  return [
    {
      header: 'Strain',
      accessor: 'strainName' as const,
      sortable: true,
      render: (row: HarvestRecord) => (
        <span className="font-medium text-text-bright">{row.strainName}</span>
      ),
    },
    {
      header: 'Room',
      accessor: ((row: HarvestRecord) => roomMap.get(row.roomId) ?? row.roomId) as unknown as keyof HarvestRecord,
      render: (row: HarvestRecord) => (
        <span className="text-text-muted">{roomMap.get(row.roomId) ?? row.roomId}</span>
      ),
      hideBelow: 'md' as const,
    },
    {
      header: 'Harvest Date',
      accessor: 'harvestDate' as const,
      sortable: true,
      render: (row: HarvestRecord) => (
        <span>{new Date(row.harvestDate).toLocaleDateString()}</span>
      ),
    },
    {
      header: 'Wet (lbs)',
      accessor: 'wetWeight' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: HarvestRecord) => <span>{row.wetWeight.toFixed(1)}</span>,
    },
    {
      header: 'Dry (lbs)',
      accessor: 'dryWeight' as const,
      sortable: true,
      render: (row: HarvestRecord) => (
        <span className="font-medium" style={{ color: CULTIVATION_ACCENT }}>
          {row.dryWeight.toFixed(1)}
        </span>
      ),
    },
    {
      header: 'Ratio',
      accessor: 'dryRatio' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: HarvestRecord) => <span>{(row.dryRatio * 100).toFixed(1)}%</span>,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row: HarvestRecord) => <StatusBadge status={row.status} />,
    },
  ];
}

/* ── Main Component ── */
export function GrowDashboard() {
  const { data: metrics, isLoading: metricsLoading } = useCultivationMetrics();
  const { data: harvests, isLoading: harvestsLoading } = useHarvestRecords();
  const { data: rooms, isLoading: roomsLoading } = useGrowRooms();

  const isLoading = metricsLoading || harvestsLoading || roomsLoading;

  const roomMap = useMemo(() => {
    const map = new Map<string, string>();
    if (rooms) {
      for (const room of rooms) {
        map.set(room.id, room.name);
      }
    }
    return map;
  }, [rooms]);

  const harvestColumns = useMemo(() => buildHarvestColumns(roomMap), [roomMap]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LoadingSkeleton variant="chart" />
          <LoadingSkeleton variant="chart" />
        </div>
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Metrics Row ── */}
      {metrics && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            label="Active Rooms"
            value={metrics.activeRooms}
            accentColor={CULTIVATION_ACCENT}
            icon={Warehouse}
          />
          <MetricCard
            label="Total Plants"
            value={metrics.totalPlants.toLocaleString()}
            accentColor={CULTIVATION_ACCENT}
            icon={Sprout}
          />
          <MetricCard
            label="Plants in Flower"
            value={metrics.plantsInFlower.toLocaleString()}
            subValue={`${metrics.plantsInVeg.toLocaleString()} in veg`}
            accentColor={CULTIVATION_ACCENT}
            icon={Flower2}
          />
          <MetricCard
            label="Next Harvest"
            value={`${metrics.daysToNextHarvest}d`}
            subValue={metrics.nextHarvestStrain}
            accentColor={CULTIVATION_ACCENT}
            icon={Calendar}
          />
          <MetricCard
            label="Environment Alerts"
            value={metrics.environmentAlerts}
            accentColor={metrics.environmentAlerts > 0 ? '#EF4444' : CULTIVATION_ACCENT}
            icon={AlertTriangle}
          />
        </div>
      )}

      {/* ── Charts Row ── */}
      {harvests && rooms && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <YieldChart harvests={harvests} />
          <StageDistribution rooms={rooms} />
        </div>
      )}

      {/* ── Recent Harvests Table ── */}
      {harvests && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-bright">Recent Harvests</h3>
          <DataTable
            data={harvests as unknown as Record<string, unknown>[]}
            columns={harvestColumns as unknown as Parameters<typeof DataTable>[0]['columns']}
            searchable
            searchPlaceholder="Search harvests..."
            pageSize={5}
            emptyState={{
              title: 'No harvests yet',
              description: 'Harvest records will appear here once rooms complete their cycle.',
              accentColor: CULTIVATION_ACCENT,
            }}
          />
        </div>
      )}
    </div>
  );
}
