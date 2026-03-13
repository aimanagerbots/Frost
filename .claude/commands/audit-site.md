---
name: audit-site
description: Crawl any website, authenticate, screenshot every page, and extract all colors, fonts, components, and CSS variables into a design audit report.
---

# Site Design Auditor

Run the site-auditor tool at `tools/site-auditor/` to crawl, screenshot, and extract design tokens from any website.

## Usage

The user provides a URL (and optionally credentials). Run the tool via:

```bash
cd tools/site-auditor && npx tsx src/cli.ts \
  --url "<URL>" \
  --password "<password>" \
  --username "<username>" \
  --output "./audit-<site-name>" \
  --max-pages 50 \
  --max-depth 3 \
  --viewports "desktop,tablet,mobile" \
  --headed
```

## Arguments

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--url` | Yes | — | Target site URL |
| `--username` | No | "" | Login username/email |
| `--password` | No | "" | Login password |
| `--login-url` | No | same as --url | Custom login page URL |
| `--output` | No | ./audit-output | Output directory |
| `--max-depth` | No | 3 | Max crawl depth |
| `--max-pages` | No | 50 | Max pages to audit |
| `--viewports` | No | desktop | desktop,tablet,mobile (comma-separated) |
| `--include` | No | — | URL glob patterns to include |
| `--exclude` | No | — | URL glob patterns to exclude |
| `--headed` | No | false | Show browser window |

## What it produces

1. `screenshots/` — Full-page PNG of every page at each viewport
2. `design-audit.json` — Machine-readable: colors, typography, components, CSS variables, page list
3. `report.html` — Visual HTML report with color swatches, type scale, component inventory, screenshot gallery

## Auth handling

The tool auto-detects and handles:
- **Modal overlays** (age gates, password modals) — checks `[role="dialog"]` first
- **Password-only gates** (site passwords without username)
- **Standard login forms** (username + password)

## After running

Present the user with:
1. Key screenshots (read the PNG files to show them)
2. Summary of colors, fonts, components found
3. Location of the HTML report they can open in browser

## When to use

- User wants to scrape/audit a website's design
- User wants screenshots of an entire site
- User wants to extract colors, fonts, or design tokens from a site
- User asks to "clone" or "reference" another site's design
- Competitive design analysis

## Prerequisites

The tool needs `playwright` with Chromium installed. If missing:
```bash
cd tools/site-auditor && npm install && npx playwright install chromium
```
