import type { SystemHealth, BackgroundJob, AIModelUsage, FeatureFlag } from '@/modules/system/types';

const systemHealth: SystemHealth[] = [
  { component: 'Database', status: 'healthy', metric: 'Capacity', value: '45%', threshold: '85%' },
  { component: 'API', status: 'healthy', metric: 'Avg Response', value: '120ms', threshold: '500ms' },
  { component: 'Celery Workers', status: 'healthy', metric: 'Active', value: '4/4' },
  { component: 'Redis Cache', status: 'healthy', metric: 'Hit Rate', value: '78%', threshold: '60%' },
  { component: 'Storage', status: 'healthy', metric: 'Used', value: '62% (12.4 GB)', threshold: '90%' },
];

const backgroundJobs: BackgroundJob[] = [
  {
    id: 'job-001',
    name: 'VMI Headset Sync',
    type: 'sync',
    status: 'running',
    lastRun: '2026-03-06T09:45:00Z',
    nextRun: '2026-03-06T10:00:00Z',
    duration: '2m 14s',
  },
  {
    id: 'job-002',
    name: 'Daily CCRS Report',
    type: 'report',
    status: 'completed',
    lastRun: '2026-03-06T06:00:00Z',
    nextRun: '2026-03-07T06:00:00Z',
    duration: '4m 32s',
  },
  {
    id: 'job-003',
    name: 'AI Memory Consolidation',
    type: 'ai',
    status: 'running',
    lastRun: '2026-03-06T09:00:00Z',
    nextRun: '2026-03-06T10:00:00Z',
    duration: '1m 48s',
  },
  {
    id: 'job-004',
    name: 'Inventory Reconciliation',
    type: 'sync',
    status: 'scheduled',
    lastRun: '2026-03-06T02:00:00Z',
    nextRun: '2026-03-07T02:00:00Z',
    duration: '8m 15s',
  },
  {
    id: 'job-005',
    name: 'Email Queue Processor',
    type: 'sync',
    status: 'running',
    lastRun: '2026-03-06T09:50:00Z',
    duration: 'continuous',
  },
  {
    id: 'job-006',
    name: 'COA Status Check',
    type: 'sync',
    status: 'completed',
    lastRun: '2026-03-06T08:00:00Z',
    nextRun: '2026-03-06T12:00:00Z',
    duration: '45s',
  },
  {
    id: 'job-007',
    name: 'Cleanup Temp Files',
    type: 'cleanup',
    status: 'scheduled',
    lastRun: '2026-03-02T03:00:00Z',
    nextRun: '2026-03-09T03:00:00Z',
    duration: '1m 22s',
  },
  {
    id: 'job-008',
    name: 'Backup Database',
    type: 'sync',
    status: 'completed',
    lastRun: '2026-03-06T03:00:00Z',
    nextRun: '2026-03-07T03:00:00Z',
    duration: '12m 08s',
  },
  {
    id: 'job-009',
    name: 'Update Market Share Data',
    type: 'sync',
    status: 'failed',
    lastRun: '2026-03-06T09:30:00Z',
    nextRun: '2026-03-06T09:35:00Z',
    error: 'Headset API timeout — retry in 5 min',
  },
  {
    id: 'job-010',
    name: 'Generate Morning Briefings',
    type: 'ai',
    status: 'completed',
    lastRun: '2026-03-06T05:30:00Z',
    nextRun: '2026-03-07T05:30:00Z',
    duration: '3m 45s',
  },
];

const aiModelUsage: AIModelUsage[] = [
  {
    model: 'Claude Sonnet',
    tokensToday: 8400,
    costToday: 3.22,
    requestsToday: 156,
    avgLatency: 340,
    errorRate: 0.5,
  },
  {
    model: 'GPT-4 Fallback',
    tokensToday: 1200,
    costToday: 0.86,
    requestsToday: 18,
    avgLatency: 520,
    errorRate: 2.1,
  },
];

const featureFlags: FeatureFlag[] = [
  { id: 'ff-001', name: 'VMI Auto-Reorder Proposals', description: 'Automatically generate reorder proposals based on VMI thresholds and velocity data.', enabled: true, module: 'VMI' },
  { id: 'ff-002', name: 'AI Email Draft Generation', description: 'Use AI to draft personalized outreach emails from CRM contact context.', enabled: true, module: 'CRM' },
  { id: 'ff-003', name: 'Competitive Displacement Alerts', description: 'Alert reps when a competitor gains shelf space at an account.', enabled: true, module: 'Competitors' },
  { id: 'ff-004', name: 'Multi-Agent Council', description: 'Enable collaborative multi-agent decision making for complex operations.', enabled: false, module: 'Council' },
  { id: 'ff-005', name: 'Automated Meeting Notes', description: 'Transcribe and summarize meetings automatically using AI.', enabled: true, module: 'Meetings' },
  { id: 'ff-006', name: 'Predictive Inventory Alerts', description: 'Predict stockouts and overstock situations using historical patterns.', enabled: false, module: 'Inventory' },
  { id: 'ff-007', name: 'B2B Portal Access', description: 'Allow retail accounts to place orders through a self-service B2B portal.', enabled: false, module: 'Orders' },
  { id: 'ff-008', name: 'Advanced Analytics Dashboard', description: 'Enhanced dashboard with predictive analytics and trend forecasting.', enabled: true, module: 'Dashboard' },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSystemHealth(): Promise<SystemHealth[]> {
  await delay(300);
  return systemHealth;
}

export async function getBackgroundJobs(): Promise<BackgroundJob[]> {
  await delay(300);
  return backgroundJobs;
}

export async function getAIModelUsage(): Promise<AIModelUsage[]> {
  await delay(300);
  return aiModelUsage;
}

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  await delay(300);
  return featureFlags;
}
