# Module-Specific CLAUDE.md Template

When building a new module, create a `CLAUDE.md` inside `src/modules/[module-name]/` with this structure:

```markdown
# [Module Name]

Accent color: #XXXXXX

[1-2 sentences: what this module does, key user workflows, important design decisions]

## Key Components
- [List the main components and their purpose]

## Data Shape
- [List the key TypeScript interfaces used by this module]
```

This file only loads when Claude Code is working in that module's directory, keeping the root CLAUDE.md clean.
