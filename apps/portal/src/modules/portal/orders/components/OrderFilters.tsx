'use client';

import { cn } from '@/lib/utils';

interface OrderFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  paymentFilter: string;
  onPaymentChange: (payment: string) => void;
  className?: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'packaged', label: 'Packaged' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'paid', label: 'Paid' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'year', label: 'This Year' },
];

const PAYMENT_OPTIONS = [
  { value: 'all', label: 'All Payments' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];

const selectClasses = cn(
  'h-9 rounded-lg border border-border-default bg-elevated px-3 text-sm text-text-default',
  'outline-none transition-colors',
  'hover:border-white/[0.12]',
  'focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30',
  'appearance-none cursor-pointer',
  '[&>option]:bg-elevated [&>option]:text-text-default'
);

export function OrderFilters({
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  paymentFilter,
  onPaymentChange,
  className,
}: OrderFiltersProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className={selectClasses}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className={selectClasses}
        aria-label="Filter by date range"
      >
        {DATE_RANGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={paymentFilter}
        onChange={(e) => onPaymentChange(e.target.value)}
        className={selectClasses}
        aria-label="Filter by payment status"
      >
        {PAYMENT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
