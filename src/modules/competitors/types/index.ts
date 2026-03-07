// Competitor Intel Domain Types

export type CompetitorTrend = 'growing' | 'stable' | 'declining';
export type AlertType = 'gained-placement' | 'lost-placement' | 'price-change' | 'new-product';
export type AlertSeverity = 'high' | 'medium' | 'low';

export interface Competitor {
  id: string;
  name: string;
  description: string;
  categories: string[];
  avgPrice: Record<string, number>; // category -> price
  storeCount: number;
  marketShare: number; // percentage
  trend: CompetitorTrend;
}

export interface CompetitorProduct {
  id: string;
  competitorId: string;
  competitorName: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  ourComparable?: string;
  ourPrice?: number;
  stores: number;
}

export interface CompetitorAlert {
  id: string;
  type: AlertType;
  competitorName: string;
  accountName: string;
  details: string;
  date: string;
  severity: AlertSeverity;
}

export interface CompetitorMetrics {
  competitorsTracked: number;
  ourMarketShare: number;
  topThreat: string;
  recentAlerts: number;
  avgPriceAdvantage: number; // percentage, positive = we're cheaper
  placementsLostThisMonth: number;
}
