export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'archived' | 'starred';

export type EmailCategory =
  | 'order-inquiry'
  | 'payment'
  | 'complaint'
  | 'general'
  | 'marketing'
  | 'internal'
  | 'vendor';

export interface EmailContact {
  name: string;
  email: string;
  accountId?: string;
}

export interface Email {
  id: string;
  from: EmailContact;
  to: EmailContact[];
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: EmailFolder;
  labels: string[];
  hasAttachment: boolean;
  crmLinked: boolean;
  crmAccountId?: string;
  crmAccountName?: string;
  crmHealthScore?: number;
  crmPipelineStatus?: string;
  crmLastOrderDate?: string;
  crmRevenue30d?: number;
  aiCategory: EmailCategory;
  aiDraftReply?: string;
}

export interface EmailMetrics {
  unread: number;
  todayReceived: number;
  needsResponse: number;
  avgResponseTime: string;
}
