# Frost — Project Structure

**Current state:** Pre-scaffold (no `create-next-app` yet). Claude Code tooling and brand assets are in place. The `src/` and `public/` directories will be created during Phase 0 scaffold.

---

## Current Structure (Pre-Scaffold)

```
Frost/
├── CLAUDE.md                          # Claude Code instructions (loaded every session)
├── assets/
│   └── brand/
│       ├── FrostLogo_SnowflakeOnly.png   # Snowflake icon mark
│       ├── FrostLogo_wordmark.png        # Full wordmark logo
│       └── FrostLogo_wordmark.ai         # Illustrator source file
├── docs/
│   ├── project-starter-kit.md            # Master architecture & workflow template
│   ├── claude-code-skills-reference.md   # Comprehensive skills catalog
│   └── project-structure.md             # This file
└── .claude/                              # Claude Code configuration
    ├── settings.json                     # Enabled plugins, hooks, statusline
    ├── rules/                            # Auto-loaded instruction files
    │   ├── component-patterns.md         # Shared component usage rules
    │   ├── design-system.md              # Design tokens & theming rules
    │   ├── git-workflow.md               # Branch strategy & commit conventions
    │   ├── module-template.md            # Template for per-module CLAUDE.md files
    │   └── skills.md                     # Installed skills reference & when to use each
    ├── agents/                           # GSD subagent definitions (12 agents)
    ├── commands/gsd/                     # GSD slash commands (30+)
    ├── hooks/                            # Session hooks (GSD context monitor, statusline)
    └── get-shit-done/                    # GSD runtime (templates, workflows, references)
```

---

## Post-Scaffold Structure (After Phase 0)

Once `create-next-app` runs, the project expands to:

```
Frost/
├── CLAUDE.md
├── assets/
│   └── brand/                            # Source/design files (.ai) stay here
│       └── FrostLogo_wordmark.ai
├── docs/
│   ├── project-starter-kit.md
│   ├── claude-code-skills-reference.md
│   └── project-structure.md
├── public/
│   └── brand/                            # Web-served logos (PNG, SVG)
│       ├── FrostLogo_SnowflakeOnly.png
│       └── FrostLogo_wordmark.png
├── src/
│   ├── app/                              # Next.js App Router routes
│   │   ├── layout.tsx                    # Root layout (providers + AppShell)
│   │   ├── page.tsx                      # Root redirect to default module
│   │   └── (modules)/                    # Route group for all module pages
│   │       └── [module-name]/
│   │           └── page.tsx              # Thin wrapper — imports from src/modules/
│   ├── components/                       # Shared component library
│   │   ├── index.ts                      # Barrel export
│   │   ├── AppShell/                     # Sidebar + topbar + content area
│   │   ├── SectionHeader.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── SearchOverlay.tsx
│   │   ├── DrawerPanel.tsx
│   │   ├── ConfirmationDialog.tsx
│   │   ├── DataTable.tsx
│   │   ├── ChartWrapper.tsx
│   │   └── KanbanBase/
│   ├── design/
│   │   └── tokens.css                    # CSS custom properties (all colors)
│   ├── hooks/                            # Shared hooks (useAuth, useTheme, etc.)
│   ├── lib/                              # Utilities, constants, API client, helpers
│   ├── modules/                          # Module-specific code
│   │   └── [module-name]/
│   │       ├── CLAUDE.md                 # Module-specific instructions (auto-loaded)
│   │       ├── components/               # Module UI components
│   │       ├── hooks/                    # TanStack Query data hooks
│   │       ├── types/                    # Module TypeScript interfaces
│   │       ├── store.ts                  # Zustand store (if needed)
│   │       └── utils/                    # Module helpers
│   ├── mocks/                            # Mock data factories (one file per module)
│   └── types/                            # Global shared types
├── .claude/                              # (same as pre-scaffold)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.example
```

---

## Key Conventions

| Concept | Location | Rule |
|---|---|---|
| Page routes | `src/app/(modules)/` | Thin wrappers only — no business logic |
| Module logic | `src/modules/[name]/` | All components, hooks, types, state |
| Shared components | `src/components/` | Barrel export from `index.ts` |
| Design tokens | `src/design/tokens.css` | All colors as CSS custom properties — never hardcode hex |
| Data access | `src/modules/[name]/hooks/` | TanStack Query hooks — the abstraction boundary |
| Mock data | `src/mocks/` | Factory functions, realistic data, one file per module |
| Brand assets (web) | `public/brand/` | Served at `/brand/filename.png` |
| Brand assets (source) | `assets/brand/` | .ai files, not web-served |
| Claude Code config | `.claude/` | Rules, skills, GSD, hooks |
| Documentation | `docs/` | Architecture templates, skills reference |

---

## Installed Skills (Claude Code)

All installed and active via `.claude/settings.json`:

| Skill | Purpose |
|---|---|
| frontend-design | Production-grade UI, prevents generic output |
| ui-ux-pro-max | Design system recommendations |
| superpowers (14 skills) | Brainstorm → plan → execute methodology |
| interface-design | Design consistency across modules |
| GSD (30+ commands) | Context rot prevention, atomic task plans |
| Deep Trilogy | Vague idea → structured plan → working code |
| Code Review | Pre-commit parallel diff analysis |
| Context7 | Up-to-date library documentation |
| Ralph Loop | Autonomous batch coding sessions |
| Trail of Bits Security | CodeQL, Semgrep, vulnerability detection |
| Vercel Skills Suite (12+) | Next.js best practices, deploy, upgrade, a11y |
