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
} from '@/modules/crm/types';

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

// --- Generated Accounts ---

function makeAccount(
  id: string, name: string, dba: string, license: string, street: string, city: string, zip: string,
  lat: number, lng: number, region: string, repId: string, health: number,
  trend: Account['healthTrend'], status: Account['status'], vmi: boolean,
  totalRev: number, thirtyRev: number, aov: number, orders: number,
  payment: Account['paymentReliability'], payMethod: Account['preferredPaymentMethod'],
  segments: string[], lastOrder: string | null, contactName: string, contactRole: Contact['role'],
  contactPhone: string, contactEmail: string, created: string,
): Account {
  return {
    id, name, dba, licenseNumber: license,
    licenseExpiration: '2027-06-30',
    address: { street, city, state: 'WA', zip, lat, lng },
    region, assignedRepId: repId,
    healthScore: health, healthTrend: trend, vmiEnrolled: vmi, status, segments,
    createdAt: created, lastOrderDate: lastOrder,
    totalRevenue: totalRev, thirtyDayRevenue: thirtyRev, avgOrderValue: aov, orderCount: orders,
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
  makeAccount('acct-001', 'Ballard Buds', 'Ballard Buds LLC', 'WA-CCB-420301', '5412 Ballard Ave NW', 'Seattle', '98107', 47.6687, -122.3855, 'Seattle Metro', 'rep-jake', 88, 'stable', 'active', true, 312400, 28600, 3200, 98, 'excellent', 'ach', ['high-volume', 'vmi'], '2026-03-05', 'Jen Takahashi', 'buyer', '(206) 555-0301', 'jen@ballardbuds.com', '2024-07-15'),
  makeAccount('acct-002', 'Capitol Hill Green', 'CHG Cannabis Inc', 'WA-CCB-420302', '1020 E Pike St', 'Seattle', '98122', 47.6144, -122.3197, 'Seattle Metro', 'rep-jake', 76, 'stable', 'active', false, 186900, 16400, 2600, 72, 'good', 'cod', ['mid-tier'], '2026-03-01', 'Marcus Bell', 'buyer', '(206) 555-0302', 'marcus@capitolhillgreen.com', '2024-08-22'),
  makeAccount('acct-003', 'Fremont Flowers', 'Fremont Cannabis Co', 'WA-CCB-420303', '3501 Fremont Pl N', 'Seattle', '98103', 47.6512, -122.3506, 'Seattle Metro', 'rep-jake', 81, 'improving', 'active', false, 224600, 21000, 2950, 76, 'good', 'ach', ['premium'], '2026-03-02', 'Olivia Grant', 'buyer', '(206) 555-0303', 'olivia@fremontflowers.com', '2024-09-10'),
  makeAccount('acct-004', 'Bellevue Botanicals', 'BB Wellness LLC', 'WA-CCB-420304', '890 Bellevue Way NE', 'Bellevue', '98004', 47.6153, -122.2026, 'Eastside', 'rep-priya', 91, 'stable', 'active', true, 267800, 24100, 3450, 78, 'excellent', 'ach', ['premium', 'vmi'], '2026-03-04', 'Rachel Nguyen', 'buyer', '(425) 555-0304', 'rachel@bellevuebotanicals.com', '2024-05-20'),
  makeAccount('acct-005', 'Kirkland Kush', 'KK Enterprises', 'WA-CCB-420305', '12030 NE 85th St', 'Kirkland', '98033', 47.6808, -122.1965, 'Eastside', 'rep-priya', 64, 'declining', 'at-risk', false, 98700, 5600, 1800, 55, 'fair', 'cod', ['mid-tier', 'at-risk'], '2026-02-15', 'Steve Park', 'manager', '(425) 555-0305', 'steve@kirklandkush.com', '2025-01-10'),
  makeAccount('acct-006', 'Redmond Relief', 'Redmond Relief Dispensary', 'WA-CCB-420306', '16420 Redmond Way', 'Redmond', '98052', 47.6740, -122.1215, 'Eastside', 'rep-priya', 73, 'stable', 'active', false, 145600, 12800, 2100, 69, 'good', 'cod', ['mid-tier'], '2026-02-28', 'Karen Osei', 'buyer', '(425) 555-0306', 'karen@redmondrelief.com', '2024-11-05'),
  makeAccount('acct-007', 'Tacoma Treehouse', 'Treehouse Cannabis LLC', 'WA-CCB-420307', '2714 6th Ave', 'Tacoma', '98406', 47.2570, -122.4647, 'Tacoma', 'rep-priya', 69, 'stable', 'active', false, 118400, 10200, 2050, 58, 'good', 'cod', ['mid-tier'], '2026-03-01', 'Derek Johnson', 'buyer', '(253) 555-0307', 'derek@tacomaTreehouse.com', '2025-02-14'),
  makeAccount('acct-008', 'Olympia Organics', 'Olympia Organics Corp', 'WA-CCB-420308', '522 4th Ave E', 'Olympia', '98501', 47.0462, -122.8966, 'Olympia', 'rep-priya', 82, 'improving', 'active', false, 167200, 15800, 2800, 60, 'excellent', 'ach', ['premium', 'organic'], '2026-03-03', 'Megan Fox', 'owner', '(360) 555-0308', 'megan@olympiaorganics.com', '2024-10-01'),
  makeAccount('acct-009', 'Spokane Smoke Shop', 'SSS Holdings', 'WA-CCB-420309', '2104 N Monroe St', 'Spokane', '99205', 47.6728, -117.4281, 'Spokane', 'rep-carlos', 55, 'declining', 'at-risk', false, 67400, 3800, 1500, 45, 'fair', 'cod', ['budget', 'at-risk'], '2026-02-10', 'Tyler Reed', 'buyer', '(509) 555-0309', 'tyler@spokanesmoke.com', '2025-03-20'),
  makeAccount('acct-010', 'Walla Walla Weed Co', 'WW Cannabis LLC', 'WA-CCB-420310', '15 E Main St', 'Walla Walla', '99362', 46.0646, -118.3387, 'Eastern WA', 'rep-carlos', 62, 'stable', 'active', false, 54200, 4600, 1700, 32, 'good', 'mail', ['rural'], '2026-02-20', 'Amy Collins', 'buyer', '(509) 555-0310', 'amy@wallawallaweed.com', '2025-04-15'),
  makeAccount('acct-011', 'Yakima Valley Green', 'YVG Dispensary', 'WA-CCB-420311', '110 S 2nd St', 'Yakima', '98901', 46.6021, -120.5059, 'Eastern WA', 'rep-carlos', 71, 'improving', 'active', false, 78900, 7200, 1950, 41, 'good', 'cod', ['mid-tier'], '2026-03-01', 'Roberto Silva', 'buyer', '(509) 555-0311', 'roberto@yvgreen.com', '2025-05-01'),
  makeAccount('acct-012', 'Bellingham Bloom', 'BB Cannabis Co', 'WA-CCB-420312', '1298 Railroad Ave', 'Bellingham', '98225', 48.7519, -122.4787, 'NW Washington', 'rep-jake', 77, 'stable', 'active', false, 134500, 11400, 2400, 56, 'good', 'ach', ['mid-tier'], '2026-03-02', 'Claire Dawson', 'buyer', '(360) 555-0312', 'claire@bellinghambloom.com', '2024-12-01'),
  makeAccount('acct-013', 'Vancouver Vapor', 'VV Holdings', 'WA-CCB-420313', '1600 Main St', 'Vancouver', '98660', 45.6387, -122.6615, 'SW Washington', 'rep-priya', 44, 'declining', 'at-risk', false, 42100, 1800, 1400, 30, 'poor', 'cod', ['budget', 'at-risk'], '2026-01-30', 'Nina Walsh', 'buyer', '(360) 555-0313', 'nina@vancouvervapor.com', '2025-06-15'),
  makeAccount('acct-014', 'Tri-Cities Terpenes', 'TCT Cannabis', 'WA-CCB-420314', '234 George Washington Way', 'Richland', '99352', 46.2804, -119.2752, 'Eastern WA', 'rep-carlos', 66, 'stable', 'active', false, 89300, 7800, 1850, 48, 'good', 'mail', ['mid-tier'], '2026-02-25', 'Jason Briggs', 'buyer', '(509) 555-0314', 'jason@tricitiesterp.com', '2025-01-20'),
  makeAccount('acct-015', 'Everett Extracts', 'EE Dispensary LLC', 'WA-CCB-420315', '2930 Colby Ave', 'Everett', '98201', 47.9790, -122.2021, 'North Sound', 'rep-jake', 79, 'improving', 'active', false, 156800, 14200, 2700, 58, 'good', 'ach', ['premium'], '2026-03-03', 'Hannah Lee', 'buyer', '(425) 555-0315', 'hannah@everettextracts.com', '2024-08-10'),
  makeAccount('acct-016', 'Bainbridge Botanics', 'Bainbridge Cannabis', 'WA-CCB-420316', '180 Winslow Way E', 'Bainbridge Island', '98110', 47.6265, -122.5091, 'Kitsap', 'rep-jake', 83, 'stable', 'active', false, 92100, 8400, 3070, 30, 'excellent', 'ach', ['boutique', 'premium'], '2026-03-02', 'Will Thornton', 'owner', '(206) 555-0316', 'will@bainbridgebotanics.com', '2025-03-01'),
];

// --- All Accounts ---
export const accounts: Account[] = [
  greenfield, pacificLeaf, emeraldCity, cascadeWellness, pugetSound,
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
];

// --- Opportunities ---

export const opportunities: Opportunity[] = [
  { id: 'opp-001', accountId: 'acct-cascade', type: 'category-expansion', title: 'Cascade Wellness — Preroll & Edible Expansion', estimatedValue: 8500, probability: 60, stage: 'Proposal Sent', expectedCloseDate: '2026-03-20', assignedRepId: 'rep-carlos', createdAt: '2026-03-03', notes: 'Tom interested after meeting. Needs owner approval.' },
  { id: 'opp-002', accountId: 'acct-emerald-city', type: 'reorder', title: 'Emerald City Cannabis — Win-Back Reorder', estimatedValue: 4200, probability: 25, stage: 'Outreach', expectedCloseDate: '2026-03-25', assignedRepId: 'rep-jake', createdAt: '2026-03-04', notes: 'Competitor undercut us on pricing. Need to present value prop.' },
  { id: 'opp-003', accountId: 'acct-004', type: 'new-account', title: 'Bellevue Botanicals — VMI Enrollment', estimatedValue: 15000, probability: 75, stage: 'Negotiation', expectedCloseDate: '2026-03-15', assignedRepId: 'rep-priya', createdAt: '2026-02-20', notes: 'Rachel very interested. Working on SLA terms.' },
  { id: 'opp-004', accountId: 'acct-puget-sound', type: 'category-expansion', title: 'Puget Sound — Live Rosin Line', estimatedValue: 6200, probability: 70, stage: 'Sample Sent', expectedCloseDate: '2026-03-18', assignedRepId: 'rep-priya', createdAt: '2026-03-05', notes: 'Lisa requested samples of new live rosin. Premium positioning.' },
  { id: 'opp-005', accountId: 'acct-011', type: 'reorder', title: 'Yakima Valley Green — Q2 Restock', estimatedValue: 12000, probability: 80, stage: 'Verbal Commit', expectedCloseDate: '2026-03-12', assignedRepId: 'rep-carlos', createdAt: '2026-02-28', notes: 'Roberto confirmed he wants to increase Q2 order volume.' },
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
];

// --- Revenue Sparkline Data (for metric cards) ---

export const revenueSparkline = [42, 45, 38, 48, 52, 46, 51, 55, 49, 58, 53, 62];
export const accountsSparkline = [15, 16, 16, 17, 17, 18, 17, 18, 18, 18, 19, 18];
export const aovSparkline = [2800, 2750, 2820, 2680, 2720, 2690, 2740, 2650, 2700, 2680, 2710, 2680];
export const ordersSparkline = [12, 8, 15, 10, 7, 11, 9, 14, 8, 12, 7, 10];

// --- Factory Functions with Simulated Delays ---

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
  };
}
