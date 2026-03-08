import type { ChatMessage, ChatConversation, ChatSuggestion } from '@/modules/chat/types';

const CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    title: 'Account health check',
    createdAt: '2026-03-07T08:15:00Z',
    updatedAt: '2026-03-07T08:16:00Z',
    messages: [
      {
        id: 'msg-1a',
        role: 'user',
        content: 'How are my accounts doing this week?',
        timestamp: '2026-03-07T08:15:00Z',
      },
      {
        id: 'msg-1b',
        role: 'assistant',
        content:
          'Your territory has **22 active accounts**. 3 need attention:\n\n' +
          '**Rainier Remedies** is overdue on payment ($4.2K, day 7 — compliance risk).\n' +
          '**Emerald City Cannabis** hasn\'t ordered in 47 days (R2 recovery status).\n' +
          '**Pacific Leaf** vape purchases dropped 40% last month.\n\n' +
          'On the bright side, **Greenfield Dispensary** and **Capitol Hill Cannabis** are both A4+ with strong sell-through. ' +
          'Recommendation: call Rainier about payment first, then focus on the Emerald City win-back playbook.',
        timestamp: '2026-03-07T08:16:00Z',
        sources: [
          { type: 'crm', label: 'CRM', module: 'crm' },
          { type: 'finance', label: 'Finance AR', module: 'ar' },
          { type: 'pipeline', label: 'Pipeline', module: 'pipeline' },
        ],
        suggestedActions: [
          { label: 'View Rainier Account', action: 'navigate', route: '/crm?account=acc-7' },
          { label: 'Start Win-Back Playbook', action: 'navigate', route: '/crm' },
          { label: 'Call Rainier', action: 'navigate', route: '/crm?account=acc-7' },
        ],
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Production status',
    createdAt: '2026-03-07T09:00:00Z',
    updatedAt: '2026-03-07T09:01:00Z',
    messages: [
      {
        id: 'msg-2a',
        role: 'user',
        content: "What's the production status today?",
        timestamp: '2026-03-07T09:00:00Z',
      },
      {
        id: 'msg-2b',
        role: 'assistant',
        content:
          'Manufacturing is running at **82% capacity**.\n\n' +
          '**12 work orders in progress:** 4 flower trim, 3 vape filling, 2 preroll rolling, 2 extraction, 1 packaging.\n\n' +
          '**Bottleneck:** Pen filling station at 76% utilization with 8-unit queue.\n\n' +
          '**Room 3 (Gelato)** harvest window opens in 5 days — schedule trim team.\n' +
          '2 COA results pending from Confidence Analytics (expected tomorrow).\n' +
          'Fulfillment has 8 orders in progress with 6 completed today.',
        timestamp: '2026-03-07T09:01:00Z',
        sources: [
          { type: 'manufacturing', label: 'Manufacturing', module: 'manufacturing' },
          { type: 'cultivation', label: 'Cultivation', module: 'cultivation' },
          { type: 'coa', label: 'COA Manager', module: 'inventory' },
          { type: 'fulfillment', label: 'Fulfillment', module: 'fulfillment' },
        ],
        suggestedActions: [
          { label: 'View Work Orders', action: 'navigate', route: '/manufacturing' },
          { label: 'View Room 3', action: 'navigate', route: '/cultivation' },
          { label: 'Check COA Status', action: 'navigate', route: '/inventory?tab=coa' },
        ],
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'Cash position',
    createdAt: '2026-03-06T14:30:00Z',
    updatedAt: '2026-03-06T14:31:00Z',
    messages: [
      {
        id: 'msg-3a',
        role: 'user',
        content: "What's our cash position?",
        timestamp: '2026-03-06T14:30:00Z',
      },
      {
        id: 'msg-3b',
        role: 'assistant',
        content:
          '**Current bank balance:** $170K\n' +
          '**AR outstanding:** $68K ($16K overdue from Rainier and Emerald City)\n' +
          '**AP due this week:** $12K\n' +
          '**Monthly burn rate:** ~$47K/day average\n' +
          '**Cash runway:** approximately 3.6 months\n\n' +
          '**Revenue MTD:** $1.24M, 8% above budget.\n\n' +
          'Main risk: if Rainier\'s $12K overdue isn\'t collected, runway drops to 3.2 months. ' +
          'Recommendation: escalate Rainier collection and move them to prepay terms.',
        timestamp: '2026-03-06T14:31:00Z',
        sources: [
          { type: 'finance', label: 'Finance', module: 'finance' },
          { type: 'ar', label: 'Accounts Receivable', module: 'ar' },
        ],
        suggestedActions: [
          { label: 'View AR Dashboard', action: 'navigate', route: '/ar' },
          { label: 'View Cash Flow', action: 'navigate', route: '/finance' },
          { label: 'Send Rainier Reminder', action: 'navigate', route: '/email' },
        ],
      },
    ],
  },
  {
    id: 'conv-4',
    title: 'Grow room status',
    createdAt: '2026-03-06T10:00:00Z',
    updatedAt: '2026-03-06T10:01:00Z',
    messages: [
      {
        id: 'msg-4a',
        role: 'user',
        content: "What's happening in the grow rooms?",
        timestamp: '2026-03-06T10:00:00Z',
      },
      {
        id: 'msg-4b',
        role: 'assistant',
        content:
          '**8 rooms active.**\n\n' +
          '**Room 2 (Blue Dream)** has a humidity alert — 68% vs 55% target, VPD is low at 0.95. Check dehumidifier.\n\n' +
          '**Room 3 (Gelato)** at day 56 of 63 — harvest prep should start Friday.\n\n' +
          '**Room 7 (Jack Herer)** dry cycle is complete, ready for buck handoff to manufacturing.\n\n' +
          'Clone room has 200 mixed clones at day 7. All other rooms optimal.',
        timestamp: '2026-03-06T10:01:00Z',
        sources: [
          { type: 'cultivation', label: 'Cultivation', module: 'cultivation' },
        ],
        suggestedActions: [
          { label: 'View Room 2 Alert', action: 'navigate', route: '/cultivation' },
          { label: 'Schedule Room 3 Harvest', action: 'navigate', route: '/cultivation' },
          { label: 'Create Buck Task', action: 'navigate', route: '/tasks' },
        ],
      },
    ],
  },
  {
    id: 'conv-5',
    title: 'Daily priorities',
    createdAt: '2026-03-07T07:30:00Z',
    updatedAt: '2026-03-07T07:31:00Z',
    messages: [
      {
        id: 'msg-5a',
        role: 'user',
        content: 'What should I focus on today?',
        timestamp: '2026-03-07T07:30:00Z',
      },
      {
        id: 'msg-5b',
        role: 'assistant',
        content:
          'Here\'s your prioritized task list for today:\n\n' +
          '1. **URGENT:** Call Rainier Remedies about $4.2K overdue payment (day 7, compliance deadline tomorrow)\n' +
          '2. Review and approve 3 pending reorder proposals in the Reorder Center ($12.4K total pipeline value)\n' +
          '3. Check Room 2 humidity alert — dehumidifier may need service\n' +
          '4. 2 COA results expected back today — check status\n' +
          '5. Vendor day with Cascade Wellness tomorrow — prep sample kit\n' +
          '6. 4 fulfillment orders queued for picking — Tyler\'s team is on it\n' +
          '7. Content: Instagram post scheduled for 2pm, review draft',
        timestamp: '2026-03-07T07:31:00Z',
        sources: [
          { type: 'crm', label: 'CRM', module: 'crm' },
          { type: 'finance', label: 'Finance', module: 'finance' },
          { type: 'cultivation', label: 'Cultivation', module: 'cultivation' },
          { type: 'coa', label: 'COA', module: 'inventory' },
          { type: 'calendar', label: 'Calendar', module: 'calendar' },
          { type: 'fulfillment', label: 'Fulfillment', module: 'fulfillment' },
          { type: 'marketing', label: 'Marketing', module: 'content-creator' },
        ],
        suggestedActions: [
          { label: 'Call Rainier', action: 'navigate', route: '/crm?account=acc-7' },
          { label: 'Open Reorder Center', action: 'navigate', route: '/crm' },
          { label: 'View Room 2', action: 'navigate', route: '/cultivation' },
        ],
      },
    ],
  },
];

const SUGGESTIONS: ChatSuggestion[] = [
  { id: 'sug-1', text: 'How are my accounts doing?', category: 'sales' },
  { id: 'sug-2', text: "What's the production status?", category: 'operations' },
  { id: 'sug-3', text: "What's our cash position?", category: 'finance' },
  { id: 'sug-4', text: 'What should I focus on today?', category: 'general' },
  { id: 'sug-5', text: 'Tell me about Greenfield Dispensary', category: 'sales' },
  { id: 'sug-6', text: 'When is the next harvest?', category: 'cultivation' },
  { id: 'sug-7', text: 'Which accounts need reorders?', category: 'sales' },
  { id: 'sug-8', text: "What's our revenue this month?", category: 'finance' },
  { id: 'sug-9', text: 'Are there any compliance issues?', category: 'operations' },
  { id: 'sug-10', text: "What's in the order pipeline?", category: 'operations' },
  { id: 'sug-11', text: 'How are my delivery routes today?', category: 'operations' },
  { id: 'sug-12', text: 'Which products are selling best?', category: 'sales' },
  { id: 'sug-13', text: 'Draft an email to Greenfield', category: 'general' },
  { id: 'sug-14', text: "What's the inventory for Blue Dream?", category: 'operations' },
  { id: 'sug-15', text: 'Compare my top 5 accounts', category: 'sales' },
];

const KEYWORD_MAP: Record<string, string> = {
  account: 'conv-1',
  territory: 'conv-1',
  'doing this week': 'conv-1',
  production: 'conv-2',
  'work order': 'conv-2',
  manufacturing: 'conv-2',
  cash: 'conv-3',
  'cash position': 'conv-3',
  revenue: 'conv-3',
  runway: 'conv-3',
  room: 'conv-4',
  grow: 'conv-4',
  cultivation: 'conv-4',
  harvest: 'conv-4',
  humidity: 'conv-4',
  focus: 'conv-5',
  today: 'conv-5',
  priority: 'conv-5',
  priorities: 'conv-5',
};

export function matchConversation(input: string): ChatMessage | null {
  const lower = input.toLowerCase();
  for (const [keyword, convId] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      const conv = CONVERSATIONS.find((c) => c.id === convId);
      if (conv) {
        const assistant = conv.messages.find((m) => m.role === 'assistant');
        if (assistant) return assistant;
      }
    }
  }
  return null;
}

export function getChatFallbackResponse(input: string): ChatMessage {
  return {
    id: `msg-fallback-${Date.now()}`,
    role: 'assistant',
    content:
      `I can help with that. Based on our current data, here's what I know:\n\n` +
      `Your territory has **22 active accounts** generating **$1.24M MTD** across 6 product categories. ` +
      `Manufacturing is at 82% capacity with 12 active work orders. ` +
      `8 grow rooms are active with 2 alerts requiring attention.\n\n` +
      `Could you be more specific about what you'd like to know? I can pull detailed reports on any account, product, ` +
      `operation, or financial metric.`,
    timestamp: new Date().toISOString(),
    sources: [
      { type: 'crm', label: 'CRM', module: 'crm' },
      { type: 'operations', label: 'Operations', module: 'dashboard' },
    ],
  };
}

export async function getChatConversations(): Promise<ChatConversation[]> {
  await new Promise((r) => setTimeout(r, 300));
  return CONVERSATIONS;
}

export async function getChatSuggestions(): Promise<ChatSuggestion[]> {
  await new Promise((r) => setTimeout(r, 200));
  return SUGGESTIONS;
}
