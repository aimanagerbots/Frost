# Sales Module — Page Analysis
> Captured: 2026-03-12 | Sessions 1 + 2 | 51 screenshots total

---

## Pages

### Dashboard (`sales/dashboard.png`)
- **Widgets:** Total # of Accounts, Total # of Active Carts, Total Sales (YTD), Total Revenue (YTD)
- **Charts:** Weekly Sales bar chart
- **Panels:** Active Carts, Recent Orders, Recent Clients
- **Toggle:** My Accounts mode (empty state captured)

### Accounts (`sales/accounts-all.png`)
- **Columns:** (see screenshot)
- **Filters:** Quick Filters modal — "Remember grid sort", "Save Current Filter"
- **Actions:** Add Non-Cannabis Account modal, Export (Contact Details, Accounts)
- **Tabs:** Active, Inactive, All
- **Detail drill-down:** `sales/states/account-detail.png` — tabs: Analytics, Orders, Notes, Recommendations, Discounts (63 items)
- **Detail modals:** Invite (Client Name/Address/License-UBI readonly + Email + Message), Assign Salesperson (radio), Add Contact (First/Last Name, Email, Title dropdown, Phone, Phone Type, Note), Update Client Info, Update Notes, Update Delivery Prefs, Update Inventory Prefs

### Carts (`sales/carts.png`)
- **Columns:** (see screenshot)
- **Detail:** `sales/states/cart-detail.png`
- **Actions:** Submit, Duplicate, Delete, Mark as Trade Samples, Conversion Setting, Auto Allocate
- **Conversion Setting modal:** Batch allocation table (Needed/Allocated/Remaining columns + Batch Date/DOH/DOM/Use/Barcode/Room/Available/Allocated), radio: Combine / Generate Multiple Batches
- **Validation modals:** Trade Samples + Auto Allocate → "No cart item selected"

### Inventory — Sales View (`sales/inventory.png`)
- **Count:** 63 products
- **Search panel** with dropdowns:
  - THCA/THC/CBD/Total range sliders
  - Strain listbox (~150+ options — see `sales/states/inventory-strain-dropdown.png`)
  - Product Line listbox (8 options — see `sales/states/inventory-product-line-dropdown.png`)
  - Sub Product Line listbox (50+ options — see `sales/states/inventory-sub-product-line-dropdown.png`)

### Catalogs (`sales/catalogs.png`)
- **Rows:** Frost - Flower 3.5g-28g, Frost - Prerolls
- **Add to Cart modal** fields: Product, Price, Quantity/Available, Line Total

### Orders (`sales/orders.png`)
- **Columns:** Order #, Client Name, Status, Manifest Date, Est. Delivery, Order Total
- **Status tabs:** All, Submitted, Manifested, Invoiced, Released
- **Quick Filters:** "Remember grid sort", "Save Current Filter"
- **Note:** Table is empty for this tenant (no historical orders)

### Sales Person Report (`sales/sales-person-report.png`)
- **Columns:** Sales Person, Number of Orders, Total Sales
- **Filters:** Min/Max Total, Search by Sales Persons (listbox), Client Status, Date Range, Show Canceled
- **Date quick-links:** All, Today, Yesterday, Last 7/10/15 Days, Week/Month/Year To Date
- **Export:** Export to Excel

### Order Summary (`sales/order-summary.png`)
- **Columns:** Order #, Submitted By, Submitted Date, Client, City, Status, Manifested Date, Est. Delivery Date, Released Date, Order Total
- **Filters:** From/To Submitted Date (calendar), Trade Name, From/To Est. Delivery Date, Submitted By, Status, From/To Released Date
- **Checkboxes:** Show Cancelled Orders, Hide "Samples Only" (default checked), Hide Non "Samples Only"
- **Export:** Export Summary to Excel, Export Details to Excel
- **Pagination:** items-per-page selector

### Market Connections (`sales/states/market-connections-all.png`)
- **Count:** 407 connections
- **Tabs:** All, Active Users, Revoked Users

---

## Entities & Data Models

### Order
| Field | Type | Notes |
|---|---|---|
| orderNumber | string | "Order #" column |
| submittedBy | string | |
| submittedDate | Date | |
| clientName | string | |
| city | string | |
| status | enum → order_status | |
| manifestedDate | Date | |
| estDeliveryDate | Date | |
| releasedDate | Date | |
| orderTotal | number | currency |

### Account
| Field | Type | Notes |
|---|---|---|
| clientName | string | readonly in invite modal |
| address | string | readonly in invite modal |
| licenseUBI | string | readonly in invite modal |
| email | string | |
| status | enum | Active / Inactive |
| deliveryDays | string | |
| amPm | string | AM/PM |
| specialInstructions | string | |
| labelBarcodePreference | string | |
| fulfillmentPriority | enum | FIFO / Newest First / Highest QA / Lowest QA |

### Contact
| Field | Type | Notes |
|---|---|---|
| firstName | string | |
| lastName | string | |
| email | string | |
| title | enum | (see dropdown) |
| phone | string | |
| phoneType | enum | (see dropdown) |
| note | string | |

### Cart
| Field | Type | Notes |
|---|---|---|
| lineItems | LineItem[] | |
| allocationMode | enum | Combine / Generate Multiple Batches |

### Catalog
| Field | Type | Notes |
|---|---|---|
| name | string | e.g. "Frost - Flower 3.5g-28g" |

### InventoryItem (Sales view)
| Field | Type | Notes |
|---|---|---|
| strain | enum | ~150+ values |
| productLine | enum | 8 values |
| subProductLine | enum | 50+ values |
| thca | number | range filter |
| thc | number | range filter |
| cbd | number | range filter |

---

## Enums

| Enum | Values |
|---|---|
| order_status | Submitted, Sublotted, Manifested, Quarantined, Invoiced, Paid, PartiallySublotted |
| sales_rep | Michael Perkins, Nichole Cluff, Richard Maloney, Stacia Hartwell, Support Cultivera |
| fulfillment_priority | FIFO, Newest First, Highest QA, Lowest QA |
| items_per_page | All, 5, 10, 20, 25, 50, 100 |
| account_status | Active, Inactive |
| strain | ~150+ values (see inventory-strain-dropdown.png) |
| product_line | 8 values (see inventory-product-line-dropdown.png) |
| sub_product_line | 50+ values (see inventory-sub-product-line-dropdown.png) |

---

## Relationships
- Account hasMany Orders
- Account hasMany Contacts
- Account hasMany Discounts (63 items seen)
- Cart hasMany LineItems → LineItem references InventoryItem
- Catalog contains Products (Add to Cart flow)
- Order belongsTo Account (Client)
- Order belongsTo SalesPerson
