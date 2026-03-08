import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- CLI ---
const args = process.argv.slice(2);
const sitemapMode = args.includes('--sitemap');
const limitArg = args.find(a => a.startsWith('--limit'));
const limitIdx = args.indexOf('--limit');
const pageLimit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const filterArg = args.find(a => a.startsWith('--filter'));
const filterIdx = args.indexOf('--filter');
const filterPath = filterIdx !== -1 ? args[filterIdx + 1] : null;
const rawUrl = args.find(a => !a.startsWith('--') && !(limitIdx !== -1 && args[limitIdx + 1] === a) && !(filterIdx !== -1 && args[filterIdx + 1] === a));

if (!rawUrl) {
  console.error('Usage:');
  console.error('  node scripts/scrape-site.mjs <url>              # single page');
  console.error('  node scripts/scrape-site.mjs <url> --sitemap    # all sitemap pages');
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

// --- Helpers ---

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    const distance = 400;
    const scrollHeight = () => document.body.scrollHeight;
    let currentPos = 0;
    while (currentPos < scrollHeight()) {
      window.scrollBy(0, distance);
      currentPos += distance;
      await delay(100);
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
}

// Turn a URL path into a safe folder name
function pathToFolder(urlStr) {
  const u = new URL(urlStr);
  let p = u.pathname.replace(/\/+$/, '') || '_home';
  p = p.replace(/^\//, '').replace(/\//g, '--');
  return p;
}

// --- Extraction functions ---

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
    const els = document.querySelectorAll('*');
    for (const el of els) {
      const s = getComputedStyle(el);
      for (const prop of ['backgroundColor', 'color', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']) {
        const hex = rgbToHex(s[prop]);
        if (hex) colorMap[hex] = (colorMap[hex] || 0) + 1;
      }
    }
    return Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .map(([hex, count]) => ({ hex, count }));
  });
}

async function extractTypography(page) {
  return page.evaluate(() => {
    const map = new Map();
    const els = document.querySelectorAll('*');
    for (const el of els) {
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
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ ...JSON.parse(key), count }));
  });
}

async function extractSpacing(page) {
  return page.evaluate(() => {
    const margins = {};
    const paddings = {};
    const els = document.querySelectorAll('*');
    for (const el of els) {
      const s = getComputedStyle(el);
      for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
        const m = s[`margin${side}`];
        const p = s[`padding${side}`];
        if (m && m !== '0px') margins[m] = (margins[m] || 0) + 1;
        if (p && p !== '0px') paddings[p] = (paddings[p] || 0) + 1;
      }
    }
    const sortDesc = obj => Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count }));
    return { margins: sortDesc(margins), paddings: sortDesc(paddings) };
  });
}

async function extractMeta(page) {
  return page.evaluate(() => {
    const get = (sel, attr = 'content') =>
      document.querySelector(sel)?.[attr] || document.querySelector(sel)?.getAttribute(attr) || null;
    return {
      title: document.title || null,
      description: get('meta[name="description"]'),
      ogTitle: get('meta[property="og:title"]'),
      ogDescription: get('meta[property="og:description"]'),
      ogImage: get('meta[property="og:image"]'),
      ogType: get('meta[property="og:type"]'),
      twitterCard: get('meta[name="twitter:card"]'),
      twitterTitle: get('meta[name="twitter:title"]'),
      twitterImage: get('meta[name="twitter:image"]'),
      favicon: get('link[rel="icon"]', 'href') || get('link[rel="shortcut icon"]', 'href'),
      themeColor: get('meta[name="theme-color"]'),
      viewport: get('meta[name="viewport"]'),
      canonical: get('link[rel="canonical"]', 'href'),
    };
  });
}

async function extractCSSVariables(page) {
  return page.evaluate(() => {
    const vars = {};
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === ':root' || rule.selectorText === 'html') {
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop.startsWith('--')) {
                vars[prop] = rule.style.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch {
        // Cross-origin stylesheet
      }
    }
    return vars;
  });
}

async function extractAssets(page) {
  return page.evaluate(() => {
    const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"]')].map(el => el.href).filter(Boolean);
    const googleFonts = stylesheets.filter(u => u.includes('fonts.googleapis.com'));
    const scripts = [...document.querySelectorAll('script[src]')].map(el => el.src).filter(Boolean);
    return { stylesheets, googleFonts, scripts: scripts.slice(0, 20) };
  });
}

// --- Brief generator ---

function generateBrief({ domain, url, meta, colors, typography, spacing, cssVars, assets }) {
  const lines = [];
  lines.push(`# Design Intelligence Brief: ${domain}`);
  lines.push(`> Scraped from ${url} on ${new Date().toISOString()}`);
  lines.push('');

  lines.push('## Page Meta');
  lines.push(`- **Title:** ${meta.title || 'N/A'}`);
  lines.push(`- **Description:** ${meta.description || 'N/A'}`);
  if (meta.ogImage) lines.push(`- **OG Image:** ${meta.ogImage}`);
  lines.push('');

  lines.push('## Color Palette (top 20 by frequency)');
  lines.push('| Hex | Usage Count |');
  lines.push('|-----|-------------|');
  for (const c of colors.slice(0, 20)) {
    lines.push(`| \`${c.hex}\` | ${c.count} |`);
  }
  lines.push('');

  lines.push('## Typography (top 10 combinations)');
  lines.push('| Font Family | Size | Weight | Line Height | Count |');
  lines.push('|-------------|------|--------|-------------|-------|');
  for (const t of typography.slice(0, 10)) {
    const family = t.fontFamily.split(',')[0].trim().replace(/"/g, '');
    lines.push(`| ${family} | ${t.fontSize} | ${t.fontWeight} | ${t.lineHeight} | ${t.count} |`);
  }
  lines.push('');

  lines.push('## Spacing Scale');
  lines.push('### Common Margins');
  for (const s of spacing.margins.slice(0, 10)) {
    lines.push(`- \`${s.value}\` (${s.count} uses)`);
  }
  lines.push('### Common Paddings');
  for (const s of spacing.paddings.slice(0, 10)) {
    lines.push(`- \`${s.value}\` (${s.count} uses)`);
  }
  lines.push('');

  const varEntries = Object.entries(cssVars);
  if (varEntries.length > 0) {
    lines.push('## CSS Custom Properties');
    for (const [prop, val] of varEntries.slice(0, 30)) {
      lines.push(`- \`${prop}\`: \`${val}\``);
    }
    if (varEntries.length > 30) lines.push(`- ... and ${varEntries.length - 30} more`);
    lines.push('');
  }

  if (assets.googleFonts.length > 0) {
    lines.push('## Google Fonts');
    for (const f of assets.googleFonts) lines.push(`- ${f}`);
    lines.push('');
  }

  lines.push('## External Stylesheets');
  for (const s of assets.stylesheets.slice(0, 10)) lines.push(`- ${s}`);
  lines.push('');

  lines.push('---');
  lines.push('*Generated by Frost scrape-site.mjs*');
  return lines.join('\n');
}

// --- Scrape a single page ---

async function scrapePage(browser, pageUrl, pageOutDir) {
  mkdirSync(pageOutDir, { recursive: true });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Desktop screenshot
  await scrollToBottom(page);
  await page.screenshot({ path: resolve(pageOutDir, 'screenshot-desktop.png'), fullPage: true });

  // Mobile screenshot
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(2000);
  await scrollToBottom(mobilePage);
  await mobilePage.screenshot({ path: resolve(pageOutDir, 'screenshot-mobile.png'), fullPage: true });
  await mobilePage.close();

  // Extractions
  const colors = await extractColors(page);
  writeFileSync(resolve(pageOutDir, 'colors.json'), JSON.stringify(colors, null, 2));

  const typography = await extractTypography(page);
  writeFileSync(resolve(pageOutDir, 'typography.json'), JSON.stringify(typography, null, 2));

  const spacing = await extractSpacing(page);
  writeFileSync(resolve(pageOutDir, 'spacing.json'), JSON.stringify(spacing, null, 2));

  const meta = await extractMeta(page);
  writeFileSync(resolve(pageOutDir, 'meta.json'), JSON.stringify(meta, null, 2));

  const cssVars = await extractCSSVariables(page);
  writeFileSync(resolve(pageOutDir, 'css-variables.json'), JSON.stringify(cssVars, null, 2));

  const assets = await extractAssets(page);
  writeFileSync(resolve(pageOutDir, 'assets.json'), JSON.stringify(assets, null, 2));

  const html = await page.content();
  writeFileSync(resolve(pageOutDir, 'snapshot.html'), html, 'utf8');

  const brief = generateBrief({ domain, url: pageUrl, meta, colors, typography, spacing, cssVars, assets });
  writeFileSync(resolve(pageOutDir, 'brief.md'), brief, 'utf8');

  await page.close();

  return { meta, colors, typography };
}

// --- Sitemap discovery ---

async function fetchSitemapUrls(siteOrigin) {
  const urls = new Set();

  // Try common sitemap locations
  const candidates = [
    `${siteOrigin}/sitemap.xml`,
    `${siteOrigin}/sitemap_index.xml`,
    `${siteOrigin}/sitemap/sitemap-index.xml`,
  ];

  // Also check robots.txt for sitemap directives
  try {
    const robotsResp = await fetch(`${siteOrigin}/robots.txt`);
    if (robotsResp.ok) {
      const robotsTxt = await robotsResp.text();
      const sitemapLines = robotsTxt.split('\n').filter(l => l.toLowerCase().startsWith('sitemap:'));
      for (const line of sitemapLines) {
        const sitemapUrl = line.split(':').slice(1).join(':').trim();
        if (sitemapUrl) candidates.unshift(sitemapUrl);
      }
    }
  } catch {}

  async function parseSitemap(sitemapUrl, depth = 0) {
    if (depth > 3) return; // prevent infinite recursion
    try {
      const resp = await fetch(sitemapUrl);
      if (!resp.ok) return;
      const text = await resp.text();

      // Extract <loc> tags (works for both sitemap index and regular sitemaps)
      const locs = [...text.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gi)].map(m => m[1].trim());

      for (const loc of locs) {
        // If this loc points to another sitemap XML, recurse into it
        if (loc.endsWith('.xml') || loc.includes('sitemap')) {
          await parseSitemap(loc, depth + 1);
        } else {
          urls.add(loc);
        }
      }

      // If no <loc> found but we got locs at top level, they might all be page URLs
      // Already handled above
    } catch {}
  }

  for (const candidate of candidates) {
    await parseSitemap(candidate);
    if (urls.size > 0) break; // found a working sitemap
  }

  return [...urls];
}

// --- Site-wide index generator ---

function generateSiteIndex(pages) {
  const lines = [];
  lines.push(`# Site Research Index: ${domain}`);
  lines.push(`> ${pages.length} pages scraped on ${new Date().toISOString()}`);
  lines.push('');
  lines.push('| Page | Title | Folder |');
  lines.push('|------|-------|--------|');
  for (const p of pages) {
    const path = new URL(p.url).pathname || '/';
    lines.push(`| ${path} | ${p.title || 'N/A'} | \`${p.folder}/\` |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('*Generated by Frost scrape-site.mjs --sitemap*');
  return lines.join('\n');
}

// --- Main ---

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    if (sitemapMode) {
      // --- Sitemap mode: scrape every page ---
      console.log(`\n  Discovering sitemap for ${domain}...`);
      let urls = await fetchSitemapUrls(baseUrl.origin);

      if (urls.length === 0) {
        console.log('  No sitemap found. Falling back to single page scrape.');
        urls = [baseUrl.href];
      } else {
        // Filter to same domain only
        urls = urls.filter(u => {
          try { return new URL(u).hostname.replace(/^www\./, '') === domain; } catch { return false; }
        });
        // Apply filter
        if (filterPath) {
          urls = urls.filter(u => new URL(u).pathname.includes(filterPath));
          console.log(`  Filtered to ${urls.length} pages matching "${filterPath}".`);
        }

        // Apply limit
        if (pageLimit < urls.length) {
          urls = urls.slice(0, pageLimit);
          console.log(`  Limited to first ${pageLimit} pages.`);
        }

        console.log(`  Scraping ${urls.length} pages.\n`);
      }

      const results = [];
      for (let i = 0; i < urls.length; i++) {
        const pageUrl = urls[i];
        const folder = pathToFolder(pageUrl);
        const pageOutDir = resolve(runDir, folder);

        console.log(`  [${i + 1}/${urls.length}] ${new URL(pageUrl).pathname}`);
        try {
          const { meta } = await scrapePage(browser, pageUrl, pageOutDir);
          results.push({ url: pageUrl, folder, title: meta.title });
          console.log(`    -> ${meta.title || '(no title)'}`);
        } catch (err) {
          console.log(`    -> FAILED: ${err.message}`);
          results.push({ url: pageUrl, folder, title: `ERROR: ${err.message}` });
        }
      }

      // Write site-wide index
      const index = generateSiteIndex(results);
      writeFileSync(resolve(runDir, 'INDEX.md'), index, 'utf8');

      // Write urls manifest
      writeFileSync(resolve(runDir, 'urls.json'), JSON.stringify(urls, null, 2));

      console.log(`\n  Done! ${results.length} pages scraped.`);
      console.log(`  Index: ${resolve(runDir, 'INDEX.md')}`);
      console.log(`  Output: ${runDir}\n`);

    } else {
      // --- Single page mode ---
      console.log(`\n  Scraping: ${baseUrl.href}`);
      console.log(`  Output:   ${runDir}\n`);

      console.log('  [1/9] Desktop screenshot (scrolling page)...');
      console.log('  [2/9] Mobile screenshot...');
      console.log('  [3/9] Extracting colors...');
      console.log('  [4/9] Extracting typography...');
      console.log('  [5/9] Extracting spacing...');
      console.log('  [6/9] Extracting meta tags...');
      console.log('  [7/9] Extracting CSS variables...');
      console.log('  [8/9] Extracting assets...');
      console.log('  [9/9] Saving HTML snapshot...');

      await scrapePage(browser, baseUrl.href, runDir);

      console.log(`\n  Done! 10 files written to:\n  ${runDir}\n`);
    }
  } catch (err) {
    console.error(`\n  Scrape failed: ${err.message}\n`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
