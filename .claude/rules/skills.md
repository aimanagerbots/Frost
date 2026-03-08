# Installed Skills — USE THEM when relevant

## frontend-design (Anthropic Official)
Anthropic's skill for production-grade UI. Forces bold aesthetic choices, unique typography, intentional design. Prevents generic "AI slop."
- **Trigger**: Auto-triggers when building frontend components. Reference it in briefs for best results.
- **Use when**: Building any UI component, page, or layout.
- **Skip when**: Backend work, data modeling, non-visual tasks.

## ui-ux-pro-max
Design intelligence engine with 50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines. Generates design system recommendations per project/page.
- **Commands**: Use its Python search script to query the design database for component patterns and spacing.
- **Use when**: Starting a brand new module's design, need inspiration for layout or typography.
- **Skip when**: Module design is already established. Don't let it override existing design tokens.

## superpowers (14 skills)
Complete development methodology: brainstorming, writing-plans, executing-plans, test-driven-development, debugging, root-cause-tracing, code-reviewer.
- **Commands**: `/superpowers:brainstorm`, `/superpowers:write-plan`, `/superpowers:execute-plan`, `/superpowers:debug`, `/superpowers:code-review`
- **Use when**: Complex multi-file features needing structured planning. brainstorm → plan → execute workflow.
- **Skip when**: Simple tasks where a detailed brief already exists. Can be overkill for straightforward builds.

## interface-design
Design consistency enforcement across sessions. Saves design decisions to `.interface-design/system.md`.
- **Commands**: `/interface-design:init` (establish direction), `/interface-design:audit` (check code against system), `/interface-design:extract` (pull patterns from existing code)
- **Use when**: AFTER the first module is built. Extract patterns, then audit all subsequent modules for consistency.
- **Skip when**: First module build (nothing to extract yet).

## GSD (Get Shit Done) — Fully Installed
Spec-driven development preventing context rot. Externalizes state into files, breaks work into atomic 2-3 task plans, runs each in a fresh subagent context with clean 200K token window. Installed with 30+ commands (`.claude/commands/gsd/`), 12 agents (`.claude/agents/`), hooks, and full runtime (`.claude/get-shit-done/`).
- **Commands**: `/gsd:new-project`, `/gsd:new-milestone`, `/gsd:plan-phase`, `/gsd:execute-phase`, `/gsd:progress`, `/gsd:debug`, `/gsd:pause-work`, `/gsd:resume-work`
- **RULE**: USE GSD when context usage is above 50% to prevent context rot. Do not wait to be asked.
- **Use when**: Long multi-module build sessions (5+ modules), OR when context is above 50%.
- **Skip when**: Short sessions with plenty of context remaining.

## The Deep Trilogy
Three plugins for structured decomposition: vague idea → components → plans → working code with TDD and git workflow.
- **Commands**: `/deep-project` (decompose idea), `/deep-plan` (create implementation plan), `/deep-implement` (build with TDD + code review)
- **Use when**: Starting a new feature from scratch, need structured decomposition before coding.
- **Skip when**: Brief is already detailed and ready to build.

## Context7 (Upstash)
Delivers up-to-date, version-specific library documentation directly into prompts. Pulls current docs from source repos instead of relying on training data.
- **Use when**: Working with external libraries and need accurate, current API docs.
- **Skip when**: Working with internal project code only.

## Code Review (Anthropic Official)
Parallel local diff code reviews to catch issues before committing. Analyzes changes, scores issues, provides actionable feedback.
- **Commands**: `/code-review` on any branch
- **Use when**: Before every commit or PR. Run on all module completions.
- **Skip when**: Trivial changes (typos, comments).

## Ralph Loop
Autonomous coding sessions where Claude works through tasks iteratively, implementing changes and committing to git.
- **Commands**: `/ralph-loop "prompt" --max-iterations 10 --completion-promise "DONE"`
- **Use when**: Repetitive tasks, batch operations, CRUD generation, migrations, test coverage.
- **Skip when**: Tasks requiring human judgment at each step.

## Trail of Bits Security
12+ professional security skills for code auditing, vulnerability detection, and secure development. Includes CodeQL, Semgrep, variant analysis, fix verification.
- **Use when**: Security audits, before production deploys, reviewing auth code.
- **Skip when**: Non-security-sensitive UI work.

## Vercel Skills Suite (12+ skills)
Full Vercel engineering skill suite — not just web design guidelines. Includes:
- **web-design-guidelines** — 100+ a11y/UX rules for UI quality gates
- **react-best-practices** — React + Next.js performance optimization from Vercel Engineering
- **next-best-practices** — File conventions, RSC boundaries, data patterns, async APIs, metadata, routing
- **next-cache-components** — PPR, `use cache` directive, cacheLife, cacheTag
- **ai-sdk** — Building AI-powered features with Vercel AI SDK
- **composition-patterns** — React composition patterns that scale (compound components, variants)
- **vercel-deploy** — Deploy applications to Vercel
- **next-upgrade** — Upgrade Next.js with official migration guides and codemods
- **agent-browser** — Browser automation for testing
- **Use when**: Building Next.js UI (react/next-best-practices), deploying (vercel-deploy), upgrading Next.js (next-upgrade), a11y audit (web-design-guidelines), AI features (ai-sdk).
- **Skip when**: Non-frontend, non-Next.js work.

## Skill Creator (Anthropic Official)
Create, test, and optimize Claude Code skills through structured eval loops with A/B testing.
- **Commands**: `/skill-creator` (auto-detects mode based on context)
- **Modes**: Create (draft from intent), Eval (run test cases with baseline comparison), Improve (iterate based on feedback), Benchmark (variance analysis with blind A/B)
- **Agents**: Grader (assertion evaluation), Comparator (blind A/B), Analyzer (improvement suggestions)
- **Use when**: Creating a new skill, optimizing an existing skill's performance, testing skill triggering accuracy, or benchmarking skill quality with statistical rigor.
- **Skip when**: Using existing skills as-is, no need to create or modify skills.

## Quick Reference Table
| Situation | Skill |
|---|---|
| Building any UI component or page | frontend-design (always) |
| Starting a new module's visual design | ui-ux-pro-max (optional) |
| Complex feature needing structured planning | superpowers (brainstorm → plan → execute) |
| Decomposing a vague idea into buildable parts | Deep Trilogy (deep-project → deep-plan → deep-implement) |
| Enforcing consistency across modules 2+ | interface-design (extract then audit) |
| Long multi-module build session | GSD (prevents context rot) |
| Need accurate library API docs | Context7 |
| Pre-commit quality check | Code Review |
| Repetitive/batch coding tasks | Ralph Loop |
| Security audit or production prep | Trail of Bits Security |
| Accessibility & UX compliance check | Vercel Skills (web-design-guidelines) |
| Next.js patterns & performance | Vercel Skills (react/next-best-practices) |
| Deploying to Vercel | Vercel Skills (vercel-deploy) |
| Upgrading Next.js version | Vercel Skills (next-upgrade) |
| Creating or optimizing a skill | Skill Creator |
| Simple module with a detailed brief | None — the brief IS the plan |
