# Project Starter Kit — Architecture & Workflow Template

**For Claude Chat (QA Supervisor) + Claude Code (Builder)**

**Version:** 1.0 — March 2026

**What this is:** A reusable template for starting any new software project using the Two-Claude System. This document contains everything needed to scaffold a production-ready frontend, establish the engineering workflow, configure Claude Code with skills and memory, and begin building modules. It is project-agnostic — adapt it to whatever you're building.

---

## Table of Contents

- [Part 1: The Two-Claude System (Workflow)](#part-1-the-two-claude-system-workflow)
- [Part 2: Technology Stack](#part-2-technology-stack)
- [Part 3: Project Setup Sequence (Phase 0)](#part-3-project-setup-sequence-phase-0)
- [Part 4: Shared Component Library (Phase 1)](#part-4-shared-component-library-phase-1)
- [Part 5: Module Build Process (Phase 2+)](#part-5-module-build-process-phase-2)
- [Part 6: Data Layer Pattern](#part-6-data-layer-pattern)
- [Part 7: Design System Setup](#part-7-design-system-setup)
- [Part 8: CLAUDE.md Setup Instructions](#part-8-claudemd-setup-instructions)
- [Part 9: Skills Installation](#part-9-skills-installation)
- [Part 10: Branch Strategy & Deployment](#part-10-branch-strategy--deployment)
- [Part 11: Environment & Secrets](#part-11-environment--secrets)
- [Part 12: Backend Architecture (Post-POC)](#part-12-backend-architecture-post-poc)
- [Part 13: Memory & RAG Architecture (For AI Products)](#part-13-memory--rag-architecture-for-ai-products)
- [Part 14: How to Use This Template](#part-14-how-to-use-this-template)

---

## Part 1: The Two-Claude System (Workflow)

This workflow uses two separate Claude instances with distinct roles. Neither can do the other's job. Together they form a complete engineering team.

### Claude Chat — The Brain

Claude Chat is the senior engineering supervisor, architect, QA lead, and strategic thinker. Claude Chat lives in a browser or app conversation (claude.ai or Claude app).

**Claude Chat's responsibilities:**

- Plans architecture and makes all design decisions
- Researches best practices, libraries, and approaches using web search
- Writes detailed briefs for Claude Code (always as a single markdown code block the user can copy-paste)
- Reviews Claude Code's plans before approving execution
- Reviews Claude Code's completed work and does QA
- Maintains the task list and tracks overall project progress
- Never writes or executes code directly — Claude Chat cannot see the codebase

### Claude Code — The Hands

Claude Code lives in the terminal/IDE. It can read the codebase, create files, run commands, and execute plans.

**Claude Code's responsibilities:**

- Receives briefs from Claude Chat (passed by the user via copy-paste)
- ALWAYS presents a detailed plan before executing anything — never builds without approval
- Builds exactly what the brief specifies
- Reports completion in a single markdown code block so the user can copy it back to Claude Chat
- Pushes code to the remote branch
- Cannot search the internet or think strategically — only Claude Chat can do that

### The User — The Bridge

The user is the bridge between Claude Chat and Claude Code:

1. Describe what you want to build to Claude Chat
2. Claude Chat writes a brief
3. Copy-paste the brief to Claude Code
4. Claude Code presents a plan
5. Copy-paste the plan back to Claude Chat for review
6. Claude Chat approves or sends revisions
7. Claude Code builds and reports completion
8. Copy-paste the completion report to Claude Chat for QA
9. Repeat for each module

---

## Part 2: Technology Stack

| Layer | Technology | Hosting | Purpose |
|---|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | Vercel | UI, routing, SSR capability |
| Styling | Tailwind CSS + shadcn/ui | — | Utility-first CSS + accessible component primitives |
| Client State | Zustand | — | UI-only state: sidebar, modals, layout preferences |
| Server State | TanStack Query (React Query) | — | Data fetching, caching, optimistic updates |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable | — | Kanban boards, reorderable lists |
| Charts | Recharts | — | Data visualization |
| Forms | React Hook Form + Zod | — | Form handling with schema validation |
| Icons | lucide-react | — | Consistent icon library |
| Backend | FastAPI + Python 3.12+ | Railway | API, agent orchestration, LLM calls |
| Task Queue | Celery + Redis | Railway | Background jobs, scheduled tasks |
| Database | Supabase (Postgres) | Supabase | Primary database with RLS |
| Auth | Supabase Auth | Supabase | Email/password, OAuth, JWT |
| Realtime | Supabase Realtime | Supabase | Database-change subscriptions |
| File Storage | Supabase Storage | Supabase | Document uploads, images |
| Vector Search | pgvector (in Supabase) | Supabase | Semantic search for RAG/memory |
| LLM Primary | Anthropic (Claude) | — | Complex reasoning, agents |
| LLM Fallback 1 | OpenAI (GPT) | — | Secondary + embeddings |
| LLM Fallback 2 | OpenRouter | — | Tertiary, multi-model access |
| LLM Fallback 3 | Ollama (local) | Railway | Emergency fallback |

---

## Part 3: Project Setup Sequence (Phase 0)

Give these instructions to Claude Code as a single brief. Claude Code should present a plan before executing.

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

**When prompted:** use App Router, use src/ directory, use TypeScript, use Tailwind, use ESLint, do NOT use Turbopack, use default import alias @/.

### Step 2: Install Core Dependencies

```bash
npm install zustand @tanstack/react-query @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities recharts react-hook-form @hookform/resolvers zod lucide-react
npm install -D @types/react-grid-layout
```

### Step 3: Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Configure for dark theme, neutral base color, CSS variables enabled.

### Step 4: Create Directory Structure

```
src/
├── app/                        # Next.js App Router routes
│   ├── (modules)/              # Route group for all module pages
│   │   └── [module-name]/page.tsx
│   ├── layout.tsx              # Root layout with providers + AppShell
│   └── page.tsx                # Root redirect to default module
├── components/                 # Shared component library
├── design/                     # Design tokens (tokens.css), global styles
├── hooks/                      # Shared hooks (useAuth, useTheme, etc.)
├── lib/                        # Utilities, constants, API client, helpers
├── modules/                    # Module-specific code
│   └── [module-name]/
│       ├── components/         # Module UI components
│       ├── hooks/              # Module data hooks
│       ├── types/              # Module TypeScript interfaces
│       ├── store.ts            # Module Zustand store (if needed)
│       └── utils/              # Module helpers
├── mocks/                      # Centralized mock data factories
└── types/                      # Global shared types
```

Each module gets its own folder under `src/modules/` with the same internal structure. Page routes live in `src/app/(modules)/` but all logic lives in `src/modules/`. Pages import from modules.

### Step 5: Create .env.example

```env
# Frontend (safe for browser, prefixed NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_fastapi_backend_url
```

### Step 6: Create Design Tokens

Create `src/design/tokens.css` with CSS custom properties. Wire into Tailwind v4 via `@theme` inline in `globals.css`. Define: backgrounds (base, card, card-hover), borders, text colors (default, muted, bright), accent color, brand gradient, semantic colors (success, warning, danger, info). See [Part 7](#part-7-design-system-setup) for a starter set.

### Step 7: Build AppShell

Build `src/components/AppShell/` with:

- **Collapsible sidebar:** module navigation links with lucide icons and labels. Active route highlighted. Collapse toggle (full → icons-only). Mobile: slide-out overlay with hamburger trigger.
- **Top bar:** current page name, placeholder avatar/notifications area.
- **Content area:** renders routed page content, independently scrollable, padded (`p-6` desktop, `p-4` mobile).
- Wrap in TanStack `QueryClientProvider` in the root layout.

### Step 8: Create Placeholder Routes

Create a `page.tsx` for every module route in `src/app/(modules)/`. Each placeholder renders a simple "Module Name — Coming soon" message. Root `page.tsx` redirects to the default module.

### Step 9: Deploy to Vercel

Push to remote. Connect repo to Vercel. Set the production branch in Vercel settings to match whatever branch Claude Code pushes to. Verify the empty shell deploys and sidebar navigation works at the live URL.

---

## Part 4: Shared Component Library (Phase 1)

Build these BEFORE any module work. All modules import from these. Export from `src/components/index.ts` barrel file.

| Component | Purpose |
|---|---|
| **SectionHeader** | Module page header: icon, title, subtitle, accent color, stat badges, actions slot. Responsive. |
| **StatusBadge** | Colored pill badge with variants (default/success/warning/danger/info/muted), sizes (sm/md), optional pulse animation and dot indicator. |
| **LoadingSkeleton** | Skeleton loader with variants (card/list/table/chart/text/avatar). Configurable count. Animated shimmer/pulse. |
| **EmptyState** | Centered empty state: icon, title, description, optional CTA button and accent color. Welcoming, not error-like. |
| **SearchOverlay** | Full-screen search modal: auto-focused input, keyboard navigation (arrows/Enter/Escape), results grouped by category, loading state. |
| **DrawerPanel** | Slide-from-right detail panel: 3 widths (sm/md/lg), dark overlay, focus trap, Escape to close, sticky footer for action buttons. Full-width on mobile. |
| **ConfirmationDialog** | Modal for destructive/important actions: 3 variants (danger/warning/info), loading spinner on confirm, focus trap. |
| **DataTable** | Generic typed sortable/filterable/paginated table: column definitions, search, row click, loading/empty states, horizontal scroll on mobile. |
| **ChartWrapper** | Recharts wrapper: consistent dark theme styling, optional title/subtitle, loading/empty states. Exports `CHART_THEME` constant with colors. |
| **KanbanBase** | Shared drag-and-drop infrastructure using @dnd-kit: Board, Column, Card components. Extensible KanbanItem type. Horizontal scroll. Reused by any module with a Kanban view. |

---

## Part 5: Module Build Process (Phase 2+)

For each module, follow this exact process:

### Brief Structure

Every module brief sent to Claude Code should contain:

1. **Module metadata** — name, accent color, route, tagline
2. **TypeScript types** — all interfaces for this module's data
3. **Mock data** — factory functions with deeply realistic data (not "Test Item 1")
4. **Data hooks** — TanStack Query wrappers around mock data with simulated delays
5. **Components** — every component with detailed description of layout, behavior, states
6. **Main page** — how the page is assembled from components, layout structure, responsive behavior
7. **Responsive breakpoints** — desktop (1200+), tablet (768-1199), mobile (below 768)
8. **Animations** — specific micro-interactions and transitions
9. **Final checks** — npm run build, lint, tsc, visual verification requirements

### Brief Rules

- Always tell Claude Code to apply the `frontend-design` skill for visual quality
- Always specify the design tokens to use (don't let Claude Code pick its own colors)
- Always include realistic mock data examples — describe a coherent persona
- Always require a plan before execution
- Always require completion report as a single markdown code block
- Always require build/lint/typecheck passing with zero errors

---

## Part 6: Data Layer Pattern

Every component accesses data through custom hooks. Hooks are the abstraction boundary between UI and data source. **This is the single most important architectural decision.**

### POC Phase (Mock Data)

```typescript
// src/modules/[module]/hooks/useModuleData.ts
import { useQuery } from '@tanstack/react-query';
import { generateMockData } from '@/mocks/[module]';

export function useModuleData(id: string) {
  return useQuery({
    queryKey: ['module', 'data', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network
      return generateMockData(id);
    },
  });
}
```

### Production Phase (Real API)

```typescript
queryFn: async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/module/${id}`);
  return res.json();
}
```

Components never change. Only the `queryFn` internals change. This makes the mock-to-real transition seamless.

### Mock Data Rules

- All mock data lives in `src/mocks/`, one file per module
- Factory functions generate realistic data matching future API response shapes
- Data must feel like a real person's life — use consistent persona across all modules
- Include edge cases: empty states, overdue items, errored states, delegated items

---

## Part 7: Design System Setup

Starter dark theme tokens. Adapt colors to your project.

```css
/* src/design/tokens.css */
:root {
  --bg-base: #08090F;
  --bg-card: #0F1219;
  --bg-card-hover: #141925;

  --border-default: #1A1F2E;
  --border-hover: #2A3040;

  --accent-primary: #667EEA;
  --accent-gradient: linear-gradient(135deg, #667EEA, #764BA2, #F093FB);

  --text-default: #C8D0E0;
  --text-muted: #6B7A99;
  --text-bright: #FFFFFF;

  --success: #00E5A0;
  --warning: #FBBF24;
  --danger: #FB7185;
  --info: #38BDF8;
}
```

Wire into Tailwind v4 via `@theme` inline in `globals.css` so tokens become utility classes (`bg-base`, `bg-card`, `text-default`, `text-muted`, etc.).

Each module gets its own accent color used for: SectionHeader accent bar, active states, progress indicators, chart colors.

Card styling: `rounded-xl`, `border border-default`, `bg-card`, glassmorphism (`backdrop-blur-xl` with slight transparency on sidebar).

Responsive: desktop-first. 3-col → 2-col → 1-col. Mobile breakpoint at 768px.

---

## Part 8: CLAUDE.md Setup Instructions

**This is critical.** CLAUDE.md is the file Claude Code reads at the start of every session. It gives Claude Code persistent context about your project.

### What Claude Chat Must Do

Before writing the CLAUDE.md, Claude Chat must research current best practices. Claude Chat should search for:

- "Claude Code CLAUDE.md best practices 2026"
- "Writing a good CLAUDE.md HumanLayer"
- "Claude Code best practices Anthropic docs"

### Key Principles

1. **Keep it under 150 lines.** Claude Code can reliably follow ~150-200 instructions total. The Claude Code system prompt already uses ~50. Every line in CLAUDE.md competes for attention. If it's too bloated, Claude ignores your rules.
2. **Only include universally applicable rules.** CLAUDE.md loads every session. Don't put module-specific knowledge here — that goes in skills or subdirectory CLAUDE.md files.
3. **Don't duplicate what a linter does.** Never send an LLM to do a linter's job. Code style rules waste context.
4. **Structure as: WHAT (stack, structure), WHY (purpose), HOW (commands, verification).** Tell Claude what the project is, why things are the way they are, and how to work on it.
5. **Use `.claude/rules/` for additional focused instruction files** (e.g., `git-workflow.md`, `component-patterns.md`). These auto-load with the same priority as CLAUDE.md.
6. **Use subdirectory CLAUDE.md files** for module-specific instructions. These only load when Claude Code is working in that directory.
7. **List installed skills** in CLAUDE.md so Claude Code remembers they exist. Claude Code tends to under-trigger skills unless reminded.

### CLAUDE.md Template

```markdown
# [Project Name] — [One-line description]

## Project
[2-3 sentences: what this is, who it's for, current phase]

## Stack
[Bullet list of key technologies — only what Claude needs to know to work]

## Architecture
[Key architectural rules: where routes live, where module logic lives, where shared components are]

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`

## Workflow Rules
- ALWAYS present a plan before executing. Do not build until approved.
- ALWAYS run build and lint after completing work. Zero errors required.
- Create feature branches per module.
- Format all completion reports as a single markdown code block.
- Use shared components — never recreate StatusBadge, DrawerPanel, DataTable, etc.
- Mock data must feel real. Never "Test Item 1".
- All components fully typed. No `any` in public props.
- All modals/drawers: focus trap, Escape to close, ARIA attributes.

## Skills Available
You have these skills installed. USE THEM when relevant:
- **frontend-design**: Use when building any UI. Bold aesthetic choices. No generic AI slop.
- **ui-ux-pro-max**: Use for design system recommendations per page.
- **interface-design**: Use to enforce design consistency. Audit components against system.
- **superpowers**: Use brainstorm → plan → execute workflow for complex features.
- **GSD**: Use for breaking work into atomic tasks with fresh contexts.

## Do NOT
- Do not install new dependencies without stating why
- Do not refactor code you weren't asked to change
- Do not create tests unless explicitly asked
- Do not put business logic in page.tsx files — import from modules
```

### Additional Rule Files

**`.claude/rules/git-workflow.md`:**

```markdown
# Git Workflow
- Feature branches per module: feature/[module-name]
- Conventional commits (feat:, fix:, chore:)
- Do not merge to main without approval
- Always push after completing work
```

**`.claude/rules/component-patterns.md`:**

```markdown
# Component Patterns
- Import shared components: import { StatusBadge, DrawerPanel } from '@/components'
- Every module page starts with SectionHeader using the module's accent color
- Data hooks use TanStack Query with queryKey arrays and simulated delays
- Loading states use LoadingSkeleton with appropriate variant
- Empty states use EmptyState with module accent color
- All forms use React Hook Form + Zod schema validation
- Responsive: Tailwind breakpoints (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
```

**Module-specific CLAUDE.md files** (created as each module is built):

```markdown
# src/modules/[module-name]/CLAUDE.md
# [Module Name]
Accent color: #XXXXXX
[1-2 sentences about what this module does and key design decisions]
```

---

## Part 9: Skills Installation

**Claude Chat must instruct Claude Code to install these skills.** The user runs these commands directly in Claude Code (they are slash commands, not bash commands):

### Required Skills

#### 1. Anthropic Official Skills (includes frontend-design)

```
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills
```

**frontend-design:** Anthropic's skill for production-grade UI. Forces bold aesthetic choices, unique typography, intentional design. Prevents generic "AI slop." Auto-triggers when building frontend components. Reference it in briefs for best results.

#### 2. UI/UX Pro Max

```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**ui-ux-pro-max:** Design intelligence engine with 50 styles, 21 color palettes, 50 font pairings. Generates design system recommendations per project/page. Has a Python search script for querying its design database. Supports Next.js + shadcn/ui + Tailwind. Best used as a reference for component patterns and spacing — don't let it override your established design tokens.

#### 3. Superpowers

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

**superpowers (14 skills):** Complete development methodology. Includes brainstorming (structured requirements before coding), writing-plans (bite-sized tasks), executing-plans (subagent dispatch with code review), test-driven-development (RED-GREEN-REFACTOR), debugging, root-cause-tracing, and code-reviewer. Best for complex multi-file features. Can be overkill for simple tasks where a detailed brief already exists.

#### 4. Interface Design

```
/plugin marketplace add Dammyjay93/interface-design
```

Then use `/plugin menu` to install interface-design.

**interface-design:** Design consistency enforcement across sessions. Saves design decisions to `.interface-design/system.md`. Commands: `/interface-design:init` (establish direction), `/interface-design:audit` (check code against system), `/interface-design:extract` (pull patterns from existing code). Best used AFTER the first module is built — extract patterns, then enforce on all subsequent modules.

#### 5. GSD (Get Shit Done)

```bash
npx gsd@latest install
```

(Run in regular terminal, not inside Claude Code)

**GSD:** Spec-driven development preventing context rot. Externalizes state into files, breaks work into atomic 2-3 task plans, runs each in a fresh subagent context with clean 200K token window. Best for large multi-phase builds where context degradation is a concern. Commands: `/gsd:create-project`, `/gsd:create-roadmap`, `/gsd:plan-phase`, `/gsd:execute-plan`.

### After Installing

Restart Claude Code so plugins load. Verify with `/plugin` command — all 5 should be listed.

### When to Use Which Skill

| Situation | Skill to Use |
|---|---|
| Building any UI component or page | **frontend-design** (reference in brief) |
| Starting a brand new module's design | **ui-ux-pro-max** (optional, for design recommendations) |
| Enforcing consistency across modules 2+ | **interface-design** (audit and extract) |
| Complex feature needing structured planning | **superpowers** (brainstorm → plan → execute) |
| Long multi-module build session | **GSD** (prevents context rot) |
| Simple module with a detailed brief already written | **None needed** — the brief IS the plan |

---

## Part 10: Branch Strategy & Deployment

### Branches

- **Production branch** — auto-deploys to Vercel on every push. Set this in Vercel project settings.
- **Feature branches** — one per module (`feature/[module-name]`). Created locally by Claude Code.
- If Claude Code's environment restricts branch naming (e.g., requires `claude/` prefix), use refspec to push: `git push origin HEAD:allowed-branch-name`
- No dev or staging branches until team grows.

### Deployment

- **Frontend:** Vercel auto-deploys on push to production branch. Preview deployments on PRs.
- **Backend (future):** Railway auto-deploys on push to main.

### CI Pipeline (GitHub Actions — set up when ready)

- Lint: ESLint + Prettier on every push
- Type check: `tsc --noEmit`
- Tests: Vitest (when written)
- Build: `next build` to catch errors before deploy

---

## Part 11: Environment & Secrets

| Variable | Where | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Public (browser-safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Public (RLS protects data) |
| `NEXT_PUBLIC_API_URL` | Vercel | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Railway only | SECRET — never frontend |
| `ANTHROPIC_API_KEY` | Railway only | SECRET |
| `OPENAI_API_KEY` | Railway only | SECRET |
| `OPENROUTER_API_KEY` | Railway only | SECRET |
| `REDIS_URL` | Railway only | SECRET |
| `SENTRY_DSN` | Both | Error tracking |

`.env.example` checked into git with placeholders. `.env.local` gitignored. LLM API keys and Supabase service role key NEVER touch the frontend.

---

## Part 12: Backend Architecture (Post-POC)

The frontend POC runs entirely on mock data. When ready to connect the backend:

### FastAPI on Railway handles:

- All business logic and API endpoints (REST, `/api/v1/...`)
- Agent orchestration (master router → specialist agents)
- LLM provider calls with automatic fallback chain
- Tool execution (calendar API, email API, web search, etc.)
- Memory retrieval (query Supabase for relevant context)
- Background jobs via Celery workers (long-running agent tasks, scheduled work)
- WebSocket connections for streaming agent chat responses

### Supabase handles:

- Postgres database with Row-Level Security (every table scoped by `auth.uid() = user_id`)
- Auth (sign-up, login, OAuth, JWT tokens passed to FastAPI)
- Realtime subscriptions (frontend subscribes to table changes for live updates)
- Storage (file uploads, document scans, receipt photos)
- pgvector (semantic search embeddings alongside structured data)

### The frontend-to-backend transition:

- Only hook internals change (`queryFn` swaps from mock data to fetch calls)
- Components never change
- Add Supabase Auth to the frontend for login/session management
- Add WebSocket connection for agent chat streaming

### LLM Fallback Chain:

1. **Anthropic (Claude)** — primary
2. **OpenAI (GPT)** — automatic fallback
3. **OpenRouter** — tertiary
4. **Ollama (local)** — emergency

Fallback is automatic and invisible. User sees casual message on delay ("Hang on, let me think..."). Each call logged with cost tracking.

### Error Handling:

- **LLM failures:** automatic fallback with exponential backoff
- **Agent errors:** marked in activity log, user notified casually
- **API timeouts:** long operations use Celery, API returns job ID immediately
- **Frontend:** React error boundaries per module route
- **Graceful degradation:** one module failing doesn't break others

---

## Part 13: Memory & RAG Architecture (For AI Products)

If building an AI agent product, use this three-layer memory system. All layers stored in Supabase Postgres.

### Layer 1: System Identity (Static Context)

Small, curated info loaded into every LLM call as system prompt. User name, communication preferences, core life context, agent behavioral rules. Stored as structured record in Supabase. Updated rarely. Always fits in context window.

### Layer 2: Structured Memory (Queryable Facts)

Postgres tables with standard SQL queries. Contacts, past decisions, commitments, preferences, interaction history.

Key tables: `memories` (fact, category, confidence, source, timestamp), `interactions` (who, what, when, channel, summary, sentiment), `decisions` (question, outcome, reasoning, date), `preferences` (domain, key, value, learned_from).

### Layer 3: Semantic Memory (Vector Search / RAG)

Full transcripts, emails, documents embedded as vectors via pgvector. Searched semantically when user asks questions like "what did John say about pricing."

pgvector in Supabase = no separate vector database needed. Embeddings generated via OpenAI text-embedding-3 or equivalent.

### Intelligence Growth Timeline

- **Days 1-30:** Record everything. Basic fact recall. No pattern recognition yet.
- **Days 30-90:** Periodic synthesis jobs extract patterns from interactions. Higher-confidence memories written back.
- **Days 90-365:** Predictions and proactive suggestions. Knows seasonal patterns, relationship dynamics, work cycles.
- **Years 1-5:** Genuinely irreplaceable knowledge. Relationship arcs, career progression, financial patterns. Memory management: decay stale data, consolidate, reinforce important memories.

---

## Part 14: How to Use This Template

1. **Start a new Claude Chat conversation** (claude.ai or Claude app)
2. **Paste this entire document** as the first message or as a project file
3. **Add this instruction to Claude Chat:**

   > You are the senior engineering supervisor for this project. You follow the Two-Claude System described in this document. You plan, research, review, and direct. You never write code. You write briefs for Claude Code as single markdown code blocks. You review Claude Code's plans and completion reports. You maintain the task list. You are the brain. Claude Code is the hands.

4. **Describe your project:**
   - What it does and who it's for
   - What modules/pages it needs
   - Any specific design preferences (dark theme, light theme, specific aesthetic)
   - Whether this is an AI agent product (if so, the memory architecture applies)

5. **Claude Chat will:**
   - Adapt this architecture to your project
   - Write the Phase 0 scaffold brief
   - Instruct you to have Claude Code set up CLAUDE.md (researching best practices first)
   - Instruct you to have Claude Code install all skills
   - Write module briefs one at a time
   - Review everything Claude Code produces

6. **Build modules one at a time.** Each module follows the cycle: brief → plan → review → build → report → QA → deploy.

7. **After the first module is built,** have Claude Code run `/interface-design:extract` to capture design patterns. These persist across all subsequent modules for consistency.

8. **For long build sessions (5+ modules),** consider using GSD to prevent context rot in Claude Code.

---

*This template gives you the skeleton. Your project gives it a soul. Happy building.*
