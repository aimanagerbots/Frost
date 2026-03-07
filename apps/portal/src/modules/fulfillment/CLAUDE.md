# Fulfillment Module

Accent color: #14B8A6

Manages warehouse pick/pack/ship operations. Orders flow through a status pipeline: Queued → Picking → Picked → Packing → Packed → Manifested → Ready for Driver. Each order has a pick list with shelf locations and checkable items.

## Key Components
- FulfillmentPage — Main page with metrics, status pipeline, orders DataTable, drawer
- FulfillmentDrawer — Pick list with checkboxes, progress bar, manifest section, action buttons

## Data Shape
- FulfillmentOrder, PickItem, FulfillmentMetrics (src/modules/fulfillment/types/)
- Mock data in src/mocks/fulfillment.ts (18 orders, 4 assignees)
- TanStack Query hooks in src/modules/fulfillment/hooks/ (3 hooks)
