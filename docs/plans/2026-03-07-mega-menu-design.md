# Mega Menu Design — Frost Website

## Overview
Replace the flat 4-link nav with a full mega menu across the website header. Each product category gets its own dropdown, plus Strain Library, Resources, and direct links for Find Near You and Wholesale.

## Top-Level Nav Structure

```
[Logo]  Flower▾  Pre-Rolls▾  Vaporizers▾  Concentrates▾  Edibles▾  Beverages▾  Strains▾  Find Near You  Resources▾  [Wholesale]
```

- 6 product category triggers with dropdowns
- Strain Library trigger with dropdown
- Find Near You — direct link (no dropdown)
- Resources trigger with dropdown
- Wholesale — CTA button, direct link

## Product Category Dropdowns

Each panel has 3 columns: By Type, By Format, Brand/Featured.

### Column 1: By Type (same for all)
- Indica, Sativa, Hybrid

### Column 2: By Format (varies per category)
- **Flower**: Eighths (3.5g), Quarters (7g), Halves (14g), Ounces (28g)
- **Pre-Rolls**: Singles, 3-Packs, 5-Packs, Infused
- **Vaporizers**: Disposables, Cartridges, Pods, Batteries
- **Concentrates**: Live Resin, Rosin, Shatter, Wax, Badder
- **Edibles**: Gummies, Chocolates, Baked Goods, Mints
- **Beverages**: Sparkling, Teas, Shots, Mixers

### Column 3: Brand + Featured
- Brand name (Frost Farms / Glacier Extracts / Northern Lights Co.)
- Featured product highlight with image
- "Shop All [Category]" link

## Strain Library Dropdown

3 columns: By Type, By Effect, Popular Strains.

- **By Type**: Indica, Sativa, Hybrid
- **By Effect**: Relaxing, Energizing, Creative, Pain Relief, Sleep
- **Popular Strains**: Blue Frost, Northern Haze, Glacier Kush + "Browse All Strains" link

## Resources Dropdown

2 columns: Learn, Connect.

- **Learn**: Blog/Journal, FAQ
- **Connect**: Newsletter Signup, Contact Us

## Direct Links
- **Find Near You** — `/find` (powered by Headset)
- **Wholesale** — `/wholesale` (CTA button style)

## Technical Approach
- Radix UI `NavigationMenu` primitive (already available via shadcn/radix)
- Desktop: mega dropdown panels with `bg-base/95 backdrop-blur-md`
- Mobile: update existing `MobileMenu` with same structure (accordion sections)
- All menu data defined in `constants.ts` for easy updates
- Styling: dark panels, white text, `#5BB8E6` accent on hover
- Keyboard accessible, ARIA compliant via Radix

## Files to Create/Modify
- `apps/website/src/components/layout/MegaMenu.tsx` — new component
- `apps/website/src/components/layout/Header.tsx` — replace flat nav with MegaMenu
- `apps/website/src/components/layout/MobileMenu.tsx` — update with accordion structure
- `apps/website/src/lib/constants.ts` — add mega menu data (MEGA_MENU_DATA)
