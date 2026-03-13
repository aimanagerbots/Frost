# Grow Module Rebuild — Brief for Claude Code

## Goal
Build out the 9 Cultivera stub tabs in the Grow (Cultivation) module. These are currently `EmptyState` placeholders in `CultivationLayout.tsx`. Do NOT touch the 5 Frost extras (Environment, Tasks, Calendar, Supplies, AI Chat) — they already have real components.

## Architecture — Key Differences from Sales

The Grow module uses **tab-based routing**, not route-based pages. Everything lives under a single `/cultivation` route with `?tab=` query params. This means:

- **No new page.tsx files** — all tabs render inside `CultivationLayout.tsx`
- Each tab is a component registered in the `ROUTES` map (currently only Frost extras are there)
- The sidebar already has all tabs defined in `nav-data.ts` under the `grow` category
- Store: `useCultivationStore` manages `activeView`, `selectedRoomId`, `selectedEnvironmentRoomId`

## Tabs to Build (9 Cultivera Stubs)

| Tab | `?tab=` value | What it shows (Cultivera reference) |
|-----|---------------|-------------------------------------|
| **Overview** | `overview` | High-level grow board — room cards showing stage, plant count, environment status, days in stage. Grid of room "cards" like a Kanban-lite view. See `grow-board-overview.png`. |
| **Dashboard** | `dashboard` | Metrics row (active rooms, total plants, plants in flower/veg, next harvest, alerts), charts (yield trends, stage distribution pie, environment compliance), recent harvest table. |
| **Grow Cycles** | `grow-cycles` | Table of grow cycles — strain, room, start date, current stage, days in stage, expected harvest, status. Actions: start new cycle, view detail. See `grow-cycles-overview.png`, `grow-cycle-detail.png`. |
| **Plants** | `plants` | Searchable/filterable table of all plants — strain, room, stage, plant ID, health status, days since transplant. Bulk actions. |
| **Grow Sources** | `grow-sources` | **NOTE**: This tab already exists as the `GeneticsLibrary` component in the Frost extras. In Cultivera it's "Grow Sources" (mother plants, clone sources). The existing `GeneticsLibrary` should serve as-is — **skip this tab**, it's already wired up in ROUTES. |
| **Rooms** | `rooms` | Room management — list of rooms with capacity, current strain, stage, plant count, environment summary. Click to see room detail with environment readings. |
| **Harvest** | `harvest` | Harvest records table — strain, room, harvest date, wet/dry weight, dry ratio, yield/plant, status. Uses existing `HarvestRecord` type. |
| **QA Lot** | `qa-lot` | QA lot tracking — lot ID, strain, harvest date, batch size, testing status, lab results pending/complete. |
| **QA Sample** | `qa-sample` | QA sample management — sample ID, lot reference, lab name, test type (potency, terpenes, pesticides, microbials), status, results. |
| **Disposal** | `disposal` | Disposal records — item, reason, weight, date, method, witness, compliance status. For tracking METRC-required disposal events. |

**Effective build count: 8 tabs** (Grow Sources already exists).

## Reference Screenshots
Located at `research/wa.cultiverapro.com/2026-03-12-v3/grow/`:
- `grow-board-overview.png` — Overview tab reference
- `grow-cycles-overview.png` — Grow Cycles list
- `grow-cycle-detail.png` — Grow Cycle detail panel
- `grow-cycles-start-new-sources.png` — New cycle + sources modal

Read these screenshots before designing each tab to match Cultivera's data model.

## Existing Code to Reuse

### Types (`src/modules/cultivation/types/index.ts`)
Already defined — use these, don't recreate:
- `GrowRoom`, `RoomStatus`, `GrowStage`, `RoomEnvironment` — for Overview/Rooms tabs
- `HarvestRecord` — for Harvest tab
- `CultivationMetrics` — for Dashboard tab
- `CultivationTask`, `TaskStatus` — referenced in dashboard
- `Strain`, `StrainType`, `MotherPlantStatus` — for Grow Cycles/Plants

### Types to ADD (in the same `types/index.ts`):
```typescript
// ─── Grow Cycles ──────────────────────────────────────────────
export type GrowCycleStatus = 'active' | 'completed' | 'planned' | 'cancelled';

export interface GrowCycle {
  id: string;
  roomId: string;
  roomName: string;
  strainId: string;
  strainName: string;
  startDate: string;
  currentStage: GrowStage;
  dayInStage: number;
  totalDays: number;
  expectedHarvestDate: string;
  plantCount: number;
  status: GrowCycleStatus;
  notes?: string;
}

// ─── Plants ───────────────────────────────────────────────────
export type PlantHealth = 'healthy' | 'stressed' | 'sick' | 'dead';

export interface Plant {
  id: string;
  plantTag: string; // METRC tag
  strainId: string;
  strainName: string;
  roomId: string;
  roomName: string;
  stage: GrowStage;
  health: PlantHealth;
  daysSinceTransplant: number;
  sourceType: 'clone' | 'seed' | 'mother';
  motherId?: string;
  batchId?: string;
  notes?: string;
}

// ─── QA Lot ───────────────────────────────────────────────────
export type QALotStatus = 'pending' | 'in-testing' | 'passed' | 'failed' | 'released';

export interface QALot {
  id: string;
  lotNumber: string;
  strainName: string;
  harvestDate: string;
  batchSize: number;
  unit: string;
  status: QALotStatus;
  labName?: string;
  submittedDate?: string;
  resultsDate?: string;
}

// ─── QA Sample ────────────────────────────────────────────────
export type QASampleStatus = 'collected' | 'submitted' | 'in-testing' | 'results-ready' | 'reviewed';
export type QATestType = 'potency' | 'terpenes' | 'pesticides' | 'microbials' | 'heavy-metals' | 'residual-solvents' | 'moisture';

export interface QASample {
  id: string;
  sampleId: string;
  lotId: string;
  lotNumber: string;
  labName: string;
  testTypes: QATestType[];
  status: QASampleStatus;
  collectedDate: string;
  submittedDate?: string;
  resultsDate?: string;
  thc?: number;
  cbd?: number;
  totalTerpenes?: number;
  passedAll?: boolean;
}

// ─── Disposal ─────────────────────────────────────────────────
export type DisposalMethod = 'compost' | 'incineration' | 'rendering' | 'other';
export type DisposalReason = 'failed-qa' | 'pest-contamination' | 'mold' | 'expired' | 'damaged' | 'regulatory' | 'other';

export interface DisposalRecord {
  id: string;
  itemDescription: string;
  reason: DisposalReason;
  method: DisposalMethod;
  weightGrams: number;
  disposalDate: string;
  witness: string;
  metrcTag?: string;
  complianceStatus: 'compliant' | 'pending-review' | 'flagged';
  notes?: string;
}
```

### Existing Hooks (in `src/modules/cultivation/hooks/`)
Already built — reuse where applicable:
- `useCultivationMetrics` — Dashboard tab
- `useGrowRooms` / `useGrowRoom` — Overview, Rooms tabs
- `useHarvestRecords` — Harvest tab
- `useStrain` — Grow Cycles, Plants

### Hooks to ADD:
- `useGrowCycles` — returns `GrowCycle[]`
- `usePlants` — returns `Plant[]` with filter params
- `useQALots` — returns `QALot[]`
- `useQASamples` — returns `QASample[]`
- `useDisposalRecords` — returns `DisposalRecord[]`

### Mock Data
Create `src/mocks/cultivation.ts` (or extend existing cultivation mocks if they exist) with factory functions for the new types. Use realistic WA state cannabis data — strain names from the existing `Strain` type, room names from `GrowRoom`.

### Shared Components (from `@/components`)
- `SectionHeader` — NOT needed per-tab (already rendered by CultivationLayout)
- `MetricCard` — Dashboard metrics row
- `DataTable` — All table views (Grow Cycles, Plants, Harvest, QA Lot, QA Sample, Disposal)
- `StatusBadge` — Status columns (add new domain statuses if needed)
- `AccentCard` — Room cards in Overview, detail panels
- `EmptyState` — Fallback for empty data
- `LoadingSkeleton` — Loading states
- `ChartWrapper` — Dashboard charts

### Accent Color
`#22C55E` (green) — already defined as the Cultivation accent. Import from `@/design/colors` as `ACCENT`.

## Execution Plan

### Phase 0: Foundation
1. Add new types to `src/modules/cultivation/types/index.ts`
2. Create mock data factory functions in `src/mocks/cultivation.ts`
3. Create new hooks in `src/modules/cultivation/hooks/`
4. Add any new domain statuses to `StatusBadge` if needed (e.g., `in-testing`, `collected`, `released`)
5. Export new hooks from `src/modules/cultivation/hooks/index.ts`

### Phase 1: Parallel Tab Builds (8 agents)
Each agent builds one tab as a component in `src/modules/cultivation/components/`:

| Agent | Tab | Component File | Key Features |
|-------|-----|----------------|--------------|
| 1 | Overview | `overview/GrowOverview.tsx` | Room card grid, stage badges, environment mini-gauges, plant counts |
| 2 | Dashboard | `dashboard/GrowDashboard.tsx` | Metrics row, yield chart, stage distribution pie, environment compliance, recent harvests |
| 3 | Grow Cycles | `grow-cycles/GrowCyclesTab.tsx` | DataTable, status filters, cycle detail drawer, "Start New Cycle" modal |
| 4 | Plants | `plants/PlantsTab.tsx` | DataTable with search/filter, health badges, bulk actions bar |
| 5 | Rooms | `rooms/RoomsTab.tsx` | Room list/grid, capacity bars, environment summary, click-to-detail |
| 6 | Harvest | `harvest/HarvestTab.tsx` | DataTable of HarvestRecord, status filters, yield calculations |
| 7 | QA Lot | `qa-lot/QALotTab.tsx` | DataTable, status pipeline, lab submission tracking |
| 8 | QA Sample | `qa-sample/QASampleTab.tsx` | DataTable, test type chips, results display, pass/fail badges |
| — | Disposal | `disposal/DisposalTab.tsx` | DataTable, compliance status, METRC tag column, reason/method filters |

**Note:** That's 9 components but Grow Sources is skipped (already exists). Agent 8 builds both QA Sample and Disposal (they're small tables).

### Phase 2: Integration
1. Update `CultivationLayout.tsx` — move stubs from `STUB_VIEWS` to `ROUTES` map, importing each new component
2. Remove the `STUB_VIEWS` object entirely (all tabs now have real components)
3. Run `npm run build` — must pass with 0 errors
4. Run `npm run lint` — must pass with 0 errors
5. Verify on localhost that all tabs render and navigation works

## Constraints
- Do NOT touch Frost extras: Environment, Tasks, Calendar, Supplies, AI Chat (grow-sources is also already built)
- Do NOT create new page.tsx files — everything renders inside CultivationLayout
- Do NOT modify `nav-data.ts` — sidebar tabs are already correct
- Use `#22C55E` accent everywhere, never hardcode other colors
- Import shared components from `@/components` — never recreate
- All hooks use TanStack Query with simulated delays
- No `any` in public props
- Mock data must feel real — WA state cannabis strains, realistic weights/counts
