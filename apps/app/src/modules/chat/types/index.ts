export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: ChatSource[];
  suggestedActions?: ChatAction[];
  agentName?: string;
}

export interface ChatSource {
  type: string;
  label: string;
  module: string;
}

export interface ChatAction {
  label: string;
  action: string;
  route: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatSuggestion {
  id: string;
  text: string;
  category: 'sales' | 'operations' | 'finance' | 'cultivation' | 'general';
  icon?: string;
}
