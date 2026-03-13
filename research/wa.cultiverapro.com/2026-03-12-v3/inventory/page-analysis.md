# Inventory Module — Page Analysis
**Crawled:** 2026-03-12
**Swarm Agent:** inventory
**Screenshots captured:** 14

---

## Module Overview

The Inventory Management module is a standalone Angular SPA (`/inventory/#/`) separate from the Sales CRM. It manages products, batches, strains, QA results, discounts, and related entities for a cannabis dispensary (G&S Greenery).

**Sidebar Navigation (all pages):**
- Manage Menu → `#/product-menu`
- Batches → `#/batch-products`
- Non-Cannabis Inventory → `#/non-cannabis-inventories`
- Production → `#/production`
- Categories → `#/categories`
- Product-Lines → `#/product-lines`
- Products → `#/products`
- Catalog Groups → `#/catalog-groups`
- Strains → `#/strains`
- Inventory Rooms → `#/rooms`
- Discount & Promotion → `#/discount-promotion`
- Backorders → `#/backorder`
- QA Result → `#/qa-result`
- Conversions for Orders → `#/flower-conversion`
- Product Tag → `#/product-tag`
- QA Lot → `#/qa-lot`
- QA Sample → `#/qa-sample`
- Employee Sample → `#/employee-sample`
- Disposal → `#/disposals`

---

## Pages Captured

### 1. Manage Menu (Landing Page)
**URL:** `#/product-menu`
**Screenshot:** `inventory-landing.png`

Grid view of all products with inventory counts. Filter tabs: ALL, AVAIL. FOR SALE, NOT FOR SALE, AVAIL. ON RETAIL PORTAL, MORE CATEGORIES, ACTIVE, DISCONTINUED.

**Columns:** Product Name, Status, Price, Units For Sale, Units Allocated, Units On Backorder, Units On Hold, Units In Stock, Last Adjusted

---

### 2. Batches
**URL:** `#/batch-products`
**Screenshot:** `batches-overview.png`

**Status:** No data ("No items to display") in this environment.

**Columns:** Barcode, Product Name, Room, Batch Date, QA, Available, Units For Sale, Units On Hold, Units Allocated, Units In Stock

**Filters:** ALL, AVAILABLE FOR SALE, NOT FOR SALE, EXCLUDED
**Filter inputs:** Filter Products (text), Filter Barcodes (text), Locations/Licenses (dropdown), Rooms (dropdown)
**Actions:** Export Batches Currently in Stock, Depleted Inventories, barcode scan icon

---

### 3. Products
**URL:** `#/products`
**Screenshot:** `products-overview.png`, `product-detail.png`, `new-product-page.png`

Card grid view (5 per row). Each card shows: product image placeholder, min/max THC, THCA, CBD, total values, product name, and inventory counts (Available For Sale, Allocated, On Hold, Total In Stock).

**Filter tabs:** ALL, AVAILABLE FOR SALE, NOT FOR SALE, AVAILABLE FOR PORTAL, ACTIVE, DISCONTINUED
**Filter inputs:** Filter Products (text), Search by Product-Line (dropdown), Search by Sub Product-Line (dropdown), Non-Cannabis (checkbox)

**Create options (dropdown):** New Product, New Non-Cannabis Product

#### Product Detail / New Product Fields:
| Field | Type | Notes |
|-------|------|-------|
| Name * | text | Required |
| Label Name | text | Internal product name |
| SKU | text | |
| Inventory Type * | select | 35 options (see enum below) |
| Product-Line * | select + add button | |
| Sub-Product Line * | select + add button | |
| Package Size * | select + add button | |
| Label Template * | select | |
| Strain * | select + add button | |
| Unit Price | number | Default: 0 |
| Conversion Source Product | text autocomplete | |
| Max. Retailer Visible Units | number | |
| Catalog Group | select | |
| Catalog Name | text | |
| Bill of Materials | select | |
| Expiry (Months) | number | Default: 12 |
| Category | select | |
| Sub Category | select | |
| Min. Order Limit | number | |
| Market Increment Quantity | number | |
| Show as DOH-Compliant in Marketplace | checkbox | |
| Product Description | textarea | |
| Product Disclaimer | textarea | |
| Product Images | file upload | |
| Edible Ingredients | text + Add button | (on detail page) |
| Override Qa Values | checkbox + CBD/CBDA/THC/THCA/Total fields | (on detail page) |

**Actions:** Update Product, Clone Product, Delete Product, Discontinue Product

**Sample products in system:**
- RTM | Extraction Material - Placeholder
- RTM | Fresh Frozen - Placeholder
- RTM | Hydrocarbon Concentrate - Placeholder
- RTM | Preroll Material - [various year codes: 1513, 1970, 2024, 2042, 2079, 2081, 2082, 2144, 2166]
- RTM | Preroll Material - [Platinum Pineapple, Green Crack, Moonbow, Orange Crush, Skatalite, White Fire OG]
- RTP | Budlets - [Platinum Pineapple, Moonbow, Orange Crush, Skatalite]
- Premium Flower - [Platinum Pineapple, Green Crack, Moonbow, Orange Crush, Skatalite]

---

### 4. Strains
**URL:** `#/strains`
**Screenshot:** `strains-overview.png`, `strains-add-new.png`

Inline editable Kendo grid. 173 strains total (4 pages × 50 items).

**Columns:** Strain (name), Image (photo upload), Is Active? (checkbox)

**Actions (inline grid buttons):** Save changes, Add new record, Cancel changes

#### Add Strain Fields (inline row):
- Strain: text input
- Image: file upload cell
- Is Active?: checkbox (default checked)

**Sample strain names:** Mostly numeric codes (1, 10, 1083, 11, 12, 13, 14, 15, 1513, 16, 17, 18, 19, 1970, 2, 20, 2024, 2042, 2079, 2081, 2082, ...) — these appear to be WA state strain registry IDs.

---

### 5. QA Result
**URL:** `#/qa-result`
**Screenshot:** `qa-result-overview.png`, `qa-result-detail.png`, `qa-result-expanded.png`

Kendo grid with master-detail expansion. Rich data set present.

**Filter inputs:** Search by QA Lot (text), Search by Strain (dropdown), Search by Inventory Types (dropdown)
**Filter tabs:** ALL, PASSED, FAILED

**Columns:** QA Lot (barcode + sub-lot), Status, Inventory Type, Strain, Farm Information (DOM + DOH dates), CBD, THC, THCA, CBDA, Total, edit button

**Expanded row detail columns:** CBD, THC, THCA, CBDA, Total, Changed By, Date Changed

**Actions:** Add New QA Result, Import WCIA Lab Result Link/File

**Status values observed:** Passed (green badge), Failed (red badge), blank (no QA yet)

**Sample data:**
- QA Lots: GF41598605597285 (Flower Lot), GF41598605545594 (Kief, Passed), WA.J415BB6.IN2NAB (Kief, Passed)
- DOM dates: 02/11/26 format
- PDF attachments visible on passed lots

#### Inventory Type Enum (35 options from QA Result filter):
```
5  - Kief
6  - Flower
7  - Clone
9  - Other Plant Material
10 - Seed
11 - Plant Tissue
12 - Mature Plant
13 - Flower Lot
14 - Other Plant Material Lot
15 - Bubble Hash
16 - Hash
17 - Hydrocarbon Wax
18 - CO2 Hash Oil
19 - Food Grade Solvent Extract
20 - Infused Dairy Butter or Fat in Solid Form
21 - Infused Cooking Oil
22 - Solid Marijuana Infused Edible
23 - Liquid Marijuana Infused Edible
24 - Marijuana Extract for Inhalation
25 - Marijuana Infused Topicals
26 - Sample Jar (sniffer)
27 - Waste
28 - Usable Marijuana
29 - Wet Flower
30 - Marijuana Mix
31 - Marijuana Mix Packaged
32 - Marijuana Mix Infused
33 - Non-Mandatory QA Sample
34 - Capsule
35 - Tincture
36 - Transdermal Patch
37 - Suppository
38 - Non-solvent_based_concentrate
39 - Hemp-CBD
40 - Ethanol Concentrate
```
*(WA State LCB METRC inventory type codes)*

---

### 6. Discount & Promotion
**URL:** `#/discount-promotion`
**Screenshot:** `discounts-overview.png`, `discounts-add-new.png`

**Status:** No data ("No items to display").

**Columns:** Name, Description, From Date, To Date, Discount
**Options:** View Expired Discounts (checkbox)

**Note:** No separate "discount_type" dropdown exists. Discount type is set via radio buttons in the create form.

#### New Discount Form Fields:
| Field | Type | Notes |
|-------|------|-------|
| Name | text | "Enter Discount Name" |
| From Date | date picker | calendar icon |
| To Date | date picker | calendar icon |
| Discount From | radio | **Percent** (default) \| Amount |
| Discount Amount | number | Default: 0 |
| Description | textarea | |
| Applies to all products | checkbox | |
| Applies to all clients | checkbox | |

**Discount Type Enum (radio):** `Percent`, `Amount`

---

### 7. Transfer History
Not a standalone page in the Inventory module. Transfer actions appear as contextual buttons ("Transfer to External", "Transfer within license") within batch/product detail views, not as a dedicated list page.

---

## Design Tokens

### Colors (extracted from Products + QA Result pages)
| Token | Value | Usage |
|-------|-------|-------|
| Primary / Brand | `rgb(0, 185, 180)` → `#00B9B4` | Navbar bg, buttons, active states, links |
| Body text | `rgb(33, 33, 33)` → `#212121` | Primary text |
| Muted text | `rgb(83, 91, 106)` → `#535B6A` | Secondary text, nav labels |
| Dark text | `rgb(38, 38, 38)` → `#262626` | Headings |
| Subtle text | `rgb(81, 89, 103)` → `#515967` | Table headers |
| White | `rgb(255, 255, 255)` → `#FFFFFF` | Backgrounds, button text |
| Success green | `rgb(139, 195, 74)` → `#8BC34A` | "Passed" badge background |
| Table border | `rgb(231, 235, 238)` → `#E7EBEE` | Row separators |
| Input bg | `rgb(243, 243, 244)` → `#F3F3F4` | Form field backgrounds |

### Typography
| Font | Usage |
|------|-------|
| `Open Sans` | Body text, labels, data (primary font) |
| `Titillium Web` | Navigation / headings (secondary font) |

### Font Sizes
| Size | Usage |
|------|-------|
| `14px` | Body / default |
| `25.2px` | h1 headings |
| `19.6px` | h2 |
| `18px` | Large labels |
| `13px` | Form labels, table data |
| `12.25px` | Small/badge text |
| `11.2px` | Micro text |

### UI Patterns
- **Navbar:** Solid teal `#00B9B4` background, white text/icons
- **Cards (Product grid):** White bg, subtle border, stats in colored rows (red = zero, green = has stock)
- **Buttons:** Primary = teal; Success = teal; Danger = outlined red; secondary = outlined
- **Badges:** Passed = green pill; Failed = red pill; Not Available = gray pill
- **Grid:** Kendo UI grid (Bootstrap-based), alternating row shading
- **Forms:** Bootstrap form layout, 2-column grid on wider screens

---

## Key Entities & Data Models

### Product
```typescript
interface Product {
  id: number;
  sku: string;
  name: string;               // Required
  labelName: string;
  inventoryType: InventoryType; // Required (numeric enum)
  productLine: string;        // Required
  subProductLine: string;     // Required
  packageSize: string;        // Required (e.g. "1 Lot")
  labelTemplate: string;      // Required
  strain: string;             // Required
  unitPrice: number;
  expiryMonths: number;       // Default: 12
  conversionSourceProduct: string;
  maxRetailerVisibleUnits: number;
  catalogGroup: string;
  catalogName: string;
  billOfMaterials: string;
  category: string;
  subCategory: string;
  minOrderLimit: number;
  marketIncrementQuantity: number;
  showAsDOHCompliant: boolean;
  productDescription: string;
  productDisclaimer: string;
  images: ProductImage[];
  edibleIngredients: string[];
  overrideQaValues: boolean;
  qaValues: { cbd: number; cbda: number; thc: number; thca: number; total: number };
  // Computed inventory fields
  availableForSale: number;
  allocated: number;
  onHold: number;
  totalInStock: number;
}
```

### Batch
```typescript
interface Batch {
  barcode: string;
  productName: string;
  room: string;
  batchDate: Date;
  qaStatus: string;
  available: number;
  unitsForSale: number;
  unitsOnHold: number;
  unitsAllocated: number;
  unitsInStock: number;
}
```

### Strain
```typescript
interface Strain {
  name: string;   // Often a WA state numeric ID or strain name
  image: string;  // URL
  isActive: boolean;
}
```

### QA Result
```typescript
interface QAResult {
  qaLot: string;           // e.g. "GF41598605597285" or "WA.J415BB6.IN2NAB"
  subLot: string;          // secondary barcode
  status: 'Passed' | 'Failed' | '';
  inventoryType: InventoryType;
  strain: string;
  dateOfManufacture: Date; // DOM
  dateOfHarvest: Date;     // DOH
  cbd: number;
  thc: number;
  thca: number;
  cbda: number;
  total: number;
  pdfAttachment: string;   // URL to COA PDF
  changedBy: string;
  dateChanged: Date;
}
```

### Discount
```typescript
interface Discount {
  name: string;
  fromDate: Date;
  toDate: Date;
  discountType: 'Percent' | 'Amount';
  discountAmount: number;
  description: string;
  appliesToAllProducts: boolean;
  appliesToAllClients: boolean;
}
```

---

## Screenshots Index
| File | Page | Notes |
|------|------|-------|
| `inventory-landing.png` | Manage Menu | Product price/stock grid |
| `batches-overview.png` | Batches | Empty, columns documented |
| `products-overview.png` | Products | Card grid, full page |
| `product-detail.png` | Product Detail | RTM Extraction Material - Placeholder |
| `new-product-page.png` | New Product | All form fields visible |
| `products-create-dropdown.png` | Products | "+ Create" dropdown options |
| `strains-overview.png` | Strains | 173 strains, full list |
| `strains-add-new.png` | Strains | Inline add row |
| `qa-result-overview.png` | QA Result | Full data, all rows |
| `qa-result-detail.png` | QA Result | First row selected |
| `qa-result-expanded.png` | QA Result | First row expanded (detail sub-row) |
| `discounts-overview.png` | Discount & Promotion | Empty, columns documented |
| `discounts-add-new.png` | New Discount | All form fields |
| `states/inventory-type-dropdown.png` | QA Result filter | All 35 inventory type options |
