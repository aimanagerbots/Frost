export type SystemTab = 'health' | 'jobs' | 'ai-usage' | 'feature-flags';
export type HealthStatus = 'healthy' | 'degraded' | 'down';
export type JobStatus = 'running' | 'completed' | 'failed' | 'scheduled';

export interface SystemHealth {
  component: string;
  status: HealthStatus;
  metric: string;
  value: string;
  threshold?: string;
}

export interface BackgroundJob {
  [key: string]: unknown;
  id: string;
  name: string;
  type: 'sync' | 'report' | 'cleanup' | 'ai';
  status: JobStatus;
  lastRun: string;
  nextRun?: string;
  duration?: string;
  error?: string;
}

export interface AIModelUsage {
  model: string;
  tokensToday: number;
  costToday: number;
  requestsToday: number;
  avgLatency: number;
  errorRate: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  module: string;
}
