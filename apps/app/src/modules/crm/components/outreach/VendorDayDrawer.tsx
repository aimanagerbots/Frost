'use client';

import { DrawerPanel, StatusBadge, ChartWrapper, CHART_THEME, CHART_COLORS } from '@/components';
import { useVendorDayImpact } from '../../hooks/useVendorDayImpact';
import type { VendorDay } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, User, Target, CheckCircle } from 'lucide-react';

const PURPOSE_LABELS: Record<string, string> = {
  'product-education': 'Product Education',
  'new-product-intro': 'New Product Intro',
  'relationship-building': 'Relationship Building',
  promotional: 'Promotional',
};

import type { DomainStatus } from '@/components/StatusBadge';

const VD_STATUS_DOMAIN: Record<string, DomainStatus> = {
  completed: 'complete',
  scheduled: 'scheduled',
  cancelled: 'cancelled',
};

interface VendorDayDrawerProps {
  vendorDay: VendorDay | null;
  onClose: () => void;
}

export function VendorDayDrawer({ vendorDay, onClose }: VendorDayDrawerProps) {
  const { data: impact } = useVendorDayImpact(vendorDay?.id ?? null);

  if (!vendorDay) return null;

  const impactData = impact ? [
    { label: 'Pre-Visit', revenue: impact.preVisitRevenue },
    { label: 'Post-Visit', revenue: impact.postVisitRevenue },
  ] : [];

  return (
    <DrawerPanel open={!!vendorDay} onClose={onClose} title={`Vendor Day — ${vendorDay.accountName}`} width="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={VD_STATUS_DOMAIN[vendorDay.status]} label={vendorDay.status} />
          <StatusBadge variant="info" label={PURPOSE_LABELS[vendorDay.purpose] || vendorDay.purpose} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Calendar className="h-4 w-4" />
            <span>{new Date(vendorDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <User className="h-4 w-4" />
            <span>{vendorDay.ambassador}</span>
          </div>
        </div>

        {/* Completed with report */}
        {vendorDay.status === 'completed' && vendorDay.report && (
          <>
            <div className="rounded-xl border border-default bg-base p-4 space-y-4">
              <h4 className="text-sm font-medium text-text-bright">Visit Report</h4>

              <div>
                <span className="text-xs font-medium text-text-muted">Attendance</span>
                <p className="mt-0.5 text-sm text-text-default">{vendorDay.report.attendance}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-text-muted">Products Showcased</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {vendorDay.report.productsShowcased.map((p) => (
                    <StatusBadge key={p} variant="info" label={p} size="sm" />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-text-muted">Budtender Feedback</span>
                <p className="mt-0.5 text-sm text-text-default leading-relaxed">{vendorDay.report.budtenderFeedback}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-text-muted">Competitor Observations</span>
                <p className="mt-0.5 text-sm text-text-default leading-relaxed">{vendorDay.report.competitorObservations}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-text-muted">Follow-Up Actions</span>
                <ul className="mt-1 space-y-1">
                  {vendorDay.report.followUpActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-default">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-text-muted">{vendorDay.report.photos} photos taken</div>
            </div>

            {/* Impact chart */}
            {impact && (
              <div className="rounded-xl border border-default bg-base p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-text-bright">Revenue Impact (2-week window)</h4>
                  <span className={`text-lg font-bold ${impact.lift >= 0 ? 'text-success' : 'text-danger'}`}>
                    {impact.lift >= 0 ? '+' : ''}{impact.lift.toFixed(1)}% lift
                  </span>
                </div>
                <ChartWrapper height={200}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
                      <XAxis dataKey="label" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} axisLine={{ stroke: CHART_THEME.gridColor }} />
                      <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                        <Cell fill={CHART_COLORS.warning} />
                        <Cell fill={impact.lift >= 0 ? CHART_COLORS.success : CHART_COLORS.danger} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartWrapper>
                <div className="mt-2 flex justify-between text-xs text-text-muted">
                  <span>Categories: {impact.preVisitCategories} → {impact.postVisitCategories}</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Completed without report */}
        {vendorDay.status === 'completed' && !vendorDay.report && (
          <div className="rounded-xl border border-dashed border-warning/40 bg-warning/5 p-6 text-center">
            <Target className="mx-auto h-8 w-8 text-warning" />
            <p className="mt-2 text-sm text-text-default">No report filed for this vendor day.</p>
            <button className="mt-3 rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/30">
              File Report
            </button>
          </div>
        )}

        {/* Scheduled */}
        {vendorDay.status === 'scheduled' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-default bg-base p-4">
              <p className="text-sm text-text-default">
                Scheduled visit to <span className="font-medium text-text-bright">{vendorDay.accountName}</span> for{' '}
                <span className="font-medium text-text-bright">{PURPOSE_LABELS[vendorDay.purpose]}</span>.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-danger/20 px-3 py-1.5 text-sm text-danger hover:bg-danger/30">
                Cancel
              </button>
              <button className="rounded-lg bg-elevated px-3 py-1.5 text-sm text-text-muted hover:text-text-default">
                Reschedule
              </button>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {vendorDay.status === 'cancelled' && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-center">
            <p className="text-sm text-text-muted">This vendor day was cancelled.</p>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
