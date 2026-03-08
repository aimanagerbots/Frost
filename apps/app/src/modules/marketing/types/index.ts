// Marketing module shared types

export type ContentPieceType = 'social-post' | 'email' | 'blog-draft' | 'product-description' | 'ad-copy';
export type ContentPlatform = 'instagram' | 'facebook' | 'twitter' | 'email' | 'website' | 'multi';
export type ContentStatus = 'idea' | 'draft' | 'review' | 'approved' | 'scheduled' | 'published';

export interface ContentPerformance {
  [key: string]: unknown;
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
  engagementRate: number;
}

export interface ContentPiece {
  [key: string]: unknown;
  id: string;
  title: string;
  type: ContentPieceType;
  platform: ContentPlatform;
  status: ContentStatus;
  content: string;
  imagePrompt?: string;
  generatedImageUrl?: string;
  scheduledDate?: string;
  publishedDate?: string;
  performance?: ContentPerformance;
  tags: string[];
  campaignId?: string;
  createdBy: string;
  aiGenerated: boolean;
}

export interface ContentCalendarEntry {
  [key: string]: unknown;
  date: string;
  items: ContentPiece[];
}

export interface ContentTemplate {
  [key: string]: unknown;
  id: string;
  name: string;
  type: ContentPieceType;
  promptTemplate: string;
  description: string;
}

export type SocialAccountStatus = 'connected' | 'pending' | 'disconnected';

export interface SocialAccount {
  [key: string]: unknown;
  id: string;
  platform: ContentPlatform;
  handle: string;
  followers: number;
  following: number;
  postsCount: number;
  status: SocialAccountStatus;
  lastPost?: string;
  engagementRate: number;
}

export interface SocialPost extends ContentPiece {
  comments: number;
  shares: number;
  saves: number;
}

export type EmailCampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';

export interface EmailStats {
  [key: string]: unknown;
  sent: number;
  delivered: number;
  bounced: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  converted: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  bounceRate: number;
}

export interface ABTestVariant {
  [key: string]: unknown;
  id: string;
  subject: string;
  openRate: number;
  clickRate: number;
  winner: boolean;
}

export interface ABTest {
  [key: string]: unknown;
  variants: ABTestVariant[];
}

export interface EmailCampaign {
  [key: string]: unknown;
  id: string;
  name: string;
  subject: string;
  previewText: string;
  body: string;
  audienceSegment: string;
  audienceSize: number;
  status: EmailCampaignStatus;
  scheduledDate?: string;
  sentDate?: string;
  stats?: EmailStats;
  abTest?: ABTest;
}

export interface EmailTemplate {
  [key: string]: unknown;
  id: string;
  name: string;
  category: string;
  previewHtml: string;
}

export interface AIContentMessage {
  [key: string]: unknown;
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imagePrompt?: string;
  imageProvider?: string;
}

export interface AIContentRequest {
  [key: string]: unknown;
  prompt: string;
  type: string;
  platform?: string;
  tone?: string;
  imageProvider?: string;
}

export interface MarketingMetrics {
  [key: string]: unknown;
  postsThisMonth: number;
  scheduledCount: number;
  draftsInPipeline: number;
  avgEngagementRate: number;
  contentGapDays: number;
  totalFollowers: number;
  emailsSentMTD: number;
  avgOpenRate: number;
  avgClickRate: number;
  activeCampaigns: number;
  listHealth: number;
  revenueAttributed: number;
}

export interface ContentFilter {
  status?: ContentStatus;
  platform?: ContentPlatform;
  type?: ContentPieceType;
  search?: string;
}

export interface EmailCampaignFilter {
  status?: EmailCampaignStatus;
  search?: string;
}

// ─── Content Library ──────────────────────────────────────────────────────

export type ContentLibraryCategory = 'instagram_caption' | 'product_description' | 'email_copy' | 'blog_intro' | 'image_concept';

// ─── Social Enrichment ────────────────────────────────────────────────────

export interface PostingTimeHeat {
  day: number; // 0=Mon..6=Sun
  hour: number; // 0-22, step 2
  engagement: number; // 0-100 intensity
}

export interface HashtagSuggestion {
  tag: string;
  relevance: number; // 0-100
}

export interface FollowerGrowthPoint {
  date: string;
  instagram: number;
  facebook: number;
  twitter: number;
}

export interface EngagementByType {
  type: string;
  engagement: number;
  posts: number;
}

// ─── Content Calendar Enrichment ──────────────────────────────────────────

export interface GapSuggestion {
  date: string;
  suggestion: string;
}

// ─── Email Marketing Enrichment ───────────────────────────────────────────

export type CampaignBuilderStep = 'details' | 'audience' | 'template' | 'content' | 'schedule' | 'review';

export interface CampaignPerformanceTrend {
  date: string;
  openRate: number;
  clickRate: number;
}
