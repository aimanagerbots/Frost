# Installed Skills — USE THEM when relevant

## frontend-design (Anthropic Official)
Anthropic's skill for production-grade UI. Forces bold aesthetic choices, unique typography, intentional design. Prevents generic "AI slop."
- **Trigger**: Auto-triggers when building frontend components. Reference it in briefs for best results.
- **Use when**: Building any UI component, page, or layout.
- **Skip when**: Backend work, data modeling, non-visual tasks.

## ui-ux-pro-max
Design intelligence engine with 50 styles, 21 color palettes, 50 font pairings. Generates design system recommendations per project/page.
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

## GSD (Get Shit Done)
Spec-driven development preventing context rot. Externalizes state into files, breaks work into atomic 2-3 task plans, runs each in a fresh subagent context with clean 200K token window.
- **Commands**: `/gsd:create-project`, `/gsd:create-roadmap`, `/gsd:plan-phase`, `/gsd:execute-plan`
- **Use when**: Long multi-module build sessions (5+ modules) where context degradation is a concern.
- **Skip when**: Short sessions or single-module builds.

## Quick Reference Table
| Situation | Skill |
|---|---|
| Building any UI component or page | frontend-design (always) |
| Starting a new module's visual design | ui-ux-pro-max (optional) |
| Complex feature needing structured planning | superpowers (brainstorm → plan → execute) |
| Enforcing consistency across modules 2+ | interface-design (extract then audit) |
| Long multi-module build session | GSD (prevents context rot) |
| Simple module with a detailed brief | None — the brief IS the plan |
