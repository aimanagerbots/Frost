# Dashboard

Accent color: #5BB8E6

The Platform Dashboard is the personalized command center every user sees when they log in. It aggregates operational data from across all modules — alerts, KPIs, charts, and quick actions — into a single at-a-glance view.

## Key Components
- DashboardPage — Main layout: welcome header, alerts, KPIs, charts, quick actions
- AlertsRow — Horizontal scrollable alert cards with severity styling and dismiss
- DashboardCharts — 2x2 grid of Recharts (revenue trend, orders by status, division workload, top products)
- QuickActions — 4 action cards linking to key modules

## Data Shape
- DashboardAlert — severity-based alerts from across the platform
- DashboardMetric — KPI cards with trend and sparkline data
- DashboardChartsData — revenue trend, orders by status, division workload, top products
