# Claude Code Skills & Plugins Reference

**Last updated:** March 2026

A comprehensive reference of the best Claude Code skills and plugins for coding, app building, planning, frontend design, UX/UI, website design, CRM design, architecture, and security.

---

## Quick Start: Installation

```bash
# Add a marketplace
/plugin marketplace add <owner>/<repo>

# Browse & install from a marketplace
/plugin

# Install a specific plugin
/plugin install <plugin-name>@<marketplace-name>

# Verify installed plugins
/plugin
```

---

## Tier 1: Core Skills (Already in Frost)

### Frontend Design (Anthropic)
**Category:** UI Design | **Installs:** 110K+/week

Production-grade UI skill that prevents generic "AI slop" aesthetics. Forces bold design choices, unique typography, intentional layout. Auto-triggers when building frontend components.

```
/plugin marketplace add anthropics/claude-code
# Then install frontend-design from the plugin menu
```

**When to use:** Every time you build UI components or pages.

---

### UI/UX Pro Max
**Category:** Design System | **Installs:** High

The most comprehensive design intelligence skill available. Includes 50+ UI styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 9 technology stacks. Has a Python search script for querying its design database.

```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**When to use:** Starting a new module's design. Don't let it override established design tokens.

---

### Superpowers (14+ Skills)
**Category:** Development Methodology

Complete development lifecycle: brainstorming, writing-plans, executing-plans (subagent dispatch with code review), TDD (RED-GREEN-REFACTOR), debugging, root-cause-tracing, and code-reviewer.

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

**When to use:** Complex multi-file features needing structured planning. Can be overkill for simple tasks with a detailed brief.

---

### Interface Design
**Category:** Design Consistency

Enforces design consistency across sessions. Saves decisions to `.interface-design/system.md`. Commands: `/interface-design:init`, `/interface-design:audit`, `/interface-design:extract`.

```
/plugin marketplace add Dammyjay93/interface-design
# Then use /plugin menu to install
```

**When to use:** After the first module is built. Extract patterns, then audit all subsequent modules.

---

### GSD (Get Shit Done)
**Category:** Task Management

Spec-driven development that prevents context rot. Externalizes state into files, breaks work into atomic 2-3 task plans, runs each in a fresh subagent context with clean 200K token window.

```bash
# Run in regular terminal, NOT inside Claude Code
npx gsd@latest install
```

**Commands:** `/gsd:create-project`, `/gsd:create-roadmap`, `/gsd:plan-phase`, `/gsd:execute-plan`

**When to use:** Long multi-module build sessions (5+ modules) where context degradation is a concern.

---

## Tier 2: High-Value Additions

### The Deep Trilogy
**Category:** Planning & Architecture

Three plugins that turn vague ideas into working code through structured decomposition:
- `/deep-project` — transforms vague ideas into individual, ready-to-be-planned components
- `/deep-plan` — transforms components into detailed implementation plans via research, interviews, and multi-LLM review
- `/deep-implement` — implements code from `/deep-plan` sections with TDD, code review, and git workflow

```
/plugin marketplace add piercelamb/deep-project
/plugin marketplace add piercelamb/deep-plan
/plugin marketplace add piercelamb/deep-implement
```

**When to use:** Starting a new feature from scratch when you need structured decomposition before coding.

---

### Context7 (Upstash)
**Category:** Documentation | **Installs:** 71K+

Delivers up-to-date, version-specific library documentation and code examples directly into prompts. Pulls current docs from source repositories instead of relying on potentially outdated training data. Significantly reduces API hallucinations.

```
/plugin marketplace add upstash/context7
/plugin install context7-plugin@context7-marketplace
```

**Alternative (MCP Server):**
```bash
claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp
```

Free API key available at context7.com/dashboard for higher rate limits.

**When to use:** Any time you're working with external libraries and need accurate, current API docs.

---

### Ralph Loop (Ralph Wiggum)
**Category:** Automation | **Installs:** 57K+

Runs autonomous coding sessions where Claude works through tasks iteratively, implementing changes and committing to git. Perfect for repetitive work like CRUD operations, migrations, or test coverage.

```
/plugin install ralph-wiggum@claude-plugins-official
```

**Usage:** `/ralph-loop "your prompt here" --max-iterations 10 --completion-promise "DONE"`

**When to use:** Repetitive tasks, batch operations, generating boilerplate across multiple files.

---

### Code Review (Anthropic Official)
**Category:** Code Quality | **Installs:** 50K+

Parallel local diff code reviews to catch issues before committing. Analyzes changes, scores potential issues, and provides actionable feedback.

```
/plugin marketplace add anthropics/claude-code
# Then install code-review from the plugin menu
```

**Usage:** `/code-review` on any branch to launch full automated review.

**When to use:** Before every commit or PR.

---

### Trail of Bits Security Skills
**Category:** Security | **Skills:** 12+

Professional security-focused skills from Trail of Bits for code auditing and vulnerability detection. Includes static analysis with CodeQL and Semgrep, variant analysis across codebases, fix verification, and secure development practices.

```
/plugin marketplace add trailofbits/skills
```

**Includes:**
- Static analysis (CodeQL, Semgrep)
- Semgrep rule creator & variant creator
- Vulnerability detection
- Audit workflows
- Secure defaults detection

**When to use:** Security audits, before deploying to production, reviewing authentication/authorization code.

---

### Vercel Web Design Guidelines
**Category:** Design & UX

Reviews UI code against the Web Interface Guidelines — a comprehensive set of 100+ rules covering accessibility, performance, and UX best practices. Focuses on correctness over aesthetics.

```bash
npx skills add https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
```

**When to use:** After building UI components, as a quality gate for accessibility and UX compliance.

---

### Shipyard
**Category:** DevOps & Architecture

Combines Superpowers-style lifecycle management with infrastructure-as-code validation and security auditing. Best for production-oriented workflows.

```
# Available through community marketplaces
```

**When to use:** Production deployments, infrastructure work, when you need security auditing alongside development.

---

## Tier 3: Specialized / Nice-to-Have

| Plugin | Category | Purpose |
|---|---|---|
| **Claude-Mem** | Memory | Long-term memory across sessions for context and preferences |
| **Dev-Browser** | Testing | Lightweight browser testing, lower context overhead than Playwright |
| **Chrome DevTools MCP** | Debugging | Inspect network requests, console errors in live Chrome sessions |
| **TypeScript LSP Plugin** | Type Safety | Real type checks via LSP inside Claude workflow |
| **Composition Patterns** | Architecture | Teaches compound components, context providers, variant patterns |
| **Playwright** (Anthropic) | Testing | Browser automation and E2E testing. 28K installs. |
| **Security Guidance** | Security | Security best practices enforcement. 25K installs. |

---

## Skills by Use Case

### Building UI Components / Pages
1. Frontend Design (always)
2. UI/UX Pro Max (for design system recommendations)
3. Vercel Web Design Guidelines (for accessibility/UX audit)
4. Interface Design (for consistency across modules)

### Planning & Architecture
1. The Deep Trilogy (vague idea → working code)
2. Superpowers (brainstorm → plan → execute)
3. GSD (large multi-phase builds)

### Code Quality & Review
1. Code Review (Anthropic official)
2. Local-Review (multi-agent parallel reviews)
3. TypeScript LSP (real type checking)

### Security
1. Trail of Bits Security (comprehensive auditing)
2. Security Guidance (best practices)
3. Semgrep Rule Creator (custom vulnerability rules)

### Automation & Productivity
1. Ralph Loop (autonomous coding sessions)
2. Context7 (up-to-date library docs)
3. Claude-Mem (cross-session memory)

### Testing & Debugging
1. Playwright (E2E browser testing)
2. Dev-Browser (lightweight browser testing)
3. Chrome DevTools MCP (live debugging)

---

## Marketplaces & Resources

| Resource | URL | Size |
|---|---|---|
| **Anthropic Official** | `anthropics/claude-code` | Curated, high quality |
| **Claude Plugin Marketplace** | claudemarketplaces.com | Broad discovery |
| **Claude Code Plugins Hub** | claudecodeplugins.io | 1,342 skills / 315 plugins |
| **Awesome Claude Skills** | github.com/travisvn/awesome-claude-skills | Curated list |
| **Awesome Claude Code Toolkit** | github.com/rohitg00/awesome-claude-code-toolkit | 135 agents, 35 skills, 120 plugins |
| **VoltAgent Awesome Agent Skills** | github.com/VoltAgent/awesome-agent-skills | 500+ skills |
| **Antigravity Awesome Skills** | github.com/sickn33/antigravity-awesome-skills | 1,206+ skills |

---

## Notes

- Over 9,000 plugins exist as of Feb 2026, but only ~50-100 are truly production-ready
- Start with Anthropic official marketplace plugins — they're vetted for quality and security
- Plugins are just directories with Markdown and JSON files — no build step required
- Test locally with `--plugin-dir` before committing to a plugin
- Restart Claude Code after installing plugins so they load properly
