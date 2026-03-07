# Manufacturing Module

Accent color: #10B981

Manages cannabis processing through multiple pipelines (flower, preroll, vaporizer, concentrate). Tracks work orders, batches, production lines, and readiness state transitions. The vaporizer pipeline has three branching paths: distillate, live resin, and solventless.

## Key Components
- ManufacturingPage — Main page with metrics, production lines, pipeline visualization, work queue
- ProductionLines — Row of 5 production line cards with capacity bars
- ManufacturingPipeline — Tabbed pipeline visualization with state flow and branching vape paths
- WorkOrderDrawer — Detailed work order view with materials BOM, readiness transition, actions

## Data Shape
- WorkOrder, WorkOrderMaterial, ManufacturingBatch, ManufacturingMetrics, PipelineState, ProductionLine (src/modules/manufacturing/types/)
- Mock data in src/mocks/manufacturing.ts (30 work orders, 25 batches, 22 pipeline states, 5 production lines)
- TanStack Query hooks in src/modules/manufacturing/hooks/ (6 hooks)
