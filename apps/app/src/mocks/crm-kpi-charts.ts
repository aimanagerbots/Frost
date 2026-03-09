import { accounts } from './crm';

// --- Reorder Cadence ---
export interface ReorderCadenceBucket {
  label: string;
  count: number;
  color: string;
}

export function getReorderCadenceData(): ReorderCadenceBucket[] {
  const now = new Date('2026-03-07');
  const buckets = [
    { label: '0-7d', min: 0, max: 7, color: '#22C55E' },
    { label: '8-14d', min: 8, max: 14, color: '#84CC16' },
    { label: '15-21d', min: 15, max: 21, color: '#FBBF24' },
    { label: '22-30d', min: 22, max: 30, color: '#F97316' },
    { label: '30d+', min: 31, max: 9999, color: '#EF4444' },
  ];

  return buckets.map(({ label, min, max, color }) => ({
    label,
    color,
    count: accounts.filter((a) => {
      if (!a.lastOrderDate) return max === 9999;
      const diff = Math.floor((now.getTime() - new Date(a.lastOrderDate).getTime()) / 86400000);
      return diff >= min && diff <= max;
    }).length,
  }));
}

// --- Category Coverage ---
export interface CategoryCoverageRow {
  accountName: string;
  accountId: string;
  categories: Record<string, number>;
}

const CATEGORIES = ['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'];

export function getCategoryCoverageData(): CategoryCoverageRow[] {
  return [...accounts]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 12)
    .map((a) => {
      const cats: Record<string, number> = {};
      for (const c of CATEGORIES) {
        const mix = a.categoryMix.find((m) => m.category === c);
        cats[c] = mix ? Math.round((mix.percentage / 100) * a.thirtyDayRevenue) : 0;
      }
      return { accountName: a.name, accountId: a.id, categories: cats };
    });
}

// --- Revenue Concentration ---
export interface RevenueConcentrationSlice {
  name: string;
  value: number;
  color: string;
}

export function getRevenueConcentrationData(): RevenueConcentrationSlice[] {
  const sorted = [...accounts].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const top5 = sorted.slice(0, 5);
  const next5 = sorted.slice(5, 10);
  const rest = sorted.slice(10);

  const colors = ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7', '#94A3B8', '#64748B'];

  const slices: RevenueConcentrationSlice[] = [
    ...top5.map((a, i) => ({ name: a.name, value: a.totalRevenue, color: colors[i] })),
    { name: 'Next 5', value: next5.reduce((s, a) => s + a.totalRevenue, 0), color: colors[5] },
  ];

  if (rest.length > 0) {
    slices.push({
      name: `Remaining ${rest.length}`,
      value: rest.reduce((s, a) => s + a.totalRevenue, 0),
      color: colors[6],
    });
  }

  return slices;
}

// --- Payment Compliance ---
export interface PaymentComplianceCounts {
  green: number;
  amber: number;
  red: number;
}

export function getPaymentComplianceData(): PaymentComplianceCounts {
  return {
    green: accounts.filter((a) => a.paymentReliability === 'excellent' || a.paymentReliability === 'good').length,
    amber: accounts.filter((a) => a.paymentReliability === 'fair').length,
    red: accounts.filter((a) => a.paymentReliability === 'poor').length,
  };
}

// --- Interaction-Order Overlay (for Account Detail HealthTab) ---
export interface InteractionOrderPoint {
  date: string;
  orders: number;
  calls: number;
  emails: number;
  visits: number;
}

export function getInteractionOrderData(accountId: string): InteractionOrderPoint[] {
  // Generate 12 weeks of deterministic data based on account ID
  const seed = accountId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const weeks: InteractionOrderPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date('2026-03-07');
    d.setDate(d.getDate() - i * 7);
    const weekSeed = seed + i;
    weeks.push({
      date: d.toISOString().slice(0, 10),
      orders: (weekSeed % 3),
      calls: (weekSeed % 4) + (i % 2),
      emails: ((weekSeed * 3) % 5) + 1,
      visits: i % 3 === 0 ? 1 : 0,
    });
  }
  return weeks;
}
