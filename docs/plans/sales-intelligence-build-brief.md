# Sales Intelligence & Pipeline Automation — Build Brief

**Date:** 2026-03-12
**Reference:** [Cultivera-Frost Overlap Audit](cultivera-frost-overlap-audit.md) — read this first for full context
**Execution:** Parallel swarm — use `/gsd:plan-phase` then `/gsd:execute-phase` or dispatch agents directly

---

## Mission

Transform the Sales module from a passive data viewer into a pipeline-driven selling engine. The A/I/R pipeline (Active 1-5, Inactive 1-5, Recovery 1-5) is the backbone — every account should be pushed toward A5 (Strategic Partner). Pipeline state must be visible everywhere, auto-generate tasks, and drive AI recommendations.

Simultaneously, fill Cultivera parity gaps so existing users see their familiar workflows intact.

---

## Phase 1: Pipeline Visibility (Swarm: 4 agents)

**Goal:** Pipeline state visible on every surface, not just `/pipeline`.

| Agent | Task | Files to Modify | Files to Read |
|-------|------|-----------------|---------------|
| **1A** | Add `pipelineCode` field to Task type + pipeline filter to TaskFilter + pipeline grouping option in task store | `src/modules/tasks/types/index.ts`, `src/modules/tasks/store.ts`, `src/mocks/tasks.ts` | Audit §8 "Tasks as Pipeline Execution" |
| **1B** | Add PipelineBadge + pipeline distribution mini-widget to Sales Dashboard | `src/modules/sales-dashboard/components/SalesDashboardPage.tsx`, create `PipelineWidget.tsx` | `src/modules/pipeline/components/PipelineBadge.tsx` (reuse), `src/modules/pipeline/hooks/usePipelineData.ts` |
| **1C** | Add PipelineBadge column to Cultivera-parity Accounts table | `src/modules/accounts/components/AccountsTable.tsx` | `src/modules/pipeline/components/PipelineBadge.tsx`, `src/mocks/sales.ts` (add pipelineCode to SalesAccount mock) |
| **1D** | Add pipeline state to OrderDrawer (show account's A/I/R code) | `src/modules/orders/components/OrderDrawer.tsx` | `src/modules/pipeline/components/PipelineBadge.tsx` |

**Constraints:**
- Reuse existing `PipelineBadge` from `src/modules/pipeline/components/PipelineBadge.tsx` — do NOT recreate
- Pipeline data shape: `PipelineInfo { status, phase, code, name, enteredDate }` from `src/modules/crm/types/index.ts`
- Agent 1A must add `pipelineCode?: string` to Task type and add mock pipeline codes to the 10 agent-source tasks in `src/mocks/tasks.ts`

---

## Phase 2: Pipeline → Task Auto-Generation (Swarm: 3 agents)

**Goal:** Pipeline events auto-create tasks. This is the behavioral automation layer.

| Agent | Task | Files to Create/Modify |
|-------|------|------------------------|
| **2A** | Build pipeline event engine — a hook `usePipelineEventWatcher` that checks account state against threshold rules and returns triggered events. Rules: health < 40, phase stale > 30 days, status changed to Inactive, license expiring < 30 days, payment overdue > 3 days | Create `src/modules/pipeline/hooks/usePipelineEvents.ts`, create `src/modules/pipeline/types/events.ts` |
| **2B** | Build auto-task generator — takes pipeline events from 2A and generates Task objects with correct `pipelineCode`, `linkedAccountId`, priority, and description. Add to mock data as "agent" source tasks | Create `src/modules/tasks/hooks/useAutoTasks.ts`, modify `src/mocks/tasks.ts` to include 15-20 auto-generated pipeline tasks |
| **2C** | Wire pipeline tasks into TaskBoard — add "Pipeline" filter chip, pipeline badge on task cards, "Pipeline Tasks" quick-filter view. Update TaskBoard to show pipeline context | Modify `src/modules/tasks/components/TaskBoard.tsx`, `src/modules/tasks/types/index.ts` |

**Dependencies:** 2A must complete before 2B. 2C can start immediately (uses types from 1A).

**Key rule:** Every auto-generated task must link back to the account AND include the pipeline code so the rep can filter tasks by "all my Recovery accounts" or "accounts ready to advance."

---

## Phase 3: Salesperson Intelligence (Swarm: 4 agents)

**Goal:** Build the intelligence layer that keeps reps proactive.

| Agent | Task | Files to Create |
|-------|------|-----------------|
| **3A — Sentiment Score** | Aggregate per-interaction sentiment into account-level score (0-100). Add `sentimentScore` + `sentimentTrend` to Account type. Build `SentimentChart` component (sparkline over time). Surface on CRM Account Detail Health tab and as badge on Accounts list | Create `src/modules/crm/components/account-detail/SentimentChart.tsx`, modify `src/modules/crm/types/index.ts`, modify `src/mocks/crm.ts` |
| **3B — Nurture Tracker** | Track touchpoint frequency per account. Calculate days since last interaction by channel. Surface "going cold" accounts (no contact > 14 days) as alerts in AI Briefing. Build `NurtureStatus` component showing last-contact-by-channel grid | Create `src/modules/crm/components/outreach/NurtureTracker.tsx`, create `src/modules/crm/hooks/useNurtureStatus.ts`, modify `src/mocks/crm.ts` |
| **3C — Order Frequency Intelligence** | Detect declining order frequency per account. Calculate avg days between orders, trend direction, predicted next order date. Surface declining accounts in Reorder Center with "frequency declining" badge. Add to AI Briefing items | Create `src/modules/crm/hooks/useOrderFrequency.ts`, modify `src/modules/crm/components/sales/ReorderCenter.tsx`, modify `src/mocks/crm.ts` |
| **3D — Proactive Alert Rules** | Build configurable alert rules engine. Threshold triggers: health < X, sentiment declining, reorder overdue, compliance expiring. Each trigger creates a BriefingItem. Wire into AIBriefingCard and Dashboard AlertsRow | Create `src/modules/crm/hooks/useAlertRules.ts`, modify `src/modules/crm/components/dashboard/AIBriefingCard.tsx`, modify `src/modules/dashboard/components/AlertsRow.tsx` |

**All agents are independent — run in parallel.**

**Design pattern:** Each intelligence feature is a TanStack Query hook returning computed data from mock sources. Components consume hooks. No business logic in components.

---

## Phase 4: Cultivera Parity (Swarm: 5 agents)

**Goal:** Fill the gaps so Cultivera users see complete, familiar workflows.

| Agent | Task | Effort |
|-------|------|--------|
| **4A — VMI/Sales Inventory Page** | Build full `/vmi` page: Product-Line / Sub Product-Line / Product-Tag filter dropdowns, cannabinoid range sliders (THC/THCA/CBD), DataTable with inline price editing, "Save Price Changes" bulk action, "Share Menu" export. Use `SalesInventoryItem` type from `src/modules/sales/types/index.ts` | L |
| **4B — Analytics Core Reports (4)** | Implement 4 analytics tabs: Monthly Sales (12mo bar chart), Sales By Person (rep breakdown table), Client By Product (matrix), Product By Client (matrix). Each tab replaces its EmptyState in `src/modules/analytics/` | L |
| **4C — Analytics Secondary Reports (4)** | Implement: Last Ordered By Account (days-since table), Monthly Sales Comparison (side-by-side), Product-Line Sales by Account (grouped table), Expected Days of Inventory (forecast) | L |
| **4D — Sales Person Report Filters** | Add full filter suite: date range picker with quick-links (Today, Yesterday, Last 7/10/15 Days, WTD, MTD, YTD), rep multi-select, territory filter, status filter, comparison mode toggle, export CSV/PDF | M |
| **4E — Order Summary Filters + Export** | Add full filter suite: 3 date-range pairs (submitted/delivery/released), status multi-select, client search, rep filter, items-per-page, show-cancelled toggle, subtotal row, CSV/PDF export | M |

**Reference screenshots:** `research/wa.cultiverapro.com/2026-03-11T22-33-21/` — each agent should read the corresponding folder for their page.

---

## Phase 5: V2 AI Enhancements (Swarm: 3 agents)

**Goal:** Inject Frost intelligence into Cultivera-familiar views.

| Agent | Task |
|-------|------|
| **5A** | Add AI Briefing Card widget to Sales Dashboard (compact version of CRM's AIBriefingCard). Add Health Score badge to Cultivera-parity Accounts table rows. Add Payment Compliance traffic light to Orders |
| **5B** | Pipeline-aware Reorder Proposals — modify ReorderCenter to generate different recommendations based on pipeline phase (A1 gets "first reorder nudge", A3 gets "VMI enrollment", I2 gets "win-back bundle") |
| **5C** | Pre-populated cart from AI recommendation — add "Create Cart" action on ReorderCenter proposals that opens Carts with line items pre-filled from the AI recommendation |

---

## Execution Rules

1. **Read the audit first** — [cultivera-frost-overlap-audit.md](cultivera-frost-overlap-audit.md) has exact file paths, component names, type definitions, and current state for every module
2. **Reuse shared components** — `SectionHeader`, `MetricCard`, `StatusBadge`, `PipelineBadge`, `DataTable`, `AccentCard`, `LoadingSkeleton`, `EmptyState` from `src/components/`
3. **Design tokens** — all colors from `src/design/tokens.css`, never hardcode hex
4. **Accent color** — Sales modules use `#F59E0B`, Pipeline uses `#F59E0B`, Cultivera uses `#22D3EE`
5. **Data hooks** — TanStack Query with simulated delays, components never fetch directly
6. **Mock data** — realistic cannabis dispensary personas, consistent with existing mocks
7. **No `any`** in public component props
8. **No business logic** in page.tsx files
9. **Build + lint must pass** after each phase — `npm run build && npm run lint`
10. **Each phase gets an atomic commit** — conventional commit format

## Phase Dependencies

```
Phase 1 (all parallel)
  ↓
Phase 2 (2A → 2B, 2C parallel)
  ↓
Phase 3 (all parallel)
  ↓
Phase 4 (all parallel)
  ↓
Phase 5 (all parallel)
```

Phases 3 and 4 can run in parallel with each other if context allows. Phase 5 depends on Phases 1-3.
