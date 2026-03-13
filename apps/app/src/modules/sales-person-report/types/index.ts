// Sales Person Report module types

export interface SalesRepReportFilters {
  dateFrom: string;
  dateTo: string;
  salesPersons: string[];
  clientStatus: 'all' | 'active' | 'inactive';
  minTotal: string;
  maxTotal: string;
  showCancelled: boolean;
}

export type DateQuickLink =
  | 'all'
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last10'
  | 'last15'
  | 'weekToDate'
  | 'monthToDate'
  | 'yearToDate';
