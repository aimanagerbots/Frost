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

## Local Development (MANDATORY)
- ALWAYS preview frontend changes locally before pushing — never push blind
- Dev server: `npm run dev` starts all apps (website on port 3001, app on port 3000)
- Hot reload is active — code changes appear in the browser instantly
- Work iteratively: make changes, user reviews in browser at localhost, repeat
- Do NOT push to git until the user approves the local preview
- After a significant chunk of work, ask the user if they'd like to push

## Git and Deployment
- Only push when the user explicitly requests it — aim for ~1 push per day, batch all changes into a single commit
- Work iteratively in local dev, accumulate changes, then push once at the end of the session
- git add -A before every commit to capture ALL files (new, modified, deleted)
- Use conventional commits: feat:, fix:, chore:, style:, refactor:
- Push to main ONLY: git push origin main (single branch, no dual-push)
- Vercel production branch: main (all 3 projects)
- DO NOT push to claude/research-claude-md-jau3A — that branch is retired
- Vercel free tier = 100 deploys/day across ALL projects. Each push triggers 3 deploys (app + website + portal). Budget ~30 pushes/day max.
- Domain: frost-orcin.vercel.app (app), frost-website.vercel.app (website), frost-portal.vercel.app (portal)
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

## Obsidian Vault (Extended Memory) — MANDATORY
- `Frost-Vault/` is an Obsidian vault inside the monorepo — gitignored, not committed
- It extends MEMORY.md with deeper project knowledge, session logs, and architecture decisions
- **Folder structure**: 00-Inbox, 01-Project (Architecture/Modules/Domain/Deployment/Brand), 02-Sessions, 03-Decisions (ADRs), 04-Reference, 05-Templates
- Conventions: YAML frontmatter on every note, `[[wikilinks]]` for cross-references, one topic per note
- MEMORY.md = hot operational facts (needed every session). Vault = depth (read on demand).
- See `.claude/rules/vault-integration.md` for full read/write guidelines

### Session Start (ALWAYS do these)
1. Read `Frost-Vault/CLOCK.md` — know the date, active projects, and last session summary
2. Read the latest file in `Frost-Vault/02-Sessions/` — understand where you left off
3. Read `DEVELOPMENT_LOG.md` — know what was built recently

### Before Any Task (ALWAYS do these)
- Search `Frost-Vault/01-Project/Modules/` for notes related to the module you're working on
- Search `Frost-Vault/03-Decisions/` for ADRs related to the area you're changing
- If the topic has been worked on before, READ the relevant vault notes before starting

### Session End (ALWAYS do these)
1. Create a session log in `Frost-Vault/02-Sessions/` using the Session Log template
2. Update `Frost-Vault/CLOCK.md` with today's date, what was done, and what's next
3. If you made an architectural decision, create an ADR in `Frost-Vault/03-Decisions/`
4. If a module was built or significantly changed, create/update its note in `Frost-Vault/01-Project/Modules/`

### During Work (proactive note-taking)
- When you discover important domain knowledge → add to relevant `01-Project/` note
- When you learn something about a module's quirks or gotchas → update its module note
- When the user shares context about the business → capture in `01-Project/Domain/`
- Do NOT wait until session end to write notes — capture knowledge as you go

## Frontend Design Skill (MANDATORY)
- ALWAYS invoke the `frontend-design` skill before designing or building any frontend file — no exceptions.
- This includes: components, pages, layouts, modals, forms, dashboards, and any file that renders UI.
- Do NOT write frontend code without invoking the skill first.

## Website Password
- Password: `1313` (test site only, set in `.env.local` as `SITE_PASSWORD`)
- Combined with age gate in a single modal (AgeGateModal) — no separate splash page
- Cookie `site-auth` persists for 24 hours after successful entry

## Development Log (MANDATORY)
- **Read `DEVELOPMENT_LOG.md` at the start of every session** — know where the project stands before doing anything
- After completing ANY task, append an entry to `DEVELOPMENT_LOG.md` in the project root
- Entry format: date, app affected, bullet list of changes, key files touched, commit hash (or "uncommitted")
- Newest entries go at the top (reverse-chronological), separated by `---`
- This is a running tally — never delete old entries, only append new ones
- If a commit is made, update the most recent entry's commit hash from "uncommitted" to the actual hash
- Keep entries concise: 2-5 bullets per task, only list key files (not every touched file)
- Also keep `Frost-Vault/01-Project/Development-Log.md` in sync (vault mirror for Obsidian search)

## Plans Archive (MANDATORY)
- **Log EVERY plan to `PLANS_LOG.md`** before executing it — no exceptions
- This includes: implementation plans, redesign proposals, refactoring strategies, architecture changes, and any multi-step approach presented to the user
- Entry format (newest first, separated by `---`):
  ```
  ## YYYY-MM-DD — [Brief Title]
  **Task:** [What the user asked for]
  **Status:** accepted | rejected | modified
  **User Feedback:** [Any notes from the user, or "none"]

  ### Plan
  [The full plan as presented to the user]
  ```
- Log the plan IMMEDIATELY when presenting it (status: pending), then update status after user responds
- If a plan is modified, log the original AND the revised version
- Also keep `Frost-Vault/01-Project/Plans-Log.md` in sync (vault mirror for Obsidian search)
- Never delete old entries — this is a permanent archive

## Do NOT
- Install dependencies without stating why
- Refactor code you weren't asked to change
- Create tests unless explicitly asked
- Put business logic in page.tsx files
- Use any type in public component props
- Design or build any frontend file without first invoking the `frontend-design` skill
