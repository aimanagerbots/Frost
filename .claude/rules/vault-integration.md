# Vault Integration

The Obsidian vault at `Frost-Vault/` is Claude Code's extended memory. It stores project knowledge, session logs, and architecture decisions that don't fit in the 200-line MEMORY.md.

## Vault Structure
- `00-Inbox/` — Quick capture, unsorted notes
- `01-Project/` — Frost project knowledge (Architecture, Modules, Domain, Deployment, Brand)
- `02-Sessions/` — Claude Code session logs
- `03-Decisions/` — Architecture Decision Records (ADRs)
- `04-Reference/` — Plugin configs, API docs, external research
- `05-Templates/` — Obsidian templates (Session Log, Module Note, Decision Record)

## When to Read from Vault
- Starting work on a specific module → read `Frost-Vault/01-Project/Modules/[module].md`
- Making an architectural decision → check `Frost-Vault/03-Decisions/` for precedent
- Resuming after a break → read the latest `Frost-Vault/02-Sessions/` log
- Need design system details → read `Frost-Vault/01-Project/Brand/Design-System.md`
- Need deployment config → read `Frost-Vault/01-Project/Deployment/Vercel-Config.md`

## When to Write to Vault
- After completing a significant feature or phase → create session log (use template)
- After making an architectural decision → create ADR (use template)
- After discovering important domain knowledge → add to relevant project note
- When a module moves beyond scaffold → create/update its module note

## Conventions
- YAML frontmatter on every note (type, date, status as needed)
- Use `[[wikilinks]]` for cross-references between notes
- One topic per note, link liberally
- ADRs are numbered sequentially: `001-`, `002-`, etc.

## What NOT to Do
- Do NOT dump entire vault contents into context — read specific notes on demand
- Do NOT create a note for every small change — only significant work
- Do NOT duplicate MEMORY.md content in the vault — they serve different purposes
- Do NOT read the vault at session start unless resuming interrupted work
