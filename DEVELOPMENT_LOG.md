# Frost Development Log

> Reverse-chronological record of ALL development work since project inception.
> Updated after every completed task. Read at the start of every session.
> Use this to trace what changed, when, and why — especially for debugging bad deploys.

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

**Key files:** `apps/app/src/components/FrostMap.tsx`, `apps/app/src/lib/map-config.ts`, `packages/types/src/dispensary.ts`, `apps/website/src/components/layout/MegaMenu.tsx`
**Commit:** uncommitted

---

## 2026-03-09 — Portal Lint Cleanup

**App:** portal
**Changes:**
- Fixed all lint errors and warnings across portal codebase
- Zero errors, zero warnings after cleanup

**Commit:** `c04ce4a`

---

## 2026-03-09 — Portal Payments + Support — All 11 Modules Complete

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

## 2026-03-09 — Unify App + Portal Design

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

**App:** portal, app
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
- Hero image cache busting

**Commits:** `fc58f5c`, `2ff44c4`

---

## 2026-03-08 — Website Hero + Footer Polish

**App:** website
**Changes:**
- Footer Frost logo size increase
- 9:16 mobile hero image with art direction for responsive hero
- Relative positioning fix for Next.js fill images
- Responsive hero aspect ratio for mobile (3:4 → 16:10 → full viewport)
- Replaced snowflake icon with full wordmark logo in mobile sidebar

**Commits:** `e35a65f`, `adadb54`, `76f2ac4`, `63973bd`, `e5113d0`

---

## 2026-03-08 — Global UI Standardization

**App:** app
**Changes:**
- Configurable card accents, module tabs, hover intensity
- Appearance settings module

**Commit:** `8a6f163`

---

## 2026-03-08 — Website Theme + Strain Art

**App:** website
**Changes:**
- Inline Tailwind theme colors wired into strain cards
- Header bg and home page spacer for fixed header

**Commits:** `3cf8f6c`, `77b8c4e`

---

## 2026-03-08 — 90 Strain Art Images + Data Rewrite

**App:** website
**Changes:**
- Added all 90 real strain art images
- Rewrote strain data to match real strains
- Vercel redeploy trigger for images

**Commits:** `a2eb43b`, `2c22ef9`

---

## 2026-03-08 — Website Header + Hero Fixes (multiple iterations)

**App:** website
**Changes:**
- Hero margin adjusted for smaller snowflake header (96px)
- Snowflake logo in header, bigger wordmark in footer
- Solid black header with border, no scroll-based toggle
- Hero uses h-screen with header overlay
- Resources dropdown single-column, positioned under trigger
- Hero image sizing — clear fixed header, no overflow
- Enforce immediate commit+push rule in CLAUDE.md

**Commits:** `24b821a`, `125b7f5`, `9948750`, `9f9f3ca`, `58ac259`, `916e00a`, `4547e52`, `ef24497`

---

## 2026-03-08 — Website Homepage Rebuild

**App:** website
**Changes:**
- Rebuilt homepage with 11-section layout
- Replaced footer text logo with wordmark image, removed unapproved copy
- Replaced website hero with custom Frosty Nugs image

**Commits:** `cbad9e5`, `11d6b96`, `485094e`

---

## 2026-03-07 — Website Info Pages + Navigation

**App:** website
**Changes:**
- Standalone maintenance page
- Interactive FAQ, Contact, Store Locator pages
- Consolidated mega menu into Shop dropdown
- Terms of Service, Privacy Policy, Compliance pages
- Product Finder, Dispensary Registration, Wholesale pages
- Mega menu navigation added

**Commits:** `371702a`, `613a838`, `2bcab97`, `2eed510`, `15b2fce`, `25615d7`

---

## 2026-03-07 — Dark Theme Unification + Fonts

**App:** app, website
**Changes:**
- All fonts replaced with Sora, Inter, Space Grotesk
- All white bold text, massive logo across entire app
- Pure black UI, massive logo, white sidebar text, blue active glow
- Made website header logo larger
- Blue CTA button on website hero, wordmark logo in app topbar
- Unified color theme across all apps to match login page

**Commits:** `d79cde0`, `fb584be`, `329a332`, `05a5ca0`, `93be8ac`, `7f8e22f`

---

## 2026-03-07 — Website Logos + Vercel Config

**App:** website
**Changes:**
- Added Frost logos to website header and age gate modal
- Vercel redeploy trigger with correct build settings

**Commits:** `ab741e4`, `cb98163`

---

## 2026-03-07 — FastAPI Backend + Supabase Schema

**App:** api, shared
**Changes:**
- FastAPI backend with auth, CRM, products endpoints
- Supabase schema with 3 SQL migrations
- Research data files added

**Commits:** `28fe91e`, `0fc5db3`, `7cd1c4b`, `f9742d2`, `7e61265`

---

## 2026-03-07 — Replace #667EEA with Snowflake Blue

**App:** app, website
**Changes:**
- Replaced all hardcoded #667EEA with #5BB8E6 snowflake blue
- Vercel deployment trigger

**Commits:** `df41c66`, `6bb57bf`

---

## 2026-03-07 — Growly Dashboard + Unified Theme

**App:** app
**Changes:**
- Growly-inspired mobile team dashboard with ring chart, compliance tracking
- Unified dark theme + snowflake blue accent across all apps

**Commits:** `d1f50a8`, `f72bbf4`

---

## 2026-03-07 — Monorepo Restructure

**App:** all
**Changes:**
- Renamed apps/portal → apps/app, created empty portal placeholder
- Restructured for Turborepo monorepo with proper app separation

**Commit:** `01cf553`

---

## 2026-03-07 — Marketing Modules Enrichment

**App:** app
**Changes:**
- SEO/Blog, Events, Paid Ads, Merchandise enrichment
- Content Creator, Content Calendar, Social Media, Email Marketing enrichment

**Commits:** `94a360f`, `3d36a2e`

---

## 2026-03-07 — Auth Pages + Vercel Config

**App:** portal, website
**Changes:**
- Portal login/signup redesign + website password gate
- Per-app vercel.json for correct Turborepo builds
- Vercel.json configured for monorepo deployment

**Commits:** `9d6f376`, `2fc843a`, `0a6eece`

---

## 2026-03-07 — Pipeline + Manufacturing + Orders/Fulfillment/Delivery

**App:** app
**Changes:**
- Pipeline module — A/I/R system with 15-cell matrix, velocity metrics
- Manufacturing module rebuild — 5-tab production command center
- Orders + Fulfillment + Delivery pipeline enrichment pass

**Commits:** `dbabcca`, `06d5afb`, `da28731`

---

## 2026-03-07 — Inventory + Cultivation + Team Chat Rebuild

**App:** app
**Changes:**
- Inventory module rebuild — 5-tab structure with COA Manager integration
- Cultivation module rebuild — unified Environment dashboard, Tasks kanban
- Team Chat tab — channels, DMs, ES/EN auto-translation

**Commits:** `8971eb9`, `37bcc39`, `c4a71bf`

---

## 2026-03-07 — Website Foundation Build

**App:** website
**Changes:**
- Home, about, and blog pages — full editorial build
- Strain pages — library with filters + detail with terpene bars
- Product pages — categories grid, category detail, product detail
- Global layout — Header, Footer, MobileMenu, AgeGate wired in
- Mock data — 20 strains, 42 products, 20 dispensaries, 10 blog posts
- Design system, config, 17 component shells

**Commits:** `ea046a7`, `7dbd5d1`, `54d5dda`, `0af2c78`, `46b01a3`, `fbcb37e`

---

## 2026-03-07 — V3 Final Integration Polish

**App:** app
**Changes:**
- Suspense boundaries, lint fixes, type fixes across all modules
- Cross-module navigation linking
- Orphan route cleanup — added Products & R&D to nav
- COA Manager folded into Inventory as tab + non-cannabis materials + alerts
- Workspace Email — AI-powered inbox with CRM integration, 30 emails
- Chat module — cross-module AI assistant with 5 demo conversations

**Commits:** `ab24e82`, `87db5d9`, `99656ec`, `813a26a`, `6457087`, `41eaeb6`

---

## 2026-03-07 — Turborepo Monorepo Conversion

**App:** all
**Changes:**
- Converted to Turborepo monorepo — apps/portal (41 modules), packages/tokens, packages/types, packages/ui
- Login page, cultivation rebuild, finance, marketing builds included

**Commit:** `f7f8e3f`

---

## 2026-03-07 — V3 Phase 2: New Modules + Module Rebuilds

**App:** app
**Changes:**
- V3 Finance Dashboard + Accounts Receivable + Accounts Payable
- V3 Cultivation module rebuild — dashboard, rooms, calendar, supplies, genetics, AI chat
- V3 Marketing — SEO/Blog, Events, Paid Ads, Merchandise
- V3 Budget & Planning + Labor & Payroll modules
- V3 sidebar restructure to 41 modules

**Commits:** `d5b4c1d`, `0ef6e1f`, `e0c9905`, `c6043e3`, `78c27d7`

---

## 2026-03-07 — Bug Fixes + Polish Pass

**App:** app
**Changes:**
- Error and empty state handling added to all page components
- VMI daily emails hook + CRM pipeline types fix
- Responsive column hiding for CRM Payments and Deliveries
- Cross-module mock data consistency
- Responsive design improvements across all modules
- Global chart styling consistency

**Commits:** `63d37cb`, `08fc0a5`, `dad204f`, `e461c86`, `8e3f606`, `8e1f8f8`

---

## 2026-03-07 — Agent Hub, Approvals, Council, Insights, Memory

**App:** app
**Changes:**
- Built Agent Hub, Approvals, Council, Insights, Memory modules
- CRM wiring for cross-module integration

**Commit:** `0f14ec1`

---

## 2026-03-07 — Text Contrast + Light/Dark Mode

**App:** app
**Changes:**
- Improved text contrast for readability
- Added light/dark mode toggle
- Redesigned header with snowflake logo
- Replaced bare text-muted/text-bright/text-default with correct token classes

**Commits:** `8ad95a1`, `177c1a3`

---

## 2026-03-06 — Initial Build: Scaffold + CRM + All Modules

**App:** app
**Changes:**
- Project configuration (CLAUDE.md, .claude/rules/)
- Initial Next.js project scaffold with AppShell and 29 module routes
- CRM Build 1-6: navigation shell, dashboard, hooks, types, mock data, account detail tabs, outreach, AI copilot, territory map, segments, intelligence, tools
- Platform Dashboard + Tasks module
- Orders + Inventory modules
- Fulfillment + Delivery + COA Manager modules
- Calendar, Competitors, Content, Cultivation, Docs, Finance, Meetings, Products, Projects, Reports, Settings, System, Team, VMI modules
- CRM Sales tab + type fixes
- Shared components: ConfirmationDialog, SearchOverlay, CommandPalette
- Chart text contrast fix for dark background
- Vercel config with productionBranch=main, framework=nextjs fix

**Commits:** `7522b02` → `b975c23` (18 commits)
