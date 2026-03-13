// CRM Domain Types

// --- Pipeline Types ---

export type PipelineStatus = 'active' | 'inactive' | 'recovery';
export type PipelinePhase = 1 | 2 | 3 | 4 | 5;

export interface PipelineTransition {
  from: { status: PipelineStatus; phase: PipelinePhase };
  to: { status: PipelineStatus; phase: PipelinePhase };
  date: string;
  trigger: string;
}

export interface PipelineInfo {
  status: PipelineStatus;
  phase: PipelinePhase;
  code: string;
  name: string;
  enteredDate: string;
  previousCode?: string;
  previousDate?: string;
  assignedRep: string;
  nextReviewDate?: string;
  notes?: string;
}

export const PIPELINE_PHASE_LABELS: Record<
  PipelineStatus,
  Record<PipelinePhase, string>
> = {
  active: {
    1: 'New Buyer',
    2: 'Established',
    3: 'Growing',
    4: 'Premium',
    5: 'Strategic Partner',
  },
  inactive: {
    1: 'Cold Lead',
    2: 'Contacted',
    3: 'Engaged',
    4: 'Sampling',
    5: 'Converting',
  },
  recovery: {
    1: 'Signal Detected',
    2: 'Confirmed Decline',
    3: 'Active Recovery',
    4: 'Re-engaging',
    5: 'Recovered',
  },
};

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
  /** Link to corresponding DispensaryLocation.id on the website (e.g. "disp-001") */
  dispensaryId?: string;
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
  pipelineStatus: PipelineStatus;
  pipelinePhase: PipelinePhase;
  pipelineHistory: PipelineTransition[];
  pipeline: PipelineInfo;
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
  sentimentScore?: number;        // 0-100, aggregated from interactions
  sentimentTrend?: 'improving' | 'stable' | 'declining';
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
  type:
    | 'reorder'
    | 'payment'
    | 'health'
    | 'competitive'
    | 'opportunity'
    | 'pipeline';
  severity: 'high' | 'medium' | 'low';
  accountId: string | null;
  actions: { label: string; action: string }[];
}

export interface KPIMetric {
  label: string;
  value: number;
  unit: string;
  trend: number;
  category:
    | 'order'
    | 'basket'
    | 'sell-through'
    | 'revenue'
    | 'payment'
    | 'relationship'
    | 'competitive';
}

export interface PipelineDistribution {
  phase: number;
  phaseLabel: string;
  active: number;
  inactive: number;
  recovery: number;
}

export interface RecoveryFunnel {
  phase: string;
  count: number;
  conversionRate: number;
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
  kpiMetrics: KPIMetric[];
  pipelineDistribution: PipelineDistribution[];
  recoveryFunnel: RecoveryFunnel[];
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

// --- Outreach Types ---

export interface Campaign {
  id: string;
  name: string;
  type: 'morning-reorder' | 'product-launch' | 'win-back' | 'seasonal' | 'custom';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  targetSegment: string;
  targetCount: number;
  channel: 'email' | 'sms' | 'multi';
  sentCount: number;
  openRate: number;
  responseRate: number;
  ordersGenerated: number;
  revenueAttributed: number;
  scheduledAt: string | null;
  completedAt: string | null;
  createdBy: string;
  messageTemplate: string;
}

export interface CampaignRecipient {
  accountId: string;
  accountName: string;
  status: 'sent' | 'opened' | 'responded' | 'ordered';
  sentAt: string;
  openedAt: string | null;
  respondedAt: string | null;
  orderPlaced: boolean;
}

export interface CampaignDetail extends Campaign {
  recipients: CampaignRecipient[];
}

export interface VendorDayReport {
  attendance: string;
  productsShowcased: string[];
  budtenderFeedback: string;
  competitorObservations: string;
  followUpActions: string[];
  photos: number;
}

export interface VendorDay {
  id: string;
  accountId: string;
  accountName: string;
  date: string;
  ambassador: string;
  purpose: 'product-education' | 'new-product-intro' | 'relationship-building' | 'promotional';
  status: 'scheduled' | 'completed' | 'cancelled';
  report?: VendorDayReport;
}

export interface VendorDayImpact {
  accountId: string;
  preVisitRevenue: number;
  postVisitRevenue: number;
  lift: number;
  preVisitCategories: number;
  postVisitCategories: number;
}

// --- Sales Types ---

export interface ProposedProduct {
  sku: string;
  name: string;
  category: string;
  qty: number;
  unitPrice: number;
  lastOrderPrice: number;
}

export interface ReorderProposal {
  id: string;
  accountId: string;
  accountName: string;
  proposedProducts: ProposedProduct[];
  totalValue: number;
  confidence: number;
  source: 'vmi-velocity' | 'cadence-analysis' | 'manual';
  reasoning: string;
  daysSinceLastOrder: number;
  status: 'pending' | 'approved' | 'sent' | 'ordered' | 'rejected';
  pipelineCode?: string;
  createdAt: string;
  modifiedAt: string;
  draftEmail: string;
}

export interface PriceBookEntry {
  id: string;
  productName: string;
  category: string;
  subCategory: string;
  packageSize: string;
  defaultPrice: number;
  cost: number;
  margin: number;
  tier1Price: number;
  tier2Price: number;
  tier3Price: number;
}

export interface LeaderboardRep extends SalesRep {
  rank: number;
  periodRevenue: number;
  periodOrders: number;
  newAccounts: number;
  healthImprovement: number;
  proposalAcceptRate: number;
  trend: 'up' | 'down' | 'flat';
  streakDays: number;
  goalProgress: number;
  topAccounts: { name: string; revenue: number }[];
}

// --- AI Copilot Types ---

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: { type: string; label: string }[];
  suggestedActions?: { label: string; action: string }[];
}

export interface CopilotSuggestion {
  id: string;
  text: string;
  category: 'account-briefing' | 'comparative' | 'communication' | 'forecasting' | 'strategy' | 'data-query';
}

// --- Territory Types ---

export interface TerritoryAccount {
  id: string;
  name: string;
  lat: number;
  lng: number;
  health: number;
  revenue30d: number;
  status: 'active' | 'at-risk' | 'churning' | 'prospect' | 'inactive';
  vmiEnrolled: boolean;
}

export interface TerritoryData {
  repId: string;
  repName: string;
  color: string;
  bounds: { lat: number; lng: number }[][];
  accounts: TerritoryAccount[];
}

export interface TerritoryMetrics {
  repId: string;
  repName: string;
  totalAccounts: number;
  totalRevenue: number;
  avgHealth: number;
  atRiskCount: number;
}

// --- Segment Types ---

export interface SegmentCriterion {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in' | 'between';
  value: string | number | string[];
  label: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriterion[];
  accountCount: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
  isPrebuilt: boolean;
}

export interface SegmentPreview {
  accounts: { id: string; name: string; health: number; revenue30d: number; city: string }[];
  totalCount: number;
  totalRevenue: number;
}

// --- Intelligence Types ---

export interface RevenueAnalytics {
  period: string;
  totalRevenue: number;
  revenueByCategory: { category: string; revenue: number; prevRevenue: number; change: number }[];
  revenueByRep: { repId: string; name: string; revenue: number; target: number; pctOfTarget: number }[];
  revenueByRegion: { region: string; revenue: number; accounts: number }[];
  topProducts: { name: string; category: string; revenue: number; unitsSold: number }[];
  monthlyRevenue: { month: string; flower: number; preroll: number; vaporizer: number; concentrate: number; edible: number; beverage: number }[];
}

export interface AccountHealthModel {
  factors: { name: string; weight: number; description: string }[];
  distribution: { tier: string; count: number; pctChange: number }[];
  avgScore: number;
  avgScoreTrend: number[];
  correlations: { factor: string; impact: string; description: string }[];
}

export interface Forecast {
  period: string;
  predicted: number;
  confidence: number;
  lower: number;
  upper: number;
  basis: string;
}

export interface ProductRecommendation {
  id: string;
  accountId: string;
  accountName: string;
  productName: string;
  category: string;
  reason: string;
  estimatedRevenue: number;
  confidence: number;
  competitorContext?: string;
  status: 'new' | 'pitched' | 'accepted' | 'dismissed';
}

export interface ComplianceLicense {
  accountId: string;
  accountName: string;
  licenseNumber: string;
  expirationDate: string;
  daysRemaining: number;
  status: 'valid' | 'expiring' | 'expired';
}

export interface CompliancePayment {
  accountId: string;
  accountName: string;
  orderNumber: string;
  deliveryDate: string;
  amount: number;
  daysElapsed: number;
  maxDays: number;
  status: 'compliant' | 'approaching' | 'overdue';
  method: string;
}

export interface WinLossEntry {
  id: string;
  accountId: string;
  accountName: string;
  outcome: 'won' | 'lost' | 'churned';
  date: string;
  reason: string;
  reasonCategory: 'pricing' | 'product-quality' | 'delivery' | 'competitor' | 'relationship' | 'compliance' | 'closure' | 'other';
  competitor?: string;
  productsAffected: string[];
  revenueImpact: number;
  notes: string;
}

export interface PlaybookStep {
  id: string;
  title: string;
  instructions: string;
  aiPrompt?: string;
  actionType: 'email' | 'call' | 'task' | 'meeting' | 'note' | 'wait';
  estimatedTime: string;
  order: number;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  type: 'new-account' | 'win-back' | 'category-expansion' | 'product-launch' | 'payment-issue' | 'competitive-response';
  steps: PlaybookStep[];
  estimatedDuration: string;
  successRate: number;
}

export interface PlaybookExecution {
  id: string;
  playbookId: string;
  accountId: string;
  accountName: string;
  startedAt: string;
  currentStep: number;
  completedSteps: number[];
  status: 'active' | 'completed' | 'abandoned';
}
