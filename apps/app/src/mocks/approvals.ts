import type { ApprovalRequest } from '@/modules/approvals/types';

const approvalRequests: ApprovalRequest[] = [
  // === PENDING (6) ===
  {
    id: 'appr-01',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email',
    status: 'pending',
    priority: 'normal',
    title: 'Send reorder email to Greenfield',
    description:
      'Greenfield Dispensary flower inventory is running low based on 14-day purchase velocity. This email reminds them to reorder before stock-out.',
    preview:
      'Hi Sarah,\n\nHope things are going well at Greenfield! I noticed your last flower order was 18 days ago — based on your typical sell-through, you may be running low on Blue Dream and Gelato.\n\nWe have fresh harvest from our latest cycle ready to ship. Want me to put together your usual order?\n\nLet me know if you\'d like to adjust quantities or add anything new.\n\nBest,\nFrost Cannabis Team',
    target: 'Greenfield Dispensary',
    createdAt: '2026-03-07T09:15:00Z',
  },
  {
    id: 'appr-02',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'order',
    status: 'pending',
    priority: 'urgent',
    title: 'Create purchase order for Olympic Greens — $4,200',
    description:
      'Olympic Greens requested a restock via their buyer portal. Order includes 50 units Blue Dream flower and 30 units Gelato prerolls at Tier 1 pricing.',
    preview:
      'Purchase Order #PO-2856\n\nAccount: Olympic Greens\nBuyer: Marcus Chen\nPricing Tier: 1 (Preferred)\n\nLine Items:\n- Blue Dream 3.5g (50 units) @ $42.00 = $2,100.00\n- Gelato Preroll 1g 5-pack (30 units) @ $70.00 = $2,100.00\n\nSubtotal: $4,200.00\nPayment Terms: Net-30\nRequested Delivery: March 10, 2026\n\nNote: Account is current on all payments. Last order was $3,800 on Feb 21.',
    target: 'Olympic Greens',
    createdAt: '2026-03-07T09:02:00Z',
  },
  {
    id: 'appr-03',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'schedule-change',
    status: 'pending',
    priority: 'normal',
    title: 'Reschedule Spokane delivery to Friday',
    description:
      'Driver availability conflict on Thursday. Proposing to move the Spokane route (3 stops: Rainier Remedies, Summit Cannabis, Cascade Wellness) to Friday morning.',
    preview:
      'Schedule Change Request\n\nOriginal: Thursday, March 12 — Spokane Route\nProposed: Friday, March 13 — Spokane Route\n\nAffected Stops:\n1. Rainier Remedies — 2 orders ($3,400)\n2. Summit Cannabis — 1 order ($4,200)\n3. Cascade Wellness — 1 order ($1,800)\n\nReason: Driver Mike Rodriguez has a vehicle inspection scheduled Thursday AM. No other drivers available for the Spokane route.\n\nAll three accounts have been pre-notified via automated text.',
    target: 'Delivery Schedule',
    createdAt: '2026-03-07T08:50:00Z',
  },
  {
    id: 'appr-04',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email',
    status: 'pending',
    priority: 'normal',
    title: 'Draft win-back email to Emerald City',
    description:
      'Emerald City Cannabis has not placed an order in 45 days, well above their typical 21-day cycle. This win-back email offers a 5% discount on their next order.',
    preview:
      'Hi Jordan,\n\nWe\'ve missed you at Emerald City! It\'s been a while since your last order and I wanted to check in.\n\nWe\'ve got some exciting new strains from our spring harvest, including a limited-edition Rainier Haze that\'s been getting great feedback.\n\nAs a valued partner, I\'d like to offer 5% off your next order if placed by March 15. Want me to send over our updated menu?\n\nLooking forward to reconnecting.\n\nBest,\nFrost Cannabis Team',
    target: 'Emerald City Cannabis',
    createdAt: '2026-03-07T08:20:00Z',
  },
  {
    id: 'appr-05',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'price-adjustment',
    status: 'pending',
    priority: 'low',
    title: 'Adjust pricing tier for Cascade Wellness',
    description:
      'Cascade Wellness has exceeded the $50K quarterly threshold for Tier 2 pricing. Recommending automatic upgrade to Tier 1 (Preferred) pricing effective immediately.',
    preview:
      'Pricing Tier Adjustment\n\nAccount: Cascade Wellness\nCurrent Tier: 2 (Standard)\nProposed Tier: 1 (Preferred)\n\nJustification:\n- Q1 2026 spend to date: $52,400 (threshold: $50,000)\n- 12 orders placed this quarter\n- Payment history: 100% on-time\n- Average order value: $4,367\n\nImpact: ~8% reduction in unit pricing across all categories\nEstimated annual revenue impact: -$6,200 (offset by increased volume)',
    target: 'Cascade Wellness',
    createdAt: '2026-03-07T07:45:00Z',
  },
  {
    id: 'appr-06',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'task-assignment',
    status: 'pending',
    priority: 'urgent',
    title: 'Create follow-up task for Pacific Leaf payment',
    description:
      'Pacific Leaf has an outstanding balance of $3,200 that is 18 days overdue. Creating an escalation task assigned to Jake Morrison with a March 10 deadline.',
    preview:
      'Task Creation Request\n\nTitle: Follow up on Pacific Leaf overdue payment\nAssignee: Jake Morrison\nPriority: High\nDue Date: March 10, 2026\n\nDetails:\n- Invoice #INV-2801: $3,200 (due Feb 17, now 18 days overdue)\n- Two automated reminders sent (Feb 24, March 3)\n- No response from accounts payable contact\n- Recommend phone call to buyer (Lisa Park) directly\n\nEscalation Path:\n1. Jake calls Lisa Park by March 8\n2. If no response, escalate to their GM (David Nguyen)\n3. If unresolved by March 14, initiate formal collection process',
    target: 'Pacific Leaf',
    createdAt: '2026-03-07T08:10:00Z',
  },

  // === APPROVED (5) ===
  {
    id: 'appr-07',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email',
    status: 'approved',
    priority: 'normal',
    title: 'Send quarterly pricing update to Pacific Leaf',
    description: 'Quarterly pricing notification with updated tier adjustments for Q2.',
    preview:
      'Hi Lisa,\n\nAttached is our updated Q2 pricing schedule. Your Tier 2 rates remain unchanged, with a slight adjustment on concentrate pricing reflecting market conditions.\n\nPlease review and let me know if you have any questions.\n\nBest,\nFrost Cannabis Team',
    target: 'Pacific Leaf',
    createdAt: '2026-03-06T14:45:00Z',
    reviewedAt: '2026-03-06T15:10:00Z',
    reviewedBy: 'Jake Morrison',
  },
  {
    id: 'appr-08',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email',
    status: 'approved',
    priority: 'normal',
    title: 'Send introduction email to Capitol Hill Collective',
    description: 'New contact introduction with product catalog and pricing overview.',
    preview:
      'Hi Alex,\n\nGreat meeting you at the WA Cannabis Expo last week! As discussed, here\'s an overview of our product lines and current Tier 2 pricing.\n\nI\'d love to set up a tasting session at your location. What does your schedule look like next week?\n\nBest,\nFrost Cannabis Team',
    target: 'Capitol Hill Collective',
    createdAt: '2026-03-06T17:45:00Z',
    reviewedAt: '2026-03-06T18:00:00Z',
    reviewedBy: 'Dana Whitfield',
  },
  {
    id: 'appr-09',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'task-assignment',
    status: 'approved',
    priority: 'normal',
    title: 'Create product photo review task',
    description: '24 new concentrate SKU images need brand consistency review.',
    preview:
      'Task: Review and approve new concentrate product photos\nAssignee: Dana Whitfield\nDue: March 11, 2026\n24 images uploaded to Content module for review.',
    target: 'Content Team',
    createdAt: '2026-03-06T12:00:00Z',
    reviewedAt: '2026-03-06T12:15:00Z',
    reviewedBy: 'Jake Morrison',
  },
  {
    id: 'appr-10',
    agentId: 'agent-compliance',
    agentName: 'Frost Compliance Agent',
    type: 'email',
    status: 'approved',
    priority: 'urgent',
    title: 'Send license renewal reminder to Cascade Wellness',
    description: 'Formal notice that their cannabis retail license expires April 6.',
    preview:
      'Dear Cascade Wellness Operations Team,\n\nThis is a formal reminder that your Washington State cannabis retail license (LIC-2847) expires on April 6, 2026.\n\nPer our vendor agreement, we require current licensing documentation to process orders. Please submit your renewal confirmation by March 28.\n\nThank you,\nFrost Compliance Team',
    target: 'Cascade Wellness',
    createdAt: '2026-03-06T13:30:00Z',
    reviewedAt: '2026-03-06T13:45:00Z',
    reviewedBy: 'Sarah Kim',
  },
  {
    id: 'appr-11',
    agentId: 'agent-general',
    agentName: 'Frost General Assistant',
    type: 'task-assignment',
    status: 'approved',
    priority: 'normal',
    title: 'Create onboarding checklist for new sales rep',
    description: 'Standard onboarding checklist with 12 items for the March 10 start date.',
    preview:
      'Onboarding Checklist — New Sales Representative\nStart Date: March 10, 2026\n\n1. System access setup (CRM, Orders, Inventory)\n2. Product knowledge training (2 days)\n3. Territory assignment and account introductions\n...(12 items total)',
    target: 'Team',
    createdAt: '2026-03-06T08:30:00Z',
    reviewedAt: '2026-03-06T09:00:00Z',
    reviewedBy: 'Jake Morrison',
  },

  // === REJECTED (3) ===
  {
    id: 'appr-12',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'order',
    status: 'rejected',
    priority: 'normal',
    title: 'Create reorder for Rainier Remedies — $6,800',
    description:
      'Proposed bulk reorder across flower and preroll categories based on purchase velocity.',
    preview:
      'Purchase Order #PO-2849\nAccount: Rainier Remedies\nTotal: $6,800.00\n\nLine Items:\n- Blue Dream 3.5g (40 units) @ $42.00\n- Sour Diesel 3.5g (30 units) @ $42.00\n- Preroll Variety 5-pack (40 units) @ $70.00',
    target: 'Rainier Remedies',
    createdAt: '2026-03-06T11:30:00Z',
    reviewedAt: '2026-03-06T11:50:00Z',
    reviewedBy: 'Jake Morrison',
    modificationNotes: 'Rejected: Rainier Remedies has an outstanding balance of $2,400. No new orders until payment is received.',
  },
  {
    id: 'appr-13',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email',
    status: 'rejected',
    priority: 'low',
    title: 'Send promotional blast to inactive accounts',
    description: 'Mass promotional email to 15 accounts inactive for 60+ days.',
    preview:
      'Subject: We Miss You! Special Offer Inside\n\nDear Valued Partner,\n\nIt\'s been a while since your last order. We\'d love to reconnect...',
    target: 'Multiple accounts',
    createdAt: '2026-03-05T16:00:00Z',
    reviewedAt: '2026-03-05T16:30:00Z',
    reviewedBy: 'Dana Whitfield',
    modificationNotes: 'Rejected: Generic blast emails don\'t align with our personalized outreach strategy. Please draft individual emails per account.',
  },
  {
    id: 'appr-14',
    agentId: 'agent-manufacturing',
    agentName: 'Frost Manufacturing Agent',
    type: 'schedule-change',
    status: 'rejected',
    priority: 'normal',
    title: 'Reschedule Batch #M-0745 to next week',
    description: 'Proposed delaying concentrate batch due to equipment maintenance.',
    preview:
      'Schedule Change: Batch #M-0745 (Gelato Concentrate)\nOriginal: March 8\nProposed: March 15\nReason: CO2 extraction unit #2 maintenance',
    target: 'Production Schedule',
    createdAt: '2026-03-05T14:00:00Z',
    reviewedAt: '2026-03-05T14:30:00Z',
    reviewedBy: 'Sarah Kim',
    modificationNotes: 'Rejected: We can use extraction unit #1 instead. No need to delay the batch.',
  },

  // === MODIFIED (1) ===
  {
    id: 'appr-15',
    agentId: 'agent-sales',
    agentName: 'Frost Sales Agent',
    type: 'email',
    status: 'modified',
    priority: 'normal',
    title: 'Send vaporizer launch email to active accounts',
    description:
      'Promotional email for new vaporizer line targeting 32 active accounts.',
    preview:
      'Hi [Name],\n\nExciting news! We\'re launching our new premium vaporizer line featuring four new SKUs...\n\n[Modified: Added compliance disclaimer and removed pricing — pricing should be shared per-account only]',
    target: 'Multiple accounts',
    createdAt: '2026-03-06T09:30:00Z',
    reviewedAt: '2026-03-06T10:00:00Z',
    reviewedBy: 'Jake Morrison',
    modificationNotes:
      'Approved with modifications: Removed bulk pricing from email body (pricing is account-specific). Added required WA state compliance disclaimer. Changed "limited time" language to avoid pressure tactics.',
  },
];

export interface ApprovalFilters {
  status?: ApprovalRequest['status'];
  type?: ApprovalRequest['type'];
  priority?: ApprovalRequest['priority'];
  agentId?: string;
}

export function getApprovalRequests(filters?: ApprovalFilters): Promise<ApprovalRequest[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...approvalRequests];
      if (filters?.status) {
        result = result.filter((r) => r.status === filters.status);
      }
      if (filters?.type) {
        result = result.filter((r) => r.type === filters.type);
      }
      if (filters?.priority) {
        result = result.filter((r) => r.priority === filters.priority);
      }
      if (filters?.agentId) {
        result = result.filter((r) => r.agentId === filters.agentId);
      }
      resolve(result);
    }, 300);
  });
}
