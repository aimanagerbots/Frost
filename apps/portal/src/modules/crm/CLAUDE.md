# CRM Module

Accent color: #F59E0B

The CRM is the platform's gravity well — every customer-facing module writes back here. It manages dispensary accounts, sales pipeline, outreach, and intelligence across 6 category tabs with 18 sub-modules. Builds 1-2 cover Dashboard + Accounts; Builds 3-6 add remaining sub-modules.

## Key Components
- CRMLayout — Top-level wrapper with SectionHeader + tab nav + content router
- CRMNavigation — 6-tab horizontal bar with dropdown sub-modules, URL sync
- CRMDashboard — AI briefing, KPI metrics, 4 charts, activity feed
- AccountsList — Filterable, searchable accounts table with client-side filtering
- AccountsFilterBar — Region, rep, health tier, VMI, payment, category filters
- AccountDetail — 10-tab detail view (Profile, Purchases, Health, VMI, Interactions, Opportunities, Payments, Deliveries, Files, Notes)
- AccountDetailHeader — Account info, badges, quick actions
- AccountDetailTabs — Horizontal scrollable tab pills

## Data Shape
- Account, Contact, Interaction, Opportunity, SalesRep (src/modules/crm/types/)
- AccountOrder, AccountHealthData, AccountVMIData, AccountPaymentSummary, AccountDeliverySummary, AccountFile, AccountNote
- CRMDashboardMetrics, BriefingItem, chart data types
- Mock data in src/mocks/crm.ts (28 accounts, 4 reps, 82 interactions, 15 opps, 40 activity items)
- Detail mock data in src/mocks/crm-details.ts (deterministic generators keyed by account ID)
- TanStack Query hooks in src/modules/crm/hooks/ (13 hooks total)
