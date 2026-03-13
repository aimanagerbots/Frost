# Packaging Module

Accent color: #84CC16

Takes packagable cannabis products and combines them with non-cannabis materials (jars, tubes, boxes, labels, shrink wrap) to create retail-ready goods. 5-tab architecture: Dashboard, Work Orders, Packaging Lines, Order Tracker, Equipment.

## Key Components
- PackagingLayout — Tab container with SectionHeader + Nav + dynamic content routing
- PackagingNav — 5 tabs with URL sync (dashboard, work-orders, packaging-lines, order-tracker, equipment)
- PackagingDashboard — Metrics row, material alerts, throughput chart, packaging lines summary, active orders + alerts panels
- PackagingWorkOrderBoard — Kanban (Queued/In Progress/Complete/Blocked) using KanbanBase
- PackagingLines — 6 category-based line cards (Flower, Preroll, Vaporizer, Concentrate, Edible, Beverage)
- OrderTracker — Searchable/filterable order list with 6-step packaging pipeline progress visualization
- PackagingEquipmentList — Equipment grouped by line with maintenance schedule
- MaterialAlerts — Alert cards for low/critical/out-of-stock non-cannabis materials (reused in Dashboard)
- PackagingDrawer — Order detail drawer with BOM breakdown (reused in Work Orders)
- MaterialsInventory — DataTable for non-cannabis inventory (accessible via Dashboard)

## Data Shape
- PackagingView, PackagingOrder, NonCannabisInventory, PackagingMetrics, PackagingLine, PackagingEquipment, PackagingAlert, PackagingThroughputDataPoint (types/)
- Mock data in src/mocks/packaging.ts (20 orders, 30 inventory items, 6 lines, 18 equipment, 6 alerts, 7-day throughput)
- 8 TanStack Query hooks in hooks/ (orders, order, metrics, inventory, lines, equipment, alerts, throughput)
