# Component Patterns
- Import shared components: import { ComponentName } from '@/components'
- Every module page starts with SectionHeader using module accent color
- Data hooks: TanStack Query with queryKey arrays and simulated delays
- Loading states: LoadingSkeleton with appropriate variant
- Empty states: EmptyState with module accent color
- Forms: React Hook Form + Zod schema validation
- Responsive: desktop-first (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
- Cards: rounded-xl, border border-default, bg-card
- Modals/drawers: focus trap, Escape to close, ARIA attributes
