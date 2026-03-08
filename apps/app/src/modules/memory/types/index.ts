export interface MemoryFact {
  id: string;
  content: string;
  source: string;
  sourceModule: string;
  confidence: number;
  category: 'account' | 'product' | 'process' | 'market' | 'team' | 'compliance';
  learnedAt: string;
  lastReferenced?: string;
  verified: boolean;
  correctedBy?: string;
}

export interface MemoryPattern {
  id: string;
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
  discoveredAt: string;
}

export interface MemoryLayer {
  name: 'system-identity' | 'structured-facts' | 'semantic-search';
  displayName: string;
  description: string;
  factCount: number;
  lastUpdated: string;
}
