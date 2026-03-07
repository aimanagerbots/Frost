export type ContentType = 'social' | 'email' | 'blog' | 'product-description';
export type ContentPlatform = 'instagram' | 'email' | 'website';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface ContentPerformance {
  impressions: number;
  engagement: number;
  clicks: number;
  conversions: number;
}

export interface ContentPost {
  [key: string]: unknown;
  id: string;
  title: string;
  type: ContentType;
  platform: ContentPlatform;
  status: ContentStatus;
  scheduledDate?: string;
  publishedDate?: string;
  content: string;
  imageUrl?: string;
  performance?: ContentPerformance;
}

export interface Campaign {
  id: string;
  name: string;
  posts: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  goal: string;
}

export interface ContentFilter {
  type?: ContentType;
  status?: ContentStatus;
  platform?: ContentPlatform;
  search?: string;
}
