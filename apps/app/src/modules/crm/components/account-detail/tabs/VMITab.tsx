'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { ChartWrapper, CHART_THEME, EmptyState, LoadingSkeleton } from '@/components';
import { useAccountVMI } from '../../../hooks';
import { Package } from 'lucide-react';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


interface VMITabProps {
  accountId: string;
  vmiEnrolled: boolean;
}

export function VMITab({ accountId, vmiEnrolled }: VMITabProps) {
  const { data: vmi, isLoading } = useAccountVMI(accountId);

  if (!vmiEnrolled) {
    return (
      <EmptyState
        icon={Package}
        title="VMI Not Enrolled"
        description="This account is not enrolled in Vendor Managed Inventory. Contact the account to discuss VMI benefits."
        accentColor={CRM_ACCENT}
      />
    );
  }

  if (isLoading || !vmi) return <LoadingSkeleton variant="chart" />;

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-card p-4">
          <div className="text-xs text-text-muted">Enrolled Since</div>
          <div className="text-lg font-bold text-text-bright">
            {vmi.enrolledDate ? new Date(vmi.enrolledDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
          </div>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="text-xs text-text-muted">Auto Reorders</div>
          <div className="text-lg font-bold text-text-bright">{vmi.autoReorderCount}</div>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="text-xs text-text-muted">Last Reorder</div>
          <div className="text-lg font-bold text-text-bright">
            {vmi.lastReorderDate ? new Date(vmi.lastReorderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
          </div>
        </div>
      </div>

      {/* Sell-through line chart */}
      <ChartWrapper title="Weekly Sell-Through" subtitle="Units sold per week">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={vmi.sellThrough}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis dataKey="week" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
            <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
            />
            <Line type="monotone" dataKey="units" stroke={CRM_ACCENT} strokeWidth={2} dot={{ fill: CRM_ACCENT, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Inventory levels: current vs par */}
        <ChartWrapper title="Inventory Levels" subtitle="Current vs Par">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vmi.inventoryLevels} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
              <YAxis dataKey="category" type="category" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} width={80} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              />
              <Bar dataKey="current" fill={CRM_ACCENT} radius={[0, 4, 4, 0]} barSize={12} name="Current" />
              <Bar dataKey="par" fill="#5BB8E6" radius={[0, 4, 4, 0]} barSize={12} name="Par" opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Days on hand */}
        <ChartWrapper title="Days on Hand" subtitle="Red highlight < 3 days">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vmi.daysOnHand} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
              <YAxis dataKey="category" type="category" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} width={80} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              />
              <ReferenceLine x={3} stroke="#FB7185" strokeDasharray="3 3" />
              <Bar dataKey="days" radius={[0, 4, 4, 0]} barSize={14} name="Days">
                {vmi.daysOnHand.map((entry, i) => (
                  <Cell key={i} fill={entry.days < 3 ? '#FB7185' : '#00E5A0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
}
