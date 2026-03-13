# Vault Integration (MANDATORY)

The Obsidian vault at `Frost-Vault/` is Claude Code's extended memory. It stores project knowledge, session logs, and architecture decisions that don't fit in the 200-line MEMORY.md.

## Vault Structure
- `CLOCK.md` — **Temporal anchor** (vault root). ALWAYS read first. ALWAYS update last.
- `00-Inbox/` — Quick capture, unsorted notes
- `01-Project/` — Frost project knowledge (Architecture, Modules, Domain, Deployment, Brand)
- `02-Sessions/` — Claude Code session logs
- `03-Decisions/` — Architecture Decision Records (ADRs)
- `04-Reference/` — Plugin configs, API docs, external research
- `05-Templates/` — Obsidian templates (Session Log, Module Note, Decision Record)

## Session Start — ALWAYS (no exceptions)
1. Read `Frost-Vault/CLOCK.md` — temporal anchor, last session summary, active projects
2. Read the latest session log in `Frost-Vault/02-Sessions/` — pick up where you left off
3. If working on a specific module → read `Frost-Vault/01-Project/Modules/[module].md` if it exists

## Before Any Task — ALWAYS Search First
- Before starting work on ANY module, search `Frost-Vault/01-Project/Modules/` for existing notes
- Before making architectural decisions, check `Frost-Vault/03-Decisions/` for precedent
- Before building something new, search the vault for prior context on that topic
- If relevant vault notes exist, READ them before writing any code

## During Work — Proactive Note-Taking
- When you discover domain knowledge → immediately add to `Frost-Vault/01-Project/Domain/`
- When you learn module quirks or gotchas → immediately update the module note
- When the user shares business context → capture in appropriate `01-Project/` subfolder
- When you hit a non-obvious technical decision → note it for a potential ADR
- Do NOT batch notes for later — write them as you learn things

## After Every Task — ALWAYS (sessions can end unexpectedly)
1. Update `Frost-Vault/CLOCK.md` — current date, what was just done, what's next, active projects
2. If a module was built or significantly changed → create/update `Frost-Vault/01-Project/Modules/[module].md`
3. If an architectural decision was made → create ADR in `Frost-Vault/03-Decisions/`
4. CLOCK.md is the single source of truth for "where did we leave off" — keep it current always

## Conventions
- YAML frontmatter on every note (type, date, status as needed)
- Use `[[wikilinks]]` for cross-references between notes
- One topic per note, link liberally
- ADRs are numbered sequentially: `001-`, `002-`, etc.

## What NOT to Do
- Do NOT dump entire vault contents into context — read specific notes on demand
- Do NOT create a note for every small change — only significant work
- Do NOT duplicate MEMORY.md content in the vault — they serve different purposes
- Do NOT skip vault reads at session start — this is how you maintain continuity
- Do NOT skip session logs at session end — this is how future sessions pick up context
