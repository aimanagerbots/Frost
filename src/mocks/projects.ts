import type { Project, ProjectFilter } from '@/modules/projects/types';

const PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Q2 Product Launch — Solventless Line',
    description:
      'Launch a new solventless concentrate line including live rosin, hash rosin, and cold-cure badder SKUs. Covers formulation, compliance testing, packaging design, and retail rollout across all accounts.',
    status: 'active',
    lead: 'Dana Whitfield',
    members: ['Dana Whitfield', 'James Park', 'Marcus Johnson', 'Jake Morrison'],
    startDate: '2026-01-15',
    targetDate: '2026-04-30',
    progress: 65,
    milestones: [
      {
        id: 'ms-001-1',
        title: 'Formulation Complete',
        dueDate: '2026-02-01',
        completed: true,
        description: 'Finalize all solventless SKU formulations and COA specs.',
      },
      {
        id: 'ms-001-2',
        title: 'Sample Approval',
        dueDate: '2026-02-28',
        completed: true,
        description: 'Internal and buyer sample review approved.',
      },
      {
        id: 'ms-001-3',
        title: 'Production Run',
        dueDate: '2026-03-31',
        completed: false,
        description: 'First full production batch across all SKUs.',
      },
      {
        id: 'ms-001-4',
        title: 'Sales Rollout',
        dueDate: '2026-04-30',
        completed: false,
        description: 'Push to all retail accounts with marketing collateral.',
      },
    ],
  },
  {
    id: 'proj-002',
    name: 'Bamboo Integration',
    description:
      'Integrate Bamboo HR system with Frost platform for automated employee data sync, time tracking, and payroll reporting. Replaces manual CSV imports.',
    status: 'active',
    lead: 'Dana Whitfield',
    members: ['Dana Whitfield', 'Tyler Ross'],
    startDate: '2026-02-01',
    targetDate: '2026-05-15',
    progress: 40,
    milestones: [
      {
        id: 'ms-002-1',
        title: 'Requirements Gathering',
        dueDate: '2026-02-15',
        completed: true,
        description: 'Document all data fields and sync requirements.',
      },
      {
        id: 'ms-002-2',
        title: 'API Setup',
        dueDate: '2026-03-01',
        completed: true,
        description: 'Bamboo API credentials and endpoint mapping complete.',
      },
      {
        id: 'ms-002-3',
        title: 'Data Migration',
        dueDate: '2026-03-31',
        completed: false,
        description: 'Migrate historical employee records into Frost.',
      },
      {
        id: 'ms-002-4',
        title: 'Testing',
        dueDate: '2026-04-30',
        completed: false,
        description: 'End-to-end sync testing with edge cases.',
      },
      {
        id: 'ms-002-5',
        title: 'Go-Live',
        dueDate: '2026-05-15',
        completed: false,
        description: 'Production cutover and deprecate manual imports.',
      },
    ],
  },
  {
    id: 'proj-003',
    name: 'B2B Portal Development',
    description:
      'Build a self-service B2B portal for dispensary buyers to browse the product catalog, place orders, view invoices, and track delivery status in real time.',
    status: 'planning',
    lead: 'Dana Whitfield',
    members: ['Dana Whitfield', 'Jake Morrison', 'Priya Patel'],
    startDate: '2026-03-01',
    targetDate: '2026-08-01',
    progress: 10,
    milestones: [
      {
        id: 'ms-003-1',
        title: 'Design Mockups',
        dueDate: '2026-04-01',
        completed: false,
        description: 'High-fidelity mockups for all portal screens.',
      },
      {
        id: 'ms-003-2',
        title: 'Backend API',
        dueDate: '2026-06-01',
        completed: false,
        description: 'REST API for catalog, orders, and invoices.',
      },
      {
        id: 'ms-003-3',
        title: 'Launch',
        dueDate: '2026-08-01',
        completed: false,
        description: 'Soft launch with top 10 accounts, then full rollout.',
      },
    ],
  },
  {
    id: 'proj-004',
    name: 'New Grow Room Buildout — Room 9',
    description:
      'Full buildout of cultivation Room 9 including permitting, construction, HVAC, LED lighting, and automated irrigation. Adds 2,400 sq ft of canopy.',
    status: 'active',
    lead: 'Sarah Williams',
    members: ['Sarah Williams', 'Carlos Ruiz'],
    startDate: '2025-11-01',
    targetDate: '2026-03-31',
    progress: 80,
    milestones: [
      {
        id: 'ms-004-1',
        title: 'Permits',
        dueDate: '2025-11-15',
        completed: true,
        description: 'City and state permits approved.',
      },
      {
        id: 'ms-004-2',
        title: 'Construction',
        dueDate: '2025-12-15',
        completed: true,
        description: 'Walls, flooring, and electrical rough-in.',
      },
      {
        id: 'ms-004-3',
        title: 'HVAC Install',
        dueDate: '2026-01-15',
        completed: true,
        description: 'Climate control system fully installed and tested.',
      },
      {
        id: 'ms-004-4',
        title: 'Lighting',
        dueDate: '2026-02-01',
        completed: true,
        description: 'LED grow lights mounted and wired.',
      },
      {
        id: 'ms-004-5',
        title: 'Irrigation',
        dueDate: '2026-02-28',
        completed: true,
        description: 'Automated drip irrigation and fertigation system.',
      },
      {
        id: 'ms-004-6',
        title: 'First Plant',
        dueDate: '2026-03-31',
        completed: false,
        description: 'Initial clone transplant and first grow cycle begins.',
      },
    ],
  },
  {
    id: 'proj-005',
    name: 'Packaging Automation Research',
    description:
      'Evaluate automated packaging equipment vendors for pre-roll and edible lines. Goal is to reduce packaging labor by 60% and improve consistency.',
    status: 'on-hold',
    lead: 'Rachel Kim',
    members: ['Rachel Kim', 'David Okonkwo'],
    startDate: '2026-01-15',
    targetDate: '2026-06-30',
    progress: 25,
    milestones: [
      {
        id: 'ms-005-1',
        title: 'Vendor Evaluation',
        dueDate: '2026-03-01',
        completed: true,
        description: 'RFP sent to 5 vendors, 3 shortlisted for demos.',
      },
      {
        id: 'ms-005-2',
        title: 'Pilot Program',
        dueDate: '2026-06-30',
        completed: false,
        description: 'Run a 4-week pilot with the selected vendor.',
      },
    ],
  },
  {
    id: 'proj-006',
    name: 'Holiday Marketing Campaign 2026',
    description:
      'End-to-end holiday marketing campaign for Q4 2025 covering 4/20 pre-season, Black Friday, and holiday gift bundles. Includes social, email, and in-store POS materials.',
    status: 'completed',
    lead: 'Dana Whitfield',
    members: ['Dana Whitfield', 'Jake Morrison'],
    startDate: '2025-10-01',
    targetDate: '2025-12-31',
    progress: 100,
    milestones: [
      {
        id: 'ms-006-1',
        title: 'Creative Brief',
        dueDate: '2025-10-15',
        completed: true,
        description: 'Campaign strategy, target audience, and KPIs defined.',
      },
      {
        id: 'ms-006-2',
        title: 'Content Production',
        dueDate: '2025-11-01',
        completed: true,
        description: 'All creative assets produced and approved.',
      },
      {
        id: 'ms-006-3',
        title: 'Campaign Launch',
        dueDate: '2025-11-15',
        completed: true,
        description: 'Campaign live across all channels.',
      },
      {
        id: 'ms-006-4',
        title: 'Post-Campaign Analysis',
        dueDate: '2025-12-31',
        completed: true,
        description: 'ROI analysis and learnings documented.',
      },
    ],
  },
];

export async function getProjects(filters?: ProjectFilter): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  let results = [...PROJECTS];

  if (filters?.status) {
    results = results.filter((p) => p.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.lead.toLowerCase().includes(q)
    );
  }

  return results;
}

export async function getProjectMetrics(): Promise<{
  active: number;
  onTrack: number;
  behind: number;
  completedThisQuarter: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const active = PROJECTS.filter((p) => p.status === 'active').length;

  const now = new Date();
  let onTrack = 0;
  let behind = 0;

  for (const p of PROJECTS) {
    if (p.status !== 'active') continue;
    const start = new Date(p.startDate).getTime();
    const end = new Date(p.targetDate).getTime();
    const elapsed = (now.getTime() - start) / (end - start);
    const expectedProgress = Math.min(Math.max(elapsed * 100, 0), 100);

    if (p.progress >= expectedProgress - 10) {
      onTrack++;
    } else {
      behind++;
    }
  }

  // Completed this quarter (Q1 2026: Jan-Mar)
  const quarterStart = new Date('2026-01-01');
  const quarterEnd = new Date('2026-03-31');
  const completedThisQuarter = PROJECTS.filter(
    (p) =>
      p.status === 'completed' &&
      new Date(p.targetDate) >= quarterStart &&
      new Date(p.targetDate) <= quarterEnd
  ).length;

  return { active, onTrack, behind, completedThisQuarter };
}
