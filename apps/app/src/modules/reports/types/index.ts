export type ReportType = 'sales' | 'operations' | 'compliance' | 'financial' | 'performance';
export type ReportSchedule = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type ReportFormat = 'pdf' | 'csv' | 'excel';

export interface Report {
  [key: string]: unknown;
  id: string;
  name: string;
  description: string;
  type: ReportType;
  schedule?: ReportSchedule;
  lastRun?: string;
  format: ReportFormat[];
  modules: string[];
}

export interface ReportFilter {
  type?: ReportType;
  search?: string;
}
