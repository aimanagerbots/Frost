import type { Segment, SegmentCriterion, SegmentPreview } from '@/modules/crm/types';
import { accounts } from './crm';

// --- Pre-built Segments ---

const prebuiltSegments: Segment[] = [
  {
    id: 'seg-1',
    name: 'Top 20 by Revenue',
    description: 'Highest-revenue accounts by 30-day sales',
    criteria: [{ field: 'thirtyDayRevenue', operator: 'greater_than', value: 15000, label: '30-day revenue > $15,000' }],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: true,
  },
  {
    id: 'seg-2',
    name: 'At-Risk Accounts',
    description: 'Accounts with health score below 60 needing intervention',
    criteria: [{ field: 'healthScore', operator: 'less_than', value: 60, label: 'Health score < 60' }],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: true,
  },
  {
    id: 'seg-3',
    name: 'Overdue Payments',
    description: 'Accounts with poor payment reliability',
    criteria: [{ field: 'paymentReliability', operator: 'in', value: ['poor'], label: 'Payment reliability is poor' }],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: true,
  },
  {
    id: 'seg-4',
    name: 'VMI Enrolled',
    description: 'Accounts currently enrolled in Vendor Managed Inventory',
    criteria: [{ field: 'vmiEnrolled', operator: 'equals', value: 'true', label: 'VMI enrolled = Yes' }],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: true,
  },
  {
    id: 'seg-5',
    name: 'New Accounts (Last 90 Days)',
    description: 'Recently onboarded accounts in the prospect or early stage',
    criteria: [{ field: 'status', operator: 'in', value: ['prospect'], label: 'Status is prospect' }],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: true,
  },
  {
    id: 'seg-6',
    name: 'Inactive (No Order 30+ Days)',
    description: 'Accounts with no orders in the past 30 days',
    criteria: [{ field: 'thirtyDayRevenue', operator: 'equals', value: 0, label: '30-day revenue = $0' }],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: true,
  },
  {
    id: 'seg-7',
    name: 'Single-Category Buyers',
    description: 'Accounts purchasing from only one product category',
    criteria: [{ field: 'categoryCount', operator: 'equals', value: 1, label: 'Category count = 1' }],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: true,
  },
];

// --- Custom Segments ---

const customSegments: Segment[] = [
  {
    id: 'seg-8',
    name: 'Seattle Premium Buyers',
    description: 'High-revenue accounts in the Seattle region',
    criteria: [
      { field: 'region', operator: 'equals', value: 'Seattle Metro', label: 'Region = Seattle Metro' },
      { field: 'thirtyDayRevenue', operator: 'greater_than', value: 10000, label: '30-day revenue > $10,000' },
    ],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: false,
  },
  {
    id: 'seg-9',
    name: 'Vape-Heavy Accounts',
    description: 'Accounts where vaporizer makes up over 25% of category mix',
    criteria: [{ field: 'categoryMix.vaporizer', operator: 'greater_than', value: 25, label: 'Vaporizer mix > 25%' }],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2026-02-05T09:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: false,
  },
  {
    id: 'seg-10',
    name: 'Expansion Targets',
    description: 'Healthy accounts with limited category adoption — room to grow',
    criteria: [
      { field: 'categoryCount', operator: 'less_than', value: 3, label: 'Category count < 3' },
      { field: 'healthScore', operator: 'greater_than', value: 60, label: 'Health score > 60' },
    ],
    accountCount: 0,
    totalRevenue: 0,
    createdAt: '2026-02-12T11:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPrebuilt: false,
  },
];

// --- Filtering Logic ---

function matchesCriterion(account: typeof accounts[0], criterion: SegmentCriterion): boolean {
  const { field, operator, value } = criterion;

  // Special computed fields
  if (field === 'categoryCount') {
    const count = account.categoryMix.length;
    if (operator === 'equals') return count === Number(value);
    if (operator === 'less_than') return count < Number(value);
    if (operator === 'greater_than') return count > Number(value);
    return false;
  }

  if (field.startsWith('categoryMix.')) {
    const category = field.split('.')[1];
    const entry = account.categoryMix.find((c) => c.category.toLowerCase() === category.toLowerCase());
    const pct = entry?.percentage ?? 0;
    if (operator === 'greater_than') return pct > Number(value);
    if (operator === 'less_than') return pct < Number(value);
    return false;
  }

  // Direct account fields
  const fieldValue = account[field as keyof typeof account];

  switch (operator) {
    case 'equals':
      return String(fieldValue) === String(value);
    case 'not_equals':
      return String(fieldValue) !== String(value);
    case 'greater_than':
      return Number(fieldValue) > Number(value);
    case 'less_than':
      return Number(fieldValue) < Number(value);
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    case 'in':
      return Array.isArray(value) && value.includes(String(fieldValue));
    case 'not_in':
      return Array.isArray(value) && !value.includes(String(fieldValue));
    default:
      return false;
  }
}

function filterAccounts(criteria: SegmentCriterion[]) {
  return accounts.filter((account) => criteria.every((c) => matchesCriterion(account, c)));
}

function hydrateSegment(segment: Segment): Segment {
  const matching = filterAccounts(segment.criteria);
  return {
    ...segment,
    accountCount: matching.length,
    totalRevenue: matching.reduce((sum, a) => sum + a.thirtyDayRevenue, 0),
  };
}

// --- Exports ---

export function getSegments(): Segment[] {
  return [...prebuiltSegments, ...customSegments].map(hydrateSegment);
}

export function getSegmentPreview(criteria: SegmentCriterion[]): SegmentPreview {
  const matching = filterAccounts(criteria);
  return {
    accounts: matching.map((a) => ({
      id: a.id,
      name: a.name,
      health: a.healthScore,
      revenue30d: a.thirtyDayRevenue,
      city: a.address.city,
    })),
    totalCount: matching.length,
    totalRevenue: matching.reduce((sum, a) => sum + a.thirtyDayRevenue, 0),
  };
}

export function filterAccountsByCriteria(criteria: SegmentCriterion[]) {
  return filterAccounts(criteria);
}
