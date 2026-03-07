# Manufacturing Module

Accent color: #10B981

Production pipeline command center. Manages cannabis processing through 6 production lines (Flower, Preroll, Extraction, Vape Fill, Concentrate, Solventless). Tracks work orders, batches, equipment, and throughput. 5-tab architecture: Dashboard, Work Orders, Production Lines, Batch Tracker, Equipment.

## Key Components
- ManufacturingLayout — Tab container with SectionHeader + Nav + dynamic content
- ManufacturingNav — 5 tabs with URL sync
- ManufacturingDashboard — Metrics, donut chart, throughput chart, active orders, alerts
- WorkOrderBoard — Kanban (Pending/In Progress/Complete) using KanbanBase
- ProductionLines — 6 production line cards with status, throughput, workers
- BatchTracker — Searchable batch list with pipeline progress visualization
- EquipmentList — Equipment grouped by line with maintenance schedule

## Data Shape
- WorkOrder, ManufacturingBatch, ProductionLine, Equipment, ManufacturingAlert, ThroughputDataPoint, ProductionDistribution (types/)
- Mock data in src/mocks/manufacturing.ts (20 work orders, 18 batches, 6 production lines, 24 equipment items)
- 11 TanStack Query hooks in hooks/
