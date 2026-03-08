# Packaging Module

Accent color: #84CC16

Takes packagable cannabis products and combines them with non-cannabis materials (jars, tubes, boxes, labels, shrink wrap) to create retail-ready goods. Tracks packaging orders, material shortages, and non-cannabis inventory levels.

## Key Components
- PackagingPage — Main page with metrics, material alerts, orders table, inventory table
- MaterialAlerts — Alert cards for low/critical/out-of-stock non-cannabis materials
- PackagingDrawer — Order detail with cannabis and non-cannabis BOM breakdown, shortage highlighting
- MaterialsInventory — DataTable for non-cannabis inventory with status-sorted view

## Data Shape
- PackagingOrder, NonCannabisInventory, PackagingMetrics (src/modules/packaging/types/)
- Mock data in src/mocks/packaging.ts (20 orders, 30 inventory items)
- TanStack Query hooks in src/modules/packaging/hooks/ (4 hooks)
