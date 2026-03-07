import type {
  DashboardAlert,
  DashboardMetric,
  DashboardChartsData,
} from '@/modules/dashboard/types';

// --- Alerts ---

const dashboardAlerts: DashboardAlert[] = [
  // Critical (3)
  {
    id: 'alert-001',
    severity: 'critical',
    title: 'Fulfillment backed up — 12 orders waiting on packaging',
    description:
      'Manufacturing output has exceeded packaging capacity. 12 orders are blocked at the packaged stage awaiting fulfillment processing.',
    module: 'Operations',
    route: '/fulfillment',
    timestamp: '2026-03-06T08:12:00Z',
    dismissed: false,
  },
  {
    id: 'alert-002',
    severity: 'critical',
    title: 'Rainier Remedies payment overdue by 4 days — $4,200',
    description:
      'Invoice #INV-2026-0287 for Rainier Remedies was due 3/2. Account has a history of late payments. Consider follow-up call.',
    module: 'CRM',
    route: '/crm',
    timestamp: '2026-03-06T07:30:00Z',
    dismissed: false,
  },
  {
    id: 'alert-003',
    severity: 'critical',
    title: 'COA failed for Batch #2024-FL-089 — Wedding Cake Quarter',
    description:
      'Lab results came back out of spec for pesticide residue. 48 units quarantined. Retest or destroy decision required.',
    module: 'Lab',
    route: '/coa',
    timestamp: '2026-03-05T16:45:00Z',
    dismissed: false,
  },

  // Warning (4)
  {
    id: 'alert-004',
    severity: 'warning',
    title: "Emerald City Cannabis hasn't ordered in 47 days",
    description:
      'Last order was on 1/18. Account health score dropped to 28. Agent recommends a check-in call this week.',
    module: 'CRM',
    route: '/crm',
    timestamp: '2026-03-06T06:00:00Z',
    dismissed: false,
  },
  {
    id: 'alert-005',
    severity: 'warning',
    title: 'Low stock: Blue Dream 3.5g — 23 units remaining',
    description:
      'Current velocity: 8 units/day. At this rate, stock runs out in ~3 days. Repackaging from bulk may be needed.',
    module: 'Inventory',
    route: '/inventory',
    timestamp: '2026-03-06T05:00:00Z',
    dismissed: false,
  },
  {
    id: 'alert-006',
    severity: 'warning',
    title: '3 deliveries rescheduled for Thursday due to weather',
    description:
      'Route B (Tacoma) and Route D (Olympia) moved from Wednesday to Thursday. Affected accounts notified.',
    module: 'Delivery',
    route: '/delivery',
    timestamp: '2026-03-05T18:00:00Z',
    dismissed: false,
  },
  {
    id: 'alert-007',
    severity: 'warning',
    title: 'Capitol Hill Collective license expires in 45 days',
    description:
      'WA-CCB license renewal due 4/20/2026. Send reminder to Naomi Chen at Capitol Hill Collective.',
    module: 'Compliance',
    route: '/crm',
    timestamp: '2026-03-05T14:00:00Z',
    dismissed: false,
  },

  // Info (5)
  {
    id: 'alert-008',
    severity: 'info',
    title: 'New reorder proposal ready for Greenfield Dispensary',
    description:
      'VMI analysis suggests a $6,200 reorder based on 14-day velocity. Proposal ready for review and send.',
    module: 'CRM',
    route: '/crm',
    timestamp: '2026-03-06T09:00:00Z',
    dismissed: false,
  },
  {
    id: 'alert-009',
    severity: 'info',
    title: 'Vendor day with Pacific Leaf scheduled for next Tuesday',
    description:
      'On-site visit at Pacific Leaf (Tacoma) on 3/10. Priya Patel assigned. Product samples and sell sheets prepared.',
    module: 'CRM',
    route: '/crm',
    timestamp: '2026-03-06T08:30:00Z',
    dismissed: false,
  },
  {
    id: 'alert-010',
    severity: 'info',
    title: 'Monthly compliance report ready for review',
    description:
      'February 2026 compliance report has been auto-generated. 2 minor findings flagged for review.',
    module: 'Reports',
    route: '/reports',
    timestamp: '2026-03-05T12:00:00Z',
    dismissed: false,
  },
  {
    id: 'alert-011',
    severity: 'info',
    title: 'New product sample request from Cascade Wellness',
    description:
      'Cascade Wellness (Spokane) requested samples of the new Gelato Live Resin line. Carlos Ruiz to coordinate.',
    module: 'CRM',
    route: '/crm',
    timestamp: '2026-03-05T10:30:00Z',
    dismissed: false,
  },
  {
    id: 'alert-012',
    severity: 'info',
    title: 'Manufacturing throughput up 12% this week',
    description:
      'Production efficiency improved after Tuesday shift adjustment. 2,847 units processed vs. 2,542 last week.',
    module: 'Manufacturing',
    route: '/manufacturing',
    timestamp: '2026-03-05T09:00:00Z',
    dismissed: false,
  },
];

// --- Metrics ---

const dashboardMetrics: DashboardMetric[] = [
  {
    id: 'metric-revenue',
    label: 'Total Revenue (This Month)',
    value: '$1.24M',
    trend: 8,
    sparklineData: [980, 1020, 1050, 1010, 1080, 1120, 1100, 1150, 1180, 1200, 1220, 1240],
    module: 'Finance',
    route: '/finance',
  },
  {
    id: 'metric-orders',
    label: 'Active Orders',
    value: 34,
    trend: -2,
    sparklineData: [38, 36, 35, 37, 34, 36, 33, 35, 34, 32, 34, 34],
    module: 'Orders',
    route: '/orders',
  },
  {
    id: 'metric-shipped',
    label: 'Units Shipped (This Week)',
    value: '2,847',
    trend: 15,
    sparklineData: [2100, 2250, 2400, 2300, 2500, 2600, 2550, 2700, 2750, 2800, 2820, 2847],
    module: 'Fulfillment',
    route: '/fulfillment',
  },
  {
    id: 'metric-inventory',
    label: 'Inventory Value',
    value: '$3.2M',
    trend: 0,
    sparklineData: [3100, 3150, 3180, 3200, 3190, 3210, 3200, 3220, 3200, 3180, 3200, 3200],
    module: 'Inventory',
    route: '/inventory',
  },
  {
    id: 'metric-accounts',
    label: 'Accounts Active (30d)',
    value: '22 of 28',
    trend: -1,
    sparklineData: [24, 24, 23, 23, 24, 23, 22, 23, 22, 22, 22, 22],
    module: 'CRM',
    route: '/crm',
  },
  {
    id: 'metric-throughput',
    label: 'Production Throughput',
    value: '89%',
    trend: 3,
    sparklineData: [82, 84, 83, 85, 86, 85, 87, 86, 88, 87, 89, 89],
    module: 'Manufacturing',
    route: '/manufacturing',
  },
  {
    id: 'metric-delivery',
    label: 'On-Time Delivery Rate',
    value: '94%',
    trend: 2,
    sparklineData: [90, 91, 89, 92, 91, 93, 92, 93, 94, 93, 94, 94],
    module: 'Delivery',
    route: '/delivery',
  },
  {
    id: 'metric-ar',
    label: 'Outstanding AR',
    value: '$127K',
    trend: -12,
    sparklineData: [155, 150, 148, 145, 142, 140, 138, 135, 132, 130, 128, 127],
    module: 'Finance',
    route: '/finance',
  },
];

// --- Charts ---

function generateRevenueTrend(): DashboardChartsData['revenueTrend'] {
  const data: DashboardChartsData['revenueTrend'] = [];
  const baseRevenue = 38000;
  for (let i = 29; i >= 0; i--) {
    const date = new Date('2026-03-06');
    date.setDate(date.getDate() - i);
    const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`;
    const variance = Math.sin(i * 0.4) * 6000 + Math.random() * 3000;
    data.push({
      label: dayLabel,
      value: Math.round(baseRevenue + variance + i * 100),
    });
  }
  return data;
}

const chartsData: DashboardChartsData = {
  revenueTrend: generateRevenueTrend(),
  ordersByStatus: [
    { status: 'Pending', count: 12, color: '#94A3B8' },
    { status: 'In Production', count: 8, color: '#8B5CF6' },
    { status: 'Packaged', count: 6, color: '#06B6D4' },
    { status: 'Fulfilled', count: 4, color: '#F59E0B' },
    { status: 'Shipped', count: 3, color: '#F97316' },
    { status: 'Delivered', count: 1, color: '#22C55E' },
  ],
  divisionWorkload: [
    { division: 'Cultivation', tasks: 3, color: '#22C55E' },
    { division: 'Manufacturing', tasks: 12, color: '#10B981' },
    { division: 'Packaging', tasks: 8, color: '#84CC16' },
    { division: 'Fulfillment', tasks: 6, color: '#14B8A6' },
    { division: 'Delivery', tasks: 4, color: '#0EA5E9' },
  ],
  topProducts: [
    { name: 'Wedding Cake 3.5g', revenue: 18200, category: 'flower' },
    { name: 'Blue Dream 3.5g', revenue: 15400, category: 'flower' },
    { name: 'Gelato Live Resin Cart', revenue: 12800, category: 'vaporizer' },
    { name: 'GSC Infused Preroll 5pk', revenue: 9600, category: 'preroll' },
    { name: 'Zkittlez Gummies 10pk', revenue: 7200, category: 'edible' },
  ],
};

// --- Exports ---

export function getDashboardAlerts(): Promise<DashboardAlert[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...dashboardAlerts]), 300);
  });
}

export function getDashboardMetrics(): Promise<DashboardMetric[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...dashboardMetrics]), 300);
  });
}

export function getDashboardCharts(): Promise<DashboardChartsData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...chartsData }), 400);
  });
}
