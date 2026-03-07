import type { Meeting, MeetingFilter } from '@/modules/meetings/types';

const MEETINGS: Meeting[] = [
  // Upcoming (scheduled)
  {
    id: 'mtg-001',
    title: 'Weekly Sales Standup',
    type: 'standup',
    date: '2026-03-10',
    startTime: '09:00',
    endTime: '09:30',
    attendees: ['Jake Morrison', 'Priya Patel', 'Carlos Ruiz', 'Dana Whitfield'],
    status: 'scheduled',
    actionItems: [],
  },
  {
    id: 'mtg-002',
    title: 'Greenfield Dispensary Q1 Review',
    type: 'account-review',
    date: '2026-03-11',
    startTime: '10:00',
    endTime: '11:00',
    attendees: ['Jake Morrison', 'Dana Whitfield'],
    accountId: 'acct-greenfield',
    status: 'scheduled',
    actionItems: [],
  },
  {
    id: 'mtg-003',
    title: 'New Product Launch Planning',
    type: 'planning',
    date: '2026-03-12',
    startTime: '14:00',
    endTime: '15:30',
    attendees: ['Dana Whitfield', 'Jake Morrison', 'Priya Patel', 'Carlos Ruiz'],
    status: 'scheduled',
    actionItems: [],
  },
  {
    id: 'mtg-004',
    title: 'Pacific Leaf Check-in',
    type: 'sales-call',
    date: '2026-03-10',
    startTime: '14:00',
    endTime: '14:30',
    attendees: ['Priya Patel'],
    accountId: 'acct-pacific-leaf',
    status: 'scheduled',
    actionItems: [],
  },

  // Completed with notes + action items
  {
    id: 'mtg-005',
    title: 'Weekly Sales Standup',
    type: 'standup',
    date: '2026-03-03',
    startTime: '09:00',
    endTime: '09:30',
    attendees: ['Jake Morrison', 'Priya Patel', 'Carlos Ruiz', 'Dana Whitfield'],
    status: 'completed',
    notes: 'Reviewed current pipeline — 12 active opportunities worth $284K. Jake closing Emerald City by Friday. Priya needs support on Pacific Leaf renewal. Carlos demoing new concentrate line to 3 accounts this week.',
    actionItems: [
      {
        id: 'ai-001',
        text: 'Send updated pricing sheet to Pacific Leaf',
        assignee: 'Priya Patel',
        dueDate: '2026-03-05',
        completed: false,
      },
      {
        id: 'ai-002',
        text: 'Prepare concentrate sample packs for demos',
        assignee: 'Carlos Ruiz',
        dueDate: '2026-03-07',
        completed: false,
      },
    ],
  },
  {
    id: 'mtg-006',
    title: 'Emerald City Cannabis Win-back Strategy',
    type: 'account-review',
    date: '2026-03-04',
    startTime: '11:00',
    endTime: '12:00',
    attendees: ['Jake Morrison', 'Dana Whitfield', 'Priya Patel'],
    accountId: 'acct-emerald-city',
    status: 'completed',
    notes: 'Emerald City reduced orders by 40% last quarter. Root cause: competitor undercut on flower pricing. Strategy: offer exclusive pre-roll bundle at 15% discount, assign dedicated account rep, schedule monthly check-ins.',
    actionItems: [
      {
        id: 'ai-003',
        text: 'Draft exclusive pre-roll bundle proposal',
        assignee: 'Jake Morrison',
        dueDate: '2026-03-07',
        completed: true,
      },
      {
        id: 'ai-004',
        text: 'Set up monthly cadence in CRM',
        assignee: 'Dana Whitfield',
        dueDate: '2026-03-06',
        completed: false,
      },
      {
        id: 'ai-005',
        text: 'Pull competitor pricing data for flower SKUs',
        assignee: 'Priya Patel',
        dueDate: '2026-03-08',
        completed: false,
      },
    ],
  },
  {
    id: 'mtg-007',
    title: 'Q1 Revenue Review',
    type: 'planning',
    date: '2026-03-05',
    startTime: '13:00',
    endTime: '14:30',
    attendees: ['Dana Whitfield', 'Jake Morrison', 'Priya Patel', 'Carlos Ruiz'],
    status: 'completed',
    notes: 'Q1 revenue tracking at $1.2M against $1.4M target (86%). Flower category strong, edibles underperforming. Action: shift marketing spend toward edible promotions. Need to close 3 more enterprise deals to hit target.',
    actionItems: [
      {
        id: 'ai-006',
        text: 'Identify top 5 edible prospects from CRM',
        assignee: 'Dana Whitfield',
        dueDate: '2026-03-10',
        completed: false,
      },
      {
        id: 'ai-007',
        text: 'Update Q1 forecast spreadsheet with latest numbers',
        assignee: 'Jake Morrison',
        dueDate: '2026-03-07',
        completed: false,
      },
    ],
  },
  {
    id: 'mtg-008',
    title: 'Summit Cannabis Order Review',
    type: 'sales-call',
    date: '2026-03-04',
    startTime: '15:00',
    endTime: '15:30',
    attendees: ['Carlos Ruiz', 'Dana Whitfield'],
    accountId: 'acct-summit',
    status: 'completed',
    notes: 'Summit placing large reorder — 200 units flower, 150 units pre-rolls. Discussed adding vaporizer line. They want samples before committing. Ship date confirmed for March 12.',
    actionItems: [
      {
        id: 'ai-008',
        text: 'Ship vaporizer samples to Summit Cannabis',
        assignee: 'Carlos Ruiz',
        dueDate: '2026-03-06',
        completed: true,
      },
    ],
  },
  {
    id: 'mtg-009',
    title: 'Compliance Training — CCRS Updates',
    type: 'training',
    date: '2026-03-03',
    startTime: '14:00',
    endTime: '15:00',
    attendees: ['Jake Morrison', 'Priya Patel', 'Carlos Ruiz', 'Dana Whitfield'],
    status: 'completed',
    notes: 'Covered new CCRS reporting requirements effective April 1. Key changes: manifest format update, 24-hour reporting window reduced to 12 hours, new product category codes for concentrates. All reps must update SOPs.',
    actionItems: [
      {
        id: 'ai-009',
        text: 'Update SOP documents with new CCRS codes',
        assignee: 'Dana Whitfield',
        dueDate: '2026-03-10',
        completed: false,
      },
      {
        id: 'ai-010',
        text: 'Test new manifest format in staging environment',
        assignee: 'Jake Morrison',
        dueDate: '2026-03-08',
        completed: false,
      },
    ],
  },

  // Completed without notes
  {
    id: 'mtg-010',
    title: 'Capitol Hill Collective Intro Call',
    type: 'sales-call',
    date: '2026-03-02',
    startTime: '10:00',
    endTime: '10:30',
    attendees: ['Priya Patel'],
    accountId: 'acct-capitol-hill',
    status: 'completed',
    actionItems: [],
  },
  {
    id: 'mtg-011',
    title: 'Team Weekly Recap',
    type: 'standup',
    date: '2026-02-28',
    startTime: '16:00',
    endTime: '16:30',
    attendees: ['Jake Morrison', 'Priya Patel', 'Carlos Ruiz', 'Dana Whitfield'],
    status: 'completed',
    actionItems: [],
  },
  {
    id: 'mtg-012',
    title: 'Delivery Route Optimization',
    type: 'planning',
    date: '2026-02-27',
    startTime: '11:00',
    endTime: '12:00',
    attendees: ['Dana Whitfield', 'Carlos Ruiz'],
    status: 'completed',
    actionItems: [],
  },
];

export async function getMeetings(filters?: MeetingFilter): Promise<Meeting[]> {
  await new Promise((r) => setTimeout(r, 300));

  let filtered = [...MEETINGS];

  if (filters?.type) {
    filtered = filtered.filter((m) => m.type === filters.type);
  }
  if (filters?.status) {
    filtered = filtered.filter((m) => m.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((m) => m.title.toLowerCase().includes(q));
  }

  return filtered;
}

export async function getMeetingMetrics() {
  await new Promise((r) => setTimeout(r, 300));

  const scheduled = MEETINGS.filter((m) => m.status === 'scheduled');
  const completed = MEETINGS.filter((m) => m.status === 'completed');
  const openActions = MEETINGS.flatMap((m) => m.actionItems).filter((a) => !a.completed);

  return {
    thisWeek: scheduled.length,
    upcomingToday: scheduled.filter((m) => m.date === '2026-03-06').length,
    actionItemsOpen: openActions.length,
    completedThisMonth: completed.filter((m) => m.date >= '2026-03-01').length,
  };
}
