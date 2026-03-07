'use client';

import { cn } from '@/lib/utils';
import {
  DrawerPanel,
  DataTable,
  StatusBadge,
  LoadingSkeleton,
} from '@/components';
import { TrendingUp, TrendingDown, Minus, Store, AlertCircle } from 'lucide-react';
import { useCompetitorProducts, useCompetitorAlerts } from '../hooks';
import type { Competitor, CompetitorProduct } from '../types';

const ACCENT = '#F97316';

const TREND_ICONS = {
  growing: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
} as const;

const TREND_COLORS = {
  growing: 'text-success',
  stable: 'text-muted',
  declining: 'text-danger',
} as const;

const ALERT_TYPE_LABELS: Record<string, string> = {
  'gained-placement': 'Gained Placement',
  'lost-placement': 'Lost Placement',
  'price-change': 'Price Change',
  'new-product': 'New Product',
};

const ALERT_TYPE_VARIANTS: Record<string, 'danger' | 'success' | 'warning' | 'info'> = {
  'gained-placement': 'danger',
  'lost-placement': 'success',
  'price-change': 'warning',
  'new-product': 'info',
};

const SEVERITY_COLORS: Record<string, string> = {
  high: 'border-l-danger',
  medium: 'border-l-warning',
  low: 'border-l-muted',
};

interface CompetitorDrawerProps {
  competitor: Competitor | null;
  onClose: () => void;
}

export function CompetitorDrawer({ competitor, onClose }: CompetitorDrawerProps) {
  const { data: products, isLoading: productsLoading } = useCompetitorProducts(
    competitor?.id
  );
  const { data: allAlerts } = useCompetitorAlerts();

  const competitorAlerts = (allAlerts ?? []).filter(
    (a) => a.competitorName === competitor?.name
  );

  const TrendIcon = competitor ? TREND_ICONS[competitor.trend] : Minus;
  const trendColor = competitor ? TREND_COLORS[competitor.trend] : '';

  const productColumns = [
    {
      header: 'Product',
      accessor: 'name' as keyof CompetitorProduct,
      sortable: true,
    },
    {
      header: 'Category',
      accessor: 'category' as keyof CompetitorProduct,
      render: (row: CompetitorProduct) => (
        <StatusBadge label={row.category} variant="default" size="sm" />
      ),
    },
    {
      header: 'Sub-Category',
      accessor: 'subCategory' as keyof CompetitorProduct,
      render: (row: CompetitorProduct) => (
        <span className="text-xs text-muted">{row.subCategory}</span>
      ),
    },
    {
      header: 'Price',
      accessor: 'price' as keyof CompetitorProduct,
      sortable: true,
      render: (row: CompetitorProduct) => (
        <span className="font-medium text-default">${row.price}</span>
      ),
    },
    {
      header: 'Our Comparable',
      accessor: 'ourComparable' as keyof CompetitorProduct,
      render: (row: CompetitorProduct) =>
        row.ourComparable ? (
          <span className="text-xs text-default">{row.ourComparable}</span>
        ) : (
          <span className="text-xs text-muted">-</span>
        ),
    },
    {
      header: 'Our Price',
      accessor: 'ourPrice' as keyof CompetitorProduct,
      render: (row: CompetitorProduct) =>
        row.ourPrice ? (
          <span className="font-medium text-default">${row.ourPrice}</span>
        ) : (
          <span className="text-xs text-muted">-</span>
        ),
    },
    {
      header: 'Delta',
      accessor: ((row: CompetitorProduct) =>
        row.ourPrice ? row.ourPrice - row.price : 0) as (row: CompetitorProduct) => unknown,
      render: (row: CompetitorProduct) => {
        if (!row.ourPrice) return <span className="text-xs text-muted">-</span>;
        const delta = row.ourPrice - row.price;
        const isGood = delta <= 0;
        return (
          <span
            className={cn(
              'text-xs font-semibold',
              isGood ? 'text-success' : 'text-danger'
            )}
          >
            {delta > 0 ? '+' : ''}${delta}
          </span>
        );
      },
    },
  ];

  return (
    <DrawerPanel
      open={!!competitor}
      onClose={onClose}
      title={competitor?.name ?? 'Competitor'}
      width="lg"
    >
      {!competitor ? null : (
        <div className="space-y-6">
          {/* Overview */}
          <div>
            <p className="text-sm text-muted">{competitor.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-elevated p-3 text-center">
                <div className="text-xl font-bold text-bright">
                  {competitor.marketShare}%
                </div>
                <div className="text-xs text-muted">Market Share</div>
              </div>
              <div className="rounded-lg bg-elevated p-3 text-center">
                <div className={cn('flex items-center justify-center gap-1 text-xl font-bold', trendColor)}>
                  <TrendIcon className="h-5 w-5" />
                  {competitor.trend.charAt(0).toUpperCase() + competitor.trend.slice(1)}
                </div>
                <div className="text-xs text-muted">Trend</div>
              </div>
              <div className="rounded-lg bg-elevated p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-bright">
                  <Store className="h-4 w-4" />
                  {competitor.storeCount}
                </div>
                <div className="text-xs text-muted">Stores</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {competitor.categories.map((cat) => (
                <StatusBadge key={cat} label={cat} variant="default" size="sm" />
              ))}
            </div>
          </div>

          {/* Products Table */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-bright">Products</h3>
            {productsLoading ? (
              <LoadingSkeleton variant="table" />
            ) : (
              <DataTable
                data={(products ?? []) as unknown as Record<string, unknown>[]}
                columns={productColumns as Parameters<typeof DataTable>[0]['columns']}
                searchable
                searchPlaceholder="Search products..."
                pageSize={6}
              />
            )}
          </div>

          {/* Alert History */}
          {competitorAlerts.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-bright">
                <AlertCircle className="h-4 w-4" style={{ color: ACCENT }} />
                Alert History ({competitorAlerts.length})
              </h3>
              <div className="space-y-2">
                {competitorAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'rounded-lg border-l-4 bg-elevated px-3 py-2',
                      SEVERITY_COLORS[alert.severity] ?? 'border-l-muted'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge
                        label={ALERT_TYPE_LABELS[alert.type] ?? alert.type}
                        variant={ALERT_TYPE_VARIANTS[alert.type] ?? 'default'}
                        size="sm"
                      />
                      <span className="text-xs text-muted">
                        {new Date(alert.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-default">{alert.details}</p>
                    <p className="mt-0.5 text-xs text-muted">{alert.accountName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DrawerPanel>
  );
}
