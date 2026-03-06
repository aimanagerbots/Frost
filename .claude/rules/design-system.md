# Design System

- Dark theme by default. All colors defined as CSS custom properties in `src/design/tokens.css`.
- Tokens are wired into Tailwind v4 via `@theme` inline in `globals.css` — use utility classes (`bg-base`, `bg-card`, `text-default`, `text-muted`, etc.).
- Never hardcode hex values in components — always reference tokens.
- Each module gets its own accent color used for: SectionHeader accent bar, active states, progress indicators, chart highlights.
- Responsive: desktop-first. 3-col -> 2-col -> 1-col. Mobile breakpoint at 768px.
- Card styling: `rounded-xl`, `border border-default`, `bg-card`
- Glassmorphism on sidebar: `backdrop-blur-xl` with slight transparency
- Brand gradient: `linear-gradient(135deg, #667EEA, #764BA2, #F093FB)`
