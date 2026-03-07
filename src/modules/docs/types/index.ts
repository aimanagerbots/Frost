export type DocType = 'sop' | 'compliance' | 'contract' | 'product-spec' | 'marketing' | 'financial' | 'other';

export interface Document {
  [key: string]: unknown;
  id: string;
  name: string;
  type: DocType;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  tags: string[];
  linkedModule?: string;
  version: number;
  description?: string;
}

export interface DocFilter {
  type?: DocType;
  category?: string;
  search?: string;
}
