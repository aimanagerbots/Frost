# CRM Module

Accent color: #F59E0B

The CRM is the platform's gravity well — every customer-facing module writes back here. It manages dispensary accounts, sales pipeline, outreach, and intelligence across 6 category tabs with 18 sub-modules. Build 1 covers Dashboard only; Builds 2-6 add remaining sub-modules.

## Key Components
- CRMLayout — Top-level wrapper with SectionHeader + tab nav + content
- CRMNavigation — 6-tab horizontal bar with dropdown sub-modules, URL sync
- CRMDashboard — AI briefing, KPI metrics, 4 charts, activity feed

## Data Shape
- Account, Contact, Interaction, Opportunity, SalesRep (src/modules/crm/types/)
- CRMDashboardMetrics, BriefingItem, chart data types
- Mock data in src/mocks/crm.ts (21 accounts, 4 reps, 10 interactions, 5 opps)
- TanStack Query hooks in src/modules/crm/hooks/
