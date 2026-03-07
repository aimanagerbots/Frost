import type { Agent, AgentAction, AgentConversation } from '@/modules/agents/types';

const agents: Agent[] = [
  {
    id: 'agent-sales',
    name: 'Frost Sales Agent',
    specialty: 'sales',
    description:
      'Monitors account health, drafts outreach emails, identifies reorder opportunities, and flags at-risk accounts. Integrates with CRM data to surface actionable sales insights.',
    avatar: '🎯',
    status: 'active',
    capabilities: [
      'Draft outreach and follow-up emails',
      'Identify reorder opportunities based on purchase history',
      'Flag accounts with overdue payments',
      'Generate account health scores',
      'Suggest cross-sell opportunities',
    ],
    actionsToday: 12,
    approvalRate: 89,
  },
  {
    id: 'agent-cultivation',
    name: 'Frost Cultivation Agent',
    specialty: 'cultivation',
    description:
      'Tracks grow room conditions, monitors plant health metrics, schedules harvest windows, and alerts on environmental anomalies. Uses sensor data to optimize yield.',
    avatar: '🌱',
    status: 'active',
    capabilities: [
      'Monitor grow room environmental data',
      'Schedule harvest and transition windows',
      'Alert on temperature or humidity anomalies',
      'Track nutrient schedules and adjustments',
    ],
    actionsToday: 8,
    approvalRate: 92,
  },
  {
    id: 'agent-compliance',
    name: 'Frost Compliance Agent',
    specialty: 'compliance',
    description:
      'Validates METRC compliance, checks payment terms against regulations, audits inventory discrepancies, and ensures all documentation meets state requirements.',
    avatar: '🛡️',
    status: 'active',
    capabilities: [
      'Validate METRC tag compliance',
      'Audit payment terms and licensing',
      'Check inventory against manifests',
      'Generate compliance status reports',
    ],
    actionsToday: 6,
    approvalRate: 95,
  },
  {
    id: 'agent-manufacturing',
    name: 'Frost Manufacturing Agent',
    specialty: 'manufacturing',
    description:
      'Optimizes batch scheduling, monitors extraction yields, tracks equipment maintenance windows, and ensures quality control benchmarks are met across production lines.',
    avatar: '⚙️',
    status: 'active',
    capabilities: [
      'Optimize batch production schedules',
      'Monitor extraction yield metrics',
      'Track equipment maintenance schedules',
      'Flag quality control deviations',
      'Suggest process improvements',
    ],
    actionsToday: 5,
    approvalRate: 88,
  },
  {
    id: 'agent-analytics',
    name: 'Frost Analytics Agent',
    specialty: 'analytics',
    description:
      'Analyzes sales trends, generates revenue forecasts, identifies market opportunities, and produces automated reports for leadership review.',
    avatar: '📊',
    status: 'active',
    capabilities: [
      'Generate sales trend analysis',
      'Produce revenue forecasts',
      'Identify market opportunities',
      'Create automated leadership reports',
    ],
    actionsToday: 4,
    approvalRate: 91,
  },
  {
    id: 'agent-general',
    name: 'Frost General Assistant',
    specialty: 'general',
    description:
      'Handles day-to-day operational tasks including task creation, scheduling, note-taking, and cross-module coordination. Your go-to assistant for anything that doesn\'t fit a specialist.',
    avatar: '🤖',
    status: 'active',
    capabilities: [
      'Create and assign tasks across modules',
      'Schedule meetings and reminders',
      'Summarize activity across modules',
      'Answer questions about platform data',
      'Draft internal communications',
    ],
    actionsToday: 15,
    approvalRate: 87,
  },
];

const actions: AgentAction[] = [
  {
    id: 'act-01',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email-draft',
    description: 'Drafted reorder reminder email to Greenfield Dispensary for flower SKUs expiring this week',
    status: 'completed',
    target: 'Greenfield Dispensary',
    timestamp: '2026-03-07T09:15:00Z',
    result: 'Email sent successfully',
  },
  {
    id: 'act-02',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'reorder-proposal',
    description: 'Created purchase order proposal for Olympic Greens — 50 units Blue Dream, 30 units Gelato',
    status: 'pending-approval',
    target: 'Olympic Greens',
    timestamp: '2026-03-07T09:02:00Z',
  },
  {
    id: 'act-03',
    agentId: 'agent-compliance',
    agentName: 'Frost Compliance Agent',
    type: 'compliance-check',
    description: 'Completed METRC tag audit for March shipments — all 142 tags verified',
    status: 'completed',
    target: 'Inventory',
    timestamp: '2026-03-07T08:45:00Z',
    result: '142/142 tags compliant',
  },
  {
    id: 'act-04',
    agentId: 'agent-cultivation',
    agentName: 'Frost Cultivation Agent',
    type: 'alert',
    description: 'Temperature alert in Room 3 — readings exceeded 82°F for 45 minutes, auto-adjusted HVAC',
    status: 'completed',
    target: 'Grow Room 3',
    timestamp: '2026-03-07T08:30:00Z',
    result: 'HVAC adjusted, temperature stabilized at 76°F',
  },
  {
    id: 'act-05',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email-draft',
    description: 'Drafted win-back email to Emerald City Cannabis — no orders in 45 days',
    status: 'pending-approval',
    target: 'Emerald City Cannabis',
    timestamp: '2026-03-07T08:20:00Z',
  },
  {
    id: 'act-06',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'task-creation',
    description: 'Created follow-up task for Pacific Leaf overdue payment ($3,200)',
    status: 'completed',
    target: 'Pacific Leaf',
    timestamp: '2026-03-07T08:10:00Z',
    result: 'Task assigned to Jake Morrison',
  },
  {
    id: 'act-07',
    agentId: 'agent-analytics',
    agentName: 'Frost Analytics Agent',
    type: 'data-analysis',
    description: 'Generated weekly sales trend report — flower category up 12%, edibles down 3%',
    status: 'completed',
    target: 'Sales Analytics',
    timestamp: '2026-03-07T07:55:00Z',
    result: 'Report available in Reports module',
  },
  {
    id: 'act-08',
    agentId: 'agent-manufacturing',
    agentName: 'Frost Manufacturing Agent',
    type: 'alert',
    description: 'Extraction yield on Batch #M-0742 below target (68% vs 74% expected) — flagged for QC review',
    status: 'completed',
    target: 'Batch #M-0742',
    timestamp: '2026-03-07T07:40:00Z',
    result: 'QC review initiated',
  },
  {
    id: 'act-09',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'reorder-proposal',
    description: 'Proposed reorder for Summit Cannabis — 20 units Sour Diesel based on 14-day velocity',
    status: 'pending-approval',
    target: 'Summit Cannabis',
    timestamp: '2026-03-07T07:30:00Z',
  },
  {
    id: 'act-10',
    agentId: 'agent-compliance',
    agentName: 'Frost Compliance Agent',
    type: 'compliance-check',
    description: 'Verified Cascade Wellness licensing documentation — license renewal due in 30 days',
    status: 'completed',
    target: 'Cascade Wellness',
    timestamp: '2026-03-07T07:15:00Z',
    result: 'Renewal reminder sent',
  },
  {
    id: 'act-11',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'task-creation',
    description: 'Created delivery reschedule task for Rainier Remedies — moved to Friday per driver availability',
    status: 'completed',
    target: 'Rainier Remedies',
    timestamp: '2026-03-07T07:00:00Z',
    result: 'Task assigned to logistics team',
  },
  {
    id: 'act-12',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email-draft',
    description: 'Drafted introduction email for new contact at Capitol Hill Collective',
    status: 'completed',
    target: 'Capitol Hill Collective',
    timestamp: '2026-03-06T17:45:00Z',
    result: 'Email sent successfully',
  },
  {
    id: 'act-13',
    agentId: 'agent-cultivation',
    agentName: 'Frost Cultivation Agent',
    type: 'data-analysis',
    description: 'Analyzed Room 2 harvest data — OG Kush yielding 15% above projections this cycle',
    status: 'completed',
    target: 'Grow Room 2',
    timestamp: '2026-03-06T16:30:00Z',
    result: 'Updated yield projections in dashboard',
  },
  {
    id: 'act-14',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'task-creation',
    description: 'Scheduled Q1 review meeting with top 5 accounts — calendar invites pending approval',
    status: 'pending-approval',
    target: 'Multiple accounts',
    timestamp: '2026-03-06T16:00:00Z',
  },
  {
    id: 'act-15',
    agentId: 'agent-analytics',
    agentName: 'Frost Analytics Agent',
    type: 'data-analysis',
    description: 'Identified pricing opportunity — competitor price increase on concentrates across Seattle market',
    status: 'completed',
    target: 'Market Intelligence',
    timestamp: '2026-03-06T15:30:00Z',
    result: 'Pricing analysis shared with sales team',
  },
  {
    id: 'act-16',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email-draft',
    description: 'Drafted quarterly pricing update email for Pacific Leaf with new tier adjustments',
    status: 'completed',
    target: 'Pacific Leaf',
    timestamp: '2026-03-06T14:45:00Z',
    result: 'Awaiting manager review',
  },
  {
    id: 'act-17',
    agentId: 'agent-manufacturing',
    agentName: 'Frost Manufacturing Agent',
    type: 'task-creation',
    description: 'Created maintenance request for CO2 extraction unit #2 — pressure readings inconsistent',
    status: 'completed',
    target: 'Extraction Unit #2',
    timestamp: '2026-03-06T14:00:00Z',
    result: 'Maintenance scheduled for March 9',
  },
  {
    id: 'act-18',
    agentId: 'agent-compliance',
    agentName: 'Frost Compliance Agent',
    type: 'alert',
    description: 'Payment terms violation detected — Greenfield Dispensary 15 days past Net-30',
    status: 'completed',
    target: 'Greenfield Dispensary',
    timestamp: '2026-03-06T13:20:00Z',
    result: 'Collection notice drafted',
  },
  {
    id: 'act-19',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'task-creation',
    description: 'Created product photo review task — 24 new concentrate SKU images from Dana',
    status: 'completed',
    target: 'Content Team',
    timestamp: '2026-03-06T12:00:00Z',
    result: 'Task assigned to Dana Whitfield',
  },
  {
    id: 'act-20',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'reorder-proposal',
    description: 'Proposed bulk reorder for Rainier Remedies — $6,800 across flower and preroll categories',
    status: 'rejected',
    target: 'Rainier Remedies',
    timestamp: '2026-03-06T11:30:00Z',
    result: 'Rejected: Account has outstanding balance',
  },
  {
    id: 'act-21',
    agentId: 'agent-cultivation',
    agentName: 'Frost Cultivation Agent',
    type: 'alert',
    description: 'Humidity spike in Room 1 — 78% RH detected, dehumidifier activated',
    status: 'completed',
    target: 'Grow Room 1',
    timestamp: '2026-03-06T10:45:00Z',
    result: 'Humidity normalized to 55% within 20 minutes',
  },
  {
    id: 'act-22',
    agentId: 'agent-analytics',
    agentName: 'Frost Analytics Agent',
    type: 'data-analysis',
    description: 'Revenue forecast updated — projecting $428K for March, up from $412K previous estimate',
    status: 'completed',
    target: 'Finance',
    timestamp: '2026-03-06T10:00:00Z',
    result: 'Forecast shared with leadership',
  },
  {
    id: 'act-23',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email-draft',
    description: 'Drafted promotional email for new vaporizer line launch — targeting 32 active accounts',
    status: 'pending-approval',
    target: 'Multiple accounts',
    timestamp: '2026-03-06T09:30:00Z',
  },
  {
    id: 'act-24',
    agentId: 'agent-manufacturing',
    agentName: 'Frost Manufacturing Agent',
    type: 'data-analysis',
    description: 'Batch efficiency report — packaging line throughput improved 8% after schedule optimization',
    status: 'completed',
    target: 'Production',
    timestamp: '2026-03-06T09:00:00Z',
    result: 'Report filed in Manufacturing module',
  },
  {
    id: 'act-25',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'task-creation',
    description: 'Created onboarding checklist for new sales rep starting March 10',
    status: 'completed',
    target: 'Team',
    timestamp: '2026-03-06T08:30:00Z',
    result: 'Checklist created with 12 items',
  },
];

const conversations: AgentConversation[] = [
  {
    id: 'conv-sales',
    agentId: 'agent-sales',
    messages: [
      {
        role: 'user',
        content: 'Which accounts need attention this week?',
        timestamp: '2026-03-07T09:00:00Z',
      },
      {
        role: 'agent',
        content:
          'Based on my analysis, here are the accounts that need your attention this week:\n\n1. **Emerald City Cannabis** — No orders in 45 days. They typically reorder every 3 weeks. I\'ve drafted a win-back email for your review.\n\n2. **Pacific Leaf** — Outstanding payment of $3,200, now 18 days overdue. I\'ve created a follow-up task for Jake.\n\n3. **Greenfield Dispensary** — Their flower inventory should be running low based on purchase velocity. Reorder reminder sent this morning.\n\n4. **Olympic Greens** — Placed a smaller-than-usual order last cycle. Possible competitive pressure. Recommend a check-in call.',
        timestamp: '2026-03-07T09:00:15Z',
        references: ['CRM Account Health', 'Orders History', 'Payment Ledger'],
      },
      {
        role: 'user',
        content: 'What about Summit Cannabis? They seemed interested in our new vaporizer line.',
        timestamp: '2026-03-07T09:01:00Z',
      },
      {
        role: 'agent',
        content:
          'Summit Cannabis is actually in good shape. They placed a $4,200 order 6 days ago and their payment history is clean.\n\nRegarding the vaporizer line — I\'ve noted their interest from the last meeting notes. I\'ve prepared a reorder proposal for 20 units of Sour Diesel based on their 14-day velocity, and I can bundle a vaporizer sample pack with that order if you approve it.\n\nWant me to draft a personalized email highlighting the new vaporizer SKUs with their account-specific pricing?',
        timestamp: '2026-03-07T09:01:20Z',
        references: ['Summit Cannabis Account', 'Meeting Notes - Feb 28', 'Product Catalog'],
      },
      {
        role: 'user',
        content: 'Yes, draft that email and include the sample pack offer.',
        timestamp: '2026-03-07T09:02:00Z',
      },
      {
        role: 'agent',
        content:
          'Done. I\'ve drafted the email with:\n\n- Personalized greeting referencing their Feb 28 meeting\n- Overview of 4 new vaporizer SKUs with their Tier 2 pricing\n- Complimentary sample pack offer (2 units each SKU)\n- Reorder suggestion for Sour Diesel bundled in\n\nThe draft is in your Approvals queue for review. Total proposed order value: $5,640.',
        timestamp: '2026-03-07T09:02:30Z',
        references: ['Draft Email #E-2847', 'Approvals Queue'],
      },
    ],
  },
  {
    id: 'conv-compliance',
    agentId: 'agent-compliance',
    messages: [
      {
        role: 'user',
        content: 'Are we compliant on payments across all accounts?',
        timestamp: '2026-03-07T08:00:00Z',
      },
      {
        role: 'agent',
        content:
          'I\'ve run a full payment compliance audit. Here\'s the summary:\n\n**Compliant (18 accounts):** All payments within terms, documentation current.\n\n**Attention Needed (3 accounts):**\n\n1. **Greenfield Dispensary** — 15 days past Net-30 on Invoice #INV-2834 ($2,100). Collection notice drafted.\n\n2. **Pacific Leaf** — 18 days overdue on Invoice #INV-2801 ($3,200). Second reminder sent, escalation recommended.\n\n3. **Cascade Wellness** — Payment on time but their cannabis retail license expires April 6. Renewal documentation not yet received.\n\nAll METRC tags are verified and compliant as of this morning\'s audit (142/142).',
        timestamp: '2026-03-07T08:00:20Z',
        references: ['Payment Ledger', 'METRC Audit Log', 'License Database'],
      },
      {
        role: 'user',
        content: 'Flag Cascade Wellness as high priority for the license renewal.',
        timestamp: '2026-03-07T08:01:00Z',
      },
      {
        role: 'agent',
        content:
          'Done. I\'ve:\n\n1. Escalated Cascade Wellness license renewal to **high priority** in the compliance tracker\n2. Created a task for the compliance team to follow up by March 14\n3. Drafted a formal license renewal reminder email to their operations manager\n4. Set an automated alert for March 28 if documentation still hasn\'t been received\n\nWe cannot process orders for Cascade Wellness after April 6 without valid licensing. Want me to notify the sales team about this potential hold?',
        timestamp: '2026-03-07T08:01:15Z',
        references: ['Compliance Tracker', 'Cascade Wellness Account', 'State Licensing Portal'],
      },
    ],
  },
  {
    id: 'conv-cultivation',
    agentId: 'agent-cultivation',
    messages: [
      {
        role: 'user',
        content: "What's the status of Room 3?",
        timestamp: '2026-03-07T08:25:00Z',
      },
      {
        role: 'agent',
        content:
          'Room 3 status as of 8:25 AM:\n\n**Current Grow:** Blue Dream (Week 6 of Flower)\n**Plants:** 48 plants across 4 tables\n\n**Environment:**\n- Temperature: 76°F (target: 75°F) — recovered from a spike to 82°F at 8:30 AM, HVAC auto-adjusted\n- Humidity: 52% RH (target: 50%)\n- CO2: 1,100 ppm (target: 1,200 ppm)\n- Light cycle: 12/12, currently ON\n\n**Health Indicators:**\n- 46 plants healthy, 2 showing minor calcium deficiency on lower leaves\n- Trichome development on track for Week 6\n- Estimated harvest window: March 18-21\n\n**Yield Projection:** 2.8 lbs per light (8 lights) = ~22.4 lbs total',
        timestamp: '2026-03-07T08:25:20Z',
        references: ['Room 3 Sensors', 'Grow Schedule', 'Plant Health Log'],
      },
      {
        role: 'user',
        content: 'What caused the temperature spike?',
        timestamp: '2026-03-07T08:26:00Z',
      },
      {
        role: 'agent',
        content:
          'The spike was caused by HVAC Zone 3 compressor cycling off for a scheduled maintenance check at 7:45 AM. The backup ventilation system maintained airflow but couldn\'t compensate for the heat output from 8 HPS lights.\n\nTimeline:\n- 7:45 AM: Compressor cycled off for maintenance\n- 8:05 AM: Temperature crossed 78°F threshold, first alert generated\n- 8:20 AM: Temperature peaked at 82°F\n- 8:30 AM: I auto-engaged the backup cooling system and notified maintenance\n- 8:42 AM: Compressor back online, temperature dropping\n- 8:55 AM: Stabilized at 76°F\n\nThe plants were exposed to elevated temps for approximately 45 minutes. At Week 6, this is unlikely to cause significant stress, but I\'ll monitor trichome and terpene development closely over the next 48 hours.\n\nI recommend scheduling HVAC maintenance for Room 3 during the dark cycle (8 PM - 8 AM) to avoid future heat buildup.',
        timestamp: '2026-03-07T08:26:30Z',
        references: ['HVAC System Log', 'Room 3 Temperature History', 'Maintenance Schedule'],
      },
    ],
  },
];

export function getAgents(): Promise<Agent[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...agents]), 300);
  });
}

export function getAgentActions(agentId?: string): Promise<AgentAction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = agentId
        ? actions.filter((a) => a.agentId === agentId)
        : [...actions];
      resolve(filtered);
    }, 300);
  });
}

export function getAgentConversation(agentId: string): Promise<AgentConversation | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conv = conversations.find((c) => c.agentId === agentId) ?? null;
      resolve(conv);
    }, 300);
  });
}
