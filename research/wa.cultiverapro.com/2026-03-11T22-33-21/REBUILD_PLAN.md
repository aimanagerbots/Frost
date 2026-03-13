# Kultivera Rebuild Plan
> Generated 2026-03-11T22:45:12.039Z from deep scrape of wa.cultiverapro.com
> 26 pages, 219 screenshots, 191 navigation edges

## 1. Architecture Overview

The original Kultivera app is a single-page application (Angular-based, hash routing).
It uses Angular Material components extensively.

### Routes Discovered
- `/dashboard` — Sales Dashboard | Cultivera - CRM
- `/` — Grow Board | Grow
- `/` — Dashboard
- `/` — Sales Dashboard | Cultivera - CRM
- `/` — Manage Menu
- `/` — Quick filters
- `/` — Manage Accounts
- `/all-notifications` — | Cultivera Pro
- `/invitations` — | Cultivera Pro
- `/../crm` — | Cultivera Pro
- `/user-profile` — | Cultivera Pro
- `/company-profile` — | Cultivera Pro
- `/notifications` — Notifications
- `/market-settings` — | Cultivera Pro
- `/setting/sync-setting` — | Cultivera Pro
- `/dasboard` — | Cultivera Pro
- `/accounts` — | Cultivera Pro
- `/account-groups` — | Cultivera Pro
- `/open-carts` — | Cultivera Pro
- `/products` — | Cultivera Pro
- `/product-catalogs` — | Cultivera Pro
- `/orders` — | Cultivera Pro
- `/sales-person-report` — | Cultivera Pro
- `/order-summary` — | Cultivera Pro
- `/cart/2` — | Cultivera Pro
- `/cart/1` — | Cultivera Pro

## 2. Design System

See `DESIGN_SYSTEM.md` for full color palette, typography, and spacing tokens.
Key implementation notes:
- Extract the top 10 colors as CSS variables
- Match font families and weight scale
- Replicate spacing patterns

## 3. Component Library

Build these shared components first (they appear across multiple pages):
### form (used on 26 pages)
- Found on: Home-Dashboard, Grow, Analytics, Sales, Inventory-Management
- Reference screenshots in those page folders

### chart (used on 8 pages)
- Found on: Home-Dashboard, Grow, Analytics, Sales, Inventory-Management
- Reference screenshots in those page folders

### modal/dialog (used on 8 pages)
- Found on: Home-Dashboard, Grow, Analytics, Sales, Inventory-Management
- Reference screenshots in those page folders

### data-table (used on 6 pages)
- Found on: Home-Dashboard, Sales, Inventory-Management, Fulfillment, Configuration
- Reference screenshots in those page folders

### list (used on 6 pages)
- Found on: Home-Dashboard, Grow, Sales, Inventory-Management, Fulfillment
- Reference screenshots in those page folders

### badge/chip (used on 4 pages)
- Found on: Home-Dashboard, Grow, Sales, Inventory-Management
- Reference screenshots in those page folders

### card (used on 2 pages)
- Found on: Grow, Analytics
- Reference screenshots in those page folders

## 4. Page-by-Page Rebuild Tasks

Execute in this order (build shared layouts/navigation first, then pages):

### Phase A: App Shell & Navigation
1. Set up app routing (hash-based) matching the discovered routes
2. Build sidebar navigation with all discovered nav items
3. Build top bar / header
4. Implement authentication flow (login page)

### Phase B: Simple Pages
1. **`/all-notifications`** — | Cultivera Pro
   - Reference: `View-all-notifications/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
2. **`/invitations`** — | Cultivera Pro
   - Reference: `0/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
3. **`/../crm`** — | Cultivera Pro
   - Reference: `2/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
4. **`/user-profile`** — | Cultivera Pro
   - Reference: `Profile/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
5. **`/company-profile`** — | Cultivera Pro
   - Reference: `Company-Profile/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
6. **`/market-settings`** — | Cultivera Pro
   - Reference: `Marketplace-Settings/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
7. **`/setting/sync-setting`** — | Cultivera Pro
   - Reference: `Settings/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
8. **`/dasboard`** — | Cultivera Pro
   - Reference: `Dashboard/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
9. **`/accounts`** — | Cultivera Pro
   - Reference: `Accounts/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
10. **`/account-groups`** — | Cultivera Pro
   - Reference: `Account-Groups/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
11. **`/open-carts`** — | Cultivera Pro
   - Reference: `Carts/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
12. **`/products`** — | Cultivera Pro
   - Reference: `Inventory/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
13. **`/product-catalogs`** — | Cultivera Pro
   - Reference: `Catalogs/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
14. **`/orders`** — | Cultivera Pro
   - Reference: `Orders/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
15. **`/sales-person-report`** — | Cultivera Pro
   - Reference: `Sales-Person-Report/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
16. **`/order-summary`** — | Cultivera Pro
   - Reference: `Order-Summary/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
17. **`/cart/2`** — | Cultivera Pro
   - Reference: `PRC-Conway-PO-949112-339795-/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0
18. **`/cart/1`** — | Cultivera Pro
   - Reference: `PRC-Arlington-PO-949112-339791-/screenshot-desktop.png`
   - Components: form
   - Interactive states: 0

### Phase C: Complex Pages
1. **`/dashboard`** — Sales Dashboard | Cultivera - CRM
   - Reference: `Home-Dashboard/screenshot-desktop.png`
   - Components: data-table, form, chart, modal/dialog, list, badge/chip
   - Interactive states: 30
   - Key interactions:
     - dropdown: "Sales Grow Analytics Sales Inventory Management Fulfillment Configuration" → see `states/000-dropdown-Sales-Grow-Analytics-Sales-Inventory-Management-Fulfillment-Configurati.png`
     - dropdown: "Sales" → see `states/001-dropdown-Sales.png`
     - dropdown: "You have 0 new notifications View all notifications × Close .notifications-list " → see `states/002-dropdown-You-have-0-new-notifications-View-all-notifications-Close-notifications.png`
     - dropdown: "" → see `states/003-dropdown-3.png`
     - dropdown: "0" → see `states/004-dropdown-0.png`
2. **`/`** — Grow Board | Grow
   - Reference: `Grow/screenshot-desktop.png`
   - Components: card, form, chart, modal/dialog, list, badge/chip
   - Interactive states: 19
   - Key interactions:
     - dropdown: "Grow Grow Analytics Sales Inventory Management Fulfillment Configuration" → see `states/000-dropdown-Grow-Grow-Analytics-Sales-Inventory-Management-Fulfillment-Configuratio.png`
     - dropdown: "Grow" → see `states/001-dropdown-Grow.png`
     - dropdown: "You have 0 new notifications View all notifications × Close .notifications-list " → see `states/002-dropdown-You-have-0-new-notifications-View-all-notifications-Close-notifications.png`
     - dropdown: "" → see `states/003-dropdown-3.png`
     - dropdown: "Profile Company Profile Notifications Settings Lock Logout Michael Perkins" → see `states/004-dropdown-Profile-Company-Profile-Notifications-Settings-Lock-Logout-Michael-Perk.png`
3. **`/`** — Dashboard
   - Reference: `Analytics/screenshot-desktop.png`
   - Components: card, form, chart, modal/dialog
   - Interactive states: 17
   - Key interactions:
     - dropdown: "Analytics Grow Analytics Sales Inventory Management Fulfillment Configuration" → see `states/000-dropdown-Analytics-Grow-Analytics-Sales-Inventory-Management-Fulfillment-Configu.png`
     - dropdown: "Analytics" → see `states/001-dropdown-Analytics.png`
     - dropdown: "You have 0 new notifications View all notifications × Close .notifications-list " → see `states/002-dropdown-You-have-0-new-notifications-View-all-notifications-Close-notifications.png`
     - dropdown: "" → see `states/003-dropdown-3.png`
     - dropdown: "Profile Company Profile Notifications Settings Lock Logout Michael Perkins" → see `states/004-dropdown-Profile-Company-Profile-Notifications-Settings-Lock-Logout-Michael-Perk.png`
4. **`/`** — Sales Dashboard | Cultivera - CRM
   - Reference: `Sales/screenshot-desktop.png`
   - Components: data-table, form, chart, modal/dialog, list, badge/chip
   - Interactive states: 30
   - Key interactions:
     - dropdown: "Sales Grow Analytics Sales Inventory Management Fulfillment Configuration" → see `states/000-dropdown-Sales-Grow-Analytics-Sales-Inventory-Management-Fulfillment-Configurati.png`
     - dropdown: "Sales" → see `states/001-dropdown-Sales.png`
     - dropdown: "You have 0 new notifications View all notifications × Close .notifications-list " → see `states/002-dropdown-You-have-0-new-notifications-View-all-notifications-Close-notifications.png`
     - dropdown: "" → see `states/003-dropdown-3.png`
     - dropdown: "0" → see `states/004-dropdown-0.png`
5. **`/`** — Manage Menu
   - Reference: `Inventory-Management/screenshot-desktop.png`
   - Components: data-table, form, chart, modal/dialog, list, badge/chip
   - Interactive states: 30
   - Key interactions:
     - dropdown: "Inventory Management Grow Analytics Sales Inventory Management Fulfillment Confi" → see `states/000-dropdown-Inventory-Management-Grow-Analytics-Sales-Inventory-Management-Fulfillm.png`
     - dropdown: "Inventory Management" → see `states/001-dropdown-Inventory-Management.png`
     - dropdown: "You have 0 new notifications View all notifications × Close .notifications-list " → see `states/002-dropdown-You-have-0-new-notifications-View-all-notifications-Close-notifications.png`
     - dropdown: "" → see `states/003-dropdown-3.png`
     - dropdown: "Profile Company Profile Notifications Settings Lock Logout Michael Perkins" → see `states/004-dropdown-Profile-Company-Profile-Notifications-Settings-Lock-Logout-Michael-Perk.png`
6. **`/`** — Quick filters
   - Reference: `Fulfillment/screenshot-desktop.png`
   - Components: data-table, form, chart, modal/dialog, list
   - Interactive states: 30
   - Key interactions:
     - dropdown: "Fulfillment Grow Analytics Sales Inventory Management Fulfillment Configuration" → see `states/000-dropdown-Fulfillment-Grow-Analytics-Sales-Inventory-Management-Fulfillment-Confi.png`
     - dropdown: "Fulfillment" → see `states/001-dropdown-Fulfillment.png`
     - dropdown: "You have 0 new notifications View all notifications × Close .notifications-list " → see `states/002-dropdown-You-have-0-new-notifications-View-all-notifications-Close-notifications.png`
     - dropdown: "" → see `states/003-dropdown-3.png`
     - dropdown: "Profile Company Profile Notifications Settings Lock Logout Michael Perkins" → see `states/004-dropdown-Profile-Company-Profile-Notifications-Settings-Lock-Logout-Michael-Perk.png`
7. **`/`** — Manage Accounts
   - Reference: `Configuration/screenshot-desktop.png`
   - Components: data-table, form, chart, modal/dialog
   - Interactive states: 18
   - Key interactions:
     - dropdown: "Configuration Grow Analytics Sales Inventory Management Fulfillment Configuratio" → see `states/000-dropdown-Configuration-Grow-Analytics-Sales-Inventory-Management-Fulfillment-Con.png`
     - dropdown: "Configuration" → see `states/001-dropdown-Configuration.png`
     - dropdown: "You have 0 new notifications View all notifications × Close .notifications-list " → see `states/002-dropdown-You-have-0-new-notifications-View-all-notifications-Close-notifications.png`
     - dropdown: "" → see `states/003-dropdown-3.png`
     - dropdown: "Profile Company Profile Marketplace Settings Notifications Settings Logout Micha" → see `states/004-dropdown-Profile-Company-Profile-Marketplace-Settings-Notifications-Settings-Log.png`
8. **`/notifications`** — Notifications
   - Reference: `Notifications/screenshot-desktop.png`
   - Components: data-table, form, chart, modal/dialog, list
   - Interactive states: 17
   - Key interactions:
     - dropdown: "Configuration Grow Analytics Sales Inventory Management Fulfillment Configuratio" → see `states/000-dropdown-Configuration-Grow-Analytics-Sales-Inventory-Management-Fulfillment-Con.png`
     - dropdown: "Configuration" → see `states/001-dropdown-Configuration.png`
     - dropdown: "You have 0 new notifications View all notifications × Close .notifications-list " → see `states/002-dropdown-You-have-0-new-notifications-View-all-notifications-Close-notifications.png`
     - dropdown: "" → see `states/003-dropdown-3.png`
     - dropdown: "Profile Company Profile Marketplace Settings Notifications Settings Logout Micha" → see `states/004-dropdown-Profile-Company-Profile-Marketplace-Settings-Notifications-Settings-Log.png`

## 5. Data Models

Infer from table headers and form fields found across pages.
See individual page `interactive-elements.json` and `components.json` for field details.

## 6. Asset Checklist

- [ ] Logo / branding images
- [ ] Icon set (identify which icon library is used)
- [ ] Font files (check Google Fonts links in page briefs)
- [ ] Color tokens → CSS variables
- [ ] Typography scale → Tailwind config or CSS

---
*Generated by Frost scrape-app.mjs — give this file + the research folder to Claude Code for rebuild*