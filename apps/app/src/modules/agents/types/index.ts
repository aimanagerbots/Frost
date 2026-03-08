export interface Agent {
  id: string;
  name: string;
  specialty: 'sales' | 'cultivation' | 'compliance' | 'manufacturing' | 'analytics' | 'general';
  description: string;
  avatar: string;
  status: 'active' | 'idle' | 'disabled';
  capabilities: string[];
  actionsToday: number;
  approvalRate: number;
}

export interface AgentAction {
  id: string;
  agentId: string;
  agentName: string;
  type: 'email-draft' | 'reorder-proposal' | 'alert' | 'task-creation' | 'data-analysis' | 'compliance-check';
  description: string;
  status: 'completed' | 'pending-approval' | 'rejected';
  target?: string;
  timestamp: string;
  result?: string;
}

export interface AgentMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  references?: string[];
}

export interface AgentConversation {
  id: string;
  agentId: string;
  messages: AgentMessage[];
}
