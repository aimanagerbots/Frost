# Cultivera Module

Accent color: #22D3EE

Bridges Frost's disconnection from Cultivera's inventory API. Manages Frost's Cultivera marketplace presence: daily menu CSV sync, automated order intake (bot UI), sponsored brand + banner ad management, and WA market intelligence.

## Key Components
- CultiveraLayout — 5-tab container (dashboard, menu-sync, order-intake, marketing, marketplace)
- CultiveraNav — URL-synced tabs (?view=), mirrors PackagingNav pattern
- CultiveraDashboard — KPI row (WA stores, last sync, orders today, rank), sync health card, "View on Cultivera" link-out, recent activity feed
- MenuSync — Sync status hero card with pulsing Sync Now button, history table; SyncLogModal for run detail
- OrderIntake — Bot status card (idle/running/error), orders table with search/filter; CultiveraOrderDrawer for order detail, PDF link, push-to-orders action
- CultiveraMarketing — Active campaign banner, campaigns table; AdCampaignModal for budget/stats/dates/notes
- CultiveraMarketplace — WA market stats, integration status panel, context narrative, retailer notes

## Data Shape
- CultiveraView, SyncRun, SyncStatus, SyncLogEntry, BotStatus, OrderImport, OrderLineItem, AdCampaign, MarketplaceStats (types/)
- Mock data in src/mocks/cultivera.ts (10 sync runs, sync log entries, bot status, 15 orders, 3 ad campaigns, market stats)
- 4 TanStack Query hooks in hooks/ (dashboard, sync-status, orders, marketing)
