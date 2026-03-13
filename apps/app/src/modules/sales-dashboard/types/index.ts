// Sales Dashboard — dashboard-specific types

export interface SalesDashboardMetrics {
  totalAccounts: number;
  activeAccounts: number;
  activeCarts: number;
  salesYTD: number;
  revenueYTD: number;
  ordersToday: number;
  ordersTodayTotal: number;
  ordersThisMonth: number;
  ordersThisMonthTotal: number;
  invoicesMTD: number;
  invoicesMTDTotal: number;
  futureSalesOrders: number;
  futureSalesTotal: number;
}

export interface WeeklySalesData {
  week: string;
  sales: number;
}

export interface TopReorderAccount {
  accountName: string;
  orderCount: number;
  lastOrder: string;
}

export interface TopOrderingClient {
  accountName: string;
  total: number;
}
