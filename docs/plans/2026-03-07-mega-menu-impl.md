# Mega Menu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the flat 4-link website header with a full mega menu featuring 6 product category dropdowns, Strain Library dropdown, Resources dropdown, Find Near You direct link, and Wholesale CTA button.

**Architecture:** Install Radix UI NavigationMenu primitive for accessible, keyboard-navigable dropdowns. All menu data lives in `constants.ts`. Desktop gets dropdown panels; mobile gets accordion sections in the existing MobileMenu. No new pages — just navigation restructuring.

**Tech Stack:** Radix UI NavigationMenu, Next.js App Router, Tailwind v4, lucide-react icons

---

### Task 1: Install Radix UI NavigationMenu

**Files:**
- Modify: `apps/website/package.json`

**Step 1: Install the package**

Run: `cd apps/website && npm install @radix-ui/react-navigation-menu`

**Step 2: Verify installation**

Run: `cd apps/website && node -e "require('@radix-ui/react-navigation-menu'); console.log('OK')"`
Expected: `OK`

**Step 3: Commit**

```bash
git add apps/website/package.json apps/website/package-lock.json
git commit -m "chore: install radix navigation-menu for website mega menu"
```

---

### Task 2: Add Mega Menu Data to Constants

**Files:**
- Modify: `apps/website/src/lib/constants.ts`

**Step 1: Add the mega menu data structure**

Add after the existing `NAV_LINKS` constant:

```typescript
export interface MegaMenuCategory {
  label: string;
  slug: string;
  brand: string;
  formats: { label: string; slug: string }[];
  featured?: { name: string; slug: string };
}

export interface MegaMenuSection {
  type: 'category' | 'dropdown' | 'link' | 'cta';
  label: string;
  href?: string;
  columns?: { heading: string; links: { label: string; href: string }[] }[];
  category?: MegaMenuCategory;
}

export const STRAIN_TYPES = [
  { label: 'Indica', slug: 'indica' },
  { label: 'Sativa', slug: 'sativa' },
  { label: 'Hybrid', slug: 'hybrid' },
] as const;

export const MEGA_MENU: MegaMenuSection[] = [
  {
    type: 'category',
    label: 'Flower',
    category: {
      label: 'Flower',
      slug: 'flower',
      brand: 'Frost Farms',
      formats: [
        { label: 'Eighths (3.5g)', slug: 'eighths' },
        { label: 'Quarters (7g)', slug: 'quarters' },
        { label: 'Halves (14g)', slug: 'halves' },
        { label: 'Ounces (28g)', slug: 'ounces' },
      ],
      featured: { name: 'Blue Frost OG', slug: 'blue-frost-og' },
    },
  },
  {
    type: 'category',
    label: 'Pre-Rolls',
    category: {
      label: 'Pre-Rolls',
      slug: 'preroll',
      brand: 'Frost Farms',
      formats: [
        { label: 'Singles', slug: 'singles' },
        { label: '3-Packs', slug: '3-packs' },
        { label: '5-Packs', slug: '5-packs' },
        { label: 'Infused', slug: 'infused' },
      ],
      featured: { name: 'Glacier Infused', slug: 'glacier-infused' },
    },
  },
  {
    type: 'category',
    label: 'Vaporizers',
    category: {
      label: 'Vaporizers',
      slug: 'vaporizer',
      brand: 'Glacier Extracts',
      formats: [
        { label: 'Disposables', slug: 'disposables' },
        { label: 'Cartridges', slug: 'cartridges' },
        { label: 'Pods', slug: 'pods' },
        { label: 'Batteries', slug: 'batteries' },
      ],
      featured: { name: 'Glacier Live Resin Cart', slug: 'glacier-live-resin-cart' },
    },
  },
  {
    type: 'category',
    label: 'Concentrates',
    category: {
      label: 'Concentrates',
      slug: 'concentrate',
      brand: 'Glacier Extracts',
      formats: [
        { label: 'Live Resin', slug: 'live-resin' },
        { label: 'Rosin', slug: 'rosin' },
        { label: 'Shatter', slug: 'shatter' },
        { label: 'Wax', slug: 'wax' },
        { label: 'Badder', slug: 'badder' },
      ],
      featured: { name: 'Northern Lights Rosin', slug: 'northern-lights-rosin' },
    },
  },
  {
    type: 'category',
    label: 'Edibles',
    category: {
      label: 'Edibles',
      slug: 'edible',
      brand: 'Northern Lights Co.',
      formats: [
        { label: 'Gummies', slug: 'gummies' },
        { label: 'Chocolates', slug: 'chocolates' },
        { label: 'Baked Goods', slug: 'baked-goods' },
        { label: 'Mints', slug: 'mints' },
      ],
      featured: { name: 'Frost Bite Gummies', slug: 'frost-bite-gummies' },
    },
  },
  {
    type: 'category',
    label: 'Beverages',
    category: {
      label: 'Beverages',
      slug: 'beverage',
      brand: 'Northern Lights Co.',
      formats: [
        { label: 'Sparkling', slug: 'sparkling' },
        { label: 'Teas', slug: 'teas' },
        { label: 'Shots', slug: 'shots' },
        { label: 'Mixers', slug: 'mixers' },
      ],
      featured: { name: 'Frost Sparkling Citrus', slug: 'frost-sparkling-citrus' },
    },
  },
  {
    type: 'dropdown',
    label: 'Strains',
    columns: [
      {
        heading: 'By Type',
        links: [
          { label: 'Indica', href: '/strains?type=indica' },
          { label: 'Sativa', href: '/strains?type=sativa' },
          { label: 'Hybrid', href: '/strains?type=hybrid' },
        ],
      },
      {
        heading: 'By Effect',
        links: [
          { label: 'Relaxing', href: '/strains?effect=relaxing' },
          { label: 'Energizing', href: '/strains?effect=energizing' },
          { label: 'Creative', href: '/strains?effect=creative' },
          { label: 'Pain Relief', href: '/strains?effect=pain-relief' },
          { label: 'Sleep', href: '/strains?effect=sleep' },
        ],
      },
      {
        heading: 'Popular Strains',
        links: [
          { label: 'Blue Frost', href: '/strains/blue-frost' },
          { label: 'Northern Haze', href: '/strains/northern-haze' },
          { label: 'Glacier Kush', href: '/strains/glacier-kush' },
          { label: 'Browse All Strains', href: '/strains' },
        ],
      },
    ],
  },
  {
    type: 'link',
    label: 'Find Near You',
    href: '/find',
  },
  {
    type: 'dropdown',
    label: 'Resources',
    columns: [
      {
        heading: 'Learn',
        links: [
          { label: 'Blog / Journal', href: '/blog' },
          { label: 'FAQ', href: '/faq' },
        ],
      },
      {
        heading: 'Connect',
        links: [
          { label: 'Newsletter Signup', href: '/newsletter' },
          { label: 'Contact Us', href: '/contact' },
        ],
      },
    ],
  },
  {
    type: 'cta',
    label: 'Wholesale',
    href: '/wholesale',
  },
];
```

**Step 2: Commit**

```bash
git add apps/website/src/lib/constants.ts
git commit -m "feat: add mega menu data structure to website constants"
```

---

### Task 3: Build the MegaMenu Component

**Files:**
- Create: `apps/website/src/components/layout/MegaMenu.tsx`

**Step 1: Create the MegaMenu component**

Build a `MegaMenu` component using Radix `NavigationMenu` that:
- Renders top-level triggers from `MEGA_MENU` data
- For `type: 'category'`: 3-column dropdown (By Type, By Format, Brand+Featured)
- For `type: 'dropdown'`: multi-column dropdown from `columns` data
- For `type: 'link'`: plain `NavigationMenu.Link` (no dropdown)
- For `type: 'cta'`: styled button link
- Uses `NavigationMenu.Viewport` for animated panel transitions
- Styling: `bg-base/95 backdrop-blur-md border-b border-border-default` on panels
- Text: uppercase 13px tracking-wide to match existing nav style
- Hover accent: `text-accent-primary` (#5BB8E6)
- Hidden on mobile (`hidden lg:flex`)

Key sub-components within the file:
- `CategoryPanel` — renders the 3-column product category dropdown
- `ColumnsPanel` — renders multi-column dropdown for Strains/Resources

**Step 2: Commit**

```bash
git add apps/website/src/components/layout/MegaMenu.tsx
git commit -m "feat: build MegaMenu component with Radix NavigationMenu"
```

---

### Task 4: Integrate MegaMenu into Header

**Files:**
- Modify: `apps/website/src/components/layout/Header.tsx`

**Step 1: Replace the flat nav with MegaMenu**

- Import `MegaMenu` component
- Replace the `<nav>` block (lines 49-65) with `<MegaMenu isScrolled={isScrolled} />`
- Keep the logo, mobile hamburger, and scroll detection logic
- Remove the desktop "Find Near You" CTA button (it's now in the mega menu)
- Keep mobile hamburger button as-is

**Step 2: Verify the build**

Run: `cd apps/website && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add apps/website/src/components/layout/Header.tsx
git commit -m "feat: integrate MegaMenu into website header"
```

---

### Task 5: Update MobileMenu with Accordion Structure

**Files:**
- Modify: `apps/website/src/components/layout/MobileMenu.tsx`

**Step 1: Update MobileMenu to use MEGA_MENU data**

- Import `MEGA_MENU` and `STRAIN_TYPES` from constants
- Replace flat link list with accordion sections:
  - Product categories: tap to expand, show type/format links
  - Strains: tap to expand, show type/effect links
  - Resources: tap to expand, show Blog/FAQ/Newsletter/Contact
  - Find Near You: direct link
  - Wholesale: CTA button at bottom
- Use `useState` for tracking which section is expanded
- Keep existing animation, escape-to-close, body scroll lock

**Step 2: Verify the build**

Run: `cd apps/website && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add apps/website/src/components/layout/MobileMenu.tsx
git commit -m "feat: update MobileMenu with accordion mega menu structure"
```

---

### Task 6: Create Newsletter Page (stub)

**Files:**
- Create: `apps/website/src/app/(site)/newsletter/page.tsx`

**Step 1: Create a newsletter signup stub page**

Simple page with:
- Hero section with heading "Stay Frosty"
- Subtext about getting product drops, strain spotlights, and dispensary updates
- Email input + subscribe button (form UI only, no backend)
- Matches existing page patterns (dark bg, Frost blue accent)

**Step 2: Commit**

```bash
git add apps/website/src/app/(site)/newsletter/page.tsx
git commit -m "feat: add newsletter signup stub page"
```

---

### Task 7: Final Build + Lint + Push

**Step 1: Full build**

Run: `cd apps/website && npx next build`
Expected: Build succeeds with zero errors

**Step 2: Lint**

Run: `cd apps/website && npx next lint`
Expected: No errors

**Step 3: Commit any remaining changes and push**

```bash
git add -A
git push origin main
git push origin main:claude/research-claude-md-jau3A
```
