# Frost — AI-Powered Cannabis Operations Platform

## Project
Single-tenant, multi-user operations platform for a cannabis company. 29 module routes, dark-themed dashboard, role-based access. Currently Phase 0 (scaffold). Frontend only with mock data.

## Stack
- Next.js (App Router) + TypeScript on Vercel
- Tailwind CSS + shadcn/ui (dark theme, CSS variables)
- Zustand (UI state) + TanStack Query (server state)
- @dnd-kit (drag-and-drop), Recharts (charts), React Hook Form + Zod (forms)
- lucide-react (icons)

## Architecture
- Routes: src/app/(modules)/[module]/page.tsx — thin wrappers
- Module logic: src/modules/[module]/ — components/, hooks/, types/, utils/
- Shared components: src/components/ — barrel export from index.ts
- Design tokens: src/design/tokens.css — all colors via CSS variables
- Mock data: src/mocks/ — factory functions, realistic data
- Data hooks: TanStack Query wrappers — components never fetch directly

## Commands
- Dev: npm run dev
- Build: npm run build
- Lint: npm run lint
- Type check: npx tsc --noEmit

## Workflow
- ALWAYS present a plan before making changes
- ALWAYS run build + lint after work — zero errors
- Use shared components from src/components/ — never recreate
- Mock data must feel real — consistent cannabis dispensary personas
- No any in public component props
- No business logic in page.tsx — import from modules

## Key Domain Rules
- Product taxonomy: 6 categories (flower, preroll, vaporizer, concentrate, edible, beverage)
- Readiness states track inventory through pipeline (see docs/OPERATIONS_PIPELINE.md)
- CRM is the gravity well — every customer-facing module writes back to CRM
- Pipeline: Cultivation → Manufacturing → Packaging → Fulfillment → Delivery

## Module Accent Colors
Dashboard #5BB8E6, CRM #F59E0B, Tasks #8B5CF6, Calendar #3B82F6,
Agents #06B6D4, Orders #F59E0B, VMI #EF4444, Content #EC4899,
Competitors #F97316, Cultivation #22C55E, Manufacturing #10B981,
Packaging #84CC16, Inventory #8B5CF6, Fulfillment #14B8A6,
Delivery #0EA5E9, COA #9333EA, Approvals #FBBF24, Council #6366F1,
Memory #8B5CF6, Insights #06B6D4, Projects #7C3AED, Products #DB2777,
Meetings #2563EB, Docs #64748B, Team #0D9488, Finance #059669,
Reports #475569, Settings #94A3B8, System #64748B

## Git and Deployment
- git add -A before every commit to capture ALL files (new, modified, deleted)
- Commit after every completed phase or meaningful chunk of work
- Use conventional commits: feat:, fix:, chore:, style:, refactor:
- ALWAYS push to main after every commit: git push origin main
- ALSO push to Vercel production branch: git push origin main:claude/research-claude-md-jau3A
- Vercel production branch is currently claude/research-claude-md-jau3A (change to main in Vercel Dashboard when ready)
- Domain: frost-orcin.vercel.app
- Never sit on uncommitted work. If you built it, commit and push it.
- Always verify with git status before committing to make sure nothing is left behind

## NotebookLM Integration
- Skill installed at ~/.claude/skills/notebooklm/
- All scripts run via: python scripts/run.py [script] (from the skill directory)
- Proactively query NotebookLM when:
  - Building compliance-related modules (COA, Approvals) → query frost-compliance notebook
  - Generating mock data that needs cannabis domain accuracy → query frost-domain notebook
  - Unsure about architecture patterns or design tokens → query frost-architecture notebook
  - Working on Competitors module → query frost-competitors notebook
- Do NOT burn context window re-reading project docs if a notebook covers the topic
- Each question is stateless (new browser session) — include full context in every query
- Rate limit: 50 queries/day on free tier — be strategic, batch related questions
- If not authenticated, tell the user a browser window will open for Google login

## Do NOT
- Install dependencies without stating why
- Refactor code you weren't asked to change
- Create tests unless explicitly asked
- Put business logic in page.tsx files
- Use any type in public component props
