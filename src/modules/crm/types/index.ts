// CRM Domain Types

export interface Contact {
  id: string;
  name: string;
  role: 'buyer' | 'owner' | 'budtender' | 'manager' | 'other';
  phone: string;
  email: string;
  preferredChannel: 'phone' | 'email' | 'sms' | 'whatsapp';
  isPrimary: boolean;
}

export interface Account {
  id: string;
  name: string;
  dba: string;
  licenseNumber: string;
  licenseExpiration: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  region: string;
  assignedRepId: string;
  healthScore: number;
  healthTrend: 'improving' | 'stable' | 'declining';
  vmiEnrolled: boolean;
  status: 'active' | 'at-risk' | 'churning' | 'prospect' | 'inactive';
  segments: string[];
  createdAt: string;
  lastOrderDate: string | null;
  totalRevenue: number;
  thirtyDayRevenue: number;
  avgOrderValue: number;
  orderCount: number;
  paymentReliability: 'excellent' | 'good' | 'fair' | 'poor';
  preferredPaymentMethod: 'cod' | 'ach' | 'mail';
  deliveryPreferences: {
    window: string;
    instructions: string;
    contactName: string;
    contactPhone: string;
  };
  categoryMix: {
    category: string;
    percentage: number;
    revenue: number;
  }[];
  contacts: Contact[];
}

export interface Interaction {
  id: string;
  accountId: string;
  contactId: string | null;
  channel: 'phone' | 'email' | 'sms' | 'whatsapp' | 'meeting' | 'note' | 'agent';
  direction: 'inbound' | 'outbound';
  subject: string;
  summary: string;
  content: string;
  userId: string;
  agentId: string | null;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative' | null;
}

export interface Opportunity {
  id: string;
  accountId: string;
  type: 'new-account' | 'reorder' | 'category-expansion';
  title: string;
  estimatedValue: number;
  probability: number;
  stage: string;
  expectedCloseDate: string;
  assignedRepId: string;
  createdAt: string;
  notes: string;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  territory: string;
  avatarUrl: string | null;
  revenue: number;
  accountCount: number;
  activeOpportunities: number;
}

export interface CRMDashboardMetrics {
  totalRevenue: number;
  revenueTrend: number;
  activeAccounts: number;
  activeAccountsTrend: number;
  avgOrderValue: number;
  aovTrend: number;
  ordersPending: number;
  atRiskAccounts: number;
  overduePayments: { count: number; amount: number };
}

export interface BriefingItem {
  id: string;
  message: string;
  type: 'reorder' | 'payment' | 'health' | 'competitive' | 'opportunity';
  severity: 'high' | 'medium' | 'low';
  accountId: string | null;
  actions: { label: string; action: string }[];
}

export interface RevenueByCategoryWeek {
  week: string;
  flower: number;
  preroll: number;
  vaporizer: number;
  concentrate: number;
  edible: number;
  beverage: number;
}

export interface HealthDistribution {
  name: string;
  value: number;
  color: string;
}

export interface OrderVolume {
  date: string;
  orders: number;
  movingAvg: number;
}

export interface TopAccount {
  name: string;
  revenue: number;
  id: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'order' | 'payment' | 'interaction' | 'agent' | 'health-change';
  title: string;
  description?: string;
  accountId: string;
  accountName: string;
  user?: string;
  channel?: string;
}

export interface CRMDashboardData {
  metrics: CRMDashboardMetrics;
  briefingItems: BriefingItem[];
  revenueByCategoryWeeks: RevenueByCategoryWeek[];
  healthDistribution: HealthDistribution[];
  orderVolume: OrderVolume[];
  topAccounts: TopAccount[];
  recentActivity: ActivityItem[];
}

// --- Account Detail Types ---

export interface AccountOrder {
  id: string;
  date: string;
  orderNumber: string;
  skuCount: number;
  categories: string[];
  total: number;
  status: 'delivered' | 'in-transit' | 'processing' | 'cancelled';
}

export interface HealthFactor {
  label: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
}

export interface HealthRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AccountHealthData {
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  factors: HealthFactor[];
  recommendations: HealthRecommendation[];
  history: { date: string; score: number }[];
}

export interface VMISellThrough {
  week: string;
  units: number;
}

export interface VMIInventoryLevel {
  category: string;
  current: number;
  par: number;
}

export interface VMIDaysOnHand {
  category: string;
  days: number;
}

export interface AccountVMIData {
  enrolled: boolean;
  enrolledDate: string | null;
  sellThrough: VMISellThrough[];
  inventoryLevels: VMIInventoryLevel[];
  daysOnHand: VMIDaysOnHand[];
  lastReorderDate: string | null;
  autoReorderCount: number;
}

export interface AccountPayment {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidDate: string | null;
  method: 'cod' | 'ach' | 'mail' | null;
}

export interface AccountPaymentSummary {
  outstanding: number;
  reliability: number;
  avgDaysToPay: number;
  payments: AccountPayment[];
}

export interface AccountDelivery {
  id: string;
  date: string;
  orderNumber: string;
  status: 'delivered' | 'in-transit' | 'scheduled' | 'failed';
  driver: string;
  window: string;
  deliveredAt: string | null;
  items: number;
}

export interface AccountDeliverySummary {
  preferredWindow: string;
  avgDeliveryMinutes: number;
  onTimeRate: number;
  deliveries: AccountDelivery[];
}

export interface AccountFile {
  id: string;
  name: string;
  type: 'coa' | 'contract' | 'invoice' | 'license' | 'other';
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  url: string;
}

export interface AccountNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  pinned: boolean;
}

export type AccountDetailTab =
  | 'profile' | 'purchases' | 'health' | 'vmi'
  | 'interactions' | 'opportunities' | 'payments'
  | 'deliveries' | 'files' | 'notes';
