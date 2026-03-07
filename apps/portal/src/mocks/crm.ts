import type {
  Account,
  Contact,
  Interaction,
  Opportunity,
  SalesRep,
  CRMDashboardMetrics,
  BriefingItem,
  RevenueByCategoryWeek,
  HealthDistribution,
  OrderVolume,
  TopAccount,
  ActivityItem,
  CRMDashboardData,
  KPIMetric,
  PipelineDistribution,
  RecoveryFunnel,
  PipelineStatus,
  PipelinePhase,
  PipelineTransition,
  PipelineInfo,
} from '@/modules/crm/types';
import { PIPELINE_PHASE_LABELS } from '@/modules/crm/types';

// --- Sales Reps ---

export const salesReps: SalesRep[] = [
  {
    id: 'rep-jake',
    name: 'Jake Morrison',
    email: 'jake.morrison@frost.io',
    territory: 'Seattle Metro',
    avatarUrl: null,
    revenue: 284500,
    accountCount: 12,
    activeOpportunities: 5,
  },
  {
    id: 'rep-priya',
    name: 'Priya Patel',
    email: 'priya.patel@frost.io',
    territory: 'Eastside & Tacoma',
    avatarUrl: null,
    revenue: 198200,
    accountCount: 9,
    activeOpportunities: 3,
  },
  {
    id: 'rep-carlos',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@frost.io',
    territory: 'Spokane & Eastern WA',
    avatarUrl: null,
    revenue: 87600,
    accountCount: 7,
    activeOpportunities: 4,
  },
  {
    id: 'rep-dana',
    name: 'Dana Whitfield',
    email: 'dana.whitfield@frost.io',
    territory: 'All — Manager',
    avatarUrl: null,
    revenue: 0,
    accountCount: 0,
    activeOpportunities: 0,
  },
];

function makePipelineInfo(
  status: PipelineStatus, phase: PipelinePhase,
  enteredDate: string, repId: string,
  previousCode?: string, previousDate?: string,
  nextReviewDate?: string, notes?: string,
): PipelineInfo {
  const prefix = status === 'active' ? 'A' : status === 'inactive' ? 'I' : 'R';
  return {
    status, phase,
    code: `${prefix}${phase}`,
    name: PIPELINE_PHASE_LABELS[status][phase],
    enteredDate, assignedRep: repId,
    ...(previousCode ? { previousCode, previousDate } : {}),
    ...(nextReviewDate ? { nextReviewDate } : {}),
    ...(notes ? { notes } : {}),
  };
}

// --- Named Account Personas ---

const greenfieldContacts: Contact[] = [
  {
    id: 'contact-sarah-chen',
    name: 'Sarah Chen',
    role: 'buyer',
    phone: '(206) 555-0142',
    email: 'sarah@greenfielddispensary.com',
    preferredChannel: 'email',
    isPrimary: true,
  },
  {
    id: 'contact-mike-rodriguez',
    name: 'Mike Rodriguez',
    role: 'owner',
    phone: '(206) 555-0198',
    email: 'mike@greenfielddispensary.com',
    preferredChannel: 'phone',
    isPrimary: false,
  },
];

const greenfield: Account = {
  id: 'acct-greenfield',
  name: 'Greenfield Dispensary',
  dba: 'Greenfield Cannabis Co.',
  licenseNumber: 'WA-CCB-420891',
  licenseExpiration: '2027-03-15',
  address: { street: '1847 Pike St', city: 'Seattle', state: 'WA', zip: '98101', lat: 47.6142, lng: -122.3284 },
  region: 'Seattle Metro',
  assignedRepId: 'rep-jake',
  healthScore: 92,
  healthTrend: 'improving',
  vmiEnrolled: true,
  status: 'active',
  segments: ['premium', 'high-volume', 'vmi'],
  createdAt: '2024-06-10',
  lastOrderDate: '2026-03-04',
  totalRevenue: 487200,
  thirtyDayRevenue: 42800,
  avgOrderValue: 3580,
  orderCount: 136,
  pipelineStatus: 'active',
  pipelinePhase: 3,
  pipelineHistory: [
    { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2024-09-15', trigger: '3rd consecutive order placed' },
    { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-03-01', trigger: 'Consistent ordering for 6 months' },
  ],
  pipeline: { status: 'active', phase: 3 as 1 | 2 | 3 | 4 | 5, code: 'P3-EST', name: 'Established', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'excellent',
  preferredPaymentMethod: 'ach',
  deliveryPreferences: { window: 'Tue/Thu 8am-12pm', instructions: 'Loading dock in rear, ring bell', contactName: 'Sarah Chen', contactPhone: '(206) 555-0142' },
  categoryMix: [
    { category: 'flower', percentage: 35, revenue: 170520 },
    { category: 'preroll', percentage: 20, revenue: 97440 },
    { category: 'vaporizer', percentage: 18, revenue: 87696 },
    { category: 'concentrate', percentage: 12, revenue: 58464 },
    { category: 'edible', percentage: 10, revenue: 48720 },
    { category: 'beverage', percentage: 5, revenue: 24360 },
  ],
  contacts: greenfieldContacts,
};

const pacificLeaf: Account = {
  id: 'acct-pacific-leaf',
  name: 'Pacific Leaf',
  dba: 'Pacific Leaf Tacoma LLC',
  licenseNumber: 'WA-CCB-420456',
  licenseExpiration: '2026-11-20',
  address: { street: '3201 Pacific Ave', city: 'Tacoma', state: 'WA', zip: '98402', lat: 47.2529, lng: -122.4443 },
  region: 'Tacoma',
  assignedRepId: 'rep-priya',
  healthScore: 58,
  healthTrend: 'declining',
  vmiEnrolled: false,
  status: 'at-risk',
  segments: ['mid-tier'],
  createdAt: '2024-09-15',
  lastOrderDate: '2026-02-22',
  totalRevenue: 142800,
  thirtyDayRevenue: 8200,
  avgOrderValue: 1890,
  orderCount: 76,
  pipelineStatus: 'active',
  pipelinePhase: 4,
  pipelineHistory: [
    { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-01-10', trigger: '5th order placed within 60 days' },
    { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-07-15', trigger: 'Stable ordering pattern for 6 months' },
    { from: { status: 'active', phase: 3 }, to: { status: 'active', phase: 4 }, date: '2026-01-20', trigger: 'Order frequency declined 30% over 60 days' },
  ],
  pipeline: { status: 'active', phase: 4 as 1 | 2 | 3 | 4 | 5, code: 'P4-STR', name: 'Strategic', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'fair',
  preferredPaymentMethod: 'cod',
  deliveryPreferences: { window: 'Mon/Wed 10am-2pm', instructions: 'Front entrance, ask for David', contactName: 'David Kim', contactPhone: '(253) 555-0267' },
  categoryMix: [
    { category: 'flower', percentage: 45, revenue: 64260 },
    { category: 'preroll', percentage: 25, revenue: 35700 },
    { category: 'vaporizer', percentage: 10, revenue: 14280 },
    { category: 'edible', percentage: 15, revenue: 21420 },
    { category: 'concentrate', percentage: 5, revenue: 7140 },
    { category: 'beverage', percentage: 0, revenue: 0 },
  ],
  contacts: [
    { id: 'contact-david-kim', name: 'David Kim', role: 'buyer', phone: '(253) 555-0267', email: 'david@pacificleaf.com', preferredChannel: 'sms', isPrimary: true },
  ],
};

const emeraldCity: Account = {
  id: 'acct-emerald-city',
  name: 'Emerald City Cannabis',
  dba: 'ECC Holdings',
  licenseNumber: 'WA-CCB-420223',
  licenseExpiration: '2026-08-01',
  address: { street: '722 Rainier Ave S', city: 'Seattle', state: 'WA', zip: '98144', lat: 47.5958, lng: -122.3131 },
  region: 'Seattle Metro',
  assignedRepId: 'rep-jake',
  healthScore: 28,
  healthTrend: 'declining',
  vmiEnrolled: false,
  status: 'churning',
  segments: ['at-risk'],
  createdAt: '2024-04-20',
  lastOrderDate: '2026-01-19',
  totalRevenue: 96400,
  thirtyDayRevenue: 0,
  avgOrderValue: 2010,
  orderCount: 48,
  pipelineStatus: 'inactive',
  pipelinePhase: 1,
  pipelineHistory: [
    { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-04-01', trigger: 'Regular ordering cadence established' },
    { from: { status: 'active', phase: 3 }, to: { status: 'active', phase: 4 }, date: '2025-10-15', trigger: 'Order frequency dropped 40%' },
    { from: { status: 'active', phase: 4 }, to: { status: 'inactive', phase: 1 }, date: '2026-02-01', trigger: 'No orders in 45 days' },
  ],
  pipeline: { status: 'inactive', phase: 1 as 1 | 2 | 3 | 4 | 5, code: 'P1-ONB', name: 'Onboarding', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'poor',
  preferredPaymentMethod: 'cod',
  deliveryPreferences: { window: 'Any weekday 9am-5pm', instructions: 'Side door, buzzer #3', contactName: 'Amanda Torres', contactPhone: '(206) 555-0389' },
  categoryMix: [
    { category: 'flower', percentage: 55, revenue: 53020 },
    { category: 'preroll', percentage: 30, revenue: 28920 },
    { category: 'edible', percentage: 15, revenue: 14460 },
    { category: 'vaporizer', percentage: 0, revenue: 0 },
    { category: 'concentrate', percentage: 0, revenue: 0 },
    { category: 'beverage', percentage: 0, revenue: 0 },
  ],
  contacts: [
    { id: 'contact-amanda-torres', name: 'Amanda Torres', role: 'buyer', phone: '(206) 555-0389', email: 'amanda@emeraldcitycannabis.com', preferredChannel: 'phone', isPrimary: true },
  ],
};

const cascadeWellness: Account = {
  id: 'acct-cascade',
  name: 'Cascade Wellness',
  dba: 'Cascade Wellness Dispensary',
  licenseNumber: 'WA-CCB-421102',
  licenseExpiration: '2027-06-30',
  address: { street: '1505 N Division St', city: 'Spokane', state: 'WA', zip: '99202', lat: 47.6688, lng: -117.4107 },
  region: 'Spokane',
  assignedRepId: 'rep-carlos',
  healthScore: 70,
  healthTrend: 'improving',
  vmiEnrolled: false,
  status: 'prospect',
  segments: ['new-account', 'flower-focused'],
  createdAt: '2026-01-08',
  lastOrderDate: '2026-02-28',
  totalRevenue: 6800,
  thirtyDayRevenue: 3400,
  avgOrderValue: 3400,
  orderCount: 2,
  pipelineStatus: 'active',
  pipelinePhase: 1,
  pipelineHistory: [
    { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 1 }, date: '2026-01-08', trigger: 'Account created — onboarding started' },
  ],
  pipeline: { status: 'active', phase: 1 as 1 | 2 | 3 | 4 | 5, code: 'P1-ONB', name: 'Onboarding', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'good',
  preferredPaymentMethod: 'cod',
  deliveryPreferences: { window: 'Fri 10am-2pm', instructions: 'Main entrance', contactName: 'Tom Wheeler', contactPhone: '(509) 555-0145' },
  categoryMix: [
    { category: 'flower', percentage: 100, revenue: 6800 },
    { category: 'preroll', percentage: 0, revenue: 0 },
    { category: 'vaporizer', percentage: 0, revenue: 0 },
    { category: 'concentrate', percentage: 0, revenue: 0 },
    { category: 'edible', percentage: 0, revenue: 0 },
    { category: 'beverage', percentage: 0, revenue: 0 },
  ],
  contacts: [
    { id: 'contact-tom-wheeler', name: 'Tom Wheeler', role: 'buyer', phone: '(509) 555-0145', email: 'tom@cascadewellness.com', preferredChannel: 'email', isPrimary: true },
  ],
};

const pugetSound: Account = {
  id: 'acct-puget-sound',
  name: 'Puget Sound Provisions',
  dba: 'PSP Cannabis LLC',
  licenseNumber: 'WA-CCB-420667',
  licenseExpiration: '2027-01-15',
  address: { street: '410 Capitol Way S', city: 'Olympia', state: 'WA', zip: '98501', lat: 47.0379, lng: -122.9007 },
  region: 'Olympia',
  assignedRepId: 'rep-priya',
  healthScore: 85,
  healthTrend: 'stable',
  vmiEnrolled: false,
  status: 'active',
  segments: ['premium', 'boutique'],
  createdAt: '2024-11-01',
  lastOrderDate: '2026-03-03',
  totalRevenue: 78400,
  thirtyDayRevenue: 6200,
  avgOrderValue: 4100,
  orderCount: 19,
  pipelineStatus: 'active',
  pipelinePhase: 3,
  pipelineHistory: [
    { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-02-01', trigger: 'Consistent monthly orders established' },
    { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-08-15', trigger: 'Stable AOV and order cadence for 6 months' },
  ],
  pipeline: { status: 'active', phase: 3 as 1 | 2 | 3 | 4 | 5, code: 'P3-EST', name: 'Established', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'excellent',
  preferredPaymentMethod: 'ach',
  deliveryPreferences: { window: 'Wed 9am-12pm', instructions: 'Premium entrance, ask for Lisa', contactName: 'Lisa Park', contactPhone: '(360) 555-0221' },
  categoryMix: [
    { category: 'flower', percentage: 40, revenue: 31360 },
    { category: 'concentrate', percentage: 25, revenue: 19600 },
    { category: 'edible', percentage: 20, revenue: 15680 },
    { category: 'vaporizer', percentage: 10, revenue: 7840 },
    { category: 'preroll', percentage: 5, revenue: 3920 },
    { category: 'beverage', percentage: 0, revenue: 0 },
  ],
  contacts: [
    { id: 'contact-lisa-park', name: 'Lisa Park', role: 'buyer', phone: '(360) 555-0221', email: 'lisa@pugetsoundprovisions.com', preferredChannel: 'email', isPrimary: true },
  ],
};

const summitCannabis: Account = {
  id: 'acct-summit',
  name: 'Summit Cannabis Co.',
  dba: 'Summit Cannabis LLC',
  licenseNumber: 'WA-CCB-420780',
  licenseExpiration: '2027-04-10',
  address: { street: '1204 Cornwall Ave', city: 'Bellingham', state: 'WA', zip: '98225', lat: 48.7516, lng: -122.4783 },
  region: 'NW Washington',
  assignedRepId: 'rep-jake',
  healthScore: 75,
  healthTrend: 'stable',
  vmiEnrolled: true,
  status: 'active',
  segments: ['mid-tier', 'vmi'],
  createdAt: '2025-04-15',
  lastOrderDate: '2026-03-02',
  totalRevenue: 168400,
  thirtyDayRevenue: 14200,
  avgOrderValue: 2800,
  orderCount: 60,
  pipelineStatus: 'active',
  pipelinePhase: 3,
  pipelineHistory: [
    { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-07-01', trigger: 'VMI enrolled, order cadence accelerated' },
    { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-12-15', trigger: 'Reliable biweekly ordering for 5 months' },
  ],
  pipeline: { status: 'active', phase: 3 as 1 | 2 | 3 | 4 | 5, code: 'P3-EST', name: 'Established', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'excellent',
  preferredPaymentMethod: 'ach',
  deliveryPreferences: { window: 'Mon/Thu 9am-1pm', instructions: 'Rear loading bay, call on arrival', contactName: 'Grant Holloway', contactPhone: '(360) 555-0440' },
  categoryMix: [
    { category: 'flower', percentage: 45, revenue: 75780 },
    { category: 'concentrate', percentage: 30, revenue: 50520 },
    { category: 'preroll', percentage: 10, revenue: 16840 },
    { category: 'edible', percentage: 8, revenue: 13472 },
    { category: 'vaporizer', percentage: 5, revenue: 8420 },
    { category: 'beverage', percentage: 2, revenue: 3368 },
  ],
  contacts: [
    { id: 'contact-grant-holloway', name: 'Grant Holloway', role: 'owner', phone: '(360) 555-0440', email: 'grant@summitcannabis.com', preferredChannel: 'email', isPrimary: true },
    { id: 'contact-beth-simon', name: 'Beth Simon', role: 'buyer', phone: '(360) 555-0441', email: 'beth@summitcannabis.com', preferredChannel: 'email', isPrimary: false },
  ],
};

const rainierRemedies: Account = {
  id: 'acct-rainier',
  name: 'Rainier Remedies',
  dba: 'Rainier Remedies Inc',
  licenseNumber: 'WA-CCB-420512',
  licenseExpiration: '2026-09-30',
  address: { street: '4510 S Tacoma Way', city: 'Tacoma', state: 'WA', zip: '98409', lat: 47.2182, lng: -122.4735 },
  region: 'Tacoma',
  assignedRepId: 'rep-priya',
  healthScore: 45,
  healthTrend: 'declining',
  vmiEnrolled: false,
  status: 'at-risk',
  segments: ['at-risk', 'payment-issues'],
  createdAt: '2024-08-01',
  lastOrderDate: '2026-02-10',
  totalRevenue: 112600,
  thirtyDayRevenue: 0,
  avgOrderValue: 2100,
  orderCount: 54,
  pipelineStatus: 'active',
  pipelinePhase: 5,
  pipelineHistory: [
    { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-03-01', trigger: 'Steady ordering pattern established' },
    { from: { status: 'active', phase: 3 }, to: { status: 'active', phase: 4 }, date: '2025-11-01', trigger: 'Payment delays and declining order volume' },
    { from: { status: 'active', phase: 4 }, to: { status: 'active', phase: 5 }, date: '2026-02-15', trigger: 'Two overdue invoices, no orders in 24 days' },
  ],
  pipeline: { status: 'active', phase: 5 as 1 | 2 | 3 | 4 | 5, code: 'P5-PTR', name: 'Partner', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'poor',
  preferredPaymentMethod: 'cod',
  deliveryPreferences: { window: 'Tue/Fri 10am-3pm', instructions: 'Main entrance, ask for front desk', contactName: 'Victor Almeida', contactPhone: '(253) 555-0520' },
  categoryMix: [
    { category: 'flower', percentage: 35, revenue: 39410 },
    { category: 'preroll', percentage: 20, revenue: 22520 },
    { category: 'edible', percentage: 18, revenue: 20268 },
    { category: 'vaporizer', percentage: 12, revenue: 13512 },
    { category: 'concentrate', percentage: 10, revenue: 11260 },
    { category: 'beverage', percentage: 5, revenue: 5630 },
  ],
  contacts: [
    { id: 'contact-victor-almeida', name: 'Victor Almeida', role: 'owner', phone: '(253) 555-0520', email: 'victor@rainierremedies.com', preferredChannel: 'phone', isPrimary: true },
    { id: 'contact-jenny-wu', name: 'Jenny Wu', role: 'buyer', phone: '(253) 555-0521', email: 'jenny@rainierremedies.com', preferredChannel: 'sms', isPrimary: false },
  ],
};

const olympicGreens: Account = {
  id: 'acct-olympic',
  name: 'Olympic Greens',
  dba: 'Olympic Greens Dispensary LLC',
  licenseNumber: 'WA-CCB-420634',
  licenseExpiration: '2027-02-28',
  address: { street: '815 4th Ave E', city: 'Olympia', state: 'WA', zip: '98501', lat: 47.0453, lng: -122.8932 },
  region: 'Olympia',
  assignedRepId: 'rep-priya',
  healthScore: 82,
  healthTrend: 'stable',
  vmiEnrolled: false,
  status: 'active',
  segments: ['preroll-heavy', 'reliable'],
  createdAt: '2024-10-20',
  lastOrderDate: '2026-03-04',
  totalRevenue: 194200,
  thirtyDayRevenue: 18600,
  avgOrderValue: 2700,
  orderCount: 72,
  pipelineStatus: 'active',
  pipelinePhase: 2,
  pipelineHistory: [
    { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-04-01', trigger: 'Weekly preroll restock cadence established' },
  ],
  pipeline: { status: 'active', phase: 2 as 1 | 2 | 3 | 4 | 5, code: 'P2-GRW', name: 'Growing', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'excellent',
  preferredPaymentMethod: 'ach',
  deliveryPreferences: { window: 'Wed/Fri 8am-12pm', instructions: 'Side entrance on 4th Ave, buzzer code 2247', contactName: 'Dana Reyes', contactPhone: '(360) 555-0634' },
  categoryMix: [
    { category: 'preroll', percentage: 60, revenue: 116520 },
    { category: 'flower', percentage: 25, revenue: 48550 },
    { category: 'edible', percentage: 8, revenue: 15536 },
    { category: 'vaporizer', percentage: 4, revenue: 7768 },
    { category: 'concentrate', percentage: 2, revenue: 3884 },
    { category: 'beverage', percentage: 1, revenue: 1942 },
  ],
  contacts: [
    { id: 'contact-dana-reyes', name: 'Dana Reyes', role: 'buyer', phone: '(360) 555-0634', email: 'dana@olympicgreens.com', preferredChannel: 'email', isPrimary: true },
  ],
};

const spokaneValley: Account = {
  id: 'acct-spokane-valley',
  name: 'Spokane Valley Dispensary',
  dba: 'SVD Cannabis Inc',
  licenseNumber: 'WA-CCB-421045',
  licenseExpiration: '2027-05-15',
  address: { street: '12014 E Sprague Ave', city: 'Spokane Valley', state: 'WA', zip: '99206', lat: 47.6535, lng: -117.3533 },
  region: 'Spokane',
  assignedRepId: 'rep-carlos',
  healthScore: 65,
  healthTrend: 'stable',
  vmiEnrolled: false,
  status: 'active',
  segments: ['mid-tier'],
  createdAt: '2025-02-10',
  lastOrderDate: '2026-02-25',
  totalRevenue: 48600,
  thirtyDayRevenue: 4200,
  avgOrderValue: 1620,
  orderCount: 30,
  pipelineStatus: 'active',
  pipelinePhase: 2,
  pipelineHistory: [
    { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-08-01', trigger: 'Monthly ordering cadence established after 6 months' },
  ],
  pipeline: { status: 'active', phase: 2 as 1 | 2 | 3 | 4 | 5, code: 'P2-GRW', name: 'Growing', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'good',
  preferredPaymentMethod: 'cod',
  deliveryPreferences: { window: 'Thu 10am-4pm', instructions: 'Front door, parking in rear lot', contactName: 'Paul Hernandez', contactPhone: '(509) 555-1045' },
  categoryMix: [
    { category: 'flower', percentage: 30, revenue: 14580 },
    { category: 'preroll', percentage: 20, revenue: 9720 },
    { category: 'vaporizer', percentage: 18, revenue: 8748 },
    { category: 'edible', percentage: 15, revenue: 7290 },
    { category: 'concentrate', percentage: 12, revenue: 5832 },
    { category: 'beverage', percentage: 5, revenue: 2430 },
  ],
  contacts: [
    { id: 'contact-paul-hernandez', name: 'Paul Hernandez', role: 'manager', phone: '(509) 555-1045', email: 'paul@spokanevalleydispensary.com', preferredChannel: 'phone', isPrimary: true },
  ],
};

const capitolHillCollective: Account = {
  id: 'acct-capitol-hill',
  name: 'Capitol Hill Collective',
  dba: 'CHC Cannabis LLC',
  licenseNumber: 'WA-CCB-420188',
  licenseExpiration: '2027-07-31',
  address: { street: '1532 Broadway E', city: 'Seattle', state: 'WA', zip: '98102', lat: 47.6148, lng: -122.3208 },
  region: 'Seattle Metro',
  assignedRepId: 'rep-jake',
  healthScore: 88,
  healthTrend: 'improving',
  vmiEnrolled: true,
  status: 'active',
  segments: ['premium', 'trend-setter', 'vmi'],
  createdAt: '2024-06-25',
  lastOrderDate: '2026-03-05',
  totalRevenue: 342800,
  thirtyDayRevenue: 32400,
  avgOrderValue: 3800,
  orderCount: 90,
  pipelineStatus: 'active',
  pipelinePhase: 2,
  pipelineHistory: [
    { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2024-12-01', trigger: 'Rapid growth — AOV increased 35%, VMI enrolled' },
  ],
  pipeline: { status: 'active', phase: 2 as 1 | 2 | 3 | 4 | 5, code: 'P2-GRW', name: 'Growing', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'excellent',
  preferredPaymentMethod: 'ach',
  deliveryPreferences: { window: 'Mon/Wed/Fri 7am-10am', instructions: 'Underground garage, bay 3, text on arrival', contactName: 'Naomi Chen', contactPhone: '(206) 555-0188' },
  categoryMix: [
    { category: 'concentrate', percentage: 35, revenue: 119980 },
    { category: 'vaporizer', percentage: 30, revenue: 102840 },
    { category: 'flower', percentage: 15, revenue: 51420 },
    { category: 'edible', percentage: 10, revenue: 34280 },
    { category: 'preroll', percentage: 5, revenue: 17140 },
    { category: 'beverage', percentage: 5, revenue: 17140 },
  ],
  contacts: [
    { id: 'contact-naomi-chen', name: 'Naomi Chen', role: 'owner', phone: '(206) 555-0188', email: 'naomi@capitolhillcollective.com', preferredChannel: 'email', isPrimary: true },
    { id: 'contact-alex-rivera', name: 'Alex Rivera', role: 'buyer', phone: '(206) 555-0189', email: 'alex@capitolhillcollective.com', preferredChannel: 'sms', isPrimary: false },
  ],
};

const harborCannabis: Account = {
  id: 'acct-harbor',
  name: 'Harbor Cannabis',
  dba: 'Harbor Cannabis Co',
  licenseNumber: 'WA-CCB-421200',
  licenseExpiration: '2027-08-20',
  address: { street: '302 E Wishkah St', city: 'Aberdeen', state: 'WA', zip: '98520', lat: 46.9754, lng: -123.8157 },
  region: 'Coastal WA',
  assignedRepId: 'rep-carlos',
  healthScore: 50,
  healthTrend: 'declining',
  vmiEnrolled: false,
  status: 'at-risk',
  segments: ['rural', 'flower-focused', 'at-risk'],
  createdAt: '2025-06-01',
  lastOrderDate: '2026-02-05',
  totalRevenue: 24800,
  thirtyDayRevenue: 0,
  avgOrderValue: 2480,
  orderCount: 10,
  pipelineStatus: 'recovery',
  pipelinePhase: 1,
  pipelineHistory: [
    { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 4 }, date: '2025-12-01', trigger: 'Order frequency dropped sharply after 3 months' },
    { from: { status: 'active', phase: 4 }, to: { status: 'inactive', phase: 1 }, date: '2026-01-15', trigger: 'No orders in 30 days' },
    { from: { status: 'inactive', phase: 1 }, to: { status: 'recovery', phase: 1 }, date: '2026-03-01', trigger: 'Rep outreach successful — Earl agreed to trial order' },
  ],
  pipeline: { status: 'recovery', phase: 1 as 1 | 2 | 3 | 4 | 5, code: 'P1-ONB', name: 'Onboarding', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'fair',
  preferredPaymentMethod: 'mail',
  deliveryPreferences: { window: 'Fri only, 11am-3pm', instructions: 'Highway 101 storefront, no loading dock — hand carry only', contactName: 'Earl Dawkins', contactPhone: '(360) 555-1200' },
  categoryMix: [
    { category: 'flower', percentage: 100, revenue: 24800 },
    { category: 'preroll', percentage: 0, revenue: 0 },
    { category: 'vaporizer', percentage: 0, revenue: 0 },
    { category: 'concentrate', percentage: 0, revenue: 0 },
    { category: 'edible', percentage: 0, revenue: 0 },
    { category: 'beverage', percentage: 0, revenue: 0 },
  ],
  contacts: [
    { id: 'contact-earl-dawkins', name: 'Earl Dawkins', role: 'owner', phone: '(360) 555-1200', email: 'earl@harborcannabis.com', preferredChannel: 'phone', isPrimary: true },
  ],
};

const evergreenWellness: Account = {
  id: 'acct-evergreen',
  name: 'Evergreen Wellness',
  dba: 'Evergreen Wellness Dispensary',
  licenseNumber: 'WA-CCB-421088',
  licenseExpiration: '2027-09-15',
  address: { street: '1890 Jadwin Ave', city: 'Richland', state: 'WA', zip: '99352', lat: 46.2856, lng: -119.2834 },
  region: 'Eastern WA',
  assignedRepId: 'rep-carlos',
  healthScore: 72,
  healthTrend: 'improving',
  vmiEnrolled: false,
  status: 'active',
  segments: ['growing', 'expanding-categories'],
  createdAt: '2025-09-01',
  lastOrderDate: '2026-03-01',
  totalRevenue: 52400,
  thirtyDayRevenue: 8600,
  avgOrderValue: 2180,
  orderCount: 24,
  pipelineStatus: 'recovery',
  pipelinePhase: 4,
  pipelineHistory: [
    { from: { status: 'active', phase: 2 }, to: { status: 'inactive', phase: 1 }, date: '2025-11-01', trigger: 'Orders stopped for 45 days' },
    { from: { status: 'inactive', phase: 1 }, to: { status: 'recovery', phase: 1 }, date: '2025-12-15', trigger: 'Carlos re-engaged Maria with edible expansion pitch' },
    { from: { status: 'recovery', phase: 1 }, to: { status: 'recovery', phase: 4 }, date: '2026-02-15', trigger: 'Consistent ordering resumed, category expansion underway' },
  ],
  pipeline: { status: 'recovery', phase: 4 as 1 | 2 | 3 | 4 | 5, code: 'P4-STR', name: 'Strategic', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
  paymentReliability: 'good',
  preferredPaymentMethod: 'cod',
  deliveryPreferences: { window: 'Tue/Thu 10am-2pm', instructions: 'Main entrance, ring buzzer', contactName: 'Maria Santos', contactPhone: '(509) 555-1088' },
  categoryMix: [
    { category: 'flower', percentage: 50, revenue: 26200 },
    { category: 'edible', percentage: 25, revenue: 13100 },
    { category: 'preroll', percentage: 15, revenue: 7860 },
    { category: 'vaporizer', percentage: 5, revenue: 2620 },
    { category: 'concentrate', percentage: 3, revenue: 1572 },
    { category: 'beverage', percentage: 2, revenue: 1048 },
  ],
  contacts: [
    { id: 'contact-maria-santos', name: 'Maria Santos', role: 'buyer', phone: '(509) 555-1088', email: 'maria@evergreenwellness.com', preferredChannel: 'email', isPrimary: true },
    { id: 'contact-raj-patel', name: 'Raj Patel', role: 'owner', phone: '(509) 555-1089', email: 'raj@evergreenwellness.com', preferredChannel: 'phone', isPrimary: false },
  ],
};

// --- Generated Accounts ---

function makeAccount(
  id: string, name: string, dba: string, license: string, street: string, city: string, zip: string,
  lat: number, lng: number, region: string, repId: string, health: number,
  trend: Account['healthTrend'], status: Account['status'], vmi: boolean,
  totalRev: number, thirtyRev: number, aov: number, orders: number,
  payment: Account['paymentReliability'], payMethod: Account['preferredPaymentMethod'],
  segments: string[], lastOrder: string | null, contactName: string, contactRole: Contact['role'],
  contactPhone: string, contactEmail: string, created: string,
  pipStatus: PipelineStatus, pipPhase: PipelinePhase, pipHistory: PipelineTransition[],
): Account {
  return {
    id, name, dba, licenseNumber: license,
    licenseExpiration: '2027-06-30',
    address: { street, city, state: 'WA', zip, lat, lng },
    region, assignedRepId: repId,
    healthScore: health, healthTrend: trend, vmiEnrolled: vmi, status, segments,
    createdAt: created, lastOrderDate: lastOrder,
    totalRevenue: totalRev, thirtyDayRevenue: thirtyRev, avgOrderValue: aov, orderCount: orders,
    pipelineStatus: pipStatus, pipelinePhase: pipPhase, pipelineHistory: pipHistory,
    pipeline: { status: 'active', phase: 1 as 1 | 2 | 3 | 4 | 5, code: 'P1-ONB', name: 'Onboarding', enteredDate: '2025-01-01', assignedRep: 'rep-jake' },
    paymentReliability: payment, preferredPaymentMethod: payMethod,
    deliveryPreferences: { window: 'Weekdays 9am-5pm', instructions: 'Front door', contactName, contactPhone },
    categoryMix: [
      { category: 'flower', percentage: 40, revenue: totalRev * 0.4 },
      { category: 'preroll', percentage: 20, revenue: totalRev * 0.2 },
      { category: 'vaporizer', percentage: 15, revenue: totalRev * 0.15 },
      { category: 'concentrate', percentage: 10, revenue: totalRev * 0.1 },
      { category: 'edible', percentage: 10, revenue: totalRev * 0.1 },
      { category: 'beverage', percentage: 5, revenue: totalRev * 0.05 },
    ],
    contacts: [
      { id: `contact-${id}`, name: contactName, role: contactRole, phone: contactPhone, email: contactEmail, preferredChannel: 'email', isPrimary: true },
    ],
  };
}

const generatedAccounts: Account[] = [
  makeAccount('acct-001', 'Ballard Buds', 'Ballard Buds LLC', 'WA-CCB-420301', '5412 Ballard Ave NW', 'Seattle', '98107', 47.6687, -122.3855, 'Seattle Metro', 'rep-jake', 88, 'stable', 'active', true, 312400, 28600, 3200, 98, 'excellent', 'ach', ['high-volume', 'vmi'], '2026-03-05', 'Jen Takahashi', 'buyer', '(206) 555-0301', 'jen@ballardbuds.com', '2024-07-15',
    'active', 3, [
      { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2024-11-01', trigger: 'Rapid order growth in first 4 months' },
      { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-05-15', trigger: 'Consistent high-volume ordering for 6 months' },
    ]),
  makeAccount('acct-002', 'Capitol Hill Green', 'CHG Cannabis Inc', 'WA-CCB-420302', '1020 E Pike St', 'Seattle', '98122', 47.6144, -122.3197, 'Seattle Metro', 'rep-jake', 76, 'stable', 'active', false, 186900, 16400, 2600, 72, 'good', 'cod', ['mid-tier'], '2026-03-01', 'Marcus Bell', 'buyer', '(206) 555-0302', 'marcus@capitolhillgreen.com', '2024-08-22',
    'active', 2, [
      { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-03-01', trigger: 'Consistent biweekly ordering established' },
    ]),
  makeAccount('acct-003', 'Fremont Flowers', 'Fremont Cannabis Co', 'WA-CCB-420303', '3501 Fremont Pl N', 'Seattle', '98103', 47.6512, -122.3506, 'Seattle Metro', 'rep-jake', 81, 'improving', 'active', false, 224600, 21000, 2950, 76, 'good', 'ach', ['premium'], '2026-03-02', 'Olivia Grant', 'buyer', '(206) 555-0303', 'olivia@fremontflowers.com', '2024-09-10',
    'active', 2, [
      { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-04-01', trigger: 'AOV increasing, category mix expanding' },
    ]),
  makeAccount('acct-004', 'Bellevue Botanicals', 'BB Wellness LLC', 'WA-CCB-420304', '890 Bellevue Way NE', 'Bellevue', '98004', 47.6153, -122.2026, 'Eastside', 'rep-priya', 91, 'stable', 'active', true, 267800, 24100, 3450, 78, 'excellent', 'ach', ['premium', 'vmi'], '2026-03-04', 'Rachel Nguyen', 'buyer', '(425) 555-0304', 'rachel@bellevuebotanicals.com', '2024-05-20',
    'active', 3, [
      { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2024-09-15', trigger: 'VMI enrolled, strong initial growth' },
      { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-04-01', trigger: 'Premium tier — stable high-value ordering' },
    ]),
  makeAccount('acct-005', 'Kirkland Kush', 'KK Enterprises', 'WA-CCB-420305', '12030 NE 85th St', 'Kirkland', '98033', 47.6808, -122.1965, 'Eastside', 'rep-priya', 64, 'declining', 'at-risk', false, 98700, 5600, 1800, 55, 'fair', 'cod', ['mid-tier', 'at-risk'], '2026-02-15', 'Steve Park', 'manager', '(425) 555-0305', 'steve@kirklandkush.com', '2025-01-10',
    'active', 4, [
      { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-08-01', trigger: 'Regular monthly ordering pattern' },
      { from: { status: 'active', phase: 3 }, to: { status: 'active', phase: 4 }, date: '2026-01-15', trigger: 'Order frequency declined 35% over 8 weeks' },
    ]),
  makeAccount('acct-006', 'Redmond Relief', 'Redmond Relief Dispensary', 'WA-CCB-420306', '16420 Redmond Way', 'Redmond', '98052', 47.6740, -122.1215, 'Eastside', 'rep-priya', 73, 'stable', 'active', false, 145600, 12800, 2100, 69, 'good', 'cod', ['mid-tier'], '2026-02-28', 'Karen Osei', 'buyer', '(425) 555-0306', 'karen@redmondrelief.com', '2024-11-05',
    'active', 3, [
      { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-03-15', trigger: 'Biweekly ordering cadence established' },
      { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-10-01', trigger: 'Consistent mid-tier ordering for 7 months' },
    ]),
  makeAccount('acct-007', 'Tacoma Treehouse', 'Treehouse Cannabis LLC', 'WA-CCB-420307', '2714 6th Ave', 'Tacoma', '98406', 47.2570, -122.4647, 'Tacoma', 'rep-priya', 69, 'stable', 'active', false, 118400, 10200, 2050, 58, 'good', 'cod', ['mid-tier'], '2026-03-01', 'Derek Johnson', 'buyer', '(253) 555-0307', 'derek@tacomaTreehouse.com', '2025-02-14',
    'recovery', 3, [
      { from: { status: 'active', phase: 3 }, to: { status: 'active', phase: 4 }, date: '2025-09-01', trigger: 'Order volume dropped after competitor opened nearby' },
      { from: { status: 'active', phase: 4 }, to: { status: 'inactive', phase: 1 }, date: '2025-11-15', trigger: 'No orders for 30 days' },
      { from: { status: 'inactive', phase: 1 }, to: { status: 'recovery', phase: 1 }, date: '2025-12-20', trigger: 'Win-back pricing accepted' },
      { from: { status: 'recovery', phase: 1 }, to: { status: 'recovery', phase: 3 }, date: '2026-02-01', trigger: 'Resumed biweekly ordering, volume stabilizing' },
    ]),
  makeAccount('acct-008', 'Olympia Organics', 'Olympia Organics Corp', 'WA-CCB-420308', '522 4th Ave E', 'Olympia', '98501', 47.0462, -122.8966, 'Olympia', 'rep-priya', 82, 'improving', 'active', false, 167200, 15800, 2800, 60, 'excellent', 'ach', ['premium', 'organic'], '2026-03-03', 'Megan Fox', 'owner', '(360) 555-0308', 'megan@olympiaorganics.com', '2024-10-01',
    'recovery', 5, [
      { from: { status: 'active', phase: 3 }, to: { status: 'inactive', phase: 1 }, date: '2025-04-01', trigger: 'Ownership transition — all orders paused' },
      { from: { status: 'inactive', phase: 1 }, to: { status: 'recovery', phase: 1 }, date: '2025-06-15', trigger: 'New owner Megan re-engaged with trial order' },
      { from: { status: 'recovery', phase: 1 }, to: { status: 'recovery', phase: 5 }, date: '2025-12-01', trigger: 'Exceeded pre-lapse ordering levels — graduated' },
    ]),
  makeAccount('acct-009', 'Spokane Smoke Shop', 'SSS Holdings', 'WA-CCB-420309', '2104 N Monroe St', 'Spokane', '99205', 47.6728, -117.4281, 'Spokane', 'rep-carlos', 55, 'declining', 'at-risk', false, 67400, 3800, 1500, 45, 'fair', 'cod', ['budget', 'at-risk'], '2026-02-10', 'Tyler Reed', 'buyer', '(509) 555-0309', 'tyler@spokanesmoke.com', '2025-03-20',
    'inactive', 2, [
      { from: { status: 'active', phase: 3 }, to: { status: 'active', phase: 4 }, date: '2025-11-01', trigger: 'Declining order volume and shrinking basket size' },
      { from: { status: 'active', phase: 4 }, to: { status: 'inactive', phase: 1 }, date: '2026-01-15', trigger: 'No orders in 35 days' },
      { from: { status: 'inactive', phase: 1 }, to: { status: 'inactive', phase: 2 }, date: '2026-02-15', trigger: 'Outreach attempted — no response' },
    ]),
  makeAccount('acct-010', 'Walla Walla Weed Co', 'WW Cannabis LLC', 'WA-CCB-420310', '15 E Main St', 'Walla Walla', '99362', 46.0646, -118.3387, 'Eastern WA', 'rep-carlos', 62, 'stable', 'active', false, 54200, 4600, 1700, 32, 'good', 'mail', ['rural'], '2026-02-20', 'Amy Collins', 'buyer', '(509) 555-0310', 'amy@wallawallaweed.com', '2025-04-15',
    'active', 1, [
      { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 1 }, date: '2025-04-15', trigger: 'Account created — onboarding in progress' },
    ]),
  makeAccount('acct-011', 'Yakima Valley Green', 'YVG Dispensary', 'WA-CCB-420311', '110 S 2nd St', 'Yakima', '98901', 46.6021, -120.5059, 'Eastern WA', 'rep-carlos', 71, 'improving', 'active', false, 78900, 7200, 1950, 41, 'good', 'cod', ['mid-tier'], '2026-03-01', 'Roberto Silva', 'buyer', '(509) 555-0311', 'roberto@yvgreen.com', '2025-05-01',
    'recovery', 2, [
      { from: { status: 'active', phase: 2 }, to: { status: 'inactive', phase: 1 }, date: '2025-10-01', trigger: 'Seasonal slowdown led to 40-day order gap' },
      { from: { status: 'inactive', phase: 1 }, to: { status: 'recovery', phase: 1 }, date: '2025-11-15', trigger: 'Carlos visited in person, secured restart order' },
      { from: { status: 'recovery', phase: 1 }, to: { status: 'recovery', phase: 2 }, date: '2026-01-15', trigger: 'Second consecutive monthly order placed' },
    ]),
  makeAccount('acct-012', 'Bellingham Bloom', 'BB Cannabis Co', 'WA-CCB-420312', '1298 Railroad Ave', 'Bellingham', '98225', 48.7519, -122.4787, 'NW Washington', 'rep-jake', 77, 'stable', 'active', false, 134500, 11400, 2400, 56, 'good', 'ach', ['mid-tier'], '2026-03-02', 'Claire Dawson', 'buyer', '(360) 555-0312', 'claire@bellinghambloom.com', '2024-12-01',
    'active', 3, [
      { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-04-01', trigger: 'Steady monthly ordering established' },
      { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-10-15', trigger: 'Reliable order cadence maintained for 6 months' },
    ]),
  makeAccount('acct-013', 'Vancouver Vapor', 'VV Holdings', 'WA-CCB-420313', '1600 Main St', 'Vancouver', '98660', 45.6387, -122.6615, 'SW Washington', 'rep-priya', 44, 'declining', 'at-risk', false, 42100, 1800, 1400, 30, 'poor', 'cod', ['budget', 'at-risk'], '2026-01-30', 'Nina Walsh', 'buyer', '(360) 555-0313', 'nina@vancouvervapor.com', '2025-06-15',
    'inactive', 3, [
      { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 4 }, date: '2025-11-01', trigger: 'Payment issues and declining order volume' },
      { from: { status: 'active', phase: 4 }, to: { status: 'inactive', phase: 1 }, date: '2025-12-15', trigger: 'Two overdue invoices, orders stopped' },
      { from: { status: 'inactive', phase: 1 }, to: { status: 'inactive', phase: 3 }, date: '2026-02-15', trigger: 'Multiple outreach attempts unanswered for 60 days' },
    ]),
  makeAccount('acct-014', 'Tri-Cities Terpenes', 'TCT Cannabis', 'WA-CCB-420314', '234 George Washington Way', 'Richland', '99352', 46.2804, -119.2752, 'Eastern WA', 'rep-carlos', 66, 'stable', 'active', false, 89300, 7800, 1850, 48, 'good', 'mail', ['mid-tier'], '2026-02-25', 'Jason Briggs', 'buyer', '(509) 555-0314', 'jason@tricitiesterp.com', '2025-01-20',
    'active', 4, [
      { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-07-01', trigger: 'Steady biweekly ordering for 6 months' },
      { from: { status: 'active', phase: 3 }, to: { status: 'active', phase: 4 }, date: '2026-01-01', trigger: 'Order frequency and AOV both declining 20%' },
    ]),
  makeAccount('acct-015', 'Everett Extracts', 'EE Dispensary LLC', 'WA-CCB-420315', '2930 Colby Ave', 'Everett', '98201', 47.9790, -122.2021, 'North Sound', 'rep-jake', 79, 'improving', 'active', false, 156800, 14200, 2700, 58, 'good', 'ach', ['premium'], '2026-03-03', 'Hannah Lee', 'buyer', '(425) 555-0315', 'hannah@everettextracts.com', '2024-08-10',
    'recovery', 5, [
      { from: { status: 'active', phase: 3 }, to: { status: 'active', phase: 4 }, date: '2025-06-01', trigger: 'Lost shelf space to competitor brand' },
      { from: { status: 'active', phase: 4 }, to: { status: 'inactive', phase: 1 }, date: '2025-08-01', trigger: 'Orders dropped to zero for 30 days' },
      { from: { status: 'inactive', phase: 1 }, to: { status: 'recovery', phase: 1 }, date: '2025-09-15', trigger: 'Jake negotiated exclusive extract placement deal' },
      { from: { status: 'recovery', phase: 1 }, to: { status: 'recovery', phase: 5 }, date: '2026-01-15', trigger: 'Surpassed pre-lapse revenue levels — graduated' },
    ]),
  makeAccount('acct-016', 'Bainbridge Botanics', 'Bainbridge Cannabis', 'WA-CCB-420316', '180 Winslow Way E', 'Bainbridge Island', '98110', 47.6265, -122.5091, 'Kitsap', 'rep-jake', 83, 'stable', 'active', false, 92100, 8400, 3070, 30, 'excellent', 'ach', ['boutique', 'premium'], '2026-03-02', 'Will Thornton', 'owner', '(206) 555-0316', 'will@bainbridgebotanics.com', '2025-03-01',
    'active', 3, [
      { from: { status: 'active', phase: 1 }, to: { status: 'active', phase: 2 }, date: '2025-07-01', trigger: 'Premium boutique — fast AOV growth' },
      { from: { status: 'active', phase: 2 }, to: { status: 'active', phase: 3 }, date: '2025-12-01', trigger: 'Stable high-value monthly ordering' },
    ]),
];

// --- All Accounts ---
export const accounts: Account[] = [
  greenfield, pacificLeaf, emeraldCity, cascadeWellness, pugetSound,
  summitCannabis, rainierRemedies, olympicGreens, spokaneValley,
  capitolHillCollective, harborCannabis, evergreenWellness,
  ...generatedAccounts,
];

// --- Interactions ---

export const interactions: Interaction[] = [
  { id: 'int-001', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'email', direction: 'outbound', subject: 'Weekly order confirmation', summary: 'Confirmed Tue delivery of 24 SKUs, $3,800 order', content: 'Hi Sarah, confirming your regular Tuesday delivery...', userId: 'rep-jake', agentId: null, timestamp: '2026-03-05T09:15:00Z', sentiment: 'positive' },
  { id: 'int-002', accountId: 'acct-emerald-city', contactId: 'contact-amanda-torres', channel: 'phone', direction: 'outbound', subject: 'Re-engagement call', summary: 'Called Amanda — went to voicemail, left message about new pricing', content: 'Attempted to reach Amanda regarding competitive pricing...', userId: 'rep-jake', agentId: null, timestamp: '2026-03-04T14:30:00Z', sentiment: 'neutral' },
  { id: 'int-003', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'sms', direction: 'inbound', subject: 'Payment delay notice', summary: 'David texted that payment will be 5 days late due to POS migration', content: 'Hey, just a heads up our POS migration is causing payment delays...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-04T11:45:00Z', sentiment: 'negative' },
  { id: 'int-004', accountId: 'acct-cascade', contactId: 'contact-tom-wheeler', channel: 'meeting', direction: 'outbound', subject: 'Category expansion pitch', summary: 'Presented preroll and edible lines. Tom interested in small preroll order.', content: 'Met with Tom at Cascade Wellness to discuss expanding beyond flower...', userId: 'rep-carlos', agentId: null, timestamp: '2026-03-03T15:00:00Z', sentiment: 'positive' },
  { id: 'int-005', accountId: 'acct-puget-sound', contactId: 'contact-lisa-park', channel: 'email', direction: 'inbound', subject: 'Premium concentrate inquiry', summary: 'Lisa asking about new live rosin line, wants samples', content: 'Hi team, I saw your new live rosin offerings and would love to...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-05T08:30:00Z', sentiment: 'positive' },
  { id: 'int-006', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'agent', direction: 'outbound', subject: 'VMI auto-reorder triggered', summary: 'AI agent detected low flower inventory, auto-generated reorder of 12 SKUs', content: 'Automated VMI system detected inventory levels below threshold...', userId: 'rep-jake', agentId: 'agent-vmi-01', timestamp: '2026-03-05T06:00:00Z', sentiment: 'positive' },
  { id: 'int-007', accountId: 'acct-001', contactId: 'contact-acct-001', channel: 'phone', direction: 'outbound', subject: 'Monthly check-in', summary: 'Routine check-in with Jen, everything on track', content: 'Called Jen for monthly review...', userId: 'rep-jake', agentId: null, timestamp: '2026-03-04T10:00:00Z', sentiment: 'positive' },
  { id: 'int-008', accountId: 'acct-005', contactId: 'contact-acct-005', channel: 'email', direction: 'outbound', subject: 'Win-back offer', summary: 'Sent 10% discount on next 3 orders to re-engage declining account', content: 'Hi Steve, we value your business and wanted to offer...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-03T16:20:00Z', sentiment: 'neutral' },
  { id: 'int-009', accountId: 'acct-013', contactId: 'contact-acct-013', channel: 'note', direction: 'outbound', subject: 'Internal: escalation needed', summary: 'Account at risk — 2 invoices overdue, need manager review', content: 'Flagging Vancouver Vapor for Dana review...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-04T09:00:00Z', sentiment: 'negative' },
  { id: 'int-010', accountId: 'acct-004', contactId: 'contact-acct-004', channel: 'email', direction: 'inbound', subject: 'VMI enrollment interest', summary: 'Rachel inquiring about VMI program requirements and timeline', content: 'Hi Priya, I\'ve been hearing about your VMI program...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-05T07:45:00Z', sentiment: 'positive' },

  // --- Greenfield Dispensary (12 more → total 14) ---
  { id: 'int-011', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'email', direction: 'outbound', subject: 'Weekly order confirmation — Feb 25', summary: 'Confirmed Tue delivery of 22 SKUs, $3,640 order', content: 'Hi Sarah, your order for next Tuesday is locked in...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-25T09:00:00Z', sentiment: 'positive' },
  { id: 'int-012', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'phone', direction: 'inbound', subject: 'Delivery feedback', summary: 'Sarah called to report one damaged case of prerolls in last delivery', content: 'Sarah called regarding damaged packaging on 12-pack preroll case...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-24T14:20:00Z', sentiment: 'negative' },
  { id: 'int-013', accountId: 'acct-greenfield', contactId: 'contact-mike-rodriguez', channel: 'meeting', direction: 'outbound', subject: 'Q1 business review', summary: 'Met with Mike to review Q1 performance. Revenue up 14%. Discussed Q2 growth targets.', content: 'Quarterly review with owner Mike Rodriguez...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-20T10:00:00Z', sentiment: 'positive' },
  { id: 'int-014', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'agent', direction: 'outbound', subject: 'VMI reorder — Feb 18', summary: 'Automated VMI detected low vaporizer stock, generated reorder of 8 SKUs', content: 'VMI system triggered reorder for vaporizer category...', userId: 'rep-jake', agentId: 'agent-vmi-01', timestamp: '2026-02-18T06:00:00Z', sentiment: 'positive' },
  { id: 'int-015', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'email', direction: 'outbound', subject: 'New edible line preview', summary: 'Sent product sheets for new gummy line launching in March', content: 'Hi Sarah, wanted to give you a sneak peek at our new gummy line...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-14T11:00:00Z', sentiment: 'positive' },
  { id: 'int-016', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'email', direction: 'inbound', subject: 'Re: New edible line preview', summary: 'Sarah interested in gummy line, wants to add 4 SKUs to next order', content: 'These look great! Can we add the mango and mixed berry flavors...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-15T08:30:00Z', sentiment: 'positive' },
  { id: 'int-017', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'phone', direction: 'outbound', subject: 'February check-in', summary: 'Monthly touch-base call. All metrics healthy. Sarah mentioned expanding beverage cooler.', content: 'Monthly check-in call with Sarah...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-10T15:00:00Z', sentiment: 'positive' },
  { id: 'int-018', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'email', direction: 'outbound', subject: 'January invoice summary', summary: 'Sent consolidated January invoice breakdown — $38,400 total, all paid on time', content: 'Hi Sarah, attached is your January invoice summary...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-03T09:00:00Z', sentiment: 'positive' },
  { id: 'int-019', accountId: 'acct-greenfield', contactId: 'contact-mike-rodriguez', channel: 'email', direction: 'inbound', subject: 'License renewal confirmation', summary: 'Mike forwarded updated license — renewed through March 2027', content: 'Jake, FYI our license renewal went through. Attached updated copy...', userId: 'rep-jake', agentId: null, timestamp: '2026-01-28T10:15:00Z', sentiment: 'positive' },
  { id: 'int-020', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'agent', direction: 'outbound', subject: 'VMI reorder — Jan 22', summary: 'Automated reorder triggered for flower and preroll categories', content: 'VMI auto-reorder: 14 SKUs across flower and preroll...', userId: 'rep-jake', agentId: 'agent-vmi-01', timestamp: '2026-01-22T06:00:00Z', sentiment: 'positive' },
  { id: 'int-021', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'meeting', direction: 'outbound', subject: 'Holiday season debrief', summary: 'Reviewed holiday performance — 22% above target. Discussed spring promotions.', content: 'Post-holiday debrief meeting at Greenfield...', userId: 'rep-jake', agentId: null, timestamp: '2026-01-15T14:00:00Z', sentiment: 'positive' },
  { id: 'int-022', accountId: 'acct-greenfield', contactId: 'contact-sarah-chen', channel: 'email', direction: 'outbound', subject: 'Holiday promo results', summary: 'Shared holiday campaign results — their store was top 3 in sell-through', content: 'Hi Sarah, the holiday numbers are in and Greenfield was #2...', userId: 'rep-jake', agentId: null, timestamp: '2025-12-28T10:00:00Z', sentiment: 'positive' },

  // --- Pacific Leaf (8 more → total 9) ---
  { id: 'int-023', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'email', direction: 'outbound', subject: 'Payment reminder — Invoice #1180', summary: 'Formal payment reminder sent for overdue invoice', content: 'Hi David, this is a reminder that invoice #1180 for $4,200 is now overdue...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-02T09:00:00Z', sentiment: 'neutral' },
  { id: 'int-024', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'phone', direction: 'outbound', subject: 'Order follow-up', summary: 'Called David about next order. He said they\'re cautious due to cash flow from POS transition.', content: 'Spoke with David about upcoming orders...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-26T11:30:00Z', sentiment: 'negative' },
  { id: 'int-025', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'email', direction: 'outbound', subject: 'Vape category review', summary: 'Sent analysis showing their vape sales dropped 40% QoQ — suggested merchandising changes', content: 'Hi David, I pulled your category data and noticed vape sales...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-18T10:00:00Z', sentiment: 'neutral' },
  { id: 'int-026', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'meeting', direction: 'outbound', subject: 'POS migration check-in', summary: 'Met at Pacific Leaf to discuss POS migration timeline. Target completion mid-March.', content: 'In-store meeting with David about their POS migration...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-12T14:00:00Z', sentiment: 'neutral' },
  { id: 'int-027', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'email', direction: 'inbound', subject: 'Re: Vape category review', summary: 'David acknowledged the vape decline — says customers shifting to concentrates', content: 'Thanks Priya, you\'re right about the vape numbers. Our customers are moving to...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-19T16:00:00Z', sentiment: 'neutral' },
  { id: 'int-028', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'phone', direction: 'outbound', subject: 'January check-in', summary: 'Routine monthly call. David mentioned tight margins and considering reducing SKU count.', content: 'Monthly call with David at Pacific Leaf...', userId: 'rep-priya', agentId: null, timestamp: '2026-01-20T10:00:00Z', sentiment: 'negative' },
  { id: 'int-029', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'email', direction: 'outbound', subject: 'Q4 performance recap', summary: 'Sent Q4 summary — revenue flat, AOV declining. Recommended focus on higher-margin products.', content: 'Hi David, here\'s your Q4 performance summary...', userId: 'rep-priya', agentId: null, timestamp: '2026-01-08T09:00:00Z', sentiment: 'neutral' },
  { id: 'int-030', accountId: 'acct-pacific-leaf', contactId: 'contact-david-kim', channel: 'sms', direction: 'inbound', subject: 'Late payment heads up', summary: 'David texted that December payment will be a week late', content: 'Hey Priya, December payment going to be about a week late, apologies...', userId: 'rep-priya', agentId: null, timestamp: '2025-12-22T17:30:00Z', sentiment: 'negative' },

  // --- Emerald City Cannabis (6 more → total 8, showing cooling) ---
  { id: 'int-031', accountId: 'acct-emerald-city', contactId: 'contact-amanda-torres', channel: 'email', direction: 'outbound', subject: 'Win-back pricing proposal', summary: 'Sent competitive pricing sheet with 8% discount on top 10 SKUs', content: 'Hi Amanda, I put together a special pricing proposal for you...', userId: 'rep-jake', agentId: null, timestamp: '2026-03-01T10:00:00Z', sentiment: 'neutral' },
  { id: 'int-032', accountId: 'acct-emerald-city', contactId: 'contact-amanda-torres', channel: 'phone', direction: 'outbound', subject: 'Follow-up on pricing proposal', summary: 'Called Amanda — no answer. Third unreturned call this month.', content: 'Attempted follow-up call on pricing proposal sent March 1...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-20T14:00:00Z', sentiment: 'negative' },
  { id: 'int-033', accountId: 'acct-emerald-city', contactId: 'contact-amanda-torres', channel: 'email', direction: 'outbound', subject: 'Checking in — missed you lately', summary: 'Friendly check-in email noting we haven\'t connected in weeks', content: 'Hi Amanda, hope everything is going well at the store...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-10T09:30:00Z', sentiment: 'neutral' },
  { id: 'int-034', accountId: 'acct-emerald-city', contactId: 'contact-amanda-torres', channel: 'note', direction: 'outbound', subject: 'Internal: competitor intel', summary: 'Heard from delivery driver that ECC now stocking Green Valley products on shelves that had ours', content: 'Driver reported competitor product placement at ECC location...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-05T16:00:00Z', sentiment: 'negative' },
  { id: 'int-035', accountId: 'acct-emerald-city', contactId: 'contact-amanda-torres', channel: 'phone', direction: 'inbound', subject: 'Last regular order call', summary: 'Amanda called in a small order — sounded hesitant, mentioned exploring other suppliers', content: 'Amanda called for what turned out to be their last order...', userId: 'rep-jake', agentId: null, timestamp: '2026-01-18T11:00:00Z', sentiment: 'negative' },
  { id: 'int-036', accountId: 'acct-emerald-city', contactId: 'contact-amanda-torres', channel: 'meeting', direction: 'outbound', subject: 'Quarterly account review — Q4', summary: 'In-store meeting. Amanda was cordial but noncommittal about Q1 plans. Red flag.', content: 'Met with Amanda for Q4 review at their Rainier Ave location...', userId: 'rep-jake', agentId: null, timestamp: '2025-12-18T14:00:00Z', sentiment: 'neutral' },

  // --- Cascade Wellness (4 more → total 5) ---
  { id: 'int-037', accountId: 'acct-cascade', contactId: 'contact-tom-wheeler', channel: 'email', direction: 'outbound', subject: 'Welcome aboard — first order details', summary: 'Sent welcome package with first order confirmation and delivery schedule', content: 'Hi Tom, welcome to Frost! Your first order is confirmed...', userId: 'rep-carlos', agentId: null, timestamp: '2026-01-15T09:00:00Z', sentiment: 'positive' },
  { id: 'int-038', accountId: 'acct-cascade', contactId: 'contact-tom-wheeler', channel: 'phone', direction: 'outbound', subject: 'Post-first-delivery check-in', summary: 'Called Tom after first delivery. Happy with product quality, wants to order again.', content: 'Follow-up call after Cascade Wellness first delivery...', userId: 'rep-carlos', agentId: null, timestamp: '2026-01-24T15:00:00Z', sentiment: 'positive' },
  { id: 'int-039', accountId: 'acct-cascade', contactId: 'contact-tom-wheeler', channel: 'email', direction: 'inbound', subject: 'Second order — same as first', summary: 'Tom emailed to reorder same flower mix as first delivery', content: 'Hey Carlos, can we do the same order as last time? Everything sold well...', userId: 'rep-carlos', agentId: null, timestamp: '2026-02-20T08:00:00Z', sentiment: 'positive' },
  { id: 'int-040', accountId: 'acct-cascade', contactId: 'contact-tom-wheeler', channel: 'email', direction: 'outbound', subject: 'Category expansion — preroll samples', summary: 'Sending preroll sample pack ahead of in-person pitch meeting', content: 'Hi Tom, I\'m sending over a sample pack of our top preroll SKUs...', userId: 'rep-carlos', agentId: null, timestamp: '2026-02-28T10:00:00Z', sentiment: 'positive' },

  // --- Puget Sound Provisions (4 more → total 5) ---
  { id: 'int-041', accountId: 'acct-puget-sound', contactId: 'contact-lisa-park', channel: 'email', direction: 'outbound', subject: 'Live rosin sample shipment', summary: 'Confirmed sample shipment of 4 live rosin SKUs arriving Wednesday', content: 'Hi Lisa, your live rosin samples are on their way...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-06T08:00:00Z', sentiment: 'positive' },
  { id: 'int-042', accountId: 'acct-puget-sound', contactId: 'contact-lisa-park', channel: 'phone', direction: 'outbound', subject: 'February order confirmation', summary: 'Called to confirm February restock — $4,100, premium mix', content: 'Confirming Lisa\'s February order details...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-15T11:00:00Z', sentiment: 'positive' },
  { id: 'int-043', accountId: 'acct-puget-sound', contactId: 'contact-lisa-park', channel: 'meeting', direction: 'outbound', subject: 'Store visit and product review', summary: 'Visited store to review shelf placement. Lisa curates beautifully — our premium line front and center.', content: 'In-store visit at Puget Sound Provisions...', userId: 'rep-priya', agentId: null, timestamp: '2026-01-22T13:00:00Z', sentiment: 'positive' },
  { id: 'int-044', accountId: 'acct-puget-sound', contactId: 'contact-lisa-park', channel: 'email', direction: 'inbound', subject: 'Holiday order feedback', summary: 'Lisa emailed thanking us for fast holiday fulfillment — everything arrived intact', content: 'Hi Priya, just wanted to say the holiday orders were perfect...', userId: 'rep-priya', agentId: null, timestamp: '2025-12-30T09:00:00Z', sentiment: 'positive' },

  // --- Summit Cannabis Co. (4) ---
  { id: 'int-045', accountId: 'acct-summit', contactId: 'contact-grant-holloway', channel: 'email', direction: 'outbound', subject: 'March order confirmation', summary: 'Confirmed monthly order — flower and concentrate restock, $2,800', content: 'Hi Grant, your March order is confirmed for delivery Monday...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-28T09:00:00Z', sentiment: 'positive' },
  { id: 'int-046', accountId: 'acct-summit', contactId: 'contact-beth-simon', channel: 'phone', direction: 'outbound', subject: 'VMI calibration call', summary: 'Called Beth to fine-tune VMI thresholds — adjusted flower reorder point down 10%', content: 'VMI calibration call with Beth at Summit Cannabis...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-14T14:00:00Z', sentiment: 'positive' },
  { id: 'int-047', accountId: 'acct-summit', contactId: 'contact-grant-holloway', channel: 'meeting', direction: 'outbound', subject: 'Quarterly business review', summary: 'Met with Grant. Steady account, no issues. Discussed possibility of adding vape SKUs in Q2.', content: 'QBR meeting with Grant at Summit Cannabis...', userId: 'rep-jake', agentId: null, timestamp: '2026-01-30T10:00:00Z', sentiment: 'positive' },
  { id: 'int-048', accountId: 'acct-summit', contactId: 'contact-grant-holloway', channel: 'agent', direction: 'outbound', subject: 'VMI auto-reorder — Feb 1', summary: 'VMI system triggered concentrate restock — 6 SKUs', content: 'Automated VMI reorder for concentrate category at Summit Cannabis...', userId: 'rep-jake', agentId: 'agent-vmi-01', timestamp: '2026-02-01T06:00:00Z', sentiment: 'positive' },

  // --- Rainier Remedies (5 — escalating payment arc) ---
  { id: 'int-049', accountId: 'acct-rainier', contactId: 'contact-victor-almeida', channel: 'phone', direction: 'outbound', subject: 'Payment collection call — 3rd attempt', summary: 'Called Victor about two overdue invoices totaling $8,400. He promised payment by Friday.', content: 'Third attempt to reach Victor about overdue payments...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-05T15:00:00Z', sentiment: 'negative' },
  { id: 'int-050', accountId: 'acct-rainier', contactId: 'contact-jenny-wu', channel: 'sms', direction: 'inbound', subject: 'Jenny — Victor is avoiding calls', summary: 'Jenny texted that Victor is dealing with personal issues and asked for patience', content: 'Hi Priya, I know Victor hasn\'t been picking up. He\'s dealing with some stuff...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-04T18:00:00Z', sentiment: 'negative' },
  { id: 'int-051', accountId: 'acct-rainier', contactId: 'contact-victor-almeida', channel: 'email', direction: 'outbound', subject: 'Overdue notice — Invoice #1165 and #1172', summary: 'Formal overdue notice for two invoices, 15 and 22 days past due', content: 'Dear Victor, this is a formal notice that invoices #1165 and #1172...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-25T09:00:00Z', sentiment: 'negative' },
  { id: 'int-052', accountId: 'acct-rainier', contactId: 'contact-victor-almeida', channel: 'phone', direction: 'outbound', subject: 'Order hold notification', summary: 'Informed Victor that new orders are on hold until outstanding balance is cleared', content: 'Called Victor to notify him that further orders are on hold...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-18T11:00:00Z', sentiment: 'negative' },
  { id: 'int-053', accountId: 'acct-rainier', contactId: 'contact-victor-almeida', channel: 'note', direction: 'outbound', subject: 'Internal: escalation to Dana', summary: 'Flagged Rainier Remedies for manager review — payment pattern deteriorating over 60 days', content: 'Escalating Rainier Remedies to Dana. Two invoices overdue, orders on hold...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-01T09:00:00Z', sentiment: 'negative' },

  // --- Olympic Greens (4) ---
  { id: 'int-054', accountId: 'acct-olympic', contactId: 'contact-dana-reyes', channel: 'email', direction: 'outbound', subject: 'Weekly preroll restock confirmation', summary: 'Confirmed standing weekly preroll order — 48 units across 6 SKUs', content: 'Hi Dana, your weekly preroll restock is confirmed for Friday delivery...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-03T09:00:00Z', sentiment: 'positive' },
  { id: 'int-055', accountId: 'acct-olympic', contactId: 'contact-dana-reyes', channel: 'phone', direction: 'inbound', subject: 'Preroll display feedback', summary: 'Dana called to share that our new preroll display fixture increased her sales 15%', content: 'Dana called excited about the preroll display fixture we provided...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-20T16:00:00Z', sentiment: 'positive' },
  { id: 'int-056', accountId: 'acct-olympic', contactId: 'contact-dana-reyes', channel: 'email', direction: 'outbound', subject: 'February invoice — paid in full', summary: 'Sent February invoice summary — $18,600, paid via ACH same day', content: 'Hi Dana, attached is your February invoice summary...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-28T09:00:00Z', sentiment: 'positive' },
  { id: 'int-057', accountId: 'acct-olympic', contactId: 'contact-dana-reyes', channel: 'meeting', direction: 'outbound', subject: 'Store walk and product review', summary: 'Visited Olympic Greens. Preroll section is dominant — 60% of display. Discussed adding flower endcap.', content: 'In-store visit at Olympic Greens in Olympia...', userId: 'rep-priya', agentId: null, timestamp: '2026-01-17T13:00:00Z', sentiment: 'positive' },

  // --- Spokane Valley Dispensary (3) ---
  { id: 'int-058', accountId: 'acct-spokane-valley', contactId: 'contact-paul-hernandez', channel: 'phone', direction: 'outbound', subject: 'Quarterly check-in', summary: 'Routine quarterly call with Paul. Steady volume, no complaints. Not interested in VMI yet.', content: 'Quarterly touch-base with Paul at Spokane Valley...', userId: 'rep-carlos', agentId: null, timestamp: '2026-02-24T10:00:00Z', sentiment: 'positive' },
  { id: 'int-059', accountId: 'acct-spokane-valley', contactId: 'contact-paul-hernandez', channel: 'email', direction: 'outbound', subject: 'Order confirmation — February', summary: 'Confirmed February order, $1,620, broad category mix as usual', content: 'Hi Paul, your February order is confirmed...', userId: 'rep-carlos', agentId: null, timestamp: '2026-02-15T09:00:00Z', sentiment: 'positive' },
  { id: 'int-060', accountId: 'acct-spokane-valley', contactId: 'contact-paul-hernandez', channel: 'email', direction: 'inbound', subject: 'Question about new concentrate brands', summary: 'Paul asking about new concentrate options — considering adding a second brand', content: 'Hey Carlos, are there any new concentrate brands available?...', userId: 'rep-carlos', agentId: null, timestamp: '2025-12-10T11:00:00Z', sentiment: 'positive' },

  // --- Capitol Hill Collective (5) ---
  { id: 'int-061', accountId: 'acct-capitol-hill', contactId: 'contact-naomi-chen', channel: 'email', direction: 'outbound', subject: 'Trend report: Q1 concentrate insights', summary: 'Sent curated trend report on concentrate market — new solventless brands gaining share', content: 'Hi Naomi, here\'s the Q1 concentrate trend report I put together for you...', userId: 'rep-jake', agentId: null, timestamp: '2026-03-04T08:00:00Z', sentiment: 'positive' },
  { id: 'int-062', accountId: 'acct-capitol-hill', contactId: 'contact-naomi-chen', channel: 'email', direction: 'inbound', subject: 'Re: Trend report — want exclusive on new brand', summary: 'Naomi wants first dibs on the new solventless line before competitors', content: 'Jake, this is exactly what I was looking for. Can we get exclusive placement...', userId: 'rep-jake', agentId: null, timestamp: '2026-03-04T12:00:00Z', sentiment: 'positive' },
  { id: 'int-063', accountId: 'acct-capitol-hill', contactId: 'contact-alex-rivera', channel: 'sms', direction: 'inbound', subject: 'Beverage cooler install', summary: 'Alex texted that the new beverage cooler is installed and ready for product', content: 'Hey Jake, cooler is in! Ready for the cannabis beverages whenever you can deliver...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-22T17:00:00Z', sentiment: 'positive' },
  { id: 'int-064', accountId: 'acct-capitol-hill', contactId: 'contact-naomi-chen', channel: 'meeting', direction: 'outbound', subject: 'VMI onboarding meeting', summary: 'Onboarding meeting for VMI enrollment. Set up initial thresholds for concentrate and vape categories.', content: 'VMI onboarding session at Capitol Hill Collective...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-10T10:00:00Z', sentiment: 'positive' },
  { id: 'int-065', accountId: 'acct-capitol-hill', contactId: 'contact-naomi-chen', channel: 'agent', direction: 'outbound', subject: 'VMI first auto-reorder', summary: 'First VMI auto-reorder for Capitol Hill Collective — 10 SKUs concentrate + vape', content: 'VMI system generated first automated reorder for CHC...', userId: 'rep-jake', agentId: 'agent-vmi-01', timestamp: '2026-03-01T06:00:00Z', sentiment: 'positive' },

  // --- Harbor Cannabis (3) ---
  { id: 'int-066', accountId: 'acct-harbor', contactId: 'contact-earl-dawkins', channel: 'phone', direction: 'outbound', subject: 'Delivery logistics discussion', summary: 'Called Earl to discuss delivery challenges. 3-hour round trip from warehouse. Considering monthly bulk drops.', content: 'Spoke with Earl about the delivery logistics to Aberdeen...', userId: 'rep-carlos', agentId: null, timestamp: '2026-02-28T14:00:00Z', sentiment: 'neutral' },
  { id: 'int-067', accountId: 'acct-harbor', contactId: 'contact-earl-dawkins', channel: 'email', direction: 'outbound', subject: 'February order — delayed', summary: 'Notified Earl that February delivery pushed to next week due to weather', content: 'Hi Earl, unfortunately we need to push your delivery to next Friday due to road conditions...', userId: 'rep-carlos', agentId: null, timestamp: '2026-02-06T10:00:00Z', sentiment: 'negative' },
  { id: 'int-068', accountId: 'acct-harbor', contactId: 'contact-earl-dawkins', channel: 'phone', direction: 'inbound', subject: 'First contact — interested in wholesale', summary: 'Earl called after seeing us at a trade show. Interested in flower wholesale for his new store.', content: 'Inbound call from Earl Dawkins at Harbor Cannabis...', userId: 'rep-carlos', agentId: null, timestamp: '2025-06-15T11:00:00Z', sentiment: 'positive' },

  // --- Evergreen Wellness (4) ---
  { id: 'int-069', accountId: 'acct-evergreen', contactId: 'contact-maria-santos', channel: 'email', direction: 'outbound', subject: 'Edible category introduction', summary: 'Sent edible product catalog and suggested starter pack of 8 SKUs', content: 'Hi Maria, based on our conversation, here\'s the edible catalog...', userId: 'rep-carlos', agentId: null, timestamp: '2026-03-02T09:00:00Z', sentiment: 'positive' },
  { id: 'int-070', accountId: 'acct-evergreen', contactId: 'contact-maria-santos', channel: 'email', direction: 'inbound', subject: 'Re: Edible category introduction', summary: 'Maria wants to start with 4 gummy SKUs and 2 chocolate SKUs', content: 'Carlos, these look great. Let\'s start with the gummy 4-pack and the dark chocolate bar...', userId: 'rep-carlos', agentId: null, timestamp: '2026-03-03T08:30:00Z', sentiment: 'positive' },
  { id: 'int-071', accountId: 'acct-evergreen', contactId: 'contact-raj-patel', channel: 'phone', direction: 'inbound', subject: 'Owner introduction call', summary: 'Raj called to introduce himself. Wants to grow the business beyond flower. Engaged and motivated.', content: 'Raj Patel, owner of Evergreen Wellness, called to introduce himself...', userId: 'rep-carlos', agentId: null, timestamp: '2025-11-15T10:00:00Z', sentiment: 'positive' },
  { id: 'int-072', accountId: 'acct-evergreen', contactId: 'contact-maria-santos', channel: 'meeting', direction: 'outbound', subject: 'Onboarding and store tour', summary: 'First in-store visit. Clean, well-organized shop. Good potential for category expansion.', content: 'Initial store visit at Evergreen Wellness in Richland...', userId: 'rep-carlos', agentId: null, timestamp: '2025-09-20T13:00:00Z', sentiment: 'positive' },

  // --- Generated accounts scattered interactions (10) ---
  { id: 'int-073', accountId: 'acct-001', contactId: 'contact-acct-001', channel: 'email', direction: 'outbound', subject: 'VMI performance report', summary: 'Sent VMI metrics to Jen — 98% fill rate, $0 stockouts last quarter', content: 'Hi Jen, here\'s your VMI performance report for the quarter...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-28T09:00:00Z', sentiment: 'positive' },
  { id: 'int-074', accountId: 'acct-004', contactId: 'contact-acct-004', channel: 'meeting', direction: 'outbound', subject: 'VMI SLA negotiation', summary: 'Met with Rachel to finalize VMI SLA terms. Targeting April 1 go-live.', content: 'VMI SLA negotiation meeting with Bellevue Botanicals...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-01T10:00:00Z', sentiment: 'positive' },
  { id: 'int-075', accountId: 'acct-003', contactId: 'contact-acct-003', channel: 'email', direction: 'inbound', subject: 'Spring seasonal order inquiry', summary: 'Olivia asking about spring seasonal SKUs — wants to pre-order flower strains', content: 'Hi Jake, do you have the spring seasonal menu ready yet?...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-22T08:00:00Z', sentiment: 'positive' },
  { id: 'int-076', accountId: 'acct-005', contactId: 'contact-acct-005', channel: 'phone', direction: 'outbound', subject: 'Win-back follow-up', summary: 'Called Steve about the 10% discount offer. He said he\'ll think about it but sounded noncommittal.', content: 'Follow-up call with Steve at Kirkland Kush about win-back offer...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-05T14:00:00Z', sentiment: 'neutral' },
  { id: 'int-077', accountId: 'acct-008', contactId: 'contact-acct-008', channel: 'email', direction: 'outbound', subject: 'Organic certification update', summary: 'Shared news about our new organic flower line — perfect fit for Olympia Organics brand', content: 'Hi Megan, exciting news — we now have certified organic flower available...', userId: 'rep-priya', agentId: null, timestamp: '2026-02-20T10:00:00Z', sentiment: 'positive' },
  { id: 'int-078', accountId: 'acct-012', contactId: 'contact-acct-012', channel: 'phone', direction: 'outbound', subject: 'Monthly check-in', summary: 'Routine call with Claire at Bellingham Bloom. Steady account, no issues.', content: 'Monthly check-in with Claire at Bellingham Bloom...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-15T15:00:00Z', sentiment: 'positive' },
  { id: 'int-079', accountId: 'acct-016', contactId: 'contact-acct-016', channel: 'email', direction: 'inbound', subject: 'Boutique curated box request', summary: 'Will wants a curated premium box for a private tasting event at the store', content: 'Hi Jake, we\'re hosting a private tasting event and need a curated selection...', userId: 'rep-jake', agentId: null, timestamp: '2026-02-25T11:00:00Z', sentiment: 'positive' },
  { id: 'int-080', accountId: 'acct-009', contactId: 'contact-acct-009', channel: 'phone', direction: 'outbound', subject: 'Re-engagement attempt', summary: 'Called Tyler at Spokane Smoke Shop. Orders declining. Price sensitivity is the main concern.', content: 'Call with Tyler Reed at Spokane Smoke Shop to discuss declining orders...', userId: 'rep-carlos', agentId: null, timestamp: '2026-02-12T10:00:00Z', sentiment: 'negative' },
  { id: 'int-081', accountId: 'acct-015', contactId: 'contact-acct-015', channel: 'email', direction: 'outbound', subject: 'New concentrate arrivals', summary: 'Sent Hannah a preview of 3 new concentrate SKUs arriving next week', content: 'Hi Hannah, we have 3 exciting new concentrate SKUs coming in...', userId: 'rep-jake', agentId: null, timestamp: '2026-03-02T09:00:00Z', sentiment: 'positive' },
  { id: 'int-082', accountId: 'acct-013', contactId: 'contact-acct-013', channel: 'phone', direction: 'outbound', subject: 'Collections call — final warning', summary: 'Called Nina about overdue invoices. Given 7-day final notice before account suspension.', content: 'Final warning call to Nina at Vancouver Vapor about outstanding balance...', userId: 'rep-priya', agentId: null, timestamp: '2026-03-06T10:00:00Z', sentiment: 'negative' },
];

// --- Opportunities ---

export const opportunities: Opportunity[] = [
  // --- Existing 5 (verbatim) ---
  { id: 'opp-001', accountId: 'acct-cascade', type: 'category-expansion', title: 'Cascade Wellness — Preroll & Edible Expansion', estimatedValue: 8500, probability: 60, stage: 'Proposal Sent', expectedCloseDate: '2026-03-20', assignedRepId: 'rep-carlos', createdAt: '2026-03-03', notes: 'Tom interested after meeting. Needs owner approval.' },
  { id: 'opp-002', accountId: 'acct-emerald-city', type: 'reorder', title: 'Emerald City Cannabis — Win-Back Reorder', estimatedValue: 4200, probability: 25, stage: 'Outreach', expectedCloseDate: '2026-03-25', assignedRepId: 'rep-jake', createdAt: '2026-03-04', notes: 'Competitor undercut us on pricing. Need to present value prop.' },
  { id: 'opp-003', accountId: 'acct-004', type: 'new-account', title: 'Bellevue Botanicals — VMI Enrollment', estimatedValue: 15000, probability: 75, stage: 'Negotiation', expectedCloseDate: '2026-03-15', assignedRepId: 'rep-priya', createdAt: '2026-02-20', notes: 'Rachel very interested. Working on SLA terms.' },
  { id: 'opp-004', accountId: 'acct-puget-sound', type: 'category-expansion', title: 'Puget Sound — Live Rosin Line', estimatedValue: 6200, probability: 70, stage: 'Sample Sent', expectedCloseDate: '2026-03-18', assignedRepId: 'rep-priya', createdAt: '2026-03-05', notes: 'Lisa requested samples of new live rosin. Premium positioning.' },
  { id: 'opp-005', accountId: 'acct-011', type: 'reorder', title: 'Yakima Valley Green — Q2 Restock', estimatedValue: 12000, probability: 80, stage: 'Verbal Commit', expectedCloseDate: '2026-03-12', assignedRepId: 'rep-carlos', createdAt: '2026-02-28', notes: 'Roberto confirmed he wants to increase Q2 order volume.' },

  // --- New Account Acquisition (3 new) ---
  { id: 'opp-006', accountId: 'acct-016', type: 'new-account', title: 'Bainbridge Botanics — Premium Partnership', estimatedValue: 9200, probability: 20, stage: 'Prospect', expectedCloseDate: '2026-04-15', assignedRepId: 'rep-jake', createdAt: '2026-03-02', notes: 'Will mentioned interest in becoming a flagship boutique partner. Early stage.' },
  { id: 'opp-007', accountId: 'acct-harbor', type: 'new-account', title: 'Harbor Cannabis — Bulk Delivery Program', estimatedValue: 5600, probability: 40, stage: 'Meeting Scheduled', expectedCloseDate: '2026-04-01', assignedRepId: 'rep-carlos', createdAt: '2026-02-28', notes: 'Discussing monthly bulk drops to solve delivery logistics. Meeting Friday.' },
  { id: 'opp-008', accountId: 'acct-007', type: 'new-account', title: 'Tacoma Treehouse — Category Upgrade', estimatedValue: 7800, probability: 35, stage: 'Contacted', expectedCloseDate: '2026-04-10', assignedRepId: 'rep-priya', createdAt: '2026-03-01', notes: 'Derek showed interest in upgrading from mid-tier to premium flower line.' },

  // --- Reorder Proposals (5 new) ---
  { id: 'opp-009', accountId: 'acct-greenfield', type: 'reorder', title: 'Greenfield — March Monthly Reorder', estimatedValue: 3800, probability: 95, stage: 'Approved', expectedCloseDate: '2026-03-08', assignedRepId: 'rep-jake', createdAt: '2026-03-05', notes: 'Standing monthly order. VMI auto-generated, Sarah confirmed.' },
  { id: 'opp-010', accountId: 'acct-olympic', type: 'reorder', title: 'Olympic Greens — Preroll Restock Q2', estimatedValue: 8400, probability: 70, stage: 'Pending Review', expectedCloseDate: '2026-03-22', assignedRepId: 'rep-priya', createdAt: '2026-03-04', notes: 'Dana reviewing increased preroll order for spring demand.' },
  { id: 'opp-011', accountId: 'acct-001', type: 'reorder', title: 'Ballard Buds — Spring Seasonal Order', estimatedValue: 6800, probability: 65, stage: 'Pending Review', expectedCloseDate: '2026-03-25', assignedRepId: 'rep-jake', createdAt: '2026-03-03', notes: 'Jen wants to add seasonal flower strains. Reviewing catalog.' },
  { id: 'opp-012', accountId: 'acct-summit', type: 'reorder', title: 'Summit Cannabis — Flower & Concentrate Restock', estimatedValue: 5600, probability: 90, stage: 'Approved', expectedCloseDate: '2026-03-10', assignedRepId: 'rep-jake', createdAt: '2026-02-28', notes: 'Grant confirmed standard monthly restock. Shipping Monday.' },
  { id: 'opp-013', accountId: 'acct-003', type: 'reorder', title: 'Fremont Flowers — Spring Mix Order', estimatedValue: 4500, probability: 60, stage: 'Pending Review', expectedCloseDate: '2026-03-28', assignedRepId: 'rep-jake', createdAt: '2026-03-02', notes: 'Olivia reviewing spring seasonal SKU list.' },

  // --- Category Expansion (2 new) ---
  { id: 'opp-014', accountId: 'acct-evergreen', type: 'category-expansion', title: 'Evergreen Wellness — Edible Category Launch', estimatedValue: 4800, probability: 45, stage: 'Identified', expectedCloseDate: '2026-03-30', assignedRepId: 'rep-carlos', createdAt: '2026-03-02', notes: 'Maria interested in gummies and chocolates. Sent catalog, awaiting selection.' },
  { id: 'opp-015', accountId: 'acct-capitol-hill', type: 'category-expansion', title: 'Capitol Hill Collective — Cannabis Beverage Line', estimatedValue: 7200, probability: 95, stage: 'First Order Placed', expectedCloseDate: '2026-03-08', assignedRepId: 'rep-jake', createdAt: '2026-02-22', notes: 'Naomi placed first beverage order — 6 SKUs for new cooler. Delivering this week.' },
];

// --- Dashboard Metrics ---

export const dashboardMetrics: CRMDashboardMetrics = {
  totalRevenue: 1248600,
  revenueTrend: 12.4,
  activeAccounts: 18,
  activeAccountsTrend: 5.6,
  avgOrderValue: 2680,
  aovTrend: -2.1,
  ordersPending: 7,
  atRiskAccounts: 4,
  overduePayments: { count: 3, amount: 14200 },
};

// --- Briefing Items ---

export const briefingItems: BriefingItem[] = [
  { id: 'brief-001', message: 'Emerald City Cannabis hasn\'t ordered in 45 days. Previously ordered weekly. Competitor pricing likely the cause.', type: 'health', severity: 'high', accountId: 'acct-emerald-city', actions: [{ label: 'Call Amanda', action: 'call' }, { label: 'View Account', action: 'view' }] },
  { id: 'brief-002', message: 'Pacific Leaf payment is 5 days overdue ($4,200). David Kim cited POS migration delays.', type: 'payment', severity: 'high', accountId: 'acct-pacific-leaf', actions: [{ label: 'Send Reminder', action: 'email' }, { label: 'View Account', action: 'view' }] },
  { id: 'brief-003', message: 'Greenfield Dispensary VMI auto-reorder triggered — 12 SKUs, est. $3,800. Delivery scheduled Tuesday.', type: 'reorder', severity: 'low', accountId: 'acct-greenfield', actions: [{ label: 'Review Order', action: 'view' }] },
  { id: 'brief-004', message: 'Cascade Wellness showed interest in preroll expansion. Category-expansion opportunity worth $8,500.', type: 'opportunity', severity: 'medium', accountId: 'acct-cascade', actions: [{ label: 'Follow Up', action: 'call' }, { label: 'View Opp', action: 'view' }] },
  { id: 'brief-005', message: 'Vancouver Vapor has 2 overdue invoices totaling $5,600. Consider escalating to collections.', type: 'payment', severity: 'high', accountId: 'acct-013', actions: [{ label: 'Escalate', action: 'escalate' }, { label: 'View Account', action: 'view' }] },
  { id: 'brief-006', message: 'Pacific Leaf moved from A3\u2192A4 \u2014 order frequency declining 18% this month', type: 'pipeline', severity: 'high', accountId: 'acct-pacific-leaf', actions: [{ label: 'View Account', action: 'view' }] },
  { id: 'brief-007', message: 'Harbor Cannabis re-engaged (R1) after 30 days inactive \u2014 rep outreach successful', type: 'pipeline', severity: 'medium', accountId: 'acct-harbor', actions: [{ label: 'View Pipeline', action: 'view' }] },
];

// --- Chart Data ---

function generateWeekLabel(weeksAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - weeksAgo * 7);
  return d.toISOString().slice(0, 10);
}

export const revenueByCategoryWeeks: RevenueByCategoryWeek[] = Array.from({ length: 12 }, (_, i) => {
  const base = 12 - i;
  return {
    week: generateWeekLabel(12 - i),
    flower: 18000 + Math.floor(Math.random() * 6000) + base * 200,
    preroll: 8000 + Math.floor(Math.random() * 3000) + base * 100,
    vaporizer: 6000 + Math.floor(Math.random() * 2500) + base * 80,
    concentrate: 4000 + Math.floor(Math.random() * 2000) + base * 60,
    edible: 5000 + Math.floor(Math.random() * 2000) + base * 50,
    beverage: 1500 + Math.floor(Math.random() * 1000) + base * 30,
  };
});

export const healthDistribution: HealthDistribution[] = [
  { name: 'Thriving', value: 8, color: '#00E5A0' },
  { name: 'Healthy', value: 6, color: '#38BDF8' },
  { name: 'At Risk', value: 4, color: '#FBBF24' },
  { name: 'Churning', value: 3, color: '#FB7185' },
];

export const orderVolume: OrderVolume[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const orders = 8 + Math.floor(Math.random() * 12);
  return {
    date: d.toISOString().slice(0, 10),
    orders,
    movingAvg: 0,
  };
}).map((item, i, arr) => {
  // Calculate 7-day moving average
  const start = Math.max(0, i - 6);
  const window = arr.slice(start, i + 1);
  const avg = window.reduce((sum, w) => sum + w.orders, 0) / window.length;
  return { ...item, movingAvg: Math.round(avg * 10) / 10 };
});

export const topAccounts: TopAccount[] = accounts
  .sort((a, b) => b.totalRevenue - a.totalRevenue)
  .slice(0, 10)
  .map((a) => ({ name: a.name, revenue: a.totalRevenue, id: a.id }));

// --- Activity Items ---

export const recentActivity: ActivityItem[] = [
  { id: 'act-001', timestamp: '2026-03-06T08:00:00Z', type: 'agent', title: 'VMI auto-reorder generated for Greenfield Dispensary', description: '12 SKUs, estimated $3,800', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', channel: 'system' },
  { id: 'act-002', timestamp: '2026-03-05T17:30:00Z', type: 'order', title: 'Order #1247 placed by Ballard Buds', description: '$3,200 — 18 SKUs across 4 categories', accountId: 'acct-001', accountName: 'Ballard Buds', user: 'Jake Morrison' },
  { id: 'act-003', timestamp: '2026-03-05T16:00:00Z', type: 'payment', title: 'Payment received from Puget Sound Provisions', description: '$6,200 via ACH — invoice #1198', accountId: 'acct-puget-sound', accountName: 'Puget Sound Provisions', user: 'System' },
  { id: 'act-004', timestamp: '2026-03-05T14:30:00Z', type: 'interaction', title: 'Call with Amanda Torres at Emerald City Cannabis', description: 'Re-engagement attempt — went to voicemail', accountId: 'acct-emerald-city', accountName: 'Emerald City Cannabis', user: 'Jake Morrison', channel: 'phone' },
  { id: 'act-005', timestamp: '2026-03-05T12:15:00Z', type: 'health-change', title: 'Health score dropped: Kirkland Kush 68 → 64', description: 'Triggered by declining order frequency', accountId: 'acct-005', accountName: 'Kirkland Kush' },
  { id: 'act-006', timestamp: '2026-03-05T11:45:00Z', type: 'interaction', title: 'SMS from David Kim at Pacific Leaf', description: 'Payment delay notice — POS migration', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf', user: 'Priya Patel', channel: 'sms' },
  { id: 'act-007', timestamp: '2026-03-05T10:00:00Z', type: 'order', title: 'Order #1246 placed by Fremont Flowers', description: '$2,950 — 14 SKUs, flower and prerolls', accountId: 'acct-003', accountName: 'Fremont Flowers', user: 'Jake Morrison' },
  { id: 'act-008', timestamp: '2026-03-05T09:15:00Z', type: 'interaction', title: 'Email to Sarah Chen at Greenfield Dispensary', description: 'Weekly order confirmation — 24 SKUs, $3,800', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', user: 'Jake Morrison', channel: 'email' },
  { id: 'act-009', timestamp: '2026-03-05T08:30:00Z', type: 'interaction', title: 'Email from Lisa Park at Puget Sound Provisions', description: 'Inquiry about new live rosin line', accountId: 'acct-puget-sound', accountName: 'Puget Sound Provisions', user: 'Priya Patel', channel: 'email' },
  { id: 'act-010', timestamp: '2026-03-05T07:45:00Z', type: 'interaction', title: 'Email from Rachel Nguyen at Bellevue Botanicals', description: 'VMI enrollment interest', accountId: 'acct-004', accountName: 'Bellevue Botanicals', user: 'Priya Patel', channel: 'email' },
  { id: 'act-011', timestamp: '2026-03-04T16:20:00Z', type: 'interaction', title: 'Win-back offer sent to Kirkland Kush', description: '10% discount on next 3 orders', accountId: 'acct-005', accountName: 'Kirkland Kush', user: 'Priya Patel', channel: 'email' },
  { id: 'act-012', timestamp: '2026-03-04T15:00:00Z', type: 'interaction', title: 'Meeting with Tom Wheeler at Cascade Wellness', description: 'Category expansion pitch — prerolls and edibles', accountId: 'acct-cascade', accountName: 'Cascade Wellness', user: 'Carlos Ruiz', channel: 'meeting' },
  { id: 'act-013', timestamp: '2026-03-04T14:00:00Z', type: 'order', title: 'Order #1245 placed by Bellevue Botanicals', description: '$3,450 — full category mix', accountId: 'acct-004', accountName: 'Bellevue Botanicals', user: 'Priya Patel' },
  { id: 'act-014', timestamp: '2026-03-04T11:00:00Z', type: 'payment', title: 'Payment received from Olympia Organics', description: '$2,800 via ACH — invoice #1192', accountId: 'acct-008', accountName: 'Olympia Organics', user: 'System' },
  { id: 'act-015', timestamp: '2026-03-04T10:00:00Z', type: 'interaction', title: 'Monthly check-in with Ballard Buds', description: 'All on track, discussed Q2 targets', accountId: 'acct-001', accountName: 'Ballard Buds', user: 'Jake Morrison', channel: 'phone' },
  { id: 'act-016', timestamp: '2026-03-04T09:00:00Z', type: 'interaction', title: 'Internal note: Vancouver Vapor escalation', description: '2 overdue invoices, flagged for manager review', accountId: 'acct-013', accountName: 'Vancouver Vapor', user: 'Priya Patel', channel: 'note' },
  { id: 'act-017', timestamp: '2026-03-03T16:00:00Z', type: 'health-change', title: 'Health score improved: Yakima Valley Green 68 → 71', description: 'Triggered by increased order frequency', accountId: 'acct-011', accountName: 'Yakima Valley Green' },
  { id: 'act-018', timestamp: '2026-03-03T14:00:00Z', type: 'order', title: 'Order #1244 placed by Tacoma Treehouse', description: '$2,050 — flower and prerolls', accountId: 'acct-007', accountName: 'Tacoma Treehouse', user: 'Priya Patel' },
  { id: 'act-019', timestamp: '2026-03-03T12:00:00Z', type: 'payment', title: 'Overdue: Pacific Leaf invoice #1180', description: '$4,200 now 5 days past due', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf' },
  { id: 'act-020', timestamp: '2026-03-03T10:00:00Z', type: 'order', title: 'Order #1243 placed by Everett Extracts', description: '$2,700 — concentrate-heavy mix', accountId: 'acct-015', accountName: 'Everett Extracts', user: 'Jake Morrison' },

  // --- 20 additional activity items ---
  { id: 'act-021', timestamp: '2026-03-06T10:00:00Z', type: 'interaction', title: 'Collections call to Vancouver Vapor', description: '7-day final notice before account suspension', accountId: 'acct-013', accountName: 'Vancouver Vapor', user: 'Priya Patel', channel: 'phone' },
  { id: 'act-022', timestamp: '2026-03-06T09:00:00Z', type: 'order', title: 'Order #1248 placed by Capitol Hill Collective', description: '$3,800 — first beverage order + concentrate restock', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective', user: 'Jake Morrison' },
  { id: 'act-023', timestamp: '2026-03-06T07:30:00Z', type: 'agent', title: 'VMI reorder triggered for Summit Cannabis Co.', description: '6 concentrate SKUs, estimated $2,200', accountId: 'acct-summit', accountName: 'Summit Cannabis Co.', channel: 'system' },
  { id: 'act-024', timestamp: '2026-03-05T15:00:00Z', type: 'interaction', title: 'Payment collection call to Rainier Remedies', description: 'Victor promised payment by Friday — 3rd attempt', accountId: 'acct-rainier', accountName: 'Rainier Remedies', user: 'Priya Patel', channel: 'phone' },
  { id: 'act-025', timestamp: '2026-03-05T13:00:00Z', type: 'order', title: 'Order #1249 placed by Olympic Greens', description: '$2,700 — weekly preroll restock, 48 units', accountId: 'acct-olympic', accountName: 'Olympic Greens', user: 'Priya Patel' },
  { id: 'act-026', timestamp: '2026-03-04T18:00:00Z', type: 'interaction', title: 'SMS from Jenny Wu at Rainier Remedies', description: 'Asked for patience — Victor dealing with personal issues', accountId: 'acct-rainier', accountName: 'Rainier Remedies', user: 'Priya Patel', channel: 'sms' },
  { id: 'act-027', timestamp: '2026-03-04T12:00:00Z', type: 'interaction', title: 'Naomi Chen wants exclusive on new solventless brand', description: 'Capitol Hill Collective requesting first-mover placement', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective', user: 'Jake Morrison', channel: 'email' },
  { id: 'act-028', timestamp: '2026-03-04T08:00:00Z', type: 'health-change', title: 'Health score dropped: Rainier Remedies 52 → 45', description: 'Two overdue invoices, no orders in 24 days', accountId: 'acct-rainier', accountName: 'Rainier Remedies' },
  { id: 'act-029', timestamp: '2026-03-03T17:00:00Z', type: 'order', title: 'Order #1250 placed by Redmond Relief', description: '$2,100 — standard mid-tier mix', accountId: 'acct-006', accountName: 'Redmond Relief', user: 'Priya Patel' },
  { id: 'act-030', timestamp: '2026-03-03T15:30:00Z', type: 'payment', title: 'Payment received from Bellingham Bloom', description: '$2,400 via ACH — invoice #1195', accountId: 'acct-012', accountName: 'Bellingham Bloom', user: 'System' },
  { id: 'act-031', timestamp: '2026-03-03T09:00:00Z', type: 'interaction', title: 'Weekly preroll restock confirmed for Olympic Greens', description: '48 units, 6 SKUs — standing weekly order', accountId: 'acct-olympic', accountName: 'Olympic Greens', user: 'Priya Patel', channel: 'email' },
  { id: 'act-032', timestamp: '2026-03-02T16:00:00Z', type: 'health-change', title: 'Health score improved: Capitol Hill Collective 85 → 88', description: 'VMI enrolled, increased order frequency', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective' },
  { id: 'act-033', timestamp: '2026-03-02T14:00:00Z', type: 'order', title: 'Order #1251 placed by Summit Cannabis Co.', description: '$2,800 — flower and concentrate monthly restock', accountId: 'acct-summit', accountName: 'Summit Cannabis Co.', user: 'Jake Morrison' },
  { id: 'act-034', timestamp: '2026-03-02T11:00:00Z', type: 'interaction', title: 'Edible catalog sent to Evergreen Wellness', description: 'Maria reviewing 8-SKU starter pack proposal', accountId: 'acct-evergreen', accountName: 'Evergreen Wellness', user: 'Carlos Ruiz', channel: 'email' },
  { id: 'act-035', timestamp: '2026-03-02T09:00:00Z', type: 'payment', title: 'Payment received from Summit Cannabis Co.', description: '$2,800 via ACH — invoice #1196', accountId: 'acct-summit', accountName: 'Summit Cannabis Co.', user: 'System' },
  { id: 'act-036', timestamp: '2026-03-01T16:00:00Z', type: 'agent', title: 'VMI first auto-reorder for Capitol Hill Collective', description: '10 SKUs concentrate + vape, estimated $3,200', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective', channel: 'system' },
  { id: 'act-037', timestamp: '2026-03-01T13:00:00Z', type: 'order', title: 'Order #1252 placed by Evergreen Wellness', description: '$2,180 — flower + first edible add-on', accountId: 'acct-evergreen', accountName: 'Evergreen Wellness', user: 'Carlos Ruiz' },
  { id: 'act-038', timestamp: '2026-03-01T10:00:00Z', type: 'payment', title: 'Overdue: Rainier Remedies invoice #1165', description: '$4,200 now 22 days past due', accountId: 'acct-rainier', accountName: 'Rainier Remedies' },
  { id: 'act-039', timestamp: '2026-03-01T09:00:00Z', type: 'interaction', title: 'Rainier Remedies escalated to manager', description: 'Priya flagged payment deterioration over 60 days', accountId: 'acct-rainier', accountName: 'Rainier Remedies', user: 'Priya Patel', channel: 'note' },
  { id: 'act-040', timestamp: '2026-02-28T15:00:00Z', type: 'health-change', title: 'Health score improved: Evergreen Wellness 68 → 72', description: 'Growing order frequency, expanding categories', accountId: 'acct-evergreen', accountName: 'Evergreen Wellness' },
];

// --- Revenue Sparkline Data (for metric cards) ---

export const revenueSparkline = [42, 45, 38, 48, 52, 46, 51, 55, 49, 58, 53, 62];
export const accountsSparkline = [15, 16, 16, 17, 17, 18, 17, 18, 18, 18, 19, 18];
export const aovSparkline = [2800, 2750, 2820, 2680, 2720, 2690, 2740, 2650, 2700, 2680, 2710, 2680];
export const ordersSparkline = [12, 8, 15, 10, 7, 11, 9, 14, 8, 12, 7, 10];

// --- Factory Functions with Simulated Delays ---

// --- KPI Metrics ---

const kpiMetrics: KPIMetric[] = [
  { label: 'Order Freq', value: 4.2, unit: '/mo', trend: 5.3, category: 'order' },
  { label: 'Basket Size', value: 18, unit: 'SKUs', trend: 2.1, category: 'basket' },
  { label: 'Sell-Through', value: 78, unit: '%', trend: 3.4, category: 'sell-through' },
  { label: 'Revenue', value: 142800, unit: '$', trend: 8.2, category: 'revenue' },
  { label: 'Days to Pay', value: 12, unit: 'days', trend: -6.1, category: 'payment' },
  { label: 'Relationship', value: 82, unit: '/100', trend: 1.8, category: 'relationship' },
  { label: 'Wallet Share', value: 34, unit: '%', trend: -2.4, category: 'competitive' },
];

// --- Pipeline Distribution ---

const pipelineDistribution: PipelineDistribution[] = [
  { phase: 1, phaseLabel: 'Phase 1', active: 2, inactive: 2, recovery: 2 },
  { phase: 2, phaseLabel: 'Phase 2', active: 4, inactive: 1, recovery: 1 },
  { phase: 3, phaseLabel: 'Phase 3', active: 5, inactive: 1, recovery: 1 },
  { phase: 4, phaseLabel: 'Phase 4', active: 3, inactive: 1, recovery: 1 },
  { phase: 5, phaseLabel: 'Phase 5', active: 2, inactive: 1, recovery: 1 },
];

// --- Recovery Funnel ---

const recoveryFunnel: RecoveryFunnel[] = [
  { phase: 'R1 Re-engaged', count: 6, conversionRate: 100 },
  { phase: 'R2 Rebuilding', count: 4, conversionRate: 67 },
  { phase: 'R3 Stabilizing', count: 3, conversionRate: 50 },
  { phase: 'R4 Strengthening', count: 2, conversionRate: 33 },
  { phase: 'R5 Graduated', count: 2, conversionRate: 33 },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAccounts(filters?: { status?: string; region?: string; search?: string }): Promise<Account[]> {
  await delay(350);
  let result = [...accounts];
  if (filters?.status) result = result.filter((a) => a.status === filters.status);
  if (filters?.region) result = result.filter((a) => a.region === filters.region);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((a) => a.name.toLowerCase().includes(q) || a.dba.toLowerCase().includes(q));
  }
  return result;
}

export async function getAccount(id: string): Promise<Account | null> {
  await delay(300);
  return accounts.find((a) => a.id === id) || null;
}

export async function getInteractions(accountId?: string): Promise<Interaction[]> {
  await delay(350);
  if (accountId) return interactions.filter((i) => i.accountId === accountId);
  return interactions;
}

export async function getOpportunities(filters?: { accountId?: string; stage?: string }): Promise<Opportunity[]> {
  await delay(300);
  let result = [...opportunities];
  if (filters?.accountId) result = result.filter((o) => o.accountId === filters.accountId);
  if (filters?.stage) result = result.filter((o) => o.stage === filters.stage);
  return result;
}

export async function getSalesReps(): Promise<SalesRep[]> {
  await delay(300);
  return salesReps;
}

export async function getDashboardData(): Promise<CRMDashboardData> {
  await delay(400);
  return {
    metrics: dashboardMetrics,
    briefingItems,
    revenueByCategoryWeeks,
    healthDistribution,
    orderVolume,
    topAccounts,
    recentActivity,
    kpiMetrics,
    pipelineDistribution,
    recoveryFunnel,
  };
}
