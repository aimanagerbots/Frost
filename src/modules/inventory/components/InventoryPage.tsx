'use client';

import { useState } from 'react';
import { Warehouse } from 'lucide-react';
import { SectionHeader, MetricCard, DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { useInventory } from '@/modules/inventory/hooks/useInventory';
import { useInventoryMetrics } from '@/modules/inventory/hooks/useInventoryMetrics';
import { useInventoryByCategory } from '@/modules/inventory/hooks/useInventoryByCategory';
import { useInventoryPipeline } from '@/modules/inventory/hooks/useInventoryPipeline';
import { PipelineVisualization } from './PipelineVisualization';
import { CategoryCards } from './CategoryCards';
import { InventoryDrawer } from './InventoryDrawer';
import type { InventoryItem, InventoryFilter, ProductCategory, StrainType, ReadinessState } from '@/modules/inventory/types';

const INVENTORY_ACCENT = '#8B5CF6';

const STRAIN_COLOR: Record<StrainType, string> = {
  indica: '#A855F7',
  sativa: '#F97316',
  hybrid: '#22C55E',
  cbd: '#3B82F6',
  balanced: '#06B6D4',
};

const selectClass =
  'rounded-lg border border-default bg-elevated px-2.5 py-1.5 text-xs text-text-default outline-none focus:border-hover';

export function InventoryPage() {
  const [filters, setFilters] = useState<InventoryFilter>({});
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const { data: items, isLoading: itemsLoading } = useInventory(filters);
  const { data: metrics, isLoading: metricsLoading } = useInventoryMetrics();
  const { data: categories, isLoading: categoriesLoading } = useInventoryByCategory();
  const { data: pipeline, isLoading: pipelineLoading } = useInventoryPipeline();

  const isLoading = itemsLoading || metricsLoading || categoriesLoading || pipelineLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  function handleCategoryClick(category: ProductCategory) {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  }

  function handleStateClick(state: ReadinessState) {
    setFilters((prev) => ({
      ...prev,
      readinessState: prev.readinessState === state ? undefined : state,
    }));
  }

  const tableColumns = [
    {
      header: 'Product',
      accessor: 'productName' as const,
      sortable: true,
      render: (row: InventoryItem) => (
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: STRAIN_COLOR[row.strainType] }}
          />
          <span className="text-sm font-medium text-text-bright">{row.productName}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      sortable: true,
      render: (row: InventoryItem) => (
        <span className="rounded-full bg-elevated px-2 py-0.5 text-[10px] text-text-muted capitalize">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Strain',
      accessor: 'strainName' as const,
      sortable: true,
    },
    {
      header: 'Type',
      accessor: 'strainType' as const,
      sortable: true,
      render: (row: InventoryItem) => (
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
          style={{ backgroundColor: `${STRAIN_COLOR[row.strainType]}20`, color: STRAIN_COLOR[row.strainType] }}
        >
          {row.strainType}
        </span>
      ),
    },
    {
      header: 'State',
      accessor: 'readinessState' as const,
      sortable: true,
      render: (row: InventoryItem) => (
        <StatusBadge variant="info" label={row.readinessState.replace(/-/g, ' ')} size="sm" />
      ),
    },
    {
      header: 'Qty',
      accessor: 'quantity' as const,
      sortable: true,
      render: (row: InventoryItem) => (
        <span className="text-text-default">{row.quantity.toLocaleString()} {row.unit}</span>
      ),
    },
    {
      header: 'THC%',
      accessor: 'thcPercent' as const,
      sortable: true,
      render: (row: InventoryItem) => (
        <span className="text-text-muted">{row.thcPercent != null ? `${row.thcPercent}%` : '—'}</span>
      ),
    },
    {
      header: 'Batch',
      accessor: 'batchNumber' as const,
      sortable: true,
      render: (row: InventoryItem) => (
        <span className="text-[11px] text-text-muted font-mono">{row.batchNumber}</span>
      ),
    },
    {
      header: 'Value',
      accessor: 'value' as const,
      sortable: true,
      render: (row: InventoryItem) => (
        <span className="font-medium text-text-bright">${row.value.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={Warehouse}
        title="Inventory"
        subtitle="Track products across the pipeline"
        accentColor={INVENTORY_ACCENT}
        stats={[
          { label: 'Items', value: metrics?.totalItems ?? 0 },
          { label: 'Value', value: `$${((metrics?.totalValue ?? 0) / 1000).toFixed(0)}K` },
          { label: 'Low Stock', value: metrics?.lowStockAlerts ?? 0 },
        ]}
      />

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard label="Total Items" value={metrics.totalItems} accentColor={INVENTORY_ACCENT} />
          <MetricCard
            label="Total Value"
            value={`$${(metrics.totalValue / 1000).toFixed(0)}K`}
            accentColor="#059669"
          />
          <MetricCard label="Low Stock Alerts" value={metrics.lowStockAlerts} accentColor="#EF4444" />
          <MetricCard
            label="Categories"
            value={Object.keys(metrics.categoryCounts).length}
            accentColor="#3B82F6"
          />
        </div>
      )}

      {/* Pipeline */}
      {pipeline && (
        <PipelineVisualization
          groups={pipeline}
          activeState={filters.readinessState}
          onStateClick={handleStateClick}
        />
      )}

      {/* Category Cards */}
      {categories && (
        <CategoryCards
          categories={categories}
          activeCategory={filters.category}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.category ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              category: (e.target.value || undefined) as InventoryFilter['category'],
            }))
          }
          className={selectClass}
        >
          <option value="">All Categories</option>
          <option value="flower">Flower</option>
          <option value="preroll">Preroll</option>
          <option value="vaporizer">Vaporizer</option>
          <option value="concentrate">Concentrate</option>
          <option value="edible">Edible</option>
          <option value="beverage">Beverage</option>
        </select>

        <select
          value={filters.strainType ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              strainType: (e.target.value || undefined) as InventoryFilter['strainType'],
            }))
          }
          className={selectClass}
        >
          <option value="">All Types</option>
          <option value="indica">Indica</option>
          <option value="sativa">Sativa</option>
          <option value="hybrid">Hybrid</option>
          <option value="cbd">CBD</option>
          <option value="balanced">Balanced</option>
        </select>

        <select
          value={filters.division ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              division: (e.target.value || undefined) as InventoryFilter['division'],
            }))
          }
          className={selectClass}
        >
          <option value="">All Divisions</option>
          <option value="cultivation">Cultivation</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="packaging">Packaging</option>
          <option value="fulfillment">Fulfillment</option>
          <option value="delivery">Delivery</option>
        </select>

        {filters.category || filters.strainType || filters.division || filters.readinessState ? (
          <button
            onClick={() => setFilters({})}
            className="text-xs text-info hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Inventory Table */}
      <DataTable<InventoryItem>
        data={items ?? []}
        columns={tableColumns}
        searchable
        searchPlaceholder="Search inventory..."
        onRowClick={setSelectedItem}
        pageSize={20}
        emptyState={{
          icon: Warehouse,
          title: 'No items found',
          description: 'Try adjusting your filters.',
          accentColor: INVENTORY_ACCENT,
        }}
      />

      <InventoryDrawer
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
