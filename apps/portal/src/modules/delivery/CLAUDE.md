# Delivery Module

Accent color: #0EA5E9

Manages delivery routes, drivers, and proof of delivery. Routes use real Washington State geography (Seattle North/South, Eastside, Olympia, Spokane, Bellingham). Each route has stops with arrival tracking, payment collection, and status management.

## Key Components
- DeliveryPage — Main page with metrics, active routes, driver cards
- ActiveRoutes — Route cards with driver, progress, animated dot for in-transit
- DriverCards — 3 driver cards with status, stats, vehicle
- RouteDrawer — Vertical timeline of stops with actions per stop

## Data Shape
- DeliveryRun, DeliveryStop, DeliveryDriver, DeliveryMetrics (src/modules/delivery/types/)
- Mock data in src/mocks/delivery.ts (6 runs, 3 drivers)
- TanStack Query hooks in src/modules/delivery/hooks/ (4 hooks)
