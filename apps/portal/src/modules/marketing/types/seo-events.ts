// ─── Blog & SEO ────────────────────────────────────────────────

export type BlogPostStatus = 'idea' | 'draft' | 'review' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: BlogPostStatus;
  author: string;
  publishedDate?: string;
  content: string;
  seoScore: number;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
  wordCount: number;
  readTime: number;
  views?: number;
  avgTimeOnPage?: number;
}

export type KeywordTrend = 'up' | 'stable' | 'down';

export interface SEOKeyword {
  [key: string]: unknown;
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  currentRank?: number;
  targetRank: number;
  page?: string;
  trend: KeywordTrend;
}

// ─── Events ────────────────────────────────────────────────────

export type EventType = 'vendor-day' | 'trade-show' | 'pop-up' | 'webinar' | 'industry-event';
export type EventStatus = 'planned' | 'confirmed' | 'completed' | 'cancelled';

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
  location: string;
  description: string;
  attendees?: number;
  budget: number;
  actualSpend?: number;
  roiMeasured?: EventROI;
}

// ─── Paid Ads ──────────────────────────────────────────────────

export type AdPlatform = 'google' | 'programmatic' | 'cannabis-specific';
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
}

// ─── Merchandise ───────────────────────────────────────────────

export type MerchCategory = 'apparel' | 'accessories' | 'stickers' | 'containers' | 'misc';

export interface MerchDistribution {
  accountName?: string;
  event?: string;
  date: string;
  quantity: number;
}

export interface MerchItem {
  id: string;
  name: string;
  category: MerchCategory;
  stock: number;
  distributed: number;
  costPerUnit: number;
  imageDescription: string;
  distributedTo: MerchDistribution[];
}

// ─── Metrics ───────────────────────────────────────────────────

export interface SEOMetrics {
  publishedPosts: number;
  totalViews: number;
  avgSeoScore: number;
  organicTraffic: number;
  topKeyword: string;
  topKeywordRank: number;
}

export interface EventMetrics {
  upcoming: number;
  completedThisQuarter: number;
  totalBudget: number;
  avgROI: number;
}

export interface AdMetrics {
  activeCampaigns: number;
  totalSpendMTD: number;
  totalImpressions: number;
  avgCPC: number;
  totalConversions: number;
  flaggedCampaigns: number;
}
