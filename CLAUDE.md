# Frost — AI-Powered Assistant with Open Integration Layer & Long-Term RAG Memory

## Project
Frost is an AI-powered personal assistant with a massive open integration layer and a RAG memory system designed to capture and retain user data for years without corruption. Currently in POC phase — frontend runs entirely on mock data. Backend (FastAPI) and Supabase integration come after the frontend POC is validated.

## Stack
- Next.js (App Router) + TypeScript — frontend, hosted on Vercel
- Tailwind CSS + shadcn/ui — styling and component primitives
- Zustand — client-only UI state (sidebar, modals, layout)
- TanStack Query — server state, data fetching, caching
- @dnd-kit — drag-and-drop (Kanban boards, reorderable lists)
- Recharts — data visualization
- React Hook Form + Zod — forms with schema validation
- lucide-react — icons
- Supabase — database, auth, realtime, storage, pgvector (future)
- FastAPI + Python — backend API, agent orchestration (future)

## Architecture
- Routes: `src/app/(modules)/[module-name]/page.tsx` — thin wrappers, no business logic
- Module logic: `src/modules/[module-name]/` with `components/`, `hooks/`, `types/`, `store.ts`, `utils/`
- Shared components: `src/components/` — barrel export from `index.ts`
- Design tokens: `src/design/tokens.css` — all colors via CSS custom properties
- Mock data: `src/mocks/` — one file per module, factory functions with realistic data
- Global types: `src/types/`
- Hooks: `src/hooks/` — shared hooks (useAuth, useTheme, etc.)
- Utilities: `src/lib/` — API client, constants, helpers

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`

## Workflow Rules
- ALWAYS present a detailed plan before executing. Do not build until approved.
- ALWAYS run `npm run build` and `npm run lint` after completing work. Zero errors required.
- Format all completion reports as a single markdown code block.
- Use shared components from `src/components/` — never recreate StatusBadge, DrawerPanel, DataTable, etc.
- Mock data must feel like a real person's life. Never "Test Item 1" or "Lorem ipsum".
- All components fully typed. No `any` in public-facing props.
- All modals/drawers: focus trap, Escape to close, ARIA attributes.
- Do not install new dependencies without stating why.
- Do not refactor code you weren't asked to change.
- Do not create tests unless explicitly asked.
- Do not put business logic in `page.tsx` files — import from modules.
- Do not override design tokens with hardcoded colors — use CSS custom properties.

## Data Layer
All data access goes through TanStack Query hooks in `src/modules/[module]/hooks/`.
- POC phase: hooks return mock data with simulated delays (`setTimeout`)
- Production: only the `queryFn` internals change — components never change
- This is the single most important architectural decision. Never bypass it.

## Memory Architecture (Three Layers)
1. **System Identity** — static user context loaded into every LLM call
2. **Structured Memory** — Postgres tables (memories, interactions, decisions, preferences)
3. **Semantic Memory** — pgvector embeddings for RAG retrieval of transcripts/documents

## Skills Installed
You have 5 skill packages installed. Check `.claude/rules/skills.md` for full details and when to use each.
- **frontend-design** — ALWAYS use when building UI. Bold choices, no generic output.
- **ui-ux-pro-max** — Design recommendations for new modules.
- **superpowers** — Structured brainstorm → plan → execute for complex features.
- **interface-design** — Extract patterns after module 1, audit all subsequent modules.
- **GSD** — Prevents context rot in long multi-module sessions.

When in doubt: `frontend-design` is the default for any visual work. The others are situational.
