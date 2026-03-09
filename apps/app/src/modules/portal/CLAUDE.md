# Portal (B2B Dispensary Portal)

Accent color: #F59E0B (amber)

Customer-facing B2B portal where licensed dispensary accounts browse wholesale inventory, place orders, track deliveries, manage consumer pickup orders, message their sales rep, and interact with an AI ordering assistant. Light theme, amber accent, 11 modules.

## Key Components
- PortalShell — sidebar + header layout (light theme)
- PortalPageHeader — page title with breadcrumb
- PortalCartDrawer — slide-over cart
- NotificationDropdown — bell icon dropdown

## Data Shape
- PortalAccount, PortalContact, PortalSalesRep
- PortalProduct, PortalPromotion, PortalVolumeBreak
- PortalOrder, PortalOrderItem, PortalCartItem, PortalOrderTemplate
- StoreOrder, StoreOrderItem, StoreOrderStats, PortalIntegration
- PortalDelivery, PortalInvoice, PortalPaymentMethod
- PortalNotification, PortalMessage, PortalMessageThread
- PortalCOA, PortalProductionItem, PortalSupportTicket, PortalFAQItem
- PortalAIMessage, PortalAIConversation
