# Accounts

Accent color: #F59E0B

Retail account management module — browse accounts (Active/Inactive/All), drill into detail view with 5-tab layout (Analytics, Orders, Notes, Recommendations, Discounts), and manage account settings through 7 modals (Invite, Assign Salesperson, Add Contact, Update Client Info, Update Notes, Delivery Preferences, Inventory Preferences). Also supports adding non-cannabis accounts and exporting data.

## Key Components
- AccountsPage — top-level orchestrator, manages list/detail view state and modals
- AccountsTable — DataTable with 3 status tab filters, row click navigates to detail
- AccountDetail — sidebar (account info, sales stats, action buttons) + tabbed content
- AccountDetailTabs — 5-tab router (analytics charts, orders table, notes, recommendations, discounts table)
- 7 modals: InviteModal, AssignSalespersonModal, AddContactModal, UpdateClientInfoModal, UpdateNotesModal, UpdateDeliveryPrefsModal, UpdateInventoryPrefsModal
- AddNonCannabisAccountModal, QuickFiltersModal

## Data Shape
- SalesAccount, SalesContact, SalesOrder, AccountDiscount (from sales/types + local types)
- AccountListTab: 'active' | 'inactive' | 'all'
- AccountDetailTab: 'analytics' | 'orders' | 'notes' | 'recommendations' | 'discounts'
