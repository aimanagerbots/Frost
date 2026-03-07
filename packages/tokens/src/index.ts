/** Module accent color map — used in charts, dynamic styles, and component props */
export const MODULE_ACCENTS = {
  dashboard: '#667EEA',
  crm: '#F59E0B',
  tasks: '#8B5CF6',
  calendar: '#3B82F6',
  agents: '#06B6D4',
  orders: '#F59E0B',
  vmi: '#EF4444',
  content: '#EC4899',
  competitors: '#F97316',
  cultivation: '#22C55E',
  manufacturing: '#10B981',
  packaging: '#84CC16',
  inventory: '#8B5CF6',
  fulfillment: '#14B8A6',
  delivery: '#0EA5E9',
  coa: '#9333EA',
  approvals: '#FBBF24',
  council: '#6366F1',
  memory: '#8B5CF6',
  insights: '#06B6D4',
  projects: '#7C3AED',
  products: '#DB2777',
  meetings: '#2563EB',
  docs: '#64748B',
  team: '#0D9488',
  finance: '#059669',
  reports: '#475569',
  settings: '#94A3B8',
  system: '#64748B',
  chat: '#06B6D4',
  marketing: '#EC4899',
} as const;

export type ModuleName = keyof typeof MODULE_ACCENTS;

/** Status colors */
export const STATUS_COLORS = {
  success: '#00E5A0',
  warning: '#FBBF24',
  danger: '#FB7185',
  info: '#38BDF8',
} as const;

/** Brand gradient CSS value */
export const BRAND_GRADIENT = 'linear-gradient(135deg, #667EEA, #764BA2, #F093FB)';

/** Chart color palette */
export const CHART_COLORS = ['#667EEA', '#764BA2', '#F093FB', '#00E5A0', '#FBBF24'] as const;
