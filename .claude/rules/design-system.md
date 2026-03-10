# Design System

## Tokens & Theme
- Dark theme by default. All colors defined as CSS custom properties in `src/design/tokens.css`.
- Tokens are wired into Tailwind v4 via `@theme` inline in `globals.css` — use utility classes (`bg-base`, `bg-card`, `text-default`, `text-muted`, etc.).
- Never hardcode hex values in components — always reference tokens.
- Each module gets its own accent color used for: SectionHeader accent bar, active states, progress indicators, chart highlights.
- Brand gradient: `linear-gradient(135deg, #5BB8E6, #4A8DB8, #3D7A9E)`

## Card & Container Styling
- Cards: `rounded-xl border border-default bg-card` — consistent across all apps
- Padding scale: `p-3` (sm/tight), `p-5` (md/default), `p-6` (lg/spacious) — use AccentCard `padding` prop
- DataTable: `rounded-xl border border-default bg-card overflow-hidden`
- Hover: `hover:bg-card-hover hover:-translate-y-0.5` for interactive cards

## Status Badges (Unified Style)
- Use `StatusBadge` from `@/components` — never create inline badge markup
- **Domain-aware `status` prop** for pipeline/business statuses — auto-resolves color + label:
  - GREEN (`bg-green-500/15 text-green-400`): delivered, paid, active, complete, approved, ready, accepted, compliant
  - BLUE (`bg-blue-500/15 text-blue-400`): confirmed, shipped, in-transit, scheduled, processing
  - AMBER (`bg-amber-500/15 text-amber-400`): pending, in-production, packaged, preparing, new, review, invoiced
  - RED (`bg-red-500/15 text-red-400`): overdue, cancelled, declined, failed, expired, rejected
  - GRAY (`bg-white/[0.06] text-text-muted`): draft, archived, inactive, fulfilled, rescheduled
- **Semantic `variant` prop** for non-status badges: success, warning, danger, info, muted, default
- Sizes: `xs` (10px), `sm` (12px), `md` (12px tighter — default). Dot always shown for `status` prop.
- Product categories: use `CategoryChip` component (flower, preroll, vaporizer, concentrate, edible, beverage)

## Sidebar Typography
- Nav items: `text-xs font-semibold uppercase tracking-wide` — matches website header nav UX
- Active: `border-l-[3px] border-accent-primary bg-accent-primary/10 text-accent-primary`
- Glassmorphism: `bg-card/80 backdrop-blur-xl`

## Responsive
- Desktop-first. 3-col -> 2-col -> 1-col. Mobile breakpoint at 768px.

## Inline Data Display
- Key-value boxes: use `InlineDataBox` component — `rounded-lg bg-elevated px-3 py-2`
