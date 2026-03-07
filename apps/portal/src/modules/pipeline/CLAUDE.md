# Pipeline Module

Accent color: #F59E0B

Visualizes the A/I/R (Active/Inactive/Recovery) pipeline — a 15-cell matrix showing account distribution across 3 statuses and 5 phases. Drives CRM prioritization and AI briefing.

## Key Components
- PipelinePage — Main page with metrics, funnel grid, and transition log
- PipelineFunnel — 3x5 grid visualization
- PipelineMetricsRow — Key pipeline health metrics
- PipelineAccountCard — Mini account card for grid cells
- PipelineTransitionLog — Recent status transitions

## Data Shape
- PipelineCellData, PipelineMetrics (src/modules/pipeline/types/)
- Consumes Account data from src/mocks/crm.ts
- Pipeline types (PipelineStatus, PipelinePhase, PipelineTransition) defined in CRM types
