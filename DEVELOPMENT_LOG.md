# Frost Development Log

> Reverse-chronological record of all development work. Updated after every completed task.
> Use this to trace what changed, when, and why — especially useful for debugging bad deploys.

---

## 2026-03-09 — Territory Map + CRM Coordinates (uncommitted)

**App:** app, website, shared
**Changes:**
- Added FrostMap shared component with Mapbox GL integration
- Updated CRM territory panel with real WA dispensary coordinates
- Added WashingtonMap with SVG county boundaries and pin markers
- Added lat/lng fields to dispensary types in @frost/types
- Updated website dispensary mocks with real coordinates
- Website: MegaMenu expansion, Header CTA updates, order store enhancements
- Website: Blog page cleanup, category page refinements, strain page updates

**Key files:**
- `apps/app/src/components/FrostMap.tsx` (new)
- `apps/app/src/lib/map-config.ts` (new)
- `apps/app/src/modules/crm/components/accounts/territory/WashingtonMap.tsx`
- `apps/app/src/modules/crm/components/accounts/TerritoryMap.tsx`
- `packages/types/src/dispensary.ts`
- `apps/website/src/components/layout/MegaMenu.tsx`
- `apps/website/src/components/layout/Header.tsx`

**Commit:** uncommitted

---

## 2026-03-09 — Portal Lint Cleanup

**App:** portal
**Changes:**
- Fixed all lint errors and warnings across portal codebase
- Zero errors, zero warnings after cleanup

**Commit:** `c04ce4a`

---

## 2026-03-09 — Portal Payments + Support Modules

**App:** portal
**Changes:**
- Completed all 11 B2B portal modules (payments, support, etc.)
- Full module suite now functional with mock data

**Commit:** `e89d707`

---

## 2026-03-09 — Portal Account Module

**App:** portal
**Changes:**
- Built 5-tab account profile (profile, contacts, COAs, docs, preferences)

**Commit:** `ceb368d`

---

## 2026-03-09 — Unify App Design with Portal

**App:** app, portal
**Changes:**
- Unified design tokens, sidebar, topbar, and nav across app and portal
- Consistent dark theme treatment

**Commit:** `c31d566`

---

## 2026-03-08 — Token Readability Fixes

**App:** app, portal
**Changes:**
- Bumped body font-weight to medium, SectionHeader to semibold
- Bumped card bg opacity, text-muted opacity, restored full-white default text
- Portal design tokens, layout, and login page updates
- Portal PostCSS config + design token refinements

**Commits:** `390236f`, `9753e41`, `89a3e5f`, `6152599`

---

## 2026-03-08 — Portal Scaffold + Lint + Middleware

**App:** portal
**Changes:**
- Lint cleanup, portal ESLint config, middleware to proxy migration
- Full B2B portal scaffold — types, mock data, hooks, components, 11 routes

**Commits:** `81f60d2`, `7ca2603`

---

## 2026-03-08 — Website Product Categories + MegaMenu

**App:** website
**Changes:**
- Built product category pages with ProductTileCard component
- MegaMenu updates for category navigation

**Commit:** `e6522fd`

---

## 2026-03-08 — Permissions, Order Concierge, Website Updates

**App:** app, website
**Changes:**
- User permissions system
- AI order concierge feature
- Website misc updates

**Commit:** `1bb60d0`

---

## 2026-03-08 — Find Near You Map + Store Pages

**App:** website
**Changes:**
- Interactive Find Near You map with store pins
- Individual store pages
- AI order concierge integration

**Commit:** `fc58f5c`
