// ─── Blog & SEO ────────────────────────────────────────────────

export type BlogPostStatus = 'idea' | 'draft' | 'review' | 'published';
export type BlogCategory = 'Strain Spotlights' | 'Education' | 'Company News' | 'Culture/Lifestyle';

export interface SEOScoreItem {
  label: string;
  status: 'pass' | 'warn' | 'fail';
}

export interface BlogPost {
  [key: string]: unknown;
  id: string;
  title: string;
  slug: string;
  status: BlogPostStatus;
  author: string;
  category: BlogCategory;
  tags: string[];
  publishedDate?: string;
  content: string;
  seoScore: number;
  seoChecklist: SEOScoreItem[];
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
  wordCount: number;
  readTime: number;
  views?: number;
  organicTraffic?: number;
  avgTimeOnPage?: number;
}

export type KeywordTrend = 'up' | 'stable' | 'down';
export type KeywordStatus = 'tracking' | 'ranking' | 'lost';

export interface SEOKeyword {
  [key: string]: unknown;
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  currentRank?: number;
  rankChange?: number;
  targetRank: number;
  page?: string;
  trend: KeywordTrend;
  status: KeywordStatus;
}

export interface OrganicTrendPoint {
  date: string;
  visits: number;
}

// ─── Events ────────────────────────────────────────────────────

export type EventType = 'vendor-day' | 'trade-show' | 'pop-up' | 'webinar' | 'industry-event' | 'internal';
export type EventStatus = 'planned' | 'confirmed' | 'day-of' | 'completed' | 'follow-up-done' | 'cancelled';

export interface CollateralItem {
  label: string;
  packed: boolean;
}

export interface EventROI {
  preEventRevenue: number;
  postEventRevenue: number;
  lift: number;
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  attendees?: number;
  expectedAttendance?: number;
  budget: number;
  actualSpend?: number;
  teamMembers?: string[];
  collateral?: CollateralItem[];
  accountName?: string;
  productsToFeature?: string[];
  roiMeasured?: EventROI;
}

// ─── Paid Ads ──────────────────────────────────────────────────

export type AdPlatform = 'google' | 'programmatic' | 'cannabis-specific' | 'email-retargeting';
export type AdStatus = 'active' | 'paused' | 'completed' | 'draft';
export type ComplianceStatus = 'approved' | 'pending-review' | 'flagged';

export interface AdCampaign {
  [key: string]: unknown;
  id: string;
  name: string;
  platform: AdPlatform;
  status: AdStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  cpc: number;
  conversions: number;
  startDate: string;
  endDate?: string;
  complianceStatus: ComplianceStatus;
  complianceNote?: string;
  topKeywords?: string[];
  creativeVariants?: number;
}

export interface ComplianceCheckItem {
  label: string;
  status: 'pass' | 'warn';
}

// ─── Merchandise ───────────────────────────────────────────────

export type MerchCategory = 'apparel' | 'headwear' | 'accessories' | 'stickers' | 'bags' | 'containers' | 'misc';

export interface MerchDistribution {
  accountName?: string;
  event?: string;
  date: string;
  quantity: number;
  distributedBy?: string;
  items?: string;
}

export interface MerchItem {
  id: string;
  sku: string;
  name: string;
  category: MerchCategory;
  stock: number;
  allocated: number;
  distributed: number;
  costPerUnit: number;
  imageDescription: string;
  distributedTo: MerchDistribution[];
}

export interface MerchBudget {
  annual: number;
  spentYTD: number;
  byCategory: { category: string; amount: number }[];
  monthlySpend: { month: string; amount: number }[];
}

// ─── Metrics ───────────────────────────────────────────────────

export interface SEOMetrics {
  publishedPosts: number;
  totalViews: number;
  avgSeoScore: number;
  organicTraffic: number;
  totalOrganicVisits: number;
  top10Count: number;
  avgPosition: number;
  topKeyword: string;
  topKeywordRank: number;
}

export interface EventMetrics {
  upcoming: number;
  completedThisQuarter: number;
  totalBudget: number;
  avgROI: number;
  vendorDaysThisMonth: number;
  avgRevenueLift: number;
  topLocation: string;
  nextTradeShowDays: number;
}

export interface AdMetrics {
  activeCampaigns: number;
  totalSpendMTD: number;
  totalBudget: number;
  totalImpressions: number;
  totalClicks: number;
  avgCPC: number;
  totalConversions: number;
  flaggedCampaigns: number;
}
