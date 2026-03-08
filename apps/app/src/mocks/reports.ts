import type { Report, ReportFilter } from '@/modules/reports/types';

const REPORTS: Report[] = [
  {
    id: 'rpt-001',
    name: 'Weekly Sales Summary',
    description: 'Aggregated sales data across all accounts with revenue trends, top SKUs, and territory breakdowns.',
    type: 'sales',
    schedule: 'weekly',
    lastRun: '2026-03-03',
    format: ['pdf', 'csv'],
    modules: ['CRM', 'Orders'],
  },
  {
    id: 'rpt-002',
    name: 'Monthly Production Report',
    description: 'Manufacturing output, batch yields, waste percentages, and packaging throughput for the period.',
    type: 'operations',
    schedule: 'monthly',
    lastRun: '2026-03-01',
    format: ['pdf', 'excel'],
    modules: ['Manufacturing', 'Packaging'],
  },
  {
    id: 'rpt-003',
    name: 'Quarterly Revenue Review',
    description: 'Full P&L breakdown with quarter-over-quarter comparisons, margin analysis, and revenue forecasting.',
    type: 'financial',
    schedule: 'quarterly',
    lastRun: '2026-01-01',
    format: ['pdf', 'excel'],
    modules: ['Finance', 'CRM'],
  },
  {
    id: 'rpt-004',
    name: 'Compliance Audit Trail',
    description: 'Tracks all compliance-relevant events including COA verifications, inventory adjustments, and regulatory submissions.',
    type: 'compliance',
    schedule: 'monthly',
    lastRun: '2026-03-01',
    format: ['pdf'],
    modules: ['Inventory', 'COA'],
  },
  {
    id: 'rpt-005',
    name: 'Inventory Aging Analysis',
    description: 'Identifies slow-moving and aging inventory with days-on-hand metrics and expiration risk flags.',
    type: 'operations',
    schedule: 'weekly',
    lastRun: '2026-03-03',
    format: ['csv', 'excel'],
    modules: ['Inventory'],
  },
  {
    id: 'rpt-006',
    name: 'Account Health Summary',
    description: 'Per-account health scores based on order frequency, payment history, and engagement metrics.',
    type: 'sales',
    schedule: 'weekly',
    lastRun: '2026-03-03',
    format: ['pdf'],
    modules: ['CRM'],
  },
  {
    id: 'rpt-007',
    name: 'Payment Collection Report',
    description: 'Outstanding balances, aging buckets, collection rates, and projected cash flow from receivables.',
    type: 'financial',
    schedule: 'monthly',
    lastRun: '2026-03-01',
    format: ['pdf', 'csv'],
    modules: ['Finance'],
  },
  {
    id: 'rpt-008',
    name: 'Delivery Performance',
    description: 'On-time delivery rates, route efficiency, driver utilization, and customer satisfaction scores.',
    type: 'performance',
    schedule: 'weekly',
    lastRun: '2026-03-03',
    format: ['pdf', 'csv'],
    modules: ['Delivery', 'Fulfillment'],
  },
  {
    id: 'rpt-009',
    name: 'Manufacturing Throughput',
    description: 'Daily production volumes, machine utilization, cycle times, and bottleneck identification.',
    type: 'operations',
    schedule: 'daily',
    lastRun: '2026-03-06',
    format: ['csv'],
    modules: ['Manufacturing'],
  },
  {
    id: 'rpt-010',
    name: 'Team Activity & Workload',
    description: 'Task completion rates, workload distribution, and individual contributor productivity metrics.',
    type: 'performance',
    schedule: 'weekly',
    lastRun: '2026-03-03',
    format: ['pdf'],
    modules: ['Team', 'Tasks'],
  },
];

export async function getReports(filters?: ReportFilter): Promise<Report[]> {
  await new Promise((r) => setTimeout(r, 300));

  let results = [...REPORTS];

  if (filters?.type) {
    results = results.filter((r) => r.type === filters.type);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }

  return results;
}
