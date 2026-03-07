export interface KnowledgeEntry {
  id: string;
  title: string;
  category: 'compliance' | 'cultivation-sop' | 'extraction-sop' | 'sales-playbook' | 'hr-policy' | 'company-info';
  content: string;
  lastUpdated: string;
  updatedBy: string;
  referencedCount: number;
}

export interface AgentPerspective {
  name: string;
  perspective: string;
}

export interface CouncilSession {
  id: string;
  question: string;
  agents: AgentPerspective[];
  synthesis: string;
  timestamp: string;
  status: 'active' | 'completed';
}
