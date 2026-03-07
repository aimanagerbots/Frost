export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface DashboardAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  module: string;
  route: string;
  timestamp: string;
  dismissed: boolean;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  trend: number;
  sparklineData: number[];
  module: string;
  route: string;
}

export type WidgetType = 'metrics' | 'chart' | 'list' | 'alerts';
export type WidgetSize = 'sm' | 'md' | 'lg' | 'full';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface OrdersByStatusData {
  status: string;
  count: number;
  color: string;
}

export interface DivisionWorkloadData {
  division: string;
  tasks: number;
  color: string;
}

export interface TopProductData {
  name: string;
  revenue: number;
  category: string;
}

export interface DashboardChartsData {
  revenueTrend: ChartDataPoint[];
  ordersByStatus: OrdersByStatusData[];
  divisionWorkload: DivisionWorkloadData[];
  topProducts: TopProductData[];
}
