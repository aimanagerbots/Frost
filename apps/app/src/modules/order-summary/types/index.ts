// Order Summary module types — re-exports from sales types + module-specific filters

export type { OrderSummaryRow, SalesOrderStatus } from '@/modules/sales/types';

export interface OrderSummaryFilters {
  fromSubmittedDate: string;
  toSubmittedDate: string;
  fromEstDeliveryDate: string;
  toEstDeliveryDate: string;
  fromReleasedDate: string;
  toReleasedDate: string;
  tradeName: string;
  status: string;
  submittedBy: string;
  itemsPerPage: number;
  showCancelled: boolean;
  hideSamplesOnly: boolean;
  hideNonSamplesOnly: boolean;
}

export const DEFAULT_FILTERS: OrderSummaryFilters = {
  fromSubmittedDate: '',
  toSubmittedDate: '',
  fromEstDeliveryDate: '',
  toEstDeliveryDate: '',
  fromReleasedDate: '',
  toReleasedDate: '',
  tradeName: '',
  status: '',
  submittedBy: '',
  itemsPerPage: 20,
  showCancelled: false,
  hideSamplesOnly: true,
  hideNonSamplesOnly: false,
};

export const ORDER_STATUSES = [
  'Submitted',
  'Sublotted',
  'Manifested',
  'Quarantined',
  'Invoiced',
  'Paid',
  'Partially Sublotted',
] as const;

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 25, 50, 100, 250, 500, 1000] as const;
