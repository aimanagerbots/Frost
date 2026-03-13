# Rebuild Plan Template

Use this format for REBUILD_PLAN.md output:

```markdown
# [App Name] Rebuild Plan
> Generated [date] from deep scrape of [domain]
> [N] pages, [N] screenshots, [N] navigation edges

## 1. Architecture Overview

**Original stack:** [Angular/React/etc] with [UI library]
**Routing:** [hash-based / history-based]
**Auth:** [mechanism observed]
**API pattern:** [if observable from network requests]

### Routes Discovered
- `[route]` — [page title / description]

## 2. Design System

Color palette, typography scale, spacing patterns extracted.
See `DESIGN_SYSTEM.md` for full token list.

### Key Colors
| Role | Hex | Usage |
|------|-----|-------|
| Primary | #XXXXXX | buttons, links, active states |
| Background | #XXXXXX | page backgrounds |
| Surface | #XXXXXX | card/panel backgrounds |
| Text Primary | #XXXXXX | body text |
| Text Secondary | #XXXXXX | labels, secondary text |
| Success | #XXXXXX | status indicators |
| Error | #XXXXXX | error states |

### Typography
| Role | Font | Size | Weight |
|------|------|------|--------|
| H1 | | | |
| Body | | | |

## 3. Shared Components (build first)

### [Component Type] (used on N pages)
- Description of the pattern
- Reference: `[screenshots]`
- Props/variants observed

## 4. Data Models

### [Entity Name]
| Field | Type | Source |
|-------|------|--------|
| [name] | [string/number/date/enum] | [table header / form field / filter] |

Relationships:
- [Entity A] has many [Entity B]

## 5. Build Sequence

### Phase A: Foundation
1. Project scaffold + routing
2. Auth flow (login page)
3. App shell (top bar + sidebar + content area)
4. Shared component library

### Phase B: Core Modules (in dependency order)
For each module:
- **Route:** `[path]`
- **Reference:** `[module]/overview.png`
- **Components needed:** [list]
- **Data model:** [entity]
- **Sub-pages:** [list with screenshots]
- **Interactive states to replicate:** [list]
- **Estimated complexity:** simple / moderate / complex

### Phase C: Supporting Pages
[Lower-priority pages]

## 6. Asset Checklist
- [ ] Logo / branding
- [ ] Icon library identification
- [ ] Font files
- [ ] Color tokens → CSS variables
- [ ] Typography scale → config

## 7. What to Give the Rebuilding Claude Code Session
1. This REBUILD_PLAN.md
2. The full `research/[domain]/` folder with all screenshots
3. DESIGN_SYSTEM.md
4. DATA_MODELS.md
5. The target stack instructions (e.g., "rebuild in Next.js + Tailwind")
```
