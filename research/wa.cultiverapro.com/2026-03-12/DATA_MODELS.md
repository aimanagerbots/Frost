# Data Models — Cultivera Pro (wa.cultiverapro.com)
**Scraped:** 2026-03-12 | **Tenant:** G&S GREENERY (License #415986)

---

## Entity: Order (Fulfillment)
**Source:** fulfillment/overview.png — orders table

| Field | Type | Notes |
|-------|------|-------|
| partnerName | string | Retailer/account name |
| orderNumber | string | PO-XXXXXX-XXXXXX format |
| manifestDate | Date | Date manifest was created |
| deliveryDate | Date | Estimated delivery date |
| status | enum | Submitted, Partially Sublotted, Sublotted, Ready For Manifest, Manifested, Quarantined, Invoiced, Released, Cancelled |

---

## Entity: Cart (Sales)
**Source:** sales/carts.png, sales/states/cart-detail-prc-conway.png

| Field | Type | Notes |
|-------|------|-------|
| cartId | number | Internal ID |
| portalOrderNumber | string | PO-XXXXXX-XXXXXX |
| startedDate | DateTime | e.g., "3/10/2026 10:44 AM" |
| client | string | Account/store name |
| contactName | string | Buyer's name |
| contactEmail | string | Buyer email |
| contactPhone | string | Buyer phone |
| itemCount | number | Line item count |
| orderTotal | currency | e.g., $621.60 |
| status | enum | Open / Accepted / Cancelled |

### Cart Line Item
| Field | Type | Notes |
|-------|------|-------|
| productName | string | Full product name |
| sku | string | Product SKU |
| strain | string | Strain name |
| batchId | string | Batch/lot identifier |
| quantity | number | Units ordered |
| unitPrice | currency | Price per unit |
| discount | number | Discount % |
| lineTotal | currency | quantity × unitPrice - discount |

---

## Entity: Account (Sales/CRM)
**Source:** sales/accounts.png

| Field | Type | Notes |
|-------|------|-------|
| accountId | number | Internal ID |
| name | string | Retailer/store name |
| licenseNumber | string | State license # |
| address | string | Street address |
| city | string | City |
| county | string | WA county |
| phone | string | Day phone |
| salesPerson | string | Assigned rep |
| status | enum | Prospect, Partner, Pending, First Contact, Sent Samples, Don't do business with, New Retailers |
| accountGroup | string | Group/territory assignment |

---

## Entity: AccountGroup (Sales)
**Source:** sales/account-groups.png, configuration/statuses.png

| Field | Type | Notes |
|-------|------|-------|
| groupId | number | Internal ID |
| name | string | Group name |
| memberCount | number | # of accounts |

### Client Status Values (from Configuration → Statuses)
`Sent Samples`, `First Contact`, `Prospect`, `Partner`, `Pending`, `Don't do business with`, `New Retailers`

### Client Note Attribute Values
`Sent Samples`, `Left Voicemail`, `Emailed`, `Called`

---

## Entity: InventoryProduct (Inventory)
**Source:** inventory/overview.png (Manage Menu), inventory/products.png

| Field | Type | Notes |
|-------|------|-------|
| productId | number | Internal ID |
| name | string | Full product name (e.g., "Premium Flower (H) Lizard Burger - 3.5g") |
| sku | string | SKU code |
| productLine | string | e.g., Premium Flower, Premium Budlets, RTP, RTM |
| subProductLine | string | One of 51 chart-of-accounts entries |
| strain | string | Strain name |
| inventoryType | string | Packaged Flower, Preroll, Concentrate, etc. |
| thc | number | THC % |
| cbd | number | CBD % |
| packageSize | string | e.g., 3.5g, 7g, 14g, 28g |
| price | currency | Wholesale price |
| available | boolean | Available on menu |
| active | boolean | Active in system |

### Product Line Taxonomy (from Chart of Accounts — 51 entries):
**RTM (Ready To Manufacture):** Extraction Material, Fresh Frozen, Hydrocarbon Concentrate, Keif, Preroll Material, Sugar
**RTP (Ready To Package):** Budlets, Distillate, Hydrocarbon Concentrate, Premium Flower, Smalls, Vape | Hydrocarbon Concentrate
**Finished:** Premium Flower, Premium Budlets, Regular Prerolls, Infused Preroll, Infused Flavored Preroll, Concentrate
**Non-Cannabis:** Packaging 4/6/9/16 Oz Jars & Lids, Clear Tubes, Red Tubes, Screw Caps, Vape carts, Ceramic/Snap-Fit hardware

---

## Entity: Strain (Inventory)
**Source:** inventory/strains.png (173 strains)

| Field | Type | Notes |
|-------|------|-------|
| strainId | number | Numeric ID (system-assigned) |
| name | string | Strain name |
| type | enum | (H)ybrid, (I)ndica, (S)ativa inferred from product names |

---

## Entity: Batch / QA Lot (Inventory/Grow)
**Source:** inventory/qa-result.png, grow/qa-lot.png

| Field | Type | Notes |
|-------|------|-------|
| qaLotId | string | Lot identifier |
| status | enum | Quarantined, Released, Approved |
| inventoryType | string | Product category |
| strain | string | Strain name |
| farmInformation | string | Farm source |
| cbd | number | CBD % |
| thc | number | THC % |
| thca | number | THCA % |
| cbda | number | CBDA % |
| totalCannabinoids | number | Total % |

---

## Entity: GrowCycle (Grow)
**Source:** grow/grow-cycles.png, grow/overview.png (Kanban)

| Field | Type | Notes |
|-------|------|-------|
| cycleId | number | Internal ID |
| name | string | Cycle name |
| stage | enum | Clones/Propagation, Vegetative, Flower, Harvest, Drying/Curing |
| room | string | Room name |
| plantCount | number | # plants in cycle |
| startDate | Date | Cycle start |
| harvestDate | Date | Expected/actual harvest |
| strain | string | Strain |

---

## Entity: Plant (Grow)
**Source:** grow/plants.png, grow/inventory-rooms.png (2811 plants, 13 rooms)

| Field | Type | Notes |
|-------|------|-------|
| plantId | string | TSID from state system |
| strain | string | Strain name |
| room | string | Room location |
| stage | enum | Propagation, Veg, Flower |
| source | string | Grow source |

---

## Entity: Harvest (Grow)
**Source:** grow/harvest.png

| Field | Type | Notes |
|-------|------|-------|
| harvestId | string | TSID |
| strain | string | Strain name |
| wetWeight | number | lbs at harvest |
| dryWeight | number | lbs after drying |
| room | string | Source room |
| date | Date | Harvest date |

---

## Entity: Disposal (Grow/Inventory)
**Source:** grow/states/disposal-destroyed-tab.png (261 destroyed records)

| Field | Type | Notes |
|-------|------|-------|
| sourceTSID | string | Source lot TSID |
| disposalTSID | string | Disposal TSID |
| strain | string | Strain name |
| quantity | number | Amount disposed |
| count | number | Unit count |
| quarantinePeriod | string | Required quarantine before disposal |
| dateDestroyed | Date | Date of disposal |
| destroyedBy | string | User who performed disposal |

---

## Entity: BillOfMaterials / Production (Inventory)
**Source:** inventory/production.png (8 BOMs)

| Field | Type | Notes |
|-------|------|-------|
| bomId | number | Internal ID |
| name | string | e.g., "Premium Flower → Packaged Flower" |
| inputMaterial | string | RTM product type |
| outputProduct | string | RTP/finished product type |

### Observed BOM Examples:
- Premium Flower → Packaged Flower
- Preroll Material → Regular Prerolls
- Preroll Material → Infused Prerolls
- Bulk Sugar → Hydrocarbon Wax
- Plant Material → Wet Flower
- Bulk Flower → Flower Lot
- Keif → Kief
- Sugar → Other Plant Material Lot

---

## Entity: TransferInbound (Fulfillment)
**Source:** fulfillment/transfer-inbound.png, fulfillment/states/transfer-inbound-detail.png

| Field | Type | Notes |
|-------|------|-------|
| tsid | string | Transfer TSID (e.g., "1") |
| type | enum | Cannabis, Non-Cannabis |
| clientName | string | Sending entity |
| location | string | Receiving location |
| transferStatus | enum | In Transit, Accepted, Rejected |
| dateTransferred | Date | Transfer date |
| source | enum | Manually-entered, WCIA Import |

### Transfer Line Item:
| Field | Type | Notes |
|-------|------|-------|
| lineItem | number | Line number |
| room | string | Destination room |
| product | string | Product name |
| strain | string | Strain |
| labResultId | string | QA/COA reference |
| quantity | number | Units |
| acceptedQty | number | Accepted units |
| qtyToAccept | number | Remaining to accept |
| totalPrice | currency | Value |
| status | enum | Pending, Accepted, Rejected |

---

## Entity: Vehicle (Fulfillment)
**Source:** fulfillment/vehicles.png

| Field | Type | Notes |
|-------|------|-------|
| vehicleId | number | Internal ID |
| nickname | string | Display name |
| make | string | Vehicle brand |
| year | number | Model year |
| plateNumber | string | License plate |
| vin | string | VIN |
| hideForFulfillment | boolean | Hidden from fulfillment |
| active | boolean | Active in system |

---

## Entity: Driver (Fulfillment)
**Source:** fulfillment/drivers.png

| Field | Type | Notes |
|-------|------|-------|
| driverId | number | Internal ID |
| name | string | Full name |
| dob | Date | Date of birth |
| hiredDate | Date | Hire date |
| hideForFulfillment | boolean | |
| active | boolean | |

---

## Entity: DeliveryAgent (Fulfillment)
**Source:** fulfillment/delivery-agents.png (46 agents)

| Field | Type | Notes |
|-------|------|-------|
| agentId | number | Internal ID |
| name | string | Company name |
| address | string | Street address |
| city | string | City |
| phone | string | Phone number |
| county | string | WA county |
| hideForFulfillment | boolean | |

---

## Entity: User (Configuration)
**Source:** configuration/users.png (5 users)

| Field | Type | Notes |
|-------|------|-------|
| userId | number | Internal ID |
| name | string | Full name |
| email | string | Login email |
| phone | string | Primary phone |
| otherPhone | string | Secondary phone |
| userName | string | Login username (= email) |
| activated | boolean | Account activated |
| lastSeen | DateTime | Last login timestamp |
| role | enum | Admin, Grow, Inventory, Management |

### Known Users: Michael Perkins, Nichole Cluff, Richard Maloney, Stacia Hartwell, Support Cultivera

---

## Entity: Role (Configuration)
**Source:** configuration/roles.png (4 roles)

| Field | Type | Notes |
|-------|------|-------|
| roleId | number | Internal ID |
| name | string | Role name |
| description | string | Permission summary |
| isActive | boolean | Active |

### Roles: Admin, Grow, Inventory, Management

---

## Entity: AnalyticsReport (Analytics)
**Source:** analytics/overview.png (12 report cards)

| Report Name | Key Dimensions | Key Metrics |
|-------------|---------------|-------------|
| Customer Sales Client By Product | Client, Product | Units Sum, Avg Unit Price, Avg Discount, Sum Line Total |
| Product By Client | Product, Client | Units, Revenue |
| Expected Days of Inventory | Product | Days of stock remaining |
| Harvest Yield | Strain, Cycle | Wet/dry weight |
| Last Ordered By Account | Account | Last order date |
| Monthly Sales 12mo | Month | Revenue |
| Monthly Sales Comparison | Month, Year | YoY comparison |
| Monthly Sales by Sales Person | Sales Person, Month | Revenue |
| Production Run Input/Output | BOM, Run | Input qty, Output qty |
| Product-Line Sales by Account | Product Line, Account | Revenue |
| Sales Recommendations | Account | Recommended products |

---

## Entity Relationships

```
Account (many) ──── belongs to ──── AccountGroup (one)
Account (one) ──── has many ──── Cart (many)
Cart (one) ──── has many ──── CartLineItem (many)
CartLineItem (many) ──── references ──── InventoryProduct (one)
InventoryProduct (many) ──── has strain ──── Strain (one)
InventoryProduct (many) ──── has QA lot ──── QALot (one)
GrowCycle (one) ──── has many ──── Plant (many)
GrowCycle (one) ──── produces ──── Harvest (many)
Harvest (one) ──── processes into ──── Batch/QALot (many)
Order (one) ──── has many ──── TransferOutbound (many)
TransferInbound (one) ──── has many ──── TransferLineItem (many)
User (many) ──── assigned role ──── Role (one)
User (one) ──── manages ──── Account (many)
```
