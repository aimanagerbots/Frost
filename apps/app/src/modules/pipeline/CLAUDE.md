# Pipeline Module

Accent color: #F59E0B

Visualizes the A/I/R (Active/Inactive/Recovery) pipeline — a 15-cell matrix showing account distribution across 3 statuses and 5 phases. Each account carries a PipelineInfo object with code (A3, I1, R2), phase name, dates, and rep assignment. Colors: Active=green, Inactive=blue, Recovery=red.

## Key Components
- PipelinePage — Main layout: velocity metrics, matrix, account panel, movement chart, rep cards, transition log
- PipelineMatrix — 3x5 clickable grid visualization
- PipelineMatrixCell — Individual cell with code badge, count, revenue, account cards
- PipelineVelocityMetrics — 5 velocity KPI cards (I1→I5, I5→A2, A2→A5, Recovery Rate, Churn Rate)
- PipelineMovementChart — Recharts grouped bar chart (advances vs declines by week)
- RepPerformanceCards — Per-rep pipeline stats with advances/declines
- AccountListPanel — Filtered account list when clicking a cell
- PipelineBadge — Reusable A3/I1/R2 colored badge (exported for cross-module use)
- PipelineAccountCard — Mini account card for grid cells
- PipelineTransitionLog — Recent status transitions with color-coded badges

## Data Shape
- PipelineCellData, PipelineMetrics, PipelineMovement, PipelineVelocityMetric, RepPipelineStats, MovementChartData (src/modules/pipeline/types/)
- PipelineInfo on every Account (src/modules/crm/types/)
- Mock data: src/mocks/pipeline.ts (movements, velocity, chart data)
- Consumes Account data from src/mocks/crm.ts
