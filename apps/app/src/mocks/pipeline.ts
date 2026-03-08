import type { PipelineMovement, PipelineVelocityMetric, RepPipelineStats, MovementChartData } from '@/modules/pipeline/types';
import { accounts, salesReps } from './crm';

// --- Pipeline Movement History ---

export const pipelineMovements: PipelineMovement[] = [
  { id: 'mv-001', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', fromCode: 'A4', toCode: 'A5', date: '2026-01-15', reason: 'Full VMI enrollment, maximum share of shelf', repId: 'rep-jake', repName: 'Jake Morrison', direction: 'advance' },
  { id: 'mv-002', accountId: 'acct-emerald-city', accountName: 'Emerald City Cannabis', fromCode: 'A4', toCode: 'A5', date: '2026-02-01', reason: 'Full VMI, maximum share of shelf achieved', repId: 'rep-jake', repName: 'Jake Morrison', direction: 'advance' },
  { id: 'mv-003', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective', fromCode: 'A3', toCode: 'A4', date: '2025-12-01', reason: 'Deep relationship, broad mix, strong sell-through', repId: 'rep-jake', repName: 'Jake Morrison', direction: 'advance' },
  { id: 'mv-004', accountId: 'acct-cascade', accountName: 'Cascade Wellness', fromCode: 'A2', toCode: 'A3', date: '2026-02-28', reason: 'Category expansion into prerolls, growing AOV', repId: 'rep-carlos', repName: 'Carlos Ruiz', direction: 'advance' },
  { id: 'mv-005', accountId: 'acct-olympic', accountName: 'Olympic Greens', fromCode: 'A2', toCode: 'A3', date: '2025-11-01', reason: '3+ categories, growing AOV, reliable payment', repId: 'rep-priya', repName: 'Priya Patel', direction: 'advance' },
  { id: 'mv-006', accountId: 'acct-harbor', accountName: 'Harbor Cannabis', fromCode: 'R1', toCode: 'A2', date: '2026-03-01', reason: 'Recovered — consistent ordering resumed', repId: 'rep-carlos', repName: 'Carlos Ruiz', direction: 'advance' },
  { id: 'mv-007', accountId: 'acct-evergreen', accountName: 'Evergreen Wellness', fromCode: 'R1', toCode: 'A2', date: '2026-02-15', reason: 'Recovered — ordering resumed with expanded categories', repId: 'rep-carlos', repName: 'Carlos Ruiz', direction: 'advance' },
  { id: 'mv-008', accountId: 'acct-005', accountName: 'Kirkland Kush', fromCode: 'I4', toCode: 'I5', date: '2026-02-15', reason: 'First order placed — converting', repId: 'rep-priya', repName: 'Priya Patel', direction: 'advance' },
  { id: 'mv-009', accountId: 'acct-014', accountName: 'Tri-Cities Terpenes', fromCode: 'I3', toCode: 'I4', date: '2026-01-15', reason: 'Sample pack sent — terpene-focused flower and concentrates', repId: 'rep-carlos', repName: 'Carlos Ruiz', direction: 'advance' },
  { id: 'mv-010', accountId: 'acct-007', accountName: 'Tacoma Treehouse', fromCode: 'A3', toCode: 'R1', date: '2026-02-01', reason: 'Order frequency dropped — competitor opened nearby', repId: 'rep-priya', repName: 'Priya Patel', direction: 'decline' },
  { id: 'mv-011', accountId: 'acct-011', accountName: 'Yakima Valley Green', fromCode: 'R1', toCode: 'R2', date: '2026-01-15', reason: 'Multiple signals confirmed — competitive displacement', repId: 'rep-carlos', repName: 'Carlos Ruiz', direction: 'decline' },
  { id: 'mv-012', accountId: 'acct-008', accountName: 'Olympia Organics', fromCode: 'R1', toCode: 'A3', date: '2025-12-01', reason: 'Exceeded pre-lapse levels — graduated to Growing', repId: 'rep-priya', repName: 'Priya Patel', direction: 'advance' },
  { id: 'mv-013', accountId: 'acct-015', accountName: 'Everett Extracts', fromCode: 'R1', toCode: 'A2', date: '2026-01-15', reason: 'Recovered — regular ordering resumed', repId: 'rep-jake', repName: 'Jake Morrison', direction: 'advance' },
  { id: 'mv-014', accountId: 'acct-003', accountName: 'Fremont Flowers', fromCode: 'I2', toCode: 'I3', date: '2025-10-15', reason: 'Meeting happened — active dialogue established', repId: 'rep-jake', repName: 'Jake Morrison', direction: 'advance' },
  { id: 'mv-015', accountId: 'acct-004', accountName: 'Bellevue Botanicals', fromCode: 'I2', toCode: 'I3', date: '2025-09-15', reason: 'Store visit scheduled, product catalog reviewed', repId: 'rep-priya', repName: 'Priya Patel', direction: 'advance' },
  { id: 'mv-016', accountId: 'acct-rainier', accountName: 'Rainier Remedies', fromCode: 'A3', toCode: 'A4', date: '2025-11-01', reason: 'Deep relationship, broad category mix, reliable payment', repId: 'rep-priya', repName: 'Priya Patel', direction: 'advance' },
  { id: 'mv-017', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf', fromCode: 'A3', toCode: 'A4', date: '2026-01-20', reason: 'Deep relationship, broad product mix', repId: 'rep-priya', repName: 'Priya Patel', direction: 'advance' },
  { id: 'mv-018', accountId: 'acct-009', accountName: 'Spokane Smoke Shop', fromCode: 'I1', toCode: 'I2', date: '2026-02-15', reason: 'Outreach attempted — no response yet', repId: 'rep-carlos', repName: 'Carlos Ruiz', direction: 'advance' },
  { id: 'mv-019', accountId: 'acct-006', accountName: 'Redmond Relief', fromCode: 'I1', toCode: 'I2', date: '2025-11-05', reason: 'Initial email outreach — they know who we are', repId: 'rep-priya', repName: 'Priya Patel', direction: 'advance' },
  { id: 'mv-020', accountId: 'acct-012', accountName: 'Bellingham Bloom', fromCode: 'A1', toCode: 'A2', date: '2025-04-01', reason: 'Steady monthly ordering established', repId: 'rep-jake', repName: 'Jake Morrison', direction: 'advance' },
  { id: 'mv-021', accountId: 'acct-016', accountName: 'Bainbridge Botanics', fromCode: 'A1', toCode: 'A2', date: '2025-07-01', reason: 'Premium boutique — steady monthly ordering', repId: 'rep-jake', repName: 'Jake Morrison', direction: 'advance' },
  { id: 'mv-022', accountId: 'acct-002', accountName: 'Capitol Hill Green', fromCode: 'A1', toCode: 'A2', date: '2025-03-01', reason: 'Consistent biweekly ordering established', repId: 'rep-jake', repName: 'Jake Morrison', direction: 'advance' },
];

// --- Movement Chart Data (last 12 weeks) ---

export const movementChartData: MovementChartData[] = [
  { week: 'Dec 9', advances: 3, declines: 0 },
  { week: 'Dec 16', advances: 2, declines: 1 },
  { week: 'Dec 23', advances: 1, declines: 0 },
  { week: 'Dec 30', advances: 0, declines: 0 },
  { week: 'Jan 6', advances: 2, declines: 1 },
  { week: 'Jan 13', advances: 3, declines: 0 },
  { week: 'Jan 20', advances: 1, declines: 1 },
  { week: 'Jan 27', advances: 2, declines: 0 },
  { week: 'Feb 3', advances: 1, declines: 1 },
  { week: 'Feb 10', advances: 2, declines: 0 },
  { week: 'Feb 17', advances: 3, declines: 1 },
  { week: 'Feb 24', advances: 2, declines: 0 },
];

// --- Helper Functions ---

export function getPipelineMovements(months?: number): PipelineMovement[] {
  if (!months) return [...pipelineMovements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return pipelineMovements
    .filter((m) => new Date(m.date) >= cutoff)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPipelineVelocityMetrics(): PipelineVelocityMetric[] {
  return [
    { label: 'Avg Days I1→I5', value: '45 days', trend: { value: 12, direction: 'down' }, description: 'Time from cold lead to first order' },
    { label: 'Avg Days I5→A2', value: '38 days', trend: { value: 5, direction: 'up' }, description: 'Time from first order to established cadence' },
    { label: 'Avg Days A2→A5', value: '180 days', trend: { value: 8, direction: 'down' }, description: 'Time from established to strategic partner' },
    { label: 'Recovery Rate', value: '67%', trend: { value: 15, direction: 'up' }, description: 'Accounts returning to active from recovery' },
    { label: 'Churn Rate', value: '8%', trend: { value: 3, direction: 'down' }, description: 'Active accounts entering recovery per quarter' },
  ];
}

export function getRepPipelineStats(repId?: string): RepPipelineStats[] {
  const reps = repId ? salesReps.filter((r) => r.id === repId) : salesReps.filter((r) => r.id !== 'rep-dana');

  return reps.map((rep) => {
    const repAccounts = accounts.filter((a) => a.assignedRepId === rep.id);
    const activeAccts = repAccounts.filter((a) => a.pipelineStatus === 'active');
    const inactiveAccts = repAccounts.filter((a) => a.pipelineStatus === 'inactive');
    const recoveryAccts = repAccounts.filter((a) => a.pipelineStatus === 'recovery');

    const repMovements = pipelineMovements.filter((m) => {
      const d = new Date(m.date);
      const now = new Date('2026-03-07');
      return m.repId === rep.id && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const topProspect = inactiveAccts
      .filter((a) => a.pipelinePhase >= 3)
      .sort((a, b) => b.pipelinePhase - a.pipelinePhase)[0];

    const topAtRisk = recoveryAccts
      .sort((a, b) => b.totalRevenue - a.totalRevenue)[0];

    return {
      repId: rep.id,
      repName: rep.name,
      avatarUrl: rep.avatarUrl,
      totalAccounts: repAccounts.length,
      activeCount: activeAccts.length,
      inactiveCount: inactiveAccts.length,
      recoveryCount: recoveryAccts.length,
      advancesThisMonth: repMovements.filter((m) => m.direction === 'advance').length,
      declinesThisMonth: repMovements.filter((m) => m.direction === 'decline').length,
      ...(topProspect ? { topProspect: { name: topProspect.name, revenue: topProspect.totalRevenue || 15000 } } : {}),
      ...(topAtRisk ? { topAtRisk: { name: topAtRisk.name, revenue: topAtRisk.thirtyDayRevenue } } : {}),
    };
  });
}

export function getMovementChartData(): MovementChartData[] {
  return movementChartData;
}
