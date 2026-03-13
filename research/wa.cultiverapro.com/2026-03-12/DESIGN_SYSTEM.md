# Design System — Cultivera Pro (wa.cultiverapro.com)
**Scraped:** 2026-03-12 | Extracted from 3 pages (Configuration, Inventory, Sales/Carts)

---

## Color Palette

Colors aggregated across Configuration, Inventory (product menu), and Sales (carts) pages.

| Hex | Count | Likely Role |
|-----|-------|------------|
| `#515967` | 2031 | **sidebar-bg** — Dark blue-gray sidebar/sidebar text |
| `#00B9B4` | 1463 | **primary** — Brand teal (links, active states, buttons) |
| `#212121` | 1385 | **surface** — Main content background / card background |
| `#E7EBEE` | 1015 | **background-light** — Table row alternates / light borders |
| `#FDFDFF` | 910 | **table-row-bg** — Table row background (near-white) |
| `#3C763D` | 1053 | **success-text** — Green status badge text |
| `#A94442` | 924 | **danger-text** — Red/error status badge text |
| `#4576A1` | 369 | **info-dark** — Info badge / link states |
| `#808080` | 344 | **text-muted-alt** — Secondary gray text |
| `#535B6A` | 344 | **sidebar-item** — Sidebar item text color |
| `#262626` | 375 | **surface-elevated** — Slightly lighter card surfaces |
| `#003940` | 171 | **header-bg** — Top bar / module switcher dark teal background |
| `#707070` | 312 | **text-muted** — Muted text, placeholders |
| `#CECED2` | 167 | **border** — Table dividers, input borders |
| `#16191C` | 201 | **background-base** — Darkest layer, base page background |
| `#03A9F4` | 188 | **info** — Info state / light blue links |
| `#05AFAA` | 66 | **primary-alt** — Alternate teal (hover states) |
| `#0ABAB4` | 117 | **primary-hover** — Teal hover variant |
| `#64B5F6` | 100 | **info-light** — Light blue chips |
| `#8BC34A` | 89 | **success-light** — Light green success indicators |
| `#90A4AE` | 80 | **border-light** — Very light slate borders |
| `#484848` | 65 | **text-secondary** — Secondary text |
| `#E5E5E5` | 18 | **divider** — Light dividers |
| `#D7756D` | 1 | **danger-alt** — Alternate red/danger |
| `#85C13F` | 3 | **success-badge** — Green badge |
| `#2980B9` | 32 | **link** — Anchor/hyperlink color |

### Key Brand Colors
```css
--color-primary:       #00B9B4;  /* Teal — primary brand */
--color-primary-dark:  #003940;  /* Very dark teal — header/top bar */
--color-primary-alt:   #05AFAA;  /* Medium teal — hover/active */
--color-background:    #16191C;  /* Base dark background */
--color-surface:       #212121;  /* Card/panel surface */
--color-sidebar:       #515967;  /* Sidebar background */
--color-text-primary:  #212121;  /* Dark text on light backgrounds */
--color-text-muted:    #707070;  /* Secondary/muted text */
--color-success:       #3C763D;  /* Success green */
--color-danger:        #A94442;  /* Error/danger red */
--color-info:          #03A9F4;  /* Info blue */
--color-border:        #CECED2;  /* Table/input borders */
--color-row-bg:        #FDFDFF;  /* Table row background */
```

---

## Typography

**Single font family: Open Sans** (Google Font) — used throughout entire app.

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Nav Label | 12.6px | 600 | 28px | Sidebar navigation items |
| Body Small | 12.25px | 400 | 20.8px | Table cell text, most common |
| Body | 14px | 400 | 20px | Form labels, descriptions |
| Subtitle | 16.5px | 500 | 23.6px | Sub-headings, section labels |
| Heading Small | 19.6px | 400 | 33.3px | Page section headings |
| Heading | 21px | 700 | 21px | Card titles, modal headings |
| Heading Large | 25.2px | 300 | 27.7px | Page title variants |
| Page Title | 19.6px → 42px | 400 | 60px | Main page H1 titles |
| Micro | 10px | 400 | normal | Status indicators, tiny labels |
| Bold Label | 12.25px | 600–700 | 17.5–40px | Column headers, emphasis |

```css
font-family: "Open Sans", sans-serif;

/* Scale */
--text-xs:    10px;
--text-sm:    12px;    /* ~12.25px rounded */
--text-base:  14px;
--text-md:    16.5px;
--text-lg:    19.6px;  /* ~20px */
--text-xl:    21px;
--text-2xl:   25.2px;  /* ~25px */
--text-display: 42px;
```

---

## Spacing Scale

Derived from computed styles across Inventory page (most complex).

| Value | Count | Usage |
|-------|-------|-------|
| `6px 8px` | 900 | Badge/chip padding (most common) |
| `3px 7px` | 141 | Small badge padding |
| `6px 12px` | 45 | Button padding |
| `24px` | 30 | Section padding / page margins |
| `7px` | 42 | Compact row padding |
| `5px` | 35 | Tight spacing |
| `1px 5px` | 41 | Micro padding (timestamps, labels) |

```css
/* Spacing tokens */
--space-xs:   3px;
--space-sm:   5px;
--space-md:   7px;
--space-lg:   12px;
--space-xl:   24px;
--space-2xl:  35px;

/* Component-specific */
--badge-padding:  6px 8px;
--badge-sm:       3px 7px;
--button-padding: 6px 12px;
--section-pad:    24px;
```

---

## Component Patterns

### Top Bar / Module Switcher
- Background: `#003940` (very dark teal)
- Height: ~48px
- Logo: Cultivera Pro (white text + icon)
- Module dropdown: white text on teal, chevron indicator
- Right side: search input, notification bell, user avatar + name

### Sidebar
- Background: `#515967` (dark blue-gray)
- Width: ~130px
- Active item: left border accent `#00B9B4`, tinted background
- Item typography: 12.6px / 600 weight / uppercase
- Icons: small icons preceding each nav label
- Company name: bold, expandable company switcher at top

### Data Tables
- Container: white background (`#FDFDFF`)
- Header row: light gray (`#E7EBEE`), all-caps column labels
- Row hover: subtle background shift
- Striped: alternating white/light rows
- Pagination: prev/next/page numbers + items-per-page dropdown
- Sort indicators: chevron arrows in column headers
- Actions: inline buttons (Accept/Cancel, Edit/Delete, Disable)

### Status Badges
- Green (active/success): `bg #8BC34A` / text `#3C763D` — delivered, approved, active
- Red (danger): `bg ~#F5C6CB` / text `#A94442` — cancelled, rejected, overdue
- Blue (info): `bg #E3F2FD` / text `#4576A1` — in transit, processing
- Teal (primary): `bg #E0F7FA` / text `#00B9B4` — primary states
- Rounded pill, ~6px 8px padding, font-size ~12px

### Buttons
- Primary: `bg #00B9B4` (teal), white text, rounded
- Secondary/outline: border `#00B9B4`, teal text
- Danger: `bg ~#D9534F` (red), white text
- Success: `bg #5CB85C` (green), white text
- Icon prefix pattern: `+ Add New X`, `✓ Accept`, `✗ Cancel`
- Font: Open Sans 12–14px, weight 600

### Page Headers
- Breadcrumb: small gray text, `>` separator
- H1: 19.6px–42px, Open Sans 400, color `#00B9B4` (teal heading) or dark gray
- Section sub-label above H1: all-caps, ~10px, muted gray

### Filter Bars
- Horizontal row of tab-style filters (Submitted | Partially Sublotted | etc.)
- Active tab: teal underline or teal background
- Text inputs: standard HTML inputs, `Find X...` placeholder pattern
- Date pickers: combobox + calendar button pairs
- Chips/tags: multi-select chips with `×` delete on each

### Kanban Board (Grow Overview)
- Cards in columns by growth stage
- Column headers bold, colored left border
- Card shows: strain name, cycle info, quick stats

### Modal / Drawer
- Overlay background: dark semi-transparent
- Modal header: H2, close button top-right
- Form fields: label-above-input pattern, full-width inputs
- Action buttons: primary + cancel pair at bottom

### Form Fields
- Label: above input, 12-14px, dark text
- Input: border `#CECED2`, 4px radius, full width
- Disabled: gray background
- File upload: "Select a file..." pattern with Choose File button

---

## App Framework & Architecture
- **Framework:** AngularJS (1.x) — legacy SPA
- **Routing:** Hash routing (`#/`) within 6 separate sub-applications
- **Sub-apps:** `/app-grow`, `/app-analytics`, `/crm`, `/inventory`, `/fulfillment`, `/configuration`
- **UI Library:** Custom Bootstrap-derived components (not Material/Tailwind)
- **Icons:** Font Awesome + custom icons
- **Maps:** Google Maps JavaScript API (loaded on some pages)
- **External:** QuickBooks OAuth integration, Leaf Data (WCIA) API sync
- **Vendor:** Σbolt Solutions ™ (platform builder)
