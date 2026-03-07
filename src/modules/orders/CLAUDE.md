# Orders

Accent color: #F59E0B

The Orders module manages sales orders through an 8-stage pipeline: Pending, Confirmed, In Production, Packaged, Fulfilled, Shipped, Delivered, Paid. Tied to real CRM accounts with realistic WA wholesale cannabis pricing.

## Key Components
- OrdersPage — Main layout with metrics, pipeline visualization, filters, DataTable, and drawer
- OrderPipeline — Horizontal flow visualization with 8 status stages as clickable nodes
- OrderDrawer — Full order detail with line items table, payment info, and status timeline

## Data Shape
- Order — orderNumber, accountId/Name, status (8 stages), items (OrderItem[]), total, paymentMethod/Status, timestamps
- OrderItem — productName, category, quantity, unitPrice, lineTotal, batchNumber
- OrderMetrics — totalOrders, pendingCount, avgFulfillmentDays, onTimeRate, avgOrderValue, revenueThisMonth
