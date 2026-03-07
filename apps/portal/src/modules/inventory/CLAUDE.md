# Inventory

Accent color: #8B5CF6

5-tab inventory module tracking cannabis and non-cannabis materials across the full seed-to-sale pipeline. COA Manager integrated as Tab 4. Pipeline visualization shows linear readiness states (Growing through Delivered).

## Tabs
1. Overview — 6 MetricCards, pipeline hero (11 readiness states), category distribution, activity feed
2. Cannabis Inventory — DataTable with 8 filters (category, state, strain, brand, THC, COA status, stock level), drawer detail
3. Non-Cannabis Materials — 35 packaging/supply items with reorder tracking
4. COA Manager — Dashboard metrics, submissions table, lab partner cards, detail drawer
5. Alerts — 14 alerts (critical/warning/info) with severity grouping and action buttons

## Key Components
- InventoryLayout — Main layout with SectionHeader + tab navigation
- overview/ — InventoryOverview, PipelineVisualization, CategoryDistribution, ActivityFeed
- cannabis/ — CannabisInventory, InventoryFilterBar
- materials/ — NonCannabisInventory
- coa/ — COAManager, LabPartnerCards
- alerts/ — InventoryAlerts, AlertCard

## Data Shape
- CannabisInventoryItem — sku, productName, category, strain, strainType, thc, cbd, readinessState, quantity, unit, packageSize, batchNumber, coaStatus, location, brand, value
- NonCannabisItem — name, category, sku, currentStock, unit, reorderPoint, reorderQuantity, supplier, status, unitCost
- COASubmission — batchNumber, productName, strain, labName, dateSubmitted, status, results (thc/cbd/terpenes/moisture/contaminants)
- LabPartner, InventoryAlert, ActivityFeedEvent, PipelineStateNode, InventoryOverviewMetrics, CategoryDistribution
- Mock data in src/mocks/inventory.ts (75 cannabis, 35 non-cannabis, 28 COA, 3 labs, 14 alerts, 18 events)
