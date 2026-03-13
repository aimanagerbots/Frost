# Site Index Template

Use this format for INDEX.md output:

```markdown
# [App Name] — Site Research Index
> [domain] — [N] pages scraped on [date]
> [N] total screenshots captured

## App Architecture
- **Framework:** [Angular/React/Vue/etc]
- **Routing:** [hash/history/etc]
- **UI Library:** [Material/Bootstrap/custom/etc]
- **Auth:** [JWT/session/OAuth/etc]

## Module Map

### [Module Name]
- **Base URL:** [url]
- **Landing page:** `[module]/overview.png`
- **Sub-pages:**
  - [Sub-page name] → `[module]/[sub-page].png`
    - Components: [table, chart, form, etc]
    - Interactive states: [N]
      - [type]: "[label]" → `[module]/states/[type]-[name].png`

## Navigation Graph
| From | Action | To |
|------|--------|-----|
| [page] | click: [element] | [destination] |

## Component Census
| Component | Total Instances | Found On |
|-----------|----------------|----------|
| data-table | N | [modules] |
| card | N | [modules] |
```
