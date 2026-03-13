/**
 * scrape-app.mjs — Deep Interactive Authenticated App Scraper
 *
 * Logs into a web app, discovers all navigation, clicks every interactive
 * element (dropdowns, modals, tabs, sidebars), screenshots every UI state,
 * extracts design tokens, and produces a comprehensive rebuild plan.
 *
 * Usage:
 *   node scripts/scrape-app.mjs <url> [options]
 *
 * Options:
 *   --headed         Show the browser (default: true for this scraper)
 *   --headless       Run headless
 *   --limit <n>      Max pages to scrape
 *   --skip-images    Don't download images
 *   --fast           Skip interactive element discovery (just pages)
 *
 * Environment (from .env):
 *   CULTIVERA_EMAIL
 *   CULTIVERA_PASSWORD
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- Load .env manually (no dependency needed) ---
function loadEnv() {
  const envPath = resolve(ROOT, '.env');
  if (!existsSync(envPath)) return {};
  const vars = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    vars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return vars;
}

const env = loadEnv();

// --- CLI ---
const args = process.argv.slice(2);
const headed = !args.includes('--headless');
const fastMode = args.includes('--fast');
const skipImages = args.includes('--skip-images');
const limitIdx = args.indexOf('--limit');
const pageLimit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const rawUrl = args.find(a => !a.startsWith('--') && !(limitIdx !== -1 && args[limitIdx + 1] === a));

if (!rawUrl) {
  console.error('Usage: node scripts/scrape-app.mjs <url>');
  console.error('  e.g. node scripts/scrape-app.mjs https://wa.cultiverapro.com');
  process.exit(1);
}

let baseUrl;
try {
  baseUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
} catch {
  console.error(`Invalid URL: ${rawUrl}`);
  process.exit(1);
}

const domain = baseUrl.hostname.replace(/^www\./, '');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const runDir = resolve(ROOT, 'research', domain, timestamp);
mkdirSync(runDir, { recursive: true });

// --- State tracking ---
const siteTree = [];         // { path, title, folder, children: [...interactive states] }
const allColors = {};        // aggregated color counts
const allTypography = new Map(); // aggregated typography
const allComponents = [];    // discovered UI patterns
const navigationGraph = [];  // { from, action, to, screenshot }
let screenshotCounter = 0;
let pageCounter = 0;

// --- Helpers ---

function log(msg) {
  const ts = new Date().toLocaleTimeString();
  console.log(`  [${ts}] ${msg}`);
}

function safeFilename(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 80);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    let prev = -1;
    let curr = window.scrollY;
    while (prev !== curr) {
      prev = curr;
      window.scrollBy(0, 600);
      await delay(150);
      curr = window.scrollY;
    }
    window.scrollTo(0, 0);
  });
  await sleep(500);
}

async function takeScreenshot(page, filepath) {
  try {
    await page.screenshot({ path: filepath, fullPage: true, timeout: 15000 });
    screenshotCounter++;
    return true;
  } catch (err) {
    log(`  Screenshot failed: ${err.message}`);
    return false;
  }
}

// --- Authentication ---

async function authenticate(page) {
  const email = env.CULTIVERA_EMAIL;
  const password = env.CULTIVERA_PASSWORD;

  if (!email || !password) {
    console.error('Missing CULTIVERA_EMAIL or CULTIVERA_PASSWORD in .env');
    process.exit(1);
  }

  log('Navigating to sign-in page...');
  await page.goto(`${baseUrl.origin}/#/sign-in`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  // Try various selectors for email/password fields
  const emailSelectors = [
    'input[type="email"]', 'input[name="email"]', 'input[name="username"]',
    'input[placeholder*="email" i]', 'input[placeholder*="user" i]',
    'input[type="text"]:first-of-type', '#email', '#username',
    'input[autocomplete="email"]', 'input[autocomplete="username"]',
  ];
  const passwordSelectors = [
    'input[type="password"]', 'input[name="password"]',
    'input[placeholder*="password" i]', '#password',
  ];
  const submitSelectors = [
    'button[type="submit"]', 'button:has-text("Sign In")', 'button:has-text("Log In")',
    'button:has-text("Login")', 'button:has-text("Submit")',
    'input[type="submit"]', 'button:has-text("sign in")',
    'button:has-text("SIGN IN")', 'button:has-text("LOG IN")',
  ];

  let emailField = null;
  for (const sel of emailSelectors) {
    try {
      emailField = await page.$(sel);
      if (emailField) { log(`  Found email field: ${sel}`); break; }
    } catch {}
  }

  let passwordField = null;
  for (const sel of passwordSelectors) {
    try {
      passwordField = await page.$(sel);
      if (passwordField) { log(`  Found password field: ${sel}`); break; }
    } catch {}
  }

  if (!emailField || !passwordField) {
    // Take screenshot of login page for debugging
    await takeScreenshot(page, resolve(runDir, '_login-page-debug.png'));
    // Try to find any input fields
    const inputs = await page.$$('input');
    log(`  Found ${inputs.length} input fields on page. Taking debug screenshot.`);
    if (inputs.length >= 2) {
      emailField = inputs[0];
      passwordField = inputs[1];
      log('  Using first two input fields as email/password');
    } else {
      console.error('Could not find login fields. See _login-page-debug.png');
      process.exit(1);
    }
  }

  log('Entering credentials...');
  await emailField.click();
  await emailField.fill(email);
  await sleep(300);
  await passwordField.click();
  await passwordField.fill(password);
  await sleep(300);

  // Screenshot the filled login form
  await takeScreenshot(page, resolve(runDir, '_login-filled.png'));

  // Submit
  let submitted = false;
  for (const sel of submitSelectors) {
    try {
      const btn = await page.$(sel);
      if (btn) {
        await btn.click();
        submitted = true;
        log(`  Clicked submit: ${sel}`);
        break;
      }
    } catch {}
  }
  if (!submitted) {
    // Try pressing Enter
    await passwordField.press('Enter');
    log('  Pressed Enter to submit');
  }

  // Wait for navigation / app to load
  log('Waiting for app to load after auth...');
  await sleep(5000);

  // Check if we're still on the sign-in page
  const currentUrl = page.url();
  if (currentUrl.includes('sign-in') || currentUrl.includes('login')) {
    log('  Still on login page — waiting longer...');
    await sleep(5000);
    const retryUrl = page.url();
    if (retryUrl.includes('sign-in') || retryUrl.includes('login')) {
      await takeScreenshot(page, resolve(runDir, '_login-failed.png'));
      log('  WARNING: May still be on login page. Check _login-failed.png');
    }
  }

  await takeScreenshot(page, resolve(runDir, '_post-login.png'));
  log(`Authenticated. Current URL: ${page.url()}`);
}

// --- Navigation Discovery ---

async function discoverNavigation(page) {
  log('Discovering navigation structure...');

  const navItems = await page.evaluate(() => {
    const items = [];
    const seen = new Set();

    // Helper to extract nav item info
    function extractItem(el, source) {
      const text = el.textContent?.trim()?.replace(/\s+/g, ' ').slice(0, 100);
      const href = el.getAttribute('href') || el.getAttribute('routerlink') || '';
      const ariaLabel = el.getAttribute('aria-label') || '';
      const tag = el.tagName.toLowerCase();
      const classes = el.className || '';

      const key = `${text}|${href}`;
      if (seen.has(key) || !text) return;
      seen.add(key);

      items.push({
        text,
        href,
        ariaLabel,
        tag,
        source,
        classes: typeof classes === 'string' ? classes.slice(0, 200) : '',
        selector: buildSelector(el),
      });
    }

    // Build a unique CSS selector for an element
    function buildSelector(el) {
      if (el.id) return `#${el.id}`;
      const parts = [];
      let current = el;
      for (let i = 0; i < 4 && current && current !== document.body; i++) {
        let part = current.tagName.toLowerCase();
        if (current.id) { parts.unshift(`#${current.id}`); break; }
        if (current.className && typeof current.className === 'string') {
          const cls = current.className.trim().split(/\s+/).filter(c => !c.includes('ng-') && !c.includes('active')).slice(0, 2).join('.');
          if (cls) part += `.${cls}`;
        }
        const parent = current.parentElement;
        if (parent) {
          const siblings = [...parent.children].filter(c => c.tagName === current.tagName);
          if (siblings.length > 1) {
            const idx = siblings.indexOf(current);
            part += `:nth-of-type(${idx + 1})`;
          }
        }
        parts.unshift(part);
        current = parent;
      }
      return parts.join(' > ');
    }

    // 1. Sidebar links
    const sidebarSelectors = [
      'nav a', 'aside a', '[class*="sidebar"] a', '[class*="sidenav"] a',
      '[class*="side-nav"] a', '[class*="menu"] a', '[class*="nav-"] a',
      '.sidebar a', '.sidenav a', '.side-nav a',
      '[role="navigation"] a', '[role="menu"] a',
      'mat-sidenav a', 'mat-nav-list a', // Angular Material
    ];
    for (const sel of sidebarSelectors) {
      try {
        for (const el of document.querySelectorAll(sel)) {
          extractItem(el, 'sidebar');
        }
      } catch {}
    }

    // 2. Top bar / header links
    const topbarSelectors = [
      'header a', '[class*="topbar"] a', '[class*="toolbar"] a',
      '[class*="header"] a', '[class*="app-bar"] a',
      'mat-toolbar a', // Angular Material
    ];
    for (const sel of topbarSelectors) {
      try {
        for (const el of document.querySelectorAll(sel)) {
          extractItem(el, 'topbar');
        }
      } catch {}
    }

    // 3. All remaining anchor tags with href containing # (SPA routes)
    for (const a of document.querySelectorAll('a[href*="#"]')) {
      extractItem(a, 'link');
    }

    // 4. Buttons/links that look like navigation
    for (const el of document.querySelectorAll('[routerlink], [ng-reflect-router-link], [ui-sref]')) {
      extractItem(el, 'router');
    }

    // 5. Any clickable list items in nav-like containers
    for (const el of document.querySelectorAll('li[class*="nav"], li[class*="menu"]')) {
      const link = el.querySelector('a') || el;
      extractItem(link, 'menu-item');
    }

    return items;
  });

  log(`  Found ${navItems.length} navigation items`);

  // Also discover routes from the URL hash (Angular apps use hash routing)
  return navItems;
}

// --- Interactive Element Discovery ---

async function discoverInteractiveElements(page) {
  return page.evaluate(() => {
    const elements = [];
    const seen = new Set();

    function buildSelector(el) {
      if (el.id) return `#${el.id}`;
      const parts = [];
      let current = el;
      for (let i = 0; i < 5 && current && current !== document.body; i++) {
        let part = current.tagName.toLowerCase();
        if (current.id) { parts.unshift(`#${current.id}`); break; }
        if (current.className && typeof current.className === 'string') {
          const cls = current.className.trim().split(/\s+/)
            .filter(c => !c.includes('ng-') && !c.includes('active') && !c.includes('hover'))
            .slice(0, 2).join('.');
          if (cls) part += `.${cls}`;
        }
        const parent = current.parentElement;
        if (parent) {
          const siblings = [...parent.children].filter(c => c.tagName === current.tagName);
          if (siblings.length > 1) {
            const idx = siblings.indexOf(current);
            part += `:nth-of-type(${idx + 1})`;
          }
        }
        parts.unshift(part);
        current = parent;
      }
      return parts.join(' > ');
    }

    function addElement(el, type) {
      const rect = el.getBoundingClientRect();
      // Skip invisible or off-screen elements
      if (rect.width === 0 || rect.height === 0) return;
      if (rect.top > window.innerHeight * 3) return; // too far down

      const text = el.textContent?.trim()?.replace(/\s+/g, ' ').slice(0, 80) || '';
      const sel = buildSelector(el);
      const key = `${type}|${sel}|${text}`;
      if (seen.has(key)) return;
      seen.add(key);

      elements.push({
        type,
        text,
        selector: sel,
        tag: el.tagName.toLowerCase(),
        ariaLabel: el.getAttribute('aria-label') || '',
        role: el.getAttribute('role') || '',
        classes: (typeof el.className === 'string' ? el.className : '').slice(0, 200),
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
      });
    }

    // Dropdowns / Select elements
    for (const el of document.querySelectorAll('select, [class*="dropdown"], [class*="select"], [role="listbox"], [role="combobox"], mat-select, .mat-select')) {
      addElement(el, 'dropdown');
    }

    // Tabs
    for (const el of document.querySelectorAll('[role="tab"], [class*="tab"]:not([class*="table"]), mat-tab, .mat-tab-label')) {
      addElement(el, 'tab');
    }

    // Modal triggers (buttons that open modals/dialogs)
    for (const el of document.querySelectorAll('[data-toggle="modal"], [data-bs-toggle="modal"], [class*="modal-trigger"], button[class*="open"], button[class*="add"], button[class*="new"], button[class*="create"]')) {
      addElement(el, 'modal-trigger');
    }

    // Expandable / accordion sections
    for (const el of document.querySelectorAll('[class*="accordion"], [class*="expand"], [class*="collapse"], [class*="collapsible"], details summary, [aria-expanded]')) {
      addElement(el, 'expandable');
    }

    // Action buttons (non-nav buttons)
    for (const el of document.querySelectorAll('button:not([type="submit"]), [role="button"], .btn, .mat-button, .mat-raised-button, .mat-icon-button')) {
      const text = el.textContent?.trim() || '';
      // Skip tiny icon-only buttons and nav buttons
      if (text.length > 0 && text.length < 50) {
        addElement(el, 'button');
      }
    }

    // Menu triggers
    for (const el of document.querySelectorAll('[mat-menu-trigger-for], [matMenuTriggerFor], [class*="menu-trigger"], [aria-haspopup="menu"]')) {
      addElement(el, 'menu-trigger');
    }

    // Date pickers
    for (const el of document.querySelectorAll('[class*="datepicker"], [class*="date-picker"], input[type="date"], mat-datepicker-toggle')) {
      addElement(el, 'datepicker');
    }

    // Toggle switches
    for (const el of document.querySelectorAll('[class*="toggle"], [class*="switch"], mat-slide-toggle, input[type="checkbox"]')) {
      addElement(el, 'toggle');
    }

    return elements;
  });
}

// --- Design Token Extraction ---

async function extractColors(page) {
  return page.evaluate(() => {
    const colorMap = {};
    function rgbToHex(rgb) {
      const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      const [, r, g, b] = match.map(Number);
      if (rgb.includes('rgba') && rgb.match(/,\s*([\d.]+)\)/) && parseFloat(RegExp.$1) === 0) return null;
      return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      for (const prop of ['backgroundColor', 'color', 'borderTopColor', 'borderBottomColor']) {
        const hex = rgbToHex(s[prop]);
        if (hex) colorMap[hex] = (colorMap[hex] || 0) + 1;
      }
    }
    return Object.entries(colorMap).sort((a, b) => b[1] - a[1]).map(([hex, count]) => ({ hex, count }));
  });
}

async function extractTypography(page) {
  return page.evaluate(() => {
    const map = new Map();
    for (const el of document.querySelectorAll('*')) {
      if (!el.textContent?.trim()) continue;
      const hasDirectText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!hasDirectText) continue;
      const s = getComputedStyle(el);
      const key = JSON.stringify({
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
      });
      map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ ...JSON.parse(key), count }));
  });
}

async function extractCSSVariables(page) {
  return page.evaluate(() => {
    const vars = {};
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === ':root' || rule.selectorText === 'html' || rule.selectorText === ':host') {
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop.startsWith('--')) vars[prop] = rule.style.getPropertyValue(prop).trim();
            }
          }
        }
      } catch {}
    }
    return vars;
  });
}

async function extractComponentPatterns(page) {
  return page.evaluate(() => {
    const patterns = [];

    // Tables
    const tables = document.querySelectorAll('table, [class*="table"], [role="grid"], mat-table, .mat-table');
    if (tables.length > 0) {
      const headers = [];
      for (const th of document.querySelectorAll('th, mat-header-cell, .mat-header-cell')) {
        const text = th.textContent?.trim();
        if (text) headers.push(text);
      }
      patterns.push({ type: 'data-table', count: tables.length, sampleHeaders: headers.slice(0, 10) });
    }

    // Cards
    const cards = document.querySelectorAll('[class*="card"], mat-card, .mat-card');
    if (cards.length > 0) patterns.push({ type: 'card', count: cards.length });

    // Forms
    const forms = document.querySelectorAll('form, [class*="form"]');
    const formFields = document.querySelectorAll('input, select, textarea, mat-form-field');
    if (forms.length > 0 || formFields.length > 5) {
      patterns.push({ type: 'form', formCount: forms.length, fieldCount: formFields.length });
    }

    // Charts
    const charts = document.querySelectorAll('canvas, svg[class*="chart"], [class*="chart"], [class*="graph"]');
    if (charts.length > 0) patterns.push({ type: 'chart', count: charts.length });

    // Dialogs / Modals
    const modals = document.querySelectorAll('[role="dialog"], [class*="modal"], mat-dialog, .mat-dialog-container, .cdk-overlay-container');
    if (modals.length > 0) patterns.push({ type: 'modal/dialog', count: modals.length });

    // Lists
    const lists = document.querySelectorAll('mat-list, [class*="list-item"], [role="listbox"]');
    if (lists.length > 0) patterns.push({ type: 'list', count: lists.length });

    // Badges / chips / tags
    const badges = document.querySelectorAll('[class*="badge"], [class*="chip"], [class*="tag"], mat-chip');
    if (badges.length > 0) patterns.push({ type: 'badge/chip', count: badges.length });

    // Progress indicators
    const progress = document.querySelectorAll('[class*="progress"], [role="progressbar"], mat-progress-bar, mat-spinner');
    if (progress.length > 0) patterns.push({ type: 'progress', count: progress.length });

    return patterns;
  });
}

// --- Page Scraping ---

async function scrapePage(page, pageUrl, folder, pageOutDir) {
  mkdirSync(pageOutDir, { recursive: true });
  mkdirSync(resolve(pageOutDir, 'states'), { recursive: true });

  // Navigate (for hash routing, set the hash)
  const currentUrl = page.url();
  if (pageUrl !== currentUrl) {
    try {
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch {
      // Hash navigation might not trigger a real navigation
      await page.evaluate((url) => { window.location.href = url; }, pageUrl);
    }
    await sleep(3000);
  }

  // Scroll to load lazy content
  await scrollToBottom(page);

  // Desktop screenshot
  await takeScreenshot(page, resolve(pageOutDir, 'screenshot-desktop.png'));

  // Extract design data
  const colors = await extractColors(page);
  writeFileSync(resolve(pageOutDir, 'colors.json'), JSON.stringify(colors, null, 2));

  // Merge into global colors
  for (const c of colors) {
    allColors[c.hex] = (allColors[c.hex] || 0) + c.count;
  }

  const typography = await extractTypography(page);
  writeFileSync(resolve(pageOutDir, 'typography.json'), JSON.stringify(typography, null, 2));

  const cssVars = await extractCSSVariables(page);
  writeFileSync(resolve(pageOutDir, 'css-variables.json'), JSON.stringify(cssVars, null, 2));

  const components = await extractComponentPatterns(page);
  writeFileSync(resolve(pageOutDir, 'components.json'), JSON.stringify(components, null, 2));
  allComponents.push({ page: folder, patterns: components });

  // Save HTML snapshot
  const html = await page.content();
  writeFileSync(resolve(pageOutDir, 'snapshot.html'), html, 'utf8');

  // Get page title
  const title = await page.title();

  // Extract page heading
  const heading = await page.evaluate(() => {
    const h = document.querySelector('h1, h2, [class*="page-title"], [class*="header-title"]');
    return h?.textContent?.trim()?.slice(0, 100) || '';
  });

  const pageInfo = {
    url: pageUrl,
    folder,
    title,
    heading,
    components,
    interactiveStates: [],
  };

  // --- Interactive element discovery & clicking ---
  if (!fastMode) {
    const interactiveElements = await discoverInteractiveElements(page);
    log(`    Found ${interactiveElements.length} interactive elements`);
    writeFileSync(resolve(pageOutDir, 'interactive-elements.json'), JSON.stringify(interactiveElements, null, 2));

    let stateIdx = 0;
    for (const el of interactiveElements) {
      if (stateIdx >= 30) {
        log(`    Capping at 30 interactive states per page`);
        break;
      }

      try {
        // Try to click the element
        const clickTarget = await page.$(el.selector);
        if (!clickTarget) continue;

        // Check if visible
        const isVisible = await clickTarget.isVisible().catch(() => false);
        if (!isVisible) continue;

        // Remember current state
        const beforeUrl = page.url();

        // Click it
        await clickTarget.click({ timeout: 3000 }).catch(() => {});
        await sleep(1500);

        // Check what changed
        const afterUrl = page.url();
        const stateChanged = afterUrl !== beforeUrl;

        // Look for new overlays, modals, dropdowns
        const hasOverlay = await page.evaluate(() => {
          const overlay = document.querySelector('[role="dialog"], .cdk-overlay-container *, [class*="modal"][class*="open"], [class*="dropdown"][class*="open"], [class*="menu"][class*="open"], .mat-menu-panel, .mat-select-panel');
          return overlay ? overlay.textContent?.trim()?.slice(0, 200) : null;
        });

        // Screenshot the new state
        const stateName = safeFilename(`${el.type}-${el.text || stateIdx}`);
        const statePath = resolve(pageOutDir, 'states', `${String(stateIdx).padStart(3, '0')}-${stateName}.png`);
        await takeScreenshot(page, statePath);

        const stateInfo = {
          index: stateIdx,
          type: el.type,
          text: el.text,
          selector: el.selector,
          screenshot: `states/${String(stateIdx).padStart(3, '0')}-${stateName}.png`,
          urlChanged: stateChanged,
          newUrl: stateChanged ? afterUrl : null,
          overlayContent: hasOverlay?.slice(0, 200) || null,
        };
        pageInfo.interactiveStates.push(stateInfo);

        navigationGraph.push({
          from: pageUrl,
          action: `${el.type}: ${el.text}`,
          to: stateChanged ? afterUrl : `${pageUrl} [${el.type} open]`,
          screenshot: statePath,
        });

        stateIdx++;

        // Close any overlays / go back if URL changed
        if (hasOverlay) {
          // Press Escape to close modals/dropdowns
          await page.keyboard.press('Escape');
          await sleep(500);
          // Click away from dropdowns
          await page.mouse.click(10, 10);
          await sleep(300);
        }
        if (stateChanged && !afterUrl.includes(beforeUrl.split('#')[1] || '___')) {
          await page.goto(beforeUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
          await sleep(2000);
        }

      } catch (err) {
        // Skip failed interactions silently
      }
    }
  }

  // Generate page brief
  const brief = generatePageBrief(pageInfo, colors, typography, components);
  writeFileSync(resolve(pageOutDir, 'brief.md'), brief, 'utf8');

  return pageInfo;
}

// --- Brief Generator ---

function generatePageBrief(pageInfo, colors, typography, components) {
  const lines = [];
  lines.push(`# ${pageInfo.heading || pageInfo.title || pageInfo.folder}`);
  lines.push(`> URL: ${pageInfo.url}`);
  lines.push('');

  lines.push('## Color Palette (top 15)');
  lines.push('| Hex | Count |');
  lines.push('|-----|-------|');
  for (const c of colors.slice(0, 15)) {
    lines.push(`| \`${c.hex}\` | ${c.count} |`);
  }
  lines.push('');

  lines.push('## Typography (top 8)');
  lines.push('| Font | Size | Weight | Count |');
  lines.push('|------|------|--------|-------|');
  for (const t of typography.slice(0, 8)) {
    const family = t.fontFamily.split(',')[0].trim().replace(/"/g, '');
    lines.push(`| ${family} | ${t.fontSize} | ${t.fontWeight} | ${t.count} |`);
  }
  lines.push('');

  if (components.length > 0) {
    lines.push('## UI Components Found');
    for (const c of components) {
      lines.push(`- **${c.type}** — ${c.count || c.formCount || 0} instances${c.sampleHeaders ? ` (columns: ${c.sampleHeaders.join(', ')})` : ''}`);
    }
    lines.push('');
  }

  if (pageInfo.interactiveStates.length > 0) {
    lines.push('## Interactive States Captured');
    for (const s of pageInfo.interactiveStates) {
      lines.push(`- **${s.type}** "${s.text}" → \`${s.screenshot}\`${s.overlayContent ? ` — content: "${s.overlayContent.slice(0, 80)}..."` : ''}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('*Generated by Frost scrape-app.mjs*');
  return lines.join('\n');
}

// --- INDEX.md Generator ---

function generateSiteIndex(pages) {
  const lines = [];
  lines.push(`# Kultivera Deep Scrape — Site Index`);
  lines.push(`> ${domain} — ${pages.length} pages scraped on ${new Date().toISOString()}`);
  lines.push(`> ${screenshotCounter} total screenshots captured`);
  lines.push('');

  lines.push('## Site Tree');
  lines.push('');
  for (const p of pages) {
    const stateCount = p.interactiveStates?.length || 0;
    const componentList = (p.components || []).map(c => c.type).join(', ');
    lines.push(`### ${p.heading || p.title || p.folder}`);
    lines.push(`- **URL:** ${p.url}`);
    lines.push(`- **Folder:** \`${p.folder}/\``);
    lines.push(`- **Components:** ${componentList || 'none detected'}`);
    lines.push(`- **Interactive states:** ${stateCount}`);
    if (stateCount > 0) {
      for (const s of p.interactiveStates) {
        lines.push(`  - ${s.type}: "${s.text}" → \`${s.screenshot}\``);
      }
    }
    lines.push('');
  }

  lines.push('## Navigation Graph');
  lines.push('');
  lines.push('| From | Action | To |');
  lines.push('|------|--------|-----|');
  for (const edge of navigationGraph.slice(0, 200)) {
    const fromPath = edge.from.split('#')[1] || '/';
    const toPath = typeof edge.to === 'string' ? (edge.to.split('#')[1] || edge.to.slice(0, 60)) : '';
    lines.push(`| ${fromPath} | ${edge.action.slice(0, 50)} | ${toPath} |`);
  }
  lines.push('');

  lines.push('---');
  lines.push('*Generated by Frost scrape-app.mjs*');
  return lines.join('\n');
}

// --- Design System Aggregator ---

function generateDesignSystem() {
  const lines = [];
  lines.push('# Kultivera Design System — Extracted Tokens');
  lines.push(`> Aggregated from ${pageCounter} pages on ${new Date().toISOString()}`);
  lines.push('');

  // Colors
  lines.push('## Color Palette');
  lines.push('| Hex | Total Usage | Likely Role |');
  lines.push('|-----|-------------|-------------|');
  const sortedColors = Object.entries(allColors).sort((a, b) => b[1] - a[1]);
  for (const [hex, count] of sortedColors.slice(0, 40)) {
    lines.push(`| \`${hex}\` | ${count} | |`);
  }
  lines.push('');

  // Component inventory
  lines.push('## Component Inventory');
  const componentCounts = {};
  for (const entry of allComponents) {
    for (const p of entry.patterns) {
      componentCounts[p.type] = (componentCounts[p.type] || 0) + (p.count || 1);
    }
  }
  lines.push('| Component Type | Total Instances |');
  lines.push('|----------------|-----------------|');
  for (const [type, count] of Object.entries(componentCounts).sort((a, b) => b - a)) {
    lines.push(`| ${type} | ${count} |`);
  }
  lines.push('');

  lines.push('---');
  lines.push('*Generated by Frost scrape-app.mjs*');
  return lines.join('\n');
}

// --- Rebuild Plan Generator ---

function generateRebuildPlan(pages) {
  const lines = [];
  lines.push('# Kultivera Rebuild Plan');
  lines.push(`> Generated ${new Date().toISOString()} from deep scrape of ${domain}`);
  lines.push(`> ${pages.length} pages, ${screenshotCounter} screenshots, ${navigationGraph.length} navigation edges`);
  lines.push('');

  lines.push('## 1. Architecture Overview');
  lines.push('');
  lines.push('The original Kultivera app is a single-page application (Angular-based, hash routing).');
  lines.push('It uses Angular Material components extensively.');
  lines.push('');
  lines.push('### Routes Discovered');
  for (const p of pages) {
    const route = p.url.split('#')[1] || '/';
    lines.push(`- \`${route}\` — ${p.heading || p.title || '(untitled)'}`);
  }
  lines.push('');

  lines.push('## 2. Design System');
  lines.push('');
  lines.push('See `DESIGN_SYSTEM.md` for full color palette, typography, and spacing tokens.');
  lines.push('Key implementation notes:');
  lines.push('- Extract the top 10 colors as CSS variables');
  lines.push('- Match font families and weight scale');
  lines.push('- Replicate spacing patterns');
  lines.push('');

  lines.push('## 3. Component Library');
  lines.push('');
  lines.push('Build these shared components first (they appear across multiple pages):');
  const componentCounts = {};
  const componentPages = {};
  for (const entry of allComponents) {
    for (const p of entry.patterns) {
      componentCounts[p.type] = (componentCounts[p.type] || 0) + 1;
      if (!componentPages[p.type]) componentPages[p.type] = [];
      componentPages[p.type].push(entry.page);
    }
  }
  const sorted = Object.entries(componentCounts).sort((a, b) => b[1] - a[1]);
  for (const [type, count] of sorted) {
    lines.push(`### ${type} (used on ${count} pages)`);
    lines.push(`- Found on: ${componentPages[type].slice(0, 5).join(', ')}`);
    lines.push(`- Reference screenshots in those page folders`);
    lines.push('');
  }

  lines.push('## 4. Page-by-Page Rebuild Tasks');
  lines.push('');
  lines.push('Execute in this order (build shared layouts/navigation first, then pages):');
  lines.push('');

  // Group pages by complexity
  const simple = pages.filter(p => (p.interactiveStates?.length || 0) <= 3);
  const complex = pages.filter(p => (p.interactiveStates?.length || 0) > 3);

  lines.push('### Phase A: App Shell & Navigation');
  lines.push('1. Set up app routing (hash-based) matching the discovered routes');
  lines.push('2. Build sidebar navigation with all discovered nav items');
  lines.push('3. Build top bar / header');
  lines.push('4. Implement authentication flow (login page)');
  lines.push('');

  lines.push('### Phase B: Simple Pages');
  for (let i = 0; i < simple.length; i++) {
    const p = simple[i];
    const route = p.url.split('#')[1] || '/';
    const stateCount = p.interactiveStates?.length || 0;
    const componentList = (p.components || []).map(c => c.type).join(', ');
    lines.push(`${i + 1}. **\`${route}\`** — ${p.heading || p.title}`);
    lines.push(`   - Reference: \`${p.folder}/screenshot-desktop.png\``);
    lines.push(`   - Components: ${componentList || 'basic layout'}`);
    lines.push(`   - Interactive states: ${stateCount}`);
  }
  lines.push('');

  lines.push('### Phase C: Complex Pages');
  for (let i = 0; i < complex.length; i++) {
    const p = complex[i];
    const route = p.url.split('#')[1] || '/';
    const stateCount = p.interactiveStates?.length || 0;
    const componentList = (p.components || []).map(c => c.type).join(', ');
    lines.push(`${i + 1}. **\`${route}\`** — ${p.heading || p.title}`);
    lines.push(`   - Reference: \`${p.folder}/screenshot-desktop.png\``);
    lines.push(`   - Components: ${componentList}`);
    lines.push(`   - Interactive states: ${stateCount}`);
    if (p.interactiveStates?.length > 0) {
      lines.push(`   - Key interactions:`);
      for (const s of p.interactiveStates.slice(0, 5)) {
        lines.push(`     - ${s.type}: "${s.text}" → see \`${s.screenshot}\``);
      }
    }
  }
  lines.push('');

  lines.push('## 5. Data Models');
  lines.push('');
  lines.push('Infer from table headers and form fields found across pages.');
  lines.push('See individual page `interactive-elements.json` and `components.json` for field details.');
  lines.push('');

  lines.push('## 6. Asset Checklist');
  lines.push('');
  lines.push('- [ ] Logo / branding images');
  lines.push('- [ ] Icon set (identify which icon library is used)');
  lines.push('- [ ] Font files (check Google Fonts links in page briefs)');
  lines.push('- [ ] Color tokens → CSS variables');
  lines.push('- [ ] Typography scale → Tailwind config or CSS');
  lines.push('');

  lines.push('---');
  lines.push('*Generated by Frost scrape-app.mjs — give this file + the research folder to Claude Code for rebuild*');
  return lines.join('\n');
}

// --- Main ---

async function main() {
  console.log(`\n  ╔══════════════════════════════════════════════════╗`);
  console.log(`  ║  Frost Deep Interactive Scraper                  ║`);
  console.log(`  ║  Target: ${domain.padEnd(40)}║`);
  console.log(`  ║  Mode: ${(fastMode ? 'Fast (pages only)' : 'Full (interactive)').padEnd(42)}║`);
  console.log(`  ╚══════════════════════════════════════════════════╝\n`);

  const browser = await chromium.launch({
    headless: !headed,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    // --- Phase 1: Authenticate ---
    await authenticate(page);

    // --- Phase 2: Discover navigation ---
    await sleep(3000);
    const navItems = await discoverNavigation(page);
    writeFileSync(resolve(runDir, 'navigation.json'), JSON.stringify(navItems, null, 2));

    // Build page list from navigation items
    const pageUrls = new Map(); // url -> label
    // Add current page
    pageUrls.set(page.url(), 'Home / Dashboard');

    for (const item of navItems) {
      let url = '';
      if (item.href.startsWith('http')) {
        url = item.href;
      } else if (item.href.startsWith('#') || item.href.startsWith('/#')) {
        url = `${baseUrl.origin}/${item.href.startsWith('#') ? item.href : item.href.slice(1)}`;
      } else if (item.href.startsWith('/')) {
        url = `${baseUrl.origin}${item.href}`;
      } else if (item.href) {
        url = `${baseUrl.origin}/#/${item.href}`;
      }

      if (url && url.includes(domain)) {
        pageUrls.set(url, item.text);
      }
    }

    // Also try clicking sidebar items directly to discover routes
    log('Clicking sidebar items to discover additional routes...');
    const sidebarLinks = await page.$$('nav a, aside a, [class*="sidebar"] a, [class*="sidenav"] a, [class*="nav-item"] a, mat-nav-list a, [class*="menu-item"] a');
    for (const link of sidebarLinks.slice(0, 50)) {
      try {
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        if (href) {
          const fullUrl = href.startsWith('http') ? href : `${baseUrl.origin}${href.startsWith('/') ? '' : '/'}${href}`;
          if (fullUrl.includes(domain)) {
            pageUrls.set(fullUrl, text?.trim() || '');
          }
        }
      } catch {}
    }

    log(`Discovered ${pageUrls.size} unique pages/routes`);

    // Apply limit
    let urls = [...pageUrls.entries()];
    if (pageLimit < urls.length) {
      urls = urls.slice(0, pageLimit);
      log(`Limited to ${pageLimit} pages`);
    }

    // --- Phase 3: Scrape each page ---
    const pages = [];
    for (let i = 0; i < urls.length; i++) {
      const [pageUrl, label] = urls[i];
      const folder = safeFilename(label || pageUrl.split('#')[1] || `page-${i}`);
      const pageOutDir = resolve(runDir, folder);

      pageCounter++;
      log(`[${i + 1}/${urls.length}] ${label || pageUrl}`);

      try {
        const pageInfo = await scrapePage(page, pageUrl, folder, pageOutDir);
        pages.push(pageInfo);
        log(`  → ${pageInfo.heading || pageInfo.title || '(no title)'} | ${pageInfo.interactiveStates.length} states | ${screenshotCounter} total screenshots`);
      } catch (err) {
        log(`  → FAILED: ${err.message}`);
        pages.push({
          url: pageUrl,
          folder,
          title: `ERROR: ${err.message}`,
          heading: '',
          components: [],
          interactiveStates: [],
        });
      }
    }

    // --- Phase 4: Generate output files ---
    log('Generating site index...');
    writeFileSync(resolve(runDir, 'INDEX.md'), generateSiteIndex(pages), 'utf8');

    log('Generating design system doc...');
    writeFileSync(resolve(runDir, 'DESIGN_SYSTEM.md'), generateDesignSystem(), 'utf8');

    log('Generating rebuild plan...');
    writeFileSync(resolve(runDir, 'REBUILD_PLAN.md'), generateRebuildPlan(pages), 'utf8');

    // Save raw data
    writeFileSync(resolve(runDir, 'site-tree.json'), JSON.stringify(pages, null, 2));
    writeFileSync(resolve(runDir, 'navigation-graph.json'), JSON.stringify(navigationGraph, null, 2));
    writeFileSync(resolve(runDir, 'all-colors.json'), JSON.stringify(
      Object.entries(allColors).sort((a, b) => b[1] - a[1]),
      null, 2
    ));

    console.log(`\n  ╔══════════════════════════════════════════════════╗`);
    console.log(`  ║  SCRAPE COMPLETE                                 ║`);
    console.log(`  ║  Pages: ${String(pages.length).padEnd(42)}║`);
    console.log(`  ║  Screenshots: ${String(screenshotCounter).padEnd(36)}║`);
    console.log(`  ║  Navigation edges: ${String(navigationGraph.length).padEnd(30)}║`);
    console.log(`  ╠══════════════════════════════════════════════════╣`);
    console.log(`  ║  Output: research/${domain}/          ║`);
    console.log(`  ║  Key files:                                      ║`);
    console.log(`  ║    INDEX.md         — site tree & nav map         ║`);
    console.log(`  ║    DESIGN_SYSTEM.md — colors, typography, tokens  ║`);
    console.log(`  ║    REBUILD_PLAN.md  — task-by-task rebuild guide  ║`);
    console.log(`  ╚══════════════════════════════════════════════════╝\n`);

  } catch (err) {
    console.error(`\n  FATAL: ${err.message}\n`);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
