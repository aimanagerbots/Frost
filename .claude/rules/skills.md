# Skills Available — USE THEM when relevant

- **frontend-design**: Use when building any UI component or page. Forces bold aesthetic choices, prevents generic output.
- **ui-ux-pro-max**: Use for design system recommendations when starting a new module's design. Don't let it override established design tokens.
- **interface-design**: Use to enforce design consistency across modules. Run `/interface-design:extract` after the first module is built, then `/interface-design:audit` on subsequent modules.
- **superpowers**: Use brainstorm -> plan -> execute workflow for complex multi-file features. Can be overkill for simple tasks where a brief already exists.
- **GSD**: Use for large multi-phase builds to prevent context rot. Breaks work into atomic tasks with fresh subagent contexts.

## When to Use Which
| Situation | Skill |
|---|---|
| Building any UI component or page | frontend-design |
| Starting a new module's design | ui-ux-pro-max (optional) |
| Enforcing consistency across modules 2+ | interface-design (audit + extract) |
| Complex feature needing structured planning | superpowers |
| Long multi-module build session (5+ modules) | GSD |
| Simple module with a detailed brief already | None needed |
