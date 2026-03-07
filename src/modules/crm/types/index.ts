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
