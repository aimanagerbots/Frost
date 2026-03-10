# Component Patterns
- Import shared components: import { ComponentName } from '@/components'
- Every module page starts with SectionHeader using module accent color
- Data hooks: TanStack Query with queryKey arrays and simulated delays
- Loading states: LoadingSkeleton with appropriate variant
- Empty states: EmptyState with module accent color
- Forms: React Hook Form + Zod schema validation
- Responsive: desktop-first (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
- Cards: rounded-xl, border border-default, bg-card, padding via AccentCard `padding` prop (sm/md/lg)
- Modals/drawers: focus trap, Escape to close, ARIA attributes

## Status Display
- Pipeline/business statuses: `<StatusBadge status="delivered" />` — domain-aware, auto-colors + auto-labels
- Semantic badges: `<StatusBadge variant="success" label="Active" />` — for non-pipeline contexts
- Product categories: `<CategoryChip category="flower" />` — colored pill per product type
- Key-value pairs inside cards: `<InlineDataBox label="THC" value="24.5%" />` — rounded elevated box
- NEVER create inline `<span className="rounded-full ...">` badges — always use StatusBadge or CategoryChip
