'use client';

import { Package } from 'lucide-react';
import { DataTable, StatusBadge } from '@/components';

interface Material {
  [key: string]: unknown;
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  status: 'in-stock' | 'low' | 'critical';
  supplier: string;
  lastOrdered: string;
}

const MATERIALS: Material[] = [
  { id: 'mat-1', name: 'Custom Mylar Bags (3.5g)', category: 'Packaging', quantity: 4200, unit: 'units', reorderPoint: 2000, status: 'in-stock', supplier: 'Pacific Packaging', lastOrdered: '2026-02-15' },
  { id: 'mat-2', name: 'Custom Mylar Bags (1g)', category: 'Packaging', quantity: 2800, unit: 'units', reorderPoint: 1500, status: 'in-stock', supplier: 'Pacific Packaging', lastOrdered: '2026-02-15' },
  { id: 'mat-3', name: 'Boveda 62% Humidity Packs', category: 'Supplies', quantity: 6400, unit: 'units', reorderPoint: 3000, status: 'in-stock', supplier: 'Pacific Packaging', lastOrdered: '2026-02-20' },
  { id: 'mat-4', name: 'Child-Resistant Tubes (preroll)', category: 'Packaging', quantity: 1200, unit: 'units', reorderPoint: 1000, status: 'low', supplier: 'Pacific Packaging', lastOrdered: '2026-02-20' },
  { id: 'mat-5', name: 'Vape Cartridge (1g, empty)', category: 'Hardware', quantity: 3600, unit: 'units', reorderPoint: 2000, status: 'in-stock', supplier: 'CCELL Direct', lastOrdered: '2026-02-10' },
  { id: 'mat-6', name: 'Vape Cartridge (0.5g, empty)', category: 'Hardware', quantity: 800, unit: 'units', reorderPoint: 1000, status: 'critical', supplier: 'CCELL Direct', lastOrdered: '2026-01-28' },
  { id: 'mat-7', name: 'Custom Labels (flower)', category: 'Labels', quantity: 8500, unit: 'units', reorderPoint: 3000, status: 'in-stock', supplier: 'NW Label Co', lastOrdered: '2026-02-18' },
  { id: 'mat-8', name: 'Custom Labels (preroll)', category: 'Labels', quantity: 5200, unit: 'units', reorderPoint: 2000, status: 'in-stock', supplier: 'NW Label Co', lastOrdered: '2026-02-18' },
  { id: 'mat-9', name: 'Custom Labels (cartridge)', category: 'Labels', quantity: 4100, unit: 'units', reorderPoint: 2000, status: 'in-stock', supplier: 'NW Label Co', lastOrdered: '2026-02-18' },
  { id: 'mat-10', name: 'Shrink Wrap Bands', category: 'Packaging', quantity: 12000, unit: 'units', reorderPoint: 5000, status: 'in-stock', supplier: 'Pacific Packaging', lastOrdered: '2026-01-30' },
  { id: 'mat-11', name: 'Exit Bags (opaque)', category: 'Packaging', quantity: 3400, unit: 'units', reorderPoint: 2000, status: 'in-stock', supplier: 'Pacific Packaging', lastOrdered: '2026-02-05' },
  { id: 'mat-12', name: 'COA Insert Cards', category: 'Labels', quantity: 7000, unit: 'units', reorderPoint: 3000, status: 'in-stock', supplier: 'NW Label Co', lastOrdered: '2026-02-12' },
];

const statusVariant = (s: Material['status']) =>
  s === 'in-stock' ? 'success' as const : s === 'low' ? 'warning' as const : 'danger' as const;

const columns = [
  { header: 'Material', accessor: 'name' as const, sortable: true },
  { header: 'Category', accessor: 'category' as const, sortable: true },
  {
    header: 'Qty',
    accessor: 'quantity' as const,
    sortable: true,
    render: (row: Material) => (
      <span className="text-text-default">{row.quantity.toLocaleString()} {row.unit}</span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: Material) => (
      <StatusBadge variant={statusVariant(row.status)} label={row.status.replace('-', ' ')} size="sm" />
    ),
  },
  { header: 'Supplier', accessor: 'supplier' as const, sortable: true, hideBelow: 'md' as const },
  {
    header: 'Last Ordered',
    accessor: 'lastOrdered' as const,
    sortable: true,
    hideBelow: 'lg' as const,
  },
];

export function NonCannabisTab() {
  return (
    <div className="space-y-4">
      <DataTable<Material>
        data={MATERIALS}
        columns={columns}
        searchable
        searchPlaceholder="Search materials..."
        pageSize={15}
        emptyState={{
          icon: Package,
          title: 'No materials found',
          description: 'Non-cannabis packaging materials will appear here.',
          accentColor: '#8B5CF6',
        }}
      />
    </div>
  );
}
