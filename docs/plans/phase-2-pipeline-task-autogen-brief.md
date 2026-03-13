# Phase 2: Pipeline → Task Auto-Generation — Swarm Execution Brief

**Date:** 2026-03-12
**Prerequisite:** Phase 1 (Pipeline Visibility) is complete. All changes verified with `tsc --noEmit`, `npm run build`, and `npm run lint` — zero errors.
**Reference:** [Sales Intelligence Build Brief](sales-intelligence-build-brief.md) — full 5-phase plan
**Reference:** [Cultivera-Frost Overlap Audit](cultivera-frost-overlap-audit.md) — domain context + file paths
**Execution:** Parallel swarm — 3 agents with dependency: 2A must complete before 2B. 2C can start immediately.

---

## What Phase 1 Delivered

Phase 1 added pipeline visibility across 4 surfaces:

1. **Task type** — `pipelineCode?: string` added to `Task` interface and `TaskFilter` in `src/modules/tasks/types/index.ts`
2. **Task store** — `groupBy: 'status' | 'pipeline'` + `setGroupBy()` added to `src/modules/tasks/store.ts`
3. **Mock tasks** — All 10 agent-source tasks (task-a01 through task-a10) now have `pipelineCode` values (A2-A5, I3, R1-R2)
4. **Mock tasks filter** — `getTasks()` in `src/mocks/tasks.ts` supports `pipelineCode` filter
5. **Sales Dashboard** — New `PipelineWidget.tsx` showing Active/Inactive/Recovery distribution bars in bottom grid
6. **Accounts table** — New "Pipeline" column with `PipelineBadge` between Status and Assigned Rep columns
7. **SalesAccount type** — `pipelineCode?: string` added to `SalesAccount` in `src/modules/sales/types/index.ts`
8. **Mock accounts** — All 30 accounts have deterministic `pipelineCode` values via `PIPELINE_CODES` array
9. **OrderDrawer** — Pipeline badge shown next to account name, looked up via CRM accounts by name match

---

## Phase 2 Goal

Pipeline events auto-create tasks. This is the behavioral automation layer — when an account's health drops, phase goes stale, or status changes, the system generates actionable tasks for sales reps.

---

## Swarm: 3 Agents

### Agent 2A — Pipeline Event Engine (START FIRST)

**Task:** Build `usePipelineEventWatcher` hook that checks account state against threshold rules and returns triggered events.

**Files to create:**
- `apps/app/src/modules/pipeline/types/events.ts`
- `apps/app/src/modules/pipeline/hooks/usePipelineEvents.ts`

**`events.ts` — Type definitions:**
```ts
export type PipelineEventType =
  | 'health-below-threshold'
  | 'phase-stale'
  | 'status-changed-inactive'
  | 'license-expiring'
  | 'payment-overdue';

export interface PipelineEvent {
  id: string;
  type: PipelineEventType;
  accountId: string;
  accountName: string;
  pipelineCode: string;
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  triggeredAt: string;
  metadata: Record<string, unknown>;
}

export interface PipelineEventRule {
  type: PipelineEventType;
  label: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
}

export const PIPELINE_EVENT_RULES: PipelineEventRule[] = [
  { type: 'health-below-threshold', label: 'Health Score Below 40', description: 'Account health score dropped below threshold', severity: 'critical' },
  { type: 'phase-stale', label: 'Phase Stale > 30 Days', description: 'Account has been in the same pipeline phase for over 30 days', severity: 'medium' },
  { type: 'status-changed-inactive', label: 'Status Changed to Inactive', description: 'Account pipeline status changed to Inactive', severity: 'high' },
  { type: 'license-expiring', label: 'License Expiring < 30 Days', description: 'Account cannabis license expiring within 30 days', severity: 'high' },
  { type: 'payment-overdue', label: 'Payment Overdue > 3 Days', description: 'Account has a payment overdue by more than 3 days', severity: 'medium' },
];
```

**`usePipelineEvents.ts` — Hook implementation:**
- Import CRM accounts from `@/mocks/crm` (they have `healthScore`, `pipeline.enteredDate`, `pipeline.status`, etc.)
- Import compliance data types if available, otherwise generate mock license/payment data inline
- TanStack Query hook with queryKey `['pipeline', 'events']`
- Check each account against all 5 rules:
  1. `healthScore < 40` → `health-below-threshold` event
  2. Days since `pipeline.enteredDate` > 30 → `phase-stale` event
  3. `pipeline.status === 'inactive'` → `status-changed-inactive` event (for recently changed — check if enteredDate < 7 days ago)
  4. Mock `licenseDaysRemaining < 30` → `license-expiring` event (generate from account index)
  5. Mock `paymentOverdueDays > 3` → `payment-overdue` event (generate from account index)
- Return `PipelineEvent[]` sorted by severity (critical first)
- Use simulated delay of 300ms

**Data sources:**
- CRM accounts: `import { accounts } from '@/mocks/crm'` — each has `id`, `name`, `healthScore`, `pipeline: PipelineInfo`, `pipelineStatus`, `pipelinePhase`, `pipelineHistory`
- PipelineInfo: `{ status, phase, code, name, enteredDate, assignedRep }`
- Current date for calculations: `'2026-03-12'`

**Export the hook from `apps/app/src/modules/pipeline/hooks/index.ts`.**

---

### Agent 2B — Auto-Task Generator (DEPENDS ON 2A)

**Task:** Build `useAutoTasks` hook that takes pipeline events and generates Task objects.

**Files to create:**
- `apps/app/src/modules/tasks/hooks/useAutoTasks.ts`

**Files to modify:**
- `apps/app/src/mocks/tasks.ts` — add 15-20 auto-generated pipeline tasks to the mock data

**`useAutoTasks.ts` — Hook implementation:**
- Import `PipelineEvent` types from `@/modules/pipeline/types/events`
- Import `usePipelineEvents` from `@/modules/pipeline/hooks/usePipelineEvents`
- Import `Task` type from `@/modules/tasks/types`
- TanStack Query hook with queryKey `['tasks', 'auto-generated']`
- For each PipelineEvent, generate a Task:
  - `id`: `task-pipeline-${event.id}`
  - `title`: Human-readable based on event type (e.g., "Health review: {accountName} — score below threshold")
  - `description`: Actionable description with context
  - `status`: `'todo'`
  - `priority`: Map from event severity (`critical` → `critical`, `high` → `high`, `medium` → `medium`)
  - `assignee`: Use event's account rep (from CRM data) or default to `'Jake Morrison'`
  - `pipelineCode`: From event
  - `linkedAccountId`: From event
  - `module`: `'CRM'`
  - `moduleRoute`: `'/crm'`
  - `source`: `'agent'`
  - `tags`: Include event type as tag + `'pipeline'`, `'auto-generated'`
  - `createdAt`: event.triggeredAt
  - `dueDate`: Calculated based on severity (critical = +1 day, high = +3 days, medium = +7 days)
- Return `Task[]`

**Mock data additions to `src/mocks/tasks.ts`:**
Add 15-20 static pipeline-generated tasks with `source: 'agent'` and realistic pipeline codes. These represent the "already generated" pipeline tasks. Examples:

```ts
// Pipeline auto-tasks (15)
{ id: 'task-p01', title: 'Health review: Emerald City Cannabis — score 28, churning risk', pipelineCode: 'R1', linkedAccountId: 'acct-emerald-city', priority: 'critical', source: 'agent', tags: ['pipeline', 'health-review', 'auto-generated'], ... },
{ id: 'task-p02', title: 'Win-back outreach: Northern Leaf — inactive 42 days', pipelineCode: 'I1', linkedAccountId: 'acct-northern-leaf', priority: 'high', source: 'agent', tags: ['pipeline', 'win-back', 'auto-generated'], ... },
{ id: 'task-p03', title: 'Phase review: Olympic Gardens — stale in A2 for 35 days', pipelineCode: 'A2', ... },
{ id: 'task-p04', title: 'License renewal: Spokane Greens — expires in 21 days', pipelineCode: 'R1', ... },
{ id: 'task-p05', title: 'Payment follow-up: Harbor Cannabis — 5 days overdue', pipelineCode: 'R2', ... },
// ... etc (15 total, mix of all 5 event types)
```

Use realistic dispensary names from existing mocks. Mix of statuses (mostly `'todo'`, some `'in-progress'`). Assignees from: Jake Morrison, Priya Patel, Carlos Ruiz, Dana Whitfield.

**Export the hook from `apps/app/src/modules/tasks/hooks/` (create index.ts if needed).**

---

### Agent 2C — Pipeline Tasks in TaskBoard (CAN START IMMEDIATELY)

**Task:** Wire pipeline tasks into the TaskBoard UI.

**Files to modify:**
- `apps/app/src/modules/tasks/components/TaskBoard.tsx`
- `apps/app/src/modules/tasks/components/TaskCard.tsx` (read first)

**Changes to TaskBoard.tsx:**
1. No structural changes needed — the TaskBoard already renders all tasks passed to it
2. The key change is that Phase 2B will add pipeline tasks to the mock data, and they'll appear automatically

**Changes to TaskCard.tsx:**
1. Read the current TaskCard implementation first
2. Add a `PipelineBadge` to task cards that have a `pipelineCode`:
   - Import `PipelineBadge` from `@/modules/pipeline/components/PipelineBadge`
   - In the card layout, add the badge next to the source icon or assignee — wherever it fits visually
   - Only show if `task.pipelineCode` is defined

**Files to modify (TasksPage or TaskFilters):**
1. Find the TaskFilters component (search for it in `apps/app/src/modules/tasks/components/`)
2. Add a "Pipeline" filter chip/dropdown that filters by `pipelineCode`
3. Options should include: All, Active (A*), Inactive (I*), Recovery (R*), or specific codes
4. Wire the filter to the existing task filtering mechanism

**Read these files before modifying:**
- `apps/app/src/modules/tasks/components/TaskCard.tsx`
- `apps/app/src/modules/tasks/components/TaskBoard.tsx`
- Any TaskFilters component in the tasks module
- `apps/app/src/modules/tasks/types/index.ts` (already has `pipelineCode` on Task and TaskFilter)

---

## Execution Order

```
Agent 2C (start immediately — UI changes only, uses existing types from Phase 1)
Agent 2A (start immediately — event engine, no dependencies)
  ↓ (2A must finish before 2B starts)
Agent 2B (after 2A — consumes event types to generate tasks + adds mock data)
```

Run 2A and 2C in parallel. Then run 2B after 2A completes.

---

## Constraints

- **Reuse shared components**: `PipelineBadge` from `src/modules/pipeline/components/PipelineBadge.tsx`
- **Design tokens**: All colors from CSS variables, never hardcode hex
- **Data hooks**: TanStack Query with simulated delays, components never fetch directly
- **Mock data**: Realistic cannabis dispensary personas, consistent with existing mocks in `src/mocks/`
- **No `any`** in public component props
- **No business logic** in page.tsx files
- **`'use client'`** directive on all new components/hooks
- **Build + lint must pass** after phase: `cd apps/app && npx tsc --noEmit && npm run build && npm run lint`

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/modules/tasks/types/index.ts` | Task + TaskFilter types (already has pipelineCode) |
| `src/modules/tasks/store.ts` | Board store (already has groupBy: status \| pipeline) |
| `src/mocks/tasks.ts` | Task mock data + getTasks() with pipelineCode filter |
| `src/modules/pipeline/components/PipelineBadge.tsx` | Reusable A/I/R badge |
| `src/modules/pipeline/hooks/usePipelineData.ts` | Pipeline grid data hook |
| `src/modules/pipeline/types/index.ts` | Pipeline types (re-exports from CRM) |
| `src/modules/crm/types/index.ts` | PipelineInfo, PipelineStatus, PipelinePhase |
| `src/mocks/crm.ts` | CRM accounts with healthScore, pipeline, pipelineHistory |
| `src/modules/tasks/components/TaskBoard.tsx` | Kanban board component |
| `src/modules/tasks/components/TaskCard.tsx` | Individual task card |

## After Completion

Run verification:
```bash
cd apps/app && npx tsc --noEmit && npm run build && npm run lint
```

All must pass with zero errors before considering Phase 2 complete.
