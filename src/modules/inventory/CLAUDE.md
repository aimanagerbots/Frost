# Inventory

Accent color: #8B5CF6

The Inventory module tracks 100+ items across 6 product categories and their readiness states through the full production pipeline. Key differentiator is the pipeline visualization showing item flow from Cultivation through Delivery, grouped by division.

## Key Components
- InventoryPage — Main layout with metrics, pipeline visualization, category cards, filters, DataTable
- PipelineVisualization — Horizontal pipeline grouped by division with clickable readiness state nodes
- CategoryCards — 6 product category cards with counts, values, and percentages
- InventoryDrawer — Full item detail with strain info, lab results (THC/CBD%), location, batch data

## Data Shape
- InventoryItem — productName, category, strainName/Type, readinessState, division, quantity, thcPercent, cbdPercent, batchNumber, location, value
- InventoryMetrics — totalItems, totalValue, lowStockAlerts, categoryCounts, stateDistribution
- InventoryByCategory — category, count, value, percentage
- PipelineGroup — division, states (readinessState + count), totalItems
