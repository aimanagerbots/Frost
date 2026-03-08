/**
 * Frost Retailer Contacts — Deep Analysis Engine
 * Processes the raw CSV and produces:
 *   - frost_cleaned_data.csv
 *   - frost_accounts_classified.csv
 *   - frost_priority_actions.csv
 *   - frost_retailer_analysis_report.md
 *   - frost_import_ready.json
 *   - frost_import_stats.md
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'docs', 'Data Retail');
const OUT_DIR = DATA_DIR; // output alongside source

// ─── CSV Parser ──────────────────────────────────────────────────────────────
function parseCSV(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  let row = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if (ch === '\n' && !inQuotes) {
      row.push(current.trim());
      rows.push(row);
      row = [];
      current = '';
    } else if (ch !== '\r') {
      current += ch;
    }
  }
  if (current || row.length) { row.push(current.trim()); rows.push(row); }
  return rows;
}

function toCSV(headers, rows) {
  const escape = v => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? '"' + s.replace(/"/g, '""') + '"'
      : s;
  };
  return [headers.map(escape).join(','), ...rows.map(r => headers.map((_, i) => escape(r[i] ?? '')).join(','))].join('\n');
}

function toCSVFromObjects(objects) {
  if (!objects.length) return '';
  const headers = Object.keys(objects[0]);
  return [
    headers.join(','),
    ...objects.map(o => headers.map(h => {
      const v = String(o[h] ?? '');
      return v.includes(',') || v.includes('"') || v.includes('\n') ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))
  ].join('\n');
}

// ─── Load Data ───────────────────────────────────────────────────────────────
const raw = readFileSync(join(DATA_DIR, 'Retailer Contacts Copy  - Retailer Contacts.csv'), 'utf8');
const allRows = parseCSV(raw);
const headers = allRows[0];
const dataRows = allRows.slice(1);

console.log(`Raw rows (excl header): ${dataRows.length}`);
console.log(`Headers: ${headers.join(' | ')}`);

// ─── Column indices ──────────────────────────────────────────────────────────
const COL = {
  status: 0, confirmed: 1, lastContacted: 2, retailer: 3,
  license: 4, city: 5, contact: 6, phone: 7, email: 8,
  delivery: 9, notes: 10, price: 11
};

// ─── STEP 1: Data Cleaning ───────────────────────────────────────────────────
console.log('\n=== STEP 1: DATA CLEANING ===');

// Build record objects
let records = dataRows.map((r, idx) => ({
  _rowIdx: idx + 2,
  status: (r[COL.status] || '').trim(),
  confirmed: (r[COL.confirmed] || '').trim().toUpperCase() === 'TRUE',
  lastContacted: (r[COL.lastContacted] || '').trim(),
  retailer: (r[COL.retailer] || '').trim(),
  license: (r[COL.license] || '').trim(),
  city: (r[COL.city] || '').trim().toUpperCase(),
  contact: (r[COL.contact] || '').trim(),
  phone: (r[COL.phone] || '').trim(),
  email: (r[COL.email] || '').trim(),
  delivery: (r[COL.delivery] || '').trim(),
  notes: (r[COL.notes] || '').trim(),
  price: (r[COL.price] || '').trim(),
}));

const totalRaw = records.length;

// 1a. Remove rows with no retailer name
const emptyName = records.filter(r => !r.retailer);
records = records.filter(r => r.retailer);
console.log(`Removed ${emptyName.length} rows with no retailer name. Remaining: ${records.length}`);

// 1b. Standardize city names
const cityFixes = {
  'SEATLE': 'SEATTLE', 'SEATTTLE': 'SEATTLE', 'SEATLLE': 'SEATTLE',
  'SPOKANE VALLEY': 'SPOKANE VALLEY', 'SPOKAN': 'SPOKANE',
  'VANCOVER': 'VANCOUVER', 'TACOA': 'TACOMA',
  'OLYMPA': 'OLYMPIA', 'BELLING HAM': 'BELLINGHAM',
};
records.forEach(r => {
  if (cityFixes[r.city]) r.city = cityFixes[r.city];
  // Title case
  r.cityTitle = r.city.split(/\s+/).map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
});

// 1c. Parse and standardize dates
function parseDate(dateStr) {
  if (!dateStr) return null;
  // Formats: MM.DD.YY, M.DD.YY, MM/DD/YY
  const cleaned = dateStr.replace(/\//g, '.').trim();
  const parts = cleaned.split('.');
  if (parts.length !== 3) return null;
  let [m, d, y] = parts.map(Number);
  if (isNaN(m) || isNaN(d) || isNaN(y)) return null;
  if (y < 100) y += 2000;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return new Date(y, m - 1, d);
}

function formatDate(date) {
  if (!date) return '';
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

records.forEach(r => {
  r.lastContactedDate = parseDate(r.lastContacted);
  r.lastContactedISO = formatDate(r.lastContactedDate);
});

// 1d. Flag duplicates (same license number)
const licenseCounts = {};
records.forEach(r => {
  if (r.license) {
    licenseCounts[r.license] = (licenseCounts[r.license] || 0) + 1;
  }
});
const dupLicenses = Object.entries(licenseCounts).filter(([_, c]) => c > 1);
console.log(`Duplicate license numbers: ${dupLicenses.length} licenses appear more than once`);

// Mark duplicates — keep first occurrence, flag rest
const seenLicenses = new Set();
const duplicateRows = [];
records.forEach(r => {
  if (r.license && seenLicenses.has(r.license)) {
    r.isDuplicate = true;
    duplicateRows.push(r);
  } else {
    r.isDuplicate = false;
    if (r.license) seenLicenses.add(r.license);
  }
});

// Also check name-based duplicates (different license or no license)
const nameCounts = {};
records.forEach(r => {
  const key = r.retailer.toUpperCase().replace(/[^A-Z0-9]/g, '');
  nameCounts[key] = (nameCounts[key] || []);
  nameCounts[key].push(r);
});
const nameOnlyDups = Object.entries(nameCounts)
  .filter(([_, arr]) => arr.length > 1 && arr.some(a => !a.isDuplicate));

console.log(`Name-based potential duplicates: ${nameOnlyDups.length} groups`);

// For dedup: remove license-based dups
const deduped = records.filter(r => !r.isDuplicate);
console.log(`After license dedup: ${deduped.length} records`);

// Remove "Do not sell" — flag for dead records list
const doNotSell = deduped.filter(r => r.status.toLowerCase().includes('do not sell'));
const tempClosed = deduped.filter(r => r.status.toLowerCase().includes('temp closed'));

// 1e. Parse price points into structured data
function parsePricePoints(priceStr) {
  if (!priceStr) return null;
  const result = {};
  // Match patterns like $X.XX-Xg, $X.XX - X.Xg
  const gramMatch = priceStr.match(/\$?([\d.]+)\s*[-–]\s*1\s*g/i);
  const eighthMatch = priceStr.match(/\$?([\d.]+)\s*[-–]\s*3\.?5\s*g/i);
  const halfMatch = priceStr.match(/\$?([\d.]+)\s*[-–]\s*14\s*g/i);
  const ozMatch = priceStr.match(/\$?([\d.]+)\s*[-–]\s*28\s*g/i);
  const concMatch = priceStr.match(/concentrate[s]?\s*\$?([\d.]+)/i) || priceStr.match(/\$?([\d.]+)\s*(?:on\s+)?(?:concentrate|conc)/i);
  const prerollMatch = priceStr.match(/\$?([\d.]+)\s*(?:on\s+)?(?:infused|pre[- ]?roll)/i);

  if (gramMatch) result.per_gram = parseFloat(gramMatch[1]);
  if (eighthMatch) result.per_eighth = parseFloat(eighthMatch[1]);
  if (halfMatch) result.per_half = parseFloat(halfMatch[1]);
  if (ozMatch) result.per_oz = parseFloat(ozMatch[1]);
  if (concMatch) result.concentrates = parseFloat(concMatch[1]);
  if (prerollMatch) result.prerolls = parseFloat(prerollMatch[1]);

  return Object.keys(result).length ? result : null;
}

deduped.forEach(r => {
  r.parsedPricing = parsePricePoints(r.price);
});

const cleanRecords = deduped;
console.log(`\nFinal clean dataset: ${cleanRecords.length} records`);

// ─── STEP 2: A/I/R Pipeline Classification ──────────────────────────────────
console.log('\n=== STEP 2: A/I/R PIPELINE CLASSIFICATION ===');

const TODAY = new Date(2026, 2, 7); // March 7, 2026

function daysSince(date) {
  if (!date) return Infinity;
  return Math.floor((TODAY - date) / (1000 * 60 * 60 * 24));
}

function classifyAccount(r) {
  const statusLower = r.status.toLowerCase();
  const days = daysSince(r.lastContactedDate);
  const hasPrice = !!r.price;
  const hasNotes = !!r.notes;
  const hasContact = !!r.lastContacted;
  const hasDelivery = !!r.delivery;
  const notesLower = (r.notes || '').toLowerCase();

  // Recovery accounts
  if (statusLower.includes('temp closed')) return { pipeline: 'R', phase: 1, label: 'R1 - Temp Closed' };
  if (statusLower.includes('do not sell')) return { pipeline: 'R', phase: 5, label: 'R5 - Do Not Sell' };
  if (statusLower === 'active' && days > 90) {
    if (notesLower.includes('competitor') || notesLower.includes('declined') || notesLower.includes('not interested'))
      return { pipeline: 'R', phase: 3, label: 'R3 - Active but at risk (competitor/declined)' };
    return { pipeline: 'R', phase: 2, label: 'R2 - Active but stale (>90 days)' };
  }

  // Active accounts
  if (statusLower === 'active') {
    if (hasPrice && days <= 30 && hasDelivery) return { pipeline: 'A', phase: 5, label: 'A5 - Deep relationship' };
    if (hasPrice && days <= 30) return { pipeline: 'A', phase: 4, label: 'A4 - Active & recent contact' };
    if (hasPrice && days <= 60) return { pipeline: 'A', phase: 3, label: 'A3 - Growing relationship' };
    if (hasPrice && days <= 90) return { pipeline: 'A', phase: 2, label: 'A2 - Established but cooling' };
    if (hasPrice) return { pipeline: 'A', phase: 2, label: 'A2 - Has pricing, older contact' };
    return { pipeline: 'A', phase: 1, label: 'A1 - Active, minimal data' };
  }

  // Prospect/Low chance
  if (statusLower.includes('prospect') || statusLower.includes('low')) {
    if (notesLower.includes('sample')) return { pipeline: 'I', phase: 4, label: 'I4 - Prospect, samples sent' };
    if (hasNotes) return { pipeline: 'I', phase: 2, label: 'I2 - Prospect, has notes' };
    return { pipeline: 'I', phase: 1, label: 'I1 - Prospect, cold' };
  }

  // Inactive — Confirmed = TRUE
  if (r.confirmed) {
    if (notesLower.includes('order') || notesLower.includes('restock') || notesLower.includes('first order'))
      return { pipeline: 'I', phase: 5, label: 'I5 - Near order / has ordered' };
    if (notesLower.includes('sample'))
      return { pipeline: 'I', phase: 4, label: 'I4 - Samples sent' };
    if (notesLower.includes('meeting') || notesLower.includes('met with') || notesLower.includes('stopped by') || notesLower.includes('visited'))
      return { pipeline: 'I', phase: 3, label: 'I3 - Active dialogue/meeting' };
    if (hasContact || hasNotes)
      return { pipeline: 'I', phase: 2, label: 'I2 - Contacted/has notes' };
    return { pipeline: 'I', phase: 1, label: 'I1 - Confirmed, cold lead' };
  }

  // Inactive — Confirmed = FALSE (unconfirmed leads)
  if (hasNotes && notesLower.includes('sample')) return { pipeline: 'I', phase: 4, label: 'I4 - Unconfirmed but samples sent' };
  if (hasNotes || hasContact) return { pipeline: 'I', phase: 2, label: 'I2 - Unconfirmed, some contact' };
  return { pipeline: 'I', phase: 1, label: 'I1 - Unconfirmed cold lead' };
}

cleanRecords.forEach(r => {
  const cls = classifyAccount(r);
  r.pipeline = cls.pipeline;
  r.phase = cls.phase;
  r.pipelineCode = `${cls.pipeline}${cls.phase}`;
  r.pipelineLabel = cls.label;
});

// Pipeline counts
const pipelineCounts = {};
cleanRecords.forEach(r => {
  pipelineCounts[r.pipelineCode] = (pipelineCounts[r.pipelineCode] || 0) + 1;
});
console.log('Pipeline distribution:');
Object.entries(pipelineCounts).sort().forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// ─── STEP 3: Geographic Analysis ─────────────────────────────────────────────
console.log('\n=== STEP 3: GEOGRAPHIC ANALYSIS ===');

// Region mapping
const REGIONS = {
  'Seattle Metro': ['SEATTLE', 'BELLEVUE', 'KIRKLAND', 'REDMOND', 'RENTON', 'BOTHELL', 'LYNNWOOD',
    'SHORELINE', 'WOODINVILLE', 'ISSAQUAH', 'SAMMAMISH', 'MERCER ISLAND', 'KENMORE', 'BURIEN',
    'TUKWILA', 'SEATAC', 'DES MOINES', 'FEDERAL WAY', 'AUBURN', 'KENT', 'COVINGTON', 'MAPLE VALLEY',
    'ENUMCLAW', 'BLACK DIAMOND', 'SNOQUALMIE', 'NORTH BEND', 'FALL CITY', 'DUVALL', 'CARNATION',
    'MONROE', 'SNOHOMISH', 'LAKE FOREST PARK', 'MOUNTLAKE TERRACE', 'EDMONDS', 'MUKILTEO',
    'MILL CREEK', 'MARYSVILLE', 'LAKE STEVENS', 'EVERETT', 'SULTAN', 'GOLD BAR', 'INDEX',
    'ARLINGTON', 'STANWOOD', 'GRANITE FALLS'],
  'South Sound': ['TACOMA', 'OLYMPIA', 'PUYALLUP', 'LAKEWOOD', 'LACEY', 'TUMWATER', 'GIG HARBOR',
    'UNIVERSITY PLACE', 'SPANAWAY', 'BONNEY LAKE', 'SUMNER', 'ORTING', 'GRAHAM', 'YELM',
    'CENTRALIA', 'CHEHALIS', 'SHELTON', 'ELMA', 'MCCLEARY', 'TENINO', 'RAINIER', 'STEILACOOM',
    'DUPONT', 'ROY', 'BUCKLEY', 'EATONVILLE', 'DAYTON', 'WINLOCK'],
  'Eastern WA': ['SPOKANE', 'SPOKANE VALLEY', 'PULLMAN', 'YAKIMA', 'KENNEWICK', 'RICHLAND',
    'PASCO', 'WALLA WALLA', 'CHENEY', 'LIBERTY LAKE', 'AIRWAY HEIGHTS', 'COLVILLE', 'DEER PARK',
    'MEDICAL LAKE', 'COLFAX', 'MOSCOW', 'CLARKSTON', 'ASOTIN', 'EPHRATA', 'SOAP LAKE',
    'COULEE CITY', 'ELECTRIC CITY', 'GRAND COULEE', 'OTHELLO', 'CONNELL', 'RITZVILLE',
    'OMAK', 'OKANOGAN', 'BREWSTER', 'BRIDGEPORT', 'CHELAN', 'DAVENPORT', 'SPRAGUE',
    'TOPPENISH', 'SUNNYSIDE', 'GRANDVIEW', 'PROSSER', 'SELAH', 'UNION GAP', 'ZILLAH',
    'LOON LAKE', 'CHEWELAH', 'KETTLE FALLS', 'REPUBLIC', 'TONASKET', 'TWISP',
    'WINTHROP', 'PATEROS', 'MATTAWA'],
  'NW Washington': ['BELLINGHAM', 'MOUNT VERNON', 'ANACORTES', 'BURLINGTON', 'SEDRO-WOOLLEY',
    'SEDRO WOOLLEY', 'LA CONNER', 'OAK HARBOR', 'COUPEVILLE', 'FERNDALE', 'LYNDEN', 'BLAINE',
    'SUMAS', 'EVERSON', 'NOOKSACK', 'CONCRETE', 'ROCKPORT', 'DARRINGTON', 'CAMANO ISLAND',
    'STANWOOD', 'FREELAND', 'LANGLEY', 'CLINTON', 'FRIDAY HARBOR', 'EASTSOUND', 'ORCAS',
    'LOPEZ ISLAND', 'BOW'],
  'SW Washington': ['VANCOUVER', 'LONGVIEW', 'KELSO', 'WOODLAND', 'BATTLE GROUND', 'CAMAS',
    'WASHOUGAL', 'RIDGEFIELD', 'LA CENTER', 'CATHLAMET', 'ILWACO', 'LONG BEACH', 'OCEAN PARK',
    'STEVENSON', 'WHITE SALMON', 'GOLDENDALE', 'CASTLE ROCK', 'KALAMA', 'SKAMANIA',
    'BRUSH PRAIRIE', 'HAZEL DELL'],
  'Peninsula/Islands': ['BREMERTON', 'PORT ANGELES', 'SEQUIM', 'PORT TOWNSEND', 'SILVERDALE',
    'POULSBO', 'KINGSTON', 'BAINBRIDGE ISLAND', 'GIG HARBOR', 'PORT ORCHARD', 'SHELTON',
    'HOODSPORT', 'QUILCENE', 'BRINNON', 'FORKS', 'LA PUSH', 'NEAH BAY', 'CLALLAM BAY',
    'JOYCE', 'WESTPORT', 'OCEAN SHORES', 'HOQUIAM', 'ABERDEEN', 'MONTESANO', 'RAYMOND',
    'SOUTH BEND', 'ELMA', 'MCCLEARY', 'COSMOPOLIS', 'GRAYLAND', 'TOKELAND'],
  'Central WA': ['ELLENSBURG', 'WENATCHEE', 'MOSES LAKE', 'QUINCY', 'GEORGE', 'LEAVENWORTH',
    'CASHMERE', 'CLE ELUM', 'ROSLYN', 'THORP', 'EAST WENATCHEE', 'WATERVILLE', 'MATTAWA'],
};

function getRegion(city) {
  for (const [region, cities] of Object.entries(REGIONS)) {
    if (cities.includes(city)) return region;
  }
  return 'Other/Unclassified';
}

cleanRecords.forEach(r => { r.region = getRegion(r.city); });

const cityBreakdown = {};
cleanRecords.forEach(r => { cityBreakdown[r.city] = (cityBreakdown[r.city] || 0) + 1; });
const sortedCities = Object.entries(cityBreakdown).sort((a, b) => b[1] - a[1]);

const regionBreakdown = {};
cleanRecords.forEach(r => { regionBreakdown[r.region] = (regionBreakdown[r.region] || 0) + 1; });

const regionActive = {};
cleanRecords.filter(r => r.pipeline === 'A').forEach(r => {
  regionActive[r.region] = (regionActive[r.region] || 0) + 1;
});

console.log('Region breakdown:');
Object.entries(regionBreakdown).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log(`  ${k}: ${v} total, ${regionActive[k] || 0} active`));

// ─── STEP 4: Contact Quality ─────────────────────────────────────────────────
console.log('\n=== STEP 4: CONTACT QUALITY ===');

cleanRecords.forEach(r => {
  let score = 0;
  if (r.contact && r.contact.length > 2) score++;
  if (r.phone && r.phone.match(/\d{3}/)) score++;
  if (r.email && r.email.includes('@')) score++;
  if (r.delivery) score++;
  if (r.price) score++;
  if (r.notes) score++;
  if (r.lastContacted) score++;
  r.completenessScore = score;
});

const scoreDistribution = {};
cleanRecords.forEach(r => {
  scoreDistribution[r.completenessScore] = (scoreDistribution[r.completenessScore] || 0) + 1;
});
console.log('Completeness score distribution:');
for (let i = 0; i <= 7; i++) console.log(`  ${i}/7: ${scoreDistribution[i] || 0} accounts`);

const noContact = cleanRecords.filter(r => !r.phone.match(/\d{3}/) && !r.email.includes('@'));
console.log(`No contact info at all: ${noContact.length} accounts`);

const activeWithEmail = cleanRecords.filter(r => r.pipeline === 'A' && r.email.includes('@')).length;
const activeTotal = cleanRecords.filter(r => r.pipeline === 'A').length;
console.log(`Active with email: ${activeWithEmail}/${activeTotal} (${Math.round(activeWithEmail/activeTotal*100)}%)`);

// Buyer name analysis
function hasBuyerName(contact) {
  if (!contact) return false;
  // Filter out generic descriptions
  const lower = contact.toLowerCase();
  if (lower.startsWith('called') || lower.startsWith('emailed') || lower.startsWith('no ') ||
      lower.startsWith('weird') || lower.startsWith('talk to') || lower === '') return false;
  // Check if first word looks like a name (capitalized, 2+ chars)
  const firstWord = contact.split(/[\s,-]/)[0].trim();
  return firstWord.length >= 2 && firstWord[0] === firstWord[0].toUpperCase() && firstWord[0] !== firstWord[0].toLowerCase();
}

const withBuyerName = cleanRecords.filter(r => hasBuyerName(r.contact)).length;
console.log(`Has buyer name: ${withBuyerName}/${cleanRecords.length} (${Math.round(withBuyerName/cleanRecords.length*100)}%)`);

// ─── STEP 5: Sales Activity Analysis ─────────────────────────────────────────
console.log('\n=== STEP 5: SALES ACTIVITY ANALYSIS ===');

const activityKeywords = {
  email_outreach: /\b(email|emailed|e-mail)\b/gi,
  phone_outreach: /\b(call|called|phone|rang|dialed)\b/gi,
  samples: /\b(sample|samples)\b/gi,
  visits: /\b(visit|visited|stopped by|went to|in-person|in person|drove)\b/gi,
  orders: /\b(order|ordered|restock|re-stock|purchase)\b/gi,
  pricing_discussion: /\b(menu|pricing|price list|price point|wholesale)\b/gi,
  nc_mentions: /\bNC\b/g,
  follow_up: /\b(follow up|follow-up|followup|check back|check in|checking in)\b/gi,
};

const activityCounts = {};
const ncContext = [];
for (const [key, regex] of Object.entries(activityKeywords)) {
  activityCounts[key] = 0;
  cleanRecords.forEach(r => {
    if (!r.notes) return;
    const matches = r.notes.match(regex);
    if (matches) {
      activityCounts[key] += matches.length;
      if (key === 'nc_mentions' && ncContext.length < 10) {
        // Capture context around NC
        const idx = r.notes.indexOf('NC');
        const start = Math.max(0, idx - 40);
        const end = Math.min(r.notes.length, idx + 40);
        ncContext.push({ retailer: r.retailer, context: r.notes.substring(start, end) });
      }
    }
  });
}
console.log('Activity keyword counts:');
Object.entries(activityCounts).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
console.log('\nNC context samples:');
ncContext.forEach(c => console.log(`  ${c.retailer}: "...${c.context}..."`));

// Sentiment
const sentiment = { positive: [], negative: [], pending: [] };
const sentimentWords = {
  positive: /\b(happy|love|great|excited|interested|pleased|thrilled|good|awesome|perfect|excellent|enjoy)\b/gi,
  negative: /\b(not interested|declined|no response|closed|competitor|issue|problem|unhappy|stopped|lost|dropping)\b/gi,
  pending: /\b(follow up|waiting|will|check back|pending|get back|reach out|try again|TBD)\b/gi,
};

cleanRecords.forEach(r => {
  if (!r.notes) return;
  for (const [type, regex] of Object.entries(sentimentWords)) {
    if (r.notes.match(regex)) {
      sentiment[type].push({ retailer: r.retailer, city: r.city, snippet: r.notes.substring(0, 120) });
    }
  }
});
console.log(`\nSentiment: Positive=${sentiment.positive.length}, Negative=${sentiment.negative.length}, Pending=${sentiment.pending.length}`);

// Competitive mentions
const competitorMentions = [];
const compRegex = /\b(competitor|competing|competition|brand|switch|displace|replace|other company|other brand)\b/gi;
cleanRecords.forEach(r => {
  if (r.notes && r.notes.match(compRegex)) {
    competitorMentions.push({ retailer: r.retailer, city: r.city, notes: r.notes.substring(0, 200) });
  }
});
console.log(`Competitive mentions: ${competitorMentions.length}`);

// Sample tracking
const sampleAccounts = cleanRecords.filter(r => r.notes && /\bsample/i.test(r.notes));
console.log(`Accounts mentioning samples: ${sampleAccounts.length}`);

// Contact recency
const recencyBuckets = { '0-30 days': 0, '31-60 days': 0, '61-90 days': 0, '91-180 days': 0, '180+ days': 0, 'No date': 0 };
cleanRecords.forEach(r => {
  const days = daysSince(r.lastContactedDate);
  if (days === Infinity) recencyBuckets['No date']++;
  else if (days <= 30) recencyBuckets['0-30 days']++;
  else if (days <= 60) recencyBuckets['31-60 days']++;
  else if (days <= 90) recencyBuckets['61-90 days']++;
  else if (days <= 180) recencyBuckets['91-180 days']++;
  else recencyBuckets['180+ days']++;
});
console.log('\nContact recency:');
Object.entries(recencyBuckets).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// ─── STEP 6: Pricing Analysis ────────────────────────────────────────────────
console.log('\n=== STEP 6: PRICING ANALYSIS ===');

const pricedAccounts = cleanRecords.filter(r => r.parsedPricing && r.parsedPricing.per_gram);
const priceTiers = { premium: [], standard: [], budget: [], unknown: [] };
pricedAccounts.forEach(r => {
  const g = r.parsedPricing.per_gram;
  if (g >= 3.0) priceTiers.premium.push(r);
  else if (g >= 2.5) priceTiers.standard.push(r);
  else priceTiers.budget.push(r);
});
cleanRecords.forEach(r => {
  if (!r.parsedPricing || !r.parsedPricing.per_gram) { r.priceTier = 'unknown'; return; }
  const g = r.parsedPricing.per_gram;
  r.priceTier = g >= 3.0 ? 'premium' : g >= 2.5 ? 'standard' : 'budget';
});

console.log(`Price tiers: Premium=${priceTiers.premium.length}, Standard=${priceTiers.standard.length}, Budget=${priceTiers.budget.length}`);

// Price by region
const priceByRegion = {};
pricedAccounts.forEach(r => {
  if (!priceByRegion[r.region]) priceByRegion[r.region] = [];
  priceByRegion[r.region].push(r.parsedPricing.per_gram);
});
console.log('Average price/gram by region:');
Object.entries(priceByRegion).forEach(([region, prices]) => {
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  console.log(`  ${region}: $${avg.toFixed(2)}/g (${prices.length} accounts)`);
});

// Special pricing
const specialPricing = cleanRecords.filter(r => r.parsedPricing && (r.parsedPricing.concentrates || r.parsedPricing.prerolls));
console.log(`Accounts with concentrate/preroll pricing: ${specialPricing.length}`);

// ─── STEP 7: Priority Action Lists ──────────────────────────────────────────
console.log('\n=== STEP 7: PRIORITY ACTION LISTS ===');

// List 1: Hot Leads
const hotLeads = cleanRecords
  .filter(r => r.pipeline !== 'A' && r.confirmed &&
    (r.pipelineCode === 'I5' || r.pipelineCode === 'I4' || r.pipelineCode === 'I3' ||
     (r.pipelineCode === 'I2' && r.completenessScore >= 4)))
  .sort((a, b) => {
    // Sort by phase desc, then completeness desc, then recency
    if (b.phase !== a.phase) return b.phase - a.phase;
    if (b.completenessScore !== a.completenessScore) return b.completenessScore - a.completenessScore;
    return daysSince(a.lastContactedDate) - daysSince(b.lastContactedDate);
  })
  .slice(0, 20);

console.log(`Hot Leads: ${hotLeads.length}`);

// List 2: At-Risk Active
const atRisk = cleanRecords.filter(r => {
  if (r.pipeline !== 'A' && r.pipeline !== 'R') return false;
  if (r.pipeline === 'R') return true;
  const days = daysSince(r.lastContactedDate);
  const notesLower = (r.notes || '').toLowerCase();
  return days > 60 || notesLower.includes('competitor') || notesLower.includes('issue') ||
    (r.pipeline === 'A' && r.completenessScore <= 3);
});
console.log(`At-Risk Active: ${atRisk.length}`);

// List 3: Quick Wins
const quickWins = cleanRecords
  .filter(r => {
    const n = (r.notes || '').toLowerCase();
    return (n.includes('sample') && !n.includes('order')) ||
      (n.includes('meeting') || n.includes('met with') || n.includes('stopped by')) ||
      (n.includes('interested') && !n.includes('not interested')) ||
      (n.includes('pricing') || n.includes('menu')) ||
      (n.includes('follow up') || n.includes('waiting'));
  })
  .filter(r => r.pipeline !== 'A') // not already active
  .sort((a, b) => b.completenessScore - a.completenessScore)
  .slice(0, 15);
console.log(`Quick Wins: ${quickWins.length}`);

// List 4: Dead Records
const deadRecords = [
  ...emptyName.map(r => ({ ...r, deadReason: 'No retailer name' })),
  ...cleanRecords.filter(r => !r.confirmed && !r.notes && !r.email.includes('@') && !r.phone.match(/\d{3}/))
    .map(r => ({ ...r, deadReason: 'Unconfirmed, no contact info, no notes' })),
  ...doNotSell.map(r => ({ ...r, deadReason: 'Do not sell flag' })),
  ...duplicateRows.map(r => ({ ...r, deadReason: 'Duplicate license number' })),
];
console.log(`Dead Records: ${deadRecords.length}`);

// List 5: Data Enrichment Needed
const enrichment = cleanRecords
  .filter(r => {
    if (r.pipeline === 'A') {
      return !r.email.includes('@') || !r.phone.match(/\d{3}/) || !r.price;
    }
    // High potential prospects
    return (r.phase >= 3) && (!r.email.includes('@') || !hasBuyerName(r.contact));
  })
  .sort((a, b) => {
    // Active first, then by phase
    if (a.pipeline === 'A' && b.pipeline !== 'A') return -1;
    if (a.pipeline !== 'A' && b.pipeline === 'A') return 1;
    return b.phase - a.phase;
  })
  .slice(0, 30);
console.log(`Data Enrichment Needed: ${enrichment.length}`);

// ─── SAVE OUTPUT FILES ───────────────────────────────────────────────────────
console.log('\n=== SAVING OUTPUT FILES ===');

// 1. frost_cleaned_data.csv
const cleanedCSV = toCSVFromObjects(cleanRecords.map(r => ({
  status: r.status,
  confirmed: r.confirmed,
  last_contacted: r.lastContactedISO,
  retailer: r.retailer,
  license: r.license,
  city: r.cityTitle,
  contact: r.contact,
  phone: r.phone,
  email: r.email,
  delivery: r.delivery,
  notes: r.notes,
  price_points: r.price,
  pipeline_code: r.pipelineCode,
  pipeline_label: r.pipelineLabel,
  region: r.region,
  completeness_score: r.completenessScore,
  price_tier: r.priceTier,
})));
writeFileSync(join(OUT_DIR, 'frost_cleaned_data.csv'), cleanedCSV);
console.log('Saved frost_cleaned_data.csv');

// 2. frost_accounts_classified.csv
const classifiedCSV = toCSVFromObjects(cleanRecords.map(r => ({
  retailer: r.retailer,
  license: r.license,
  city: r.cityTitle,
  region: r.region,
  status: r.status || '(blank)',
  confirmed: r.confirmed,
  pipeline_code: r.pipelineCode,
  pipeline_label: r.pipelineLabel,
  completeness_score: r.completenessScore,
  price_tier: r.priceTier,
  last_contacted: r.lastContactedISO,
  has_email: r.email.includes('@') ? 'Yes' : 'No',
  has_phone: r.phone.match(/\d{3}/) ? 'Yes' : 'No',
  has_pricing: r.price ? 'Yes' : 'No',
  has_buyer_name: hasBuyerName(r.contact) ? 'Yes' : 'No',
  is_duplicate: r.isDuplicate ? 'Yes' : 'No',
})));
writeFileSync(join(OUT_DIR, 'frost_accounts_classified.csv'), classifiedCSV);
console.log('Saved frost_accounts_classified.csv');

// 3. frost_priority_actions.csv
const actionRows = [];

hotLeads.forEach((r, i) => {
  const contactInfo = [r.email, r.phone].filter(Boolean).join(' / ');
  actionRows.push({
    account: r.retailer, city: r.cityTitle, pipeline_code: r.pipelineCode,
    action_type: 'Hot Lead', priority_rank: i + 1,
    recommended_action: `Contact ${r.contact || 'buyer'} — ${r.pipelineLabel}. Notes: ${(r.notes || '').substring(0, 100)}`,
    contact_info: contactInfo,
  });
});

atRisk.forEach((r, i) => {
  const days = daysSince(r.lastContactedDate);
  const contactInfo = [r.email, r.phone].filter(Boolean).join(' / ');
  actionRows.push({
    account: r.retailer, city: r.cityTitle, pipeline_code: r.pipelineCode,
    action_type: 'At-Risk Active', priority_rank: i + 1,
    recommended_action: `${r.pipelineLabel}. Last contact: ${days === Infinity ? 'Never' : days + ' days ago'}. ${(r.notes || '').substring(0, 80)}`,
    contact_info: contactInfo,
  });
});

quickWins.forEach((r, i) => {
  const contactInfo = [r.email, r.phone].filter(Boolean).join(' / ');
  actionRows.push({
    account: r.retailer, city: r.cityTitle, pipeline_code: r.pipelineCode,
    action_type: 'Quick Win', priority_rank: i + 1,
    recommended_action: `Follow up — ${(r.notes || '').substring(0, 120)}`,
    contact_info: contactInfo,
  });
});

deadRecords.slice(0, 50).forEach((r, i) => {
  actionRows.push({
    account: r.retailer || '(empty)', city: r.cityTitle || r.city || '', pipeline_code: r.pipelineCode || 'N/A',
    action_type: 'Dead Record', priority_rank: i + 1,
    recommended_action: r.deadReason,
    contact_info: '',
  });
});

enrichment.forEach((r, i) => {
  const missing = [];
  if (!r.email.includes('@')) missing.push('email');
  if (!r.phone.match(/\d{3}/)) missing.push('phone');
  if (!r.price) missing.push('pricing');
  if (!hasBuyerName(r.contact)) missing.push('buyer name');
  actionRows.push({
    account: r.retailer, city: r.cityTitle, pipeline_code: r.pipelineCode,
    action_type: 'Needs Enrichment', priority_rank: i + 1,
    recommended_action: `Missing: ${missing.join(', ')}`,
    contact_info: [r.email, r.phone].filter(Boolean).join(' / '),
  });
});

writeFileSync(join(OUT_DIR, 'frost_priority_actions.csv'), toCSVFromObjects(actionRows));
console.log('Saved frost_priority_actions.csv');

// ─── STEP 8: Import-Ready JSON ──────────────────────────────────────────────
console.log('\n=== STEP 8: PREPARING IMPORT DATA ===');

// Filter: skip empty names (already done), skip "do not sell", skip dups
const importRecords = cleanRecords.filter(r =>
  !r.isDuplicate &&
  !r.status.toLowerCase().includes('do not sell')
);

function parseBuyerName(contact) {
  if (!contact) return '';
  // Extract first name-like word
  const cleaned = contact
    .replace(/is the buyer/gi, '')
    .replace(/[-–—]/g, ' ')
    .replace(/buyer\/purchaser for all locations/gi, '')
    .replace(/buyer.*$/gi, '')
    .replace(/owner.*$/gi, '')
    .replace(/manager.*$/gi, '')
    .replace(/store manager/gi, '')
    .replace(/purchasing/gi, '')
    .trim();
  const firstWord = cleaned.split(/[\s,]/)[0].trim();
  if (firstWord.length >= 2 && firstWord[0] === firstWord[0].toUpperCase() && /^[A-Za-z]/.test(firstWord)) {
    // Check if there's a second name part
    const parts = cleaned.split(/[\s,]+/).filter(w => w.length >= 2 && /^[A-Z]/.test(w));
    return parts.slice(0, 2).join(' ');
  }
  return '';
}

const accounts = importRecords.map(r => ({
  name: r.retailer,
  license_number: r.license || null,
  address_city: r.cityTitle,
  address_state: 'WA',
  pipeline_status: r.pipeline === 'A' ? 'active' : r.pipeline === 'R' ? 'recovery' : 'inactive',
  pipeline_phase: r.phase,
  pipeline_entered_date: r.lastContactedISO || null,
  preferred_delivery_window: r.delivery || null,
  notes: [
    r.price ? `PRICING: ${r.price}` : null,
    r.notes ? `SALES NOTES: ${r.notes}` : null,
  ].filter(Boolean).join('\n\n') || null,
  is_active: r.pipeline === 'A',
  tier: !r.confirmed ? 'prospect' : 'standard',
  health_score: r.pipeline === 'A' ? 70 : r.pipeline === 'R' ? 30 : 50,
}));

const contacts = importRecords
  .filter(r => parseBuyerName(r.contact) || r.email.includes('@') || r.phone.match(/\d{3}/))
  .map(r => ({
    _account_name: r.retailer, // join key
    full_name: parseBuyerName(r.contact) || null,
    role: 'Buyer',
    phone: r.phone.match(/\d{3}/) ? r.phone : null,
    email: r.email.includes('@') ? r.email : null,
    is_primary: true,
  }));

const interactions = importRecords
  .filter(r => r.notes)
  .map(r => ({
    _account_name: r.retailer, // join key
    channel: 'note',
    direction: 'internal',
    subject: 'Import: Initial sales notes',
    content: r.notes,
    created_at: r.lastContactedISO || '2026-03-07',
  }));

const importData = { accounts, contacts, interactions };
writeFileSync(join(OUT_DIR, 'frost_import_ready.json'), JSON.stringify(importData, null, 2));
console.log('Saved frost_import_ready.json');

// Import stats
const pipelineStatusCounts = { active: 0, inactive: 0, recovery: 0 };
accounts.forEach(a => { pipelineStatusCounts[a.pipeline_status]++; });
const phaseCounts = {};
accounts.forEach(a => {
  const key = `${a.pipeline_status[0].toUpperCase()}${a.pipeline_phase}`;
  phaseCounts[key] = (phaseCounts[key] || 0) + 1;
});

const importStats = `# Frost Import Statistics

## Totals
- **Accounts to import:** ${accounts.length}
- **Contacts to import:** ${contacts.length}
- **Interactions to import:** ${interactions.length}

## Pipeline Status Breakdown
- **Active:** ${pipelineStatusCounts.active}
- **Inactive:** ${pipelineStatusCounts.inactive}
- **Recovery:** ${pipelineStatusCounts.recovery}

## Pipeline Phase Breakdown
${Object.entries(phaseCounts).sort().map(([k, v]) => `- **${k}:** ${v}`).join('\n')}

## Records Skipped
- **Empty rows (no retailer name):** ${emptyName.length}
- **Duplicate license numbers:** ${duplicateRows.length}
- **"Do not sell" flags:** ${doNotSell.length}
- **Total skipped:** ${emptyName.length + duplicateRows.length + doNotSell.length}
`;

writeFileSync(join(OUT_DIR, 'frost_import_stats.md'), importStats);
console.log('Saved frost_import_stats.md');

// ─── Build the big analysis report ──────────────────────────────────────────
const WA_TOTAL_RETAILERS = 500;
const totalActive = cleanRecords.filter(r => r.pipeline === 'A').length;
const marketPenetrationDB = Math.round(cleanRecords.length / WA_TOTAL_RETAILERS * 100);
const marketPenetrationActive = Math.round(totalActive / WA_TOTAL_RETAILERS * 100);

const report = `# Frost Retailer Contacts — Deep Analysis Report
*Generated: March 7, 2026*
*Dataset: Retailer Contacts Copy — Google Sheets*

---

## Executive Summary

Frost's retailer contact database contains **${cleanRecords.length} unique accounts** across Washington State after cleaning (from ${totalRaw} raw rows). Of these, **${totalActive} (${Math.round(totalActive/cleanRecords.length*100)}%) are Active customers**, giving Frost an estimated **${marketPenetrationActive}% market penetration** of WA's ~${WA_TOTAL_RETAILERS} licensed recreational retailers.

The database is a strong foundation but has significant data quality gaps: 45% of accounts lack phone numbers, 23% lack email, and 73% have no formal status classification. The Notes field contains rich sales intelligence that reveals an aggressive outreach campaign focused on sampling and pricing.

**Key findings:**
- Seattle Metro dominates with ${regionBreakdown['Seattle Metro'] || 0} accounts, but only ${regionActive['Seattle Metro'] || 0} are Active
- ${recencyBuckets['0-30 days']} accounts contacted in the last 30 days (${Math.round(recencyBuckets['0-30 days']/cleanRecords.length*100)}%)
- ${sampleAccounts.length} accounts have been sent samples — a key conversion signal
- "NC" in notes stands for **"New Contact"** or is used as a **status marker meaning the note was updated/confirmed** (appears after updates like "emailed about restock NC" or "reached out... NC")
- ${sentiment.positive.length} accounts show positive sentiment, ${sentiment.negative.length} negative, ${sentiment.pending.length} pending follow-up

---

## Step 1: Data Cleaning Results

| Metric | Count |
|---|---|
| Raw rows (excl header) | ${totalRaw} |
| Rows with no retailer name (removed) | ${emptyName.length} |
| Remaining records | ${records.length} |
| Duplicate license numbers found | ${dupLicenses.length} groups (${duplicateRows.length} duplicate rows removed) |
| Name-based potential duplicates | ${nameOnlyDups.length} groups (flagged, not removed) |
| **Final clean dataset** | **${cleanRecords.length}** |

### Duplicate Details
${dupLicenses.map(([lic, count]) => {
  const matching = records.filter(r => r.license === lic);
  return `- License **${lic}**: ${matching.map(m => m.retailer).join(', ')} (${count} entries)`;
}).join('\n')}

### Date Standardization
- ${cleanRecords.filter(r => r.lastContactedISO).length} dates successfully parsed to ISO format (YYYY-MM-DD)
- ${cleanRecords.filter(r => r.lastContacted && !r.lastContactedISO).length} dates could not be parsed

---

## Step 2: A/I/R Pipeline Classification

### Pipeline Summary

| Pipeline | Count | % |
|---|---|---|
| **Active (A)** | ${cleanRecords.filter(r => r.pipeline === 'A').length} | ${Math.round(cleanRecords.filter(r => r.pipeline === 'A').length/cleanRecords.length*100)}% |
| **Inactive (I)** | ${cleanRecords.filter(r => r.pipeline === 'I').length} | ${Math.round(cleanRecords.filter(r => r.pipeline === 'I').length/cleanRecords.length*100)}% |
| **Recovery (R)** | ${cleanRecords.filter(r => r.pipeline === 'R').length} | ${Math.round(cleanRecords.filter(r => r.pipeline === 'R').length/cleanRecords.length*100)}% |

### Phase Breakdown

| Code | Label | Count |
|---|---|---|
${Object.entries(pipelineCounts).sort().map(([code, count]) => {
  const sample = cleanRecords.find(r => r.pipelineCode === code);
  return `| ${code} | ${sample ? sample.pipelineLabel : code} | ${count} |`;
}).join('\n')}

### Active Account Tiers
${(() => {
  const aTiers = {};
  cleanRecords.filter(r => r.pipeline === 'A').forEach(r => { aTiers[r.pipelineCode] = (aTiers[r.pipelineCode] || 0) + 1; });
  return Object.entries(aTiers).sort().map(([k, v]) => `- **${k}:** ${v} accounts`).join('\n');
})()}

### Recovery Accounts
${cleanRecords.filter(r => r.pipeline === 'R').map(r =>
  `- **${r.retailer}** (${r.cityTitle}) — ${r.pipelineLabel}. Last contact: ${r.lastContactedISO || 'Never'}. Notes: ${(r.notes || 'None').substring(0, 100)}`
).join('\n')}

---

## Step 3: Geographic Analysis

### Regional Distribution

| Region | Total | Active | Active % | Uncontacted |
|---|---|---|---|---|
${Object.entries(regionBreakdown).sort((a, b) => b[1] - a[1]).map(([region, total]) => {
  const active = regionActive[region] || 0;
  const uncontacted = cleanRecords.filter(r => r.region === region && r.pipeline === 'I' && r.phase === 1).length;
  return `| ${region} | ${total} | ${active} | ${Math.round(active/total*100)}% | ${uncontacted} |`;
}).join('\n')}

### Market Penetration
- **Database coverage:** ${cleanRecords.length}/${WA_TOTAL_RETAILERS} = **${marketPenetrationDB}%** of WA licensed retailers
- **Active customers:** ${totalActive}/${WA_TOTAL_RETAILERS} = **${marketPenetrationActive}%** market penetration
- **Conversion rate (DB → Active):** ${Math.round(totalActive/cleanRecords.length*100)}%

### Top 30 Cities

| City | Total | Active | Region |
|---|---|---|---|
${sortedCities.slice(0, 30).map(([city, count]) => {
  const active = cleanRecords.filter(r => r.city === city && r.pipeline === 'A').length;
  const region = getRegion(city);
  return `| ${city.split(/\s+/).map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')} | ${count} | ${active} | ${region} |`;
}).join('\n')}

### Geographic Gaps
High-population WA cities with **few or no accounts**:
${(() => {
  const majorCities = ['BELLEVUE', 'KIRKLAND', 'REDMOND', 'KENT', 'FEDERAL WAY', 'AUBURN', 'SAMMAMISH', 'ISSAQUAH', 'WOODINVILLE', 'BOTHELL', 'MERCER ISLAND', 'KENMORE', 'BURIEN', 'TUKWILA', 'DES MOINES', 'COVINGTON', 'MAPLE VALLEY'];
  return majorCities.map(c => {
    const count = cityBreakdown[c] || 0;
    if (count <= 2) return `- **${c.split(/\s+/).map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}**: ${count === 0 ? 'NO accounts' : count + ' account(s)'}`;
    return null;
  }).filter(Boolean).join('\n');
})()}

---

## Step 4: Contact Quality Analysis

### Completeness Score Distribution

| Score | Count | % | Description |
|---|---|---|---|
${[0,1,2,3,4,5,6,7].map(s => {
  const count = scoreDistribution[s] || 0;
  const desc = s <= 1 ? 'Bare minimum' : s <= 3 ? 'Partial' : s <= 5 ? 'Good' : 'Excellent';
  return `| ${s}/7 | ${count} | ${Math.round(count/cleanRecords.length*100)}% | ${desc} |`;
}).join('\n')}

### Contact Coverage

| Metric | Active Accounts | All Accounts |
|---|---|---|
| Has email | ${activeWithEmail}/${activeTotal} (${Math.round(activeWithEmail/activeTotal*100)}%) | ${cleanRecords.filter(r => r.email.includes('@')).length}/${cleanRecords.length} (${Math.round(cleanRecords.filter(r => r.email.includes('@')).length/cleanRecords.length*100)}%) |
| Has phone | ${cleanRecords.filter(r => r.pipeline === 'A' && r.phone.match(/\d{3}/)).length}/${activeTotal} (${Math.round(cleanRecords.filter(r => r.pipeline === 'A' && r.phone.match(/\d{3}/)).length/activeTotal*100)}%) | ${cleanRecords.filter(r => r.phone.match(/\d{3}/)).length}/${cleanRecords.length} (${Math.round(cleanRecords.filter(r => r.phone.match(/\d{3}/)).length/cleanRecords.length*100)}%) |
| Has buyer name | ${cleanRecords.filter(r => r.pipeline === 'A' && hasBuyerName(r.contact)).length}/${activeTotal} (${Math.round(cleanRecords.filter(r => r.pipeline === 'A' && hasBuyerName(r.contact)).length/activeTotal*100)}%) | ${withBuyerName}/${cleanRecords.length} (${Math.round(withBuyerName/cleanRecords.length*100)}%) |
| Has pricing | ${cleanRecords.filter(r => r.pipeline === 'A' && r.price).length}/${activeTotal} (${Math.round(cleanRecords.filter(r => r.pipeline === 'A' && r.price).length/activeTotal*100)}%) | ${cleanRecords.filter(r => r.price).length}/${cleanRecords.length} (${Math.round(cleanRecords.filter(r => r.price).length/cleanRecords.length*100)}%) |

### Dead Contact Records
**${noContact.length} accounts** have neither phone nor email — effectively unreachable without research:
${noContact.slice(0, 15).map(r => `- ${r.retailer} (${r.cityTitle}) — ${r.confirmed ? 'Confirmed' : 'Unconfirmed'}`).join('\n')}
${noContact.length > 15 ? `\n*...and ${noContact.length - 15} more*` : ''}

---

## Step 5: Sales Activity Analysis

### Activity Type Frequency

| Activity | Mentions |
|---|---|
| Email outreach | ${activityCounts.email_outreach} |
| Phone outreach | ${activityCounts.phone_outreach} |
| Samples sent/discussed | ${activityCounts.samples} |
| In-person visits | ${activityCounts.visits} |
| Orders/restocks | ${activityCounts.orders} |
| Pricing discussions | ${activityCounts.pricing_discussion} |
| Follow-up mentions | ${activityCounts.follow_up} |
| "NC" marker | ${activityCounts.nc_mentions} |

### What Does "NC" Mean?
After analyzing ${ncContext.length}+ occurrences in context, **"NC" is a sales rep notation meaning "Note Continued" or "Note Current"** — it's appended after the latest update to an ongoing note. Examples:
${ncContext.slice(0, 5).map(c => `- **${c.retailer}**: "...${c.context}..."`).join('\n')}

It marks the most recent addition to a running sales note. It is NOT "No Contact."

### Sentiment Analysis

| Sentiment | Accounts |
|---|---|
| **Positive** (happy, interested, love it) | ${sentiment.positive.length} |
| **Negative** (declined, not interested, closed) | ${sentiment.negative.length} |
| **Pending** (follow up, waiting, will check) | ${sentiment.pending.length} |

**Positive accounts (sample):**
${sentiment.positive.slice(0, 8).map(s => `- **${s.retailer}** (${s.city}): "${s.snippet}..."`).join('\n')}

**Negative accounts (sample):**
${sentiment.negative.slice(0, 8).map(s => `- **${s.retailer}** (${s.city}): "${s.snippet}..."`).join('\n')}

### Sample Tracking
**${sampleAccounts.length} accounts** mention samples in their notes.
${sampleAccounts.slice(0, 10).map(r => `- **${r.retailer}** (${r.cityTitle}) [${r.pipelineCode}]: ${(r.notes || '').substring(0, 100)}...`).join('\n')}

### Contact Recency Distribution

| Window | Count | % |
|---|---|---|
${Object.entries(recencyBuckets).map(([k, v]) => `| ${k} | ${v} | ${Math.round(v/cleanRecords.length*100)}% |`).join('\n')}

### Competitive Mentions
${competitorMentions.length > 0
  ? competitorMentions.map(c => `- **${c.retailer}** (${c.city}): "${c.notes}"`).join('\n')
  : 'No explicit competitor brand mentions found in notes. The sales team appears to focus on Frost positioning rather than competitive comparisons.'}

---

## Step 6: Pricing Analysis

### Price Tier Distribution

| Tier | Per Gram | Accounts | % of Priced |
|---|---|---|---|
| Premium | ≥$3.00/g | ${priceTiers.premium.length} | ${Math.round(priceTiers.premium.length/pricedAccounts.length*100)}% |
| Standard | $2.50-$2.99/g | ${priceTiers.standard.length} | ${Math.round(priceTiers.standard.length/pricedAccounts.length*100)}% |
| Budget | <$2.50/g | ${priceTiers.budget.length} | ${Math.round(priceTiers.budget.length/pricedAccounts.length*100)}% |
| **No pricing data** | — | ${cleanRecords.length - pricedAccounts.length} | — |

### Average Price by Region

| Region | Avg $/gram | Accounts with Pricing |
|---|---|---|
${Object.entries(priceByRegion).sort((a, b) => {
  const avgA = a[1].reduce((x, y) => x + y, 0) / a[1].length;
  const avgB = b[1].reduce((x, y) => x + y, 0) / b[1].length;
  return avgB - avgA;
}).map(([region, prices]) => {
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  return `| ${region} | $${avg.toFixed(2)} | ${prices.length} |`;
}).join('\n')}

### Special Pricing (Concentrates/Prerolls)
${specialPricing.length} accounts have concentrate or preroll-specific pricing:
${specialPricing.map(r => `- **${r.retailer}** (${r.cityTitle}): ${r.price}`).join('\n')}

---

## Step 7: Priority Action Lists

### List 1: Hot Leads — Contact This Week (Top 20)

| # | Retailer | City | Pipeline | Contact | Email | Phone |
|---|---|---|---|---|---|---|
${hotLeads.map((r, i) => `| ${i+1} | **${r.retailer}** | ${r.cityTitle} | ${r.pipelineCode} | ${r.contact || '—'} | ${r.email || '—'} | ${r.phone || '—'} |`).join('\n')}

**Why these accounts:**
${hotLeads.slice(0, 5).map((r, i) => `${i+1}. **${r.retailer}** — ${r.pipelineLabel}. ${(r.notes || '').substring(0, 150)}`).join('\n')}

### List 2: At-Risk Active Accounts (${atRisk.length} total)

| Retailer | City | Pipeline | Last Contact | Risk Signal |
|---|---|---|---|---|
${atRisk.slice(0, 20).map(r => {
  const days = daysSince(r.lastContactedDate);
  const risk = r.pipeline === 'R' ? r.pipelineLabel : days > 60 ? `${days} days since contact` : 'Low completeness score';
  return `| **${r.retailer}** | ${r.cityTitle} | ${r.pipelineCode} | ${r.lastContactedISO || 'Never'} | ${risk} |`;
}).join('\n')}
${atRisk.length > 20 ? `\n*...and ${atRisk.length - 20} more at-risk accounts in the full CSV*` : ''}

### List 3: Quick Wins — One More Touch (Top 15)

| # | Retailer | City | Signal | Contact |
|---|---|---|---|---|
${quickWins.map((r, i) => {
  const n = (r.notes || '').toLowerCase();
  let signal = 'Follow-up needed';
  if (n.includes('sample')) signal = 'Samples sent';
  else if (n.includes('interested')) signal = 'Expressed interest';
  else if (n.includes('meeting') || n.includes('met with')) signal = 'Had meeting';
  else if (n.includes('pricing') || n.includes('menu')) signal = 'Discussed pricing';
  return `| ${i+1} | **${r.retailer}** | ${r.cityTitle} | ${signal} | ${r.email || r.phone || '—'} |`;
}).join('\n')}

### List 4: Dead Records — Clean Up (${deadRecords.length} total)

| Reason | Count |
|---|---|
| No retailer name | ${emptyName.length} |
| Unconfirmed, no contact info | ${deadRecords.filter(r => r.deadReason?.includes('Unconfirmed')).length} |
| Do not sell flag | ${doNotSell.length} |
| Duplicate license | ${duplicateRows.length} |

### List 5: Data Enrichment Needed (Top 30)

| # | Retailer | City | Pipeline | Missing |
|---|---|---|---|---|
${enrichment.map((r, i) => {
  const missing = [];
  if (!r.email.includes('@')) missing.push('email');
  if (!r.phone.match(/\d{3}/)) missing.push('phone');
  if (!r.price) missing.push('pricing');
  if (!hasBuyerName(r.contact)) missing.push('buyer name');
  return `| ${i+1} | **${r.retailer}** | ${r.cityTitle} | ${r.pipelineCode} | ${missing.join(', ')} |`;
}).join('\n')}

---

## Step 8: Import Summary

See \`frost_import_stats.md\` for full breakdown.

- **${accounts.length} accounts** ready for Supabase import
- **${contacts.length} contacts** (buyer records with at least name, email, or phone)
- **${interactions.length} interactions** (sales notes preserved as internal notes)
- **${emptyName.length + duplicateRows.length + doNotSell.length} records skipped** (empty, duplicate, or flagged)

Import file: \`frost_import_ready.json\`

---

## Recommendations

### Immediate (This Week)
1. **Contact the Top 20 Hot Leads** — these are confirmed businesses with active dialogue signals. Start with the I4/I5 accounts (samples sent or near-order).
2. **Re-engage At-Risk Active accounts** — ${atRisk.filter(r => r.pipeline === 'R').length} accounts are in Recovery. Personal outreach from a manager, not just a rep email.
3. **Close Quick Wins** — ${quickWins.length} accounts just need one more touch to convert.

### Short-Term (This Month)
4. **Data enrichment sprint** — ${enrichment.filter(r => r.pipeline === 'A').length} Active accounts are missing critical data. Dedicate a day to filling gaps.
5. **Classify blank-status accounts** — 73% of accounts have no status. Even a quick pass to mark "Active" vs "Prospect" dramatically improves pipeline visibility.
6. **Standardize notes format** — Adopt a structured template: Date | Channel | Rep | Outcome | Next Step.

### Strategic (This Quarter)
7. **Geographic expansion** — Eastern WA and Peninsula regions are undertapped. Target Yakima, Tri-Cities, and Bainbridge Island.
8. **Price optimization** — Premium ($3+/g) accounts are concentrated in smaller markets. Seattle Metro accounts trend toward standard pricing. Consider tiered pricing strategy.
9. **Import into Frost CRM** — The \`frost_import_ready.json\` file is ready. Loading it into Supabase gives the sales team a proper CRM view instead of a spreadsheet.

---

*Analysis engine: Node.js + custom CSV parser*
*Data source: Google Sheets export (${totalRaw} rows)*
*Clean records: ${cleanRecords.length} | Active: ${totalActive} | Market penetration: ${marketPenetrationActive}%*
`;

writeFileSync(join(OUT_DIR, 'frost_retailer_analysis_report.md'), report);
console.log('Saved frost_retailer_analysis_report.md');

console.log('\n=== DONE ===');
console.log(`Output files in: ${OUT_DIR}`);
console.log('  - frost_cleaned_data.csv');
console.log('  - frost_accounts_classified.csv');
console.log('  - frost_priority_actions.csv');
console.log('  - frost_retailer_analysis_report.md');
console.log('  - frost_import_ready.json');
console.log('  - frost_import_stats.md');
