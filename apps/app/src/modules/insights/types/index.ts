export interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'correlation' | 'recommendation';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  module: string;
  confidence: number;
  createdAt: string;
  actionable: boolean;
  action?: string;
}

export interface InsightQueryResult {
  query: string;
  results: string;
  timestamp: string;
}
