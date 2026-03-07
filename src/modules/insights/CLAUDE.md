# Insights

Accent color: #06B6D4

AI-generated intelligence engine surfacing trends, anomalies, predictions, correlations, and recommendations across all platform modules. Features a natural language query bar for conversational data exploration and filterable insights feed with severity-based prioritization.

## Key Components
- InsightsPage — Main layout with query bar, metric cards, filter row, insights feed, and module chart
- InsightCard — Individual insight with type icon, severity border, confidence bar, and action button
- ConfidenceBar — Visual confidence indicator (green 80+, amber 60-79, red <60)

## Data Shape
- Insight — id, type, title, description, severity, module, confidence, createdAt, actionable, action
- InsightQueryResult — query, results, timestamp
