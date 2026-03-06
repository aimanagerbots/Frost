# Git Workflow

- Feature branches per module: `feature/[module-name]`
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- Always push after completing work
- Do not merge to main without explicit approval
- If branch naming is restricted (e.g., requires `claude/` prefix), use refspec: `git push origin HEAD:allowed-branch-name`
- No dev or staging branches until team grows
