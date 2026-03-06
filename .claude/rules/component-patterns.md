# Component Patterns

- Import shared components: `import { StatusBadge, DrawerPanel } from '@/components'`
- Every module page starts with `SectionHeader` using the module's accent color
- Data hooks use TanStack Query with descriptive `queryKey` arrays and simulated delays
- Loading states: use `LoadingSkeleton` with appropriate variant (card/list/table/chart/text/avatar)
- Empty states: use `EmptyState` with module accent color — welcoming tone, not error-like
- Forms: React Hook Form + Zod schema validation — always
- Responsive: desktop-first with Tailwind breakpoints (`lg:grid-cols-3 md:grid-cols-2 grid-cols-1`)
- Card styling: `rounded-xl border border-default bg-card` — see `src/design/tokens.css` for values
- Sidebar: glassmorphism (backdrop-blur-xl with slight transparency)
- Each module gets its own accent color for SectionHeader, active states, progress indicators, charts
