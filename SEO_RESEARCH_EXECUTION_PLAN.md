# Frost SEO Research Execution Plan

> **Purpose**: This document is a master plan for how a Claude Code bot would use maximum skill orchestration to generate a comprehensive SEO research document for Frost, a cannabis producer/processor in Washington state.
>
> **Output**: A second Claude instance will consume this plan to produce a detailed task list, which drives the creation of the final SEO strategy document.

---

## Part 1: Business Context & Constraints

### Who Is Frost?
- Cannabis **producer/processor** in Washington state (NOT a retailer)
- Cannot vertically integrate (WA law prohibits producer/processors from owning retail)
- Sells into a **finite market of ~556 licensed retail stores** (cap set by WSLCB)
- Revenue depends entirely on sell-through at dispensaries Frost doesn't control
- Frost's website connects consumers to dispensary online ordering systems (Dutchie, Jane, etc.)
- The value proposition: Frost drives demand → consumers find products at retail → stores reorder from Frost

### Regulatory Guardrails (WAC 314-55-155)
| Allowed | Prohibited |
|---------|-----------|
| Company website with product info | Online sales (all sales must be at licensed premises) |
| Educational content about products | Medical/therapeutic benefit claims |
| Store locator linking to retailers | Targeting out-of-state consumers |
| Social media (age-gated) | Appealing to minors (imagery, characters, language) |
| Blog posts, video content, YouTube | Giveaways, coupons, free samples, branded merch |
| Effect descriptions ("uplifting, creative") | Health claims ("cures anxiety") |
| Industry event sponsorship | Ads within 1,000ft of schools/parks/libraries |
| Age gate (21+ required on all ads) | Radio/TV (FCC regulated) |
| Google AdWords (with restrictions) | Mobile billboards, vehicle wraps |

**Key Insight**: Frost CAN build a full content-rich website, CAN describe effects, CAN link to retailers, CAN educate consumers — just can't sell direct, make health claims, or target minors/out-of-state.

### How Frost Makes Money from SEO
```
Consumer searches "Blue Dream Washington" or "best edibles Seattle"
    → Finds Frost's website (strain page, product page, blog post)
    → Clicks "Find Near You" → Store locator
    → Redirected to dispensary's online ordering (Dutchie/Jane)
    → Places order for Frost products → picks up in store
    → Dispensary sells through inventory → reorders from Frost
    → Frost revenue increases
```
**The flywheel**: SEO traffic → Brand awareness → Store locator conversions → Retail sell-through → Reorders

---

## Part 2: Frost's Current SEO Assets (Codebase Audit)

### What Exists Today
| Asset | Count | Quality | SEO-Ready? |
|-------|-------|---------|------------|
| Product pages | 42 (6 categories) | Rich terpene/effect/flavor data | ⚠️ No dynamic metadata |
| Strain library | 90+ strains | Detailed lineage, aromas, difficulty | ⚠️ No dynamic metadata |
| Blog posts | 10 | Long-form, categorized, tagged | ⚠️ No dynamic metadata |
| Dispensary listings | 13 locations | Full address, hours, deals, inventory | ⚠️ No schema markup |
| Store locator | ✅ Exists | Maps to online ordering | ✅ Functional |
| Category pages | 6 | Filter/search/sidebar | ⚠️ No dynamic metadata |

### Critical Technical SEO Gaps
| Gap | Impact | Fix Complexity |
|-----|--------|---------------|
| No `sitemap.ts` | Google can't discover 140+ pages | Low — Next.js built-in |
| No `robots.ts` | No crawl directives | Low — Next.js built-in |
| No `generateMetadata()` | Every page has generic title/desc | Medium — per-route |
| No JSON-LD schema | No rich results (Product, LocalBusiness, BlogPosting, FAQ) | Medium — per component |
| No Open Graph images | Poor social sharing | Medium — og image generation |
| No canonical URLs | Potential duplicate content | Low — Next.js metadata |
| No breadcrumbs | No breadcrumb rich results | Low — component + schema |

---

## Part 3: The SEO Strategy Framework

### Keyword Strategy Matrix

Frost should pursue keywords across 5 tiers, prioritized by conversion proximity:

#### Tier 1: HIGH INTENT — Brand + Product (Own Your Name)
- `"Frost cannabis"`, `"Frost Farms flower"`, `"Glacier Extracts cartridge"`
- `"Northern Lights Co edibles"`, `"Frost [product name]"`
- **Difficulty**: Low (branded, nobody else targeting these)
- **Value**: Highest — direct brand searches convert to store locator clicks
- **Strategy**: Ensure Frost.com owns page 1 for all branded queries

#### Tier 2: PRODUCT CATEGORY + LOCAL (Where the Money Is)
- `"edibles Seattle"`, `"live rosin Washington"`, `"THC gummies Tacoma"`
- `"cannabis drinks Spokane"`, `"pre rolls near me"`
- **Difficulty**: Medium (competing with dispensaries and Leafly/Weedmaps)
- **Value**: Very high — purchase-intent searches with geographic qualifier
- **Strategy**: Category pages + local landing pages per metro area

#### Tier 3: STRAIN NAMES (The Traffic Play)
- `"Blue Dream"`, `"Wedding Cake"`, `"Gelato"`, `"Gorilla Glue"`, `"Runtz"`
- 90+ strain pages already exist — massive long-tail surface area
- **Difficulty**: High for head terms (Leafly, Weedmaps, AllBud dominate)
- **Value**: High traffic, medium conversion — users researching before buying
- **Strategy**: Out-content Leafly on strain depth (terpene profiles, pairing guides, grow difficulty). Add "Available at [Store] in [City]" to every strain page.

#### Tier 4: EDUCATIONAL / INFORMATIONAL (Authority Building)
- `"indica vs sativa"`, `"what are terpenes"`, `"how to choose edibles"`
- `"microdosing cannabis"`, `"cannabis for beginners"`, `"THC vs CBD"`
- **Difficulty**: Medium-High (major publications rank here)
- **Value**: Top-of-funnel brand awareness, link building, AI training data
- **Strategy**: Comprehensive guides, FAQ pages, "Cannabis 101" hub

#### Tier 5: DISPENSARY + COMPETITOR NAMES (The Aggressive Play)
- `"Uncle Ike's menu"`, `"Have a Heart Seattle"`, `"Hashtag Cannabis deals"`
- `"Phat Panda strain"`, `"Wyld gummies Washington"`, `"Select cartridge"`
- **Difficulty**: Low-Medium (most dispensaries have weak SEO)
- **Value**: Intercept competitor traffic, capture comparison shoppers
- **Strategy**: "Available at [Dispensary Name]" pages, comparison content, "Frost vs [Competitor]" guides

### Geographic Strategy (Washington Metro Areas)

| Metro Area | Est. Stores | Priority | Content Play |
|-----------|-------------|----------|-------------|
| Seattle/King County | ~150 | Highest | City + neighborhood pages |
| Tacoma/Pierce County | ~50 | High | Metro landing page |
| Spokane | ~40 | High | Eastern WA hub |
| Vancouver/Clark County | ~30 | Medium | Portland-adjacent traffic |
| Olympia/Thurston | ~20 | Medium | Capitol area page |
| Bellingham/Whatcom | ~15 | Medium | College town + border traffic |
| Tri-Cities | ~15 | Medium | Eastern WA |
| Everett/Snohomish | ~25 | High | North Sound page |

### Content Architecture for SEO

```
frost-website.vercel.app/
├── /home                          (brand story, featured products, store CTA)
├── /flower                        (category page — filter, search, 5-up grid)
│   └── /products/flower/[slug]    (product detail — schema, store availability)
├── /pre-rolls                     ...
├── /vaporizers                    ...
├── /concentrates                  ...
├── /edibles                       ...
├── /drinks                        ...
├── /strains                       (strain library — 90+ indexed pages)
│   └── /strains/[slug]            (strain detail — terpenes, effects, products, stores)
├── /blog                          (content hub — 5-up grid)
│   └── /blog/[slug]               (article — schema, internal links)
├── /stores                        (store locator — all 556 WA dispensaries)
│   └── /stores/[city]             (NEW: city-specific store pages)
│   └── /stores/[store-slug]       (NEW: individual store pages with Frost inventory)
├── /learn                         (NEW: Cannabis education hub)
│   └── /learn/terpenes            (NEW: comprehensive terpene guide)
│   └── /learn/indica-vs-sativa    (NEW: keyword-targeted guides)
│   └── /learn/edibles-guide       (NEW: edibles beginner guide)
├── /faq                           (FAQ page — FAQ schema)
├── /about                         (brand story — Organization schema)
├── /wholesale                     (B2B — different audience)
└── /compliance                    (required disclosures)
```

---

## Part 4: Claude Code Execution Plan — Maximum Skill Orchestration

This is the plan a Claude Code bot would follow to produce the full SEO research document. Each phase uses specific skills, agents, and tools for maximum parallelism and depth.

### Phase 0: Session Setup & Context Loading
**Skills**: None (manual)
**Actions**:
1. Read `CLAUDE.md`, `MEMORY.md`, `DEVELOPMENT_LOG.md`
2. Read this execution plan (`SEO_RESEARCH_EXECUTION_PLAN.md`)
3. Scan `apps/website/src/` for current state

### Phase 1: Deep Market Research (8 Parallel Agents)

**Skills Used**: `WebSearch`, `WebFetch`, `gsd:research-phase`
**Agent Strategy**: Launch 8 `general-purpose` agents in parallel, each with a focused research brief

| Agent # | Research Focus | Tools | Output |
|---------|---------------|-------|--------|
| 1 | **WA Regulatory Deep Dive** — Pull full WAC 314-55-155 text, WSLCB enforcement actions, recent rule changes (ESB 5206 draft rules Dec 2025), compliance case studies | `WebSearch` x5, `WebFetch` x3 | `research/01-regulatory.md` |
| 2 | **Keyword Volume & Difficulty** — Use web sources to compile search volume estimates for top 100 cannabis keywords across all 5 tiers. Cross-reference Ahrefs/SEMrush public reports, cannabis SEO agency keyword lists | `WebSearch` x8, `WebFetch` x5 | `research/02-keywords.md` |
| 3 | **WA Dispensary Landscape** — Map all major chains, independents, geographic distribution. Identify which have online ordering, which platforms they use, which carry competitor brands | `WebSearch` x6, `WebFetch` x4 | `research/03-dispensary-landscape.md` |
| 4 | **Competitor Brand Analysis** — Research top 10 WA producer/processor brands (Phat Panda, Artizen, Fireline, Lifted, Fairwinds, etc.). Analyze their websites, SEO presence, content strategy, social following | `WebSearch` x6, `WebFetch` x10 (competitor sites) | `research/04-competitor-brands.md` |
| 5 | **Leafly/Weedmaps SERP Analysis** — For the top 50 strain names, check who ranks #1-#5. Identify where Frost can realistically compete vs where Leafly is unbeatable. Find content gaps | `WebSearch` x10, `WebFetch` x5 | `research/05-serp-analysis.md` |
| 6 | **Cannabis Content Strategy Best Practices** — Research what content types perform best for cannabis brands. Case studies from Cookies, Kiva, Wyld, CANN. Blog, video, social, email approaches | `WebSearch` x6, `WebFetch` x5 | `research/06-content-strategy.md` |
| 7 | **Technical SEO for Cannabis** — Research cannabis-specific technical SEO challenges: age gating impact on crawling, schema markup for cannabis products, Core Web Vitals benchmarks, programmatic SEO for strain/product pages | `WebSearch` x5, `WebFetch` x4 | `research/07-technical-seo.md` |
| 8 | **Local SEO & Store Locator Strategy** — Research how brand-to-retail SEO works in other restricted industries (alcohol, tobacco, pharma). Google Business Profile for producers. Local landing page strategies | `WebSearch` x6, `WebFetch` x4 | `research/08-local-seo.md` |

### Phase 2: Codebase Analysis (3 Parallel Agents)

**Skills Used**: `gsd:map-codebase`, `Explore` agent, `Grep`, `Glob`

| Agent # | Analysis Focus | Tools | Output |
|---------|---------------|-------|--------|
| 9 | **Content Inventory** — Catalog every indexable page, its metadata status, word count, internal links, image alt text. Build the gap analysis spreadsheet | `Explore`, `Glob`, `Read` | `research/09-content-inventory.md` |
| 10 | **Technical SEO Audit** — Check for sitemap, robots, canonical URLs, structured data, page speed indicators, image optimization, heading hierarchy, mobile responsiveness | `Explore`, `Read`, `Bash` (Lighthouse) | `research/10-technical-audit.md` |
| 11 | **Mock Data Quality Audit** — Review strain data, product data, dispensary data for SEO completeness. Are descriptions unique? Are there enough long-tail modifiers? Is the data realistic enough for production? | `Read`, `Grep` | `research/11-data-quality.md` |

### Phase 3: Strategy Synthesis (2 Agents + Skills)

**Skills Used**: `superpowers:brainstorming`, `everything-claude-code:article-writing`, `deep-plan`

| Agent # | Synthesis Focus | Skills | Output |
|---------|----------------|--------|--------|
| 12 | **Keyword Strategy Document** — Synthesize agents 2+5 into a prioritized keyword target list with difficulty scores, monthly volume estimates, content type recommendations, and page assignments | `superpowers:brainstorming` | `research/12-keyword-strategy.md` |
| 13 | **Content Calendar** — Using agents 6+7+8, create a 12-month content calendar with blog topics, landing pages to build, technical SEO tasks, and seasonal cannabis keyword opportunities | `deep-plan` | `research/13-content-calendar.md` |

### Phase 4: Document Assembly (1 Agent)

**Skills Used**: `everything-claude-code:article-writing`

| Agent # | Task | Skills | Output |
|---------|------|--------|--------|
| 14 | **Final Research Document** — Assemble all 13 research outputs into one comprehensive SEO strategy document with executive summary, strategic recommendations, implementation roadmap, KPI framework, and budget estimates | `article-writing` | `FROST_SEO_STRATEGY.md` |

### Phase 5: Review & Validation (3 Parallel Agents)

**Skills Used**: `superpowers:requesting-code-review`, `everything-claude-code:security-reviewer`

| Agent # | Review Focus | Skills | Output |
|---------|-------------|--------|--------|
| 15 | **Regulatory Compliance Review** — Verify every recommendation complies with WAC 314-55-155. Flag any strategy that could violate WA cannabis advertising law | `security-reviewer` pattern | `review/compliance-check.md` |
| 16 | **Feasibility Review** — Assess each recommendation against Frost's current technical stack (Next.js, Vercel, mock data). What can be implemented today vs needs backend? | `code-reviewer` pattern | `review/feasibility-check.md` |
| 17 | **Competitive Viability Review** — Challenge each keyword strategy against realistic competition. Can Frost actually rank? What's the timeline? | `architect` pattern | `review/viability-check.md` |

---

## Part 5: The Final SEO Research Document Structure

The output document (`FROST_SEO_STRATEGY.md`) should follow this structure:

### 1. Executive Summary (1 page)
- Frost's SEO opportunity in 3 sentences
- Top 5 strategic recommendations
- Expected impact (traffic, store locator clicks, brand searches)

### 2. Market Analysis
- 2.1 Washington Cannabis Market Overview (556 stores, market size)
- 2.2 Regulatory Framework (WAC 314-55-155, what's allowed)
- 2.3 Competitive Landscape (top 10 brands, their SEO presence)
- 2.4 Consumer Search Behavior (how WA cannabis consumers search)

### 3. Keyword Strategy
- 3.1 Tier 1: Branded Keywords (protect the brand)
- 3.2 Tier 2: Product + Local (where the money is)
- 3.3 Tier 3: Strain Names (the traffic play)
- 3.4 Tier 4: Educational (authority building)
- 3.5 Tier 5: Competitor/Dispensary Names (the aggressive play)
- 3.6 Full Keyword Target List (100+ keywords with volume, difficulty, priority)

### 4. Content Strategy
- 4.1 Content Pillars (strains, education, product guides, local)
- 4.2 Blog Calendar (12-month plan)
- 4.3 Landing Page Strategy (city pages, store pages, comparison pages)
- 4.4 Content Production Workflow

### 5. Technical SEO Implementation
- 5.1 Sitemap & Robots Configuration
- 5.2 Dynamic Metadata (generateMetadata for all routes)
- 5.3 JSON-LD Schema (Product, LocalBusiness, BlogPosting, FAQ, Organization)
- 5.4 Open Graph & Social Metadata
- 5.5 Core Web Vitals Optimization
- 5.6 Programmatic SEO (auto-generated strain × city pages)

### 6. Local SEO Strategy
- 6.1 Store Locator Optimization
- 6.2 City-Specific Landing Pages
- 6.3 Dispensary Partnership Pages
- 6.4 Google Business Profile (if applicable for producers)

### 7. Link Building & Authority
- 7.1 Cannabis Industry Publications
- 7.2 Local Washington Media
- 7.3 Educational Resource Links
- 7.4 Dispensary Cross-Linking

### 8. Measurement & KPIs
- 8.1 Traffic KPIs (organic sessions, strain page views, blog traffic)
- 8.2 Conversion KPIs (store locator clicks, order-through rate)
- 8.3 Brand KPIs (branded search volume growth, SERP ownership)
- 8.4 Technical KPIs (indexed pages, Core Web Vitals, crawl budget)
- 8.5 Reporting Cadence & Tools

### 9. Implementation Roadmap
- 9.1 Month 1-2: Technical Foundation (sitemap, metadata, schema)
- 9.2 Month 3-4: Content Expansion (strain pages, education hub)
- 9.3 Month 5-6: Local SEO (city pages, store pages)
- 9.4 Month 7-12: Content Velocity & Link Building
- 9.5 Resource Requirements & Budget

### 10. Appendices
- A. Full Keyword Target List (spreadsheet format)
- B. Competitor SEO Scorecard
- C. WAC 314-55-155 Compliance Checklist
- D. Technical SEO Implementation Tickets
- E. Content Brief Templates

---

## Part 6: Skill Usage Summary — Maximum Orchestration

### Total Agent Count: 17 agents across 5 phases

### Skills Invoked:
| Skill | Usage | Phase |
|-------|-------|-------|
| `WebSearch` | ~52 searches across 8 research agents | Phase 1 |
| `WebFetch` | ~40 page fetches (competitor sites, regulation pages, SEO guides) | Phase 1 |
| `gsd:research-phase` | Structure each research agent's output | Phase 1 |
| `gsd:map-codebase` | Audit website codebase for SEO assets | Phase 2 |
| `Explore` agent | Deep file-level analysis of website routes and data | Phase 2 |
| `superpowers:brainstorming` | Keyword strategy synthesis and prioritization | Phase 3 |
| `deep-plan` | Content calendar structuring | Phase 3 |
| `everything-claude-code:article-writing` | Final document assembly | Phase 4 |
| `superpowers:requesting-code-review` | Strategy review pattern | Phase 5 |
| `everything-claude-code:security-reviewer` | Regulatory compliance validation | Phase 5 |
| `everything-claude-code:architect` | Competitive viability assessment | Phase 5 |
| `everything-claude-code:planner` | Implementation roadmap creation | Phase 4 |
| `TodoWrite` | Track progress across all 17 agents | All phases |

### Parallel Execution Windows:
- **Window 1**: Agents 1-8 (all Phase 1 research agents run simultaneously)
- **Window 2**: Agents 9-11 (codebase analysis, can overlap with late Phase 1)
- **Window 3**: Agents 12-13 (synthesis, depends on Phase 1 completion)
- **Window 4**: Agent 14 (document assembly, depends on Phase 3)
- **Window 5**: Agents 15-17 (review agents run simultaneously)

### Estimated Token Budget:
- Phase 1: ~800K tokens (8 agents × ~100K each)
- Phase 2: ~300K tokens (3 agents × ~100K each)
- Phase 3: ~200K tokens (2 agents × ~100K each)
- Phase 4: ~150K tokens (1 agent, heavy writing)
- Phase 5: ~300K tokens (3 review agents × ~100K each)
- **Total: ~1.75M tokens across 17 agents**

---

## Part 7: Key Strategic Questions to Answer

The research document must definitively answer these questions:

### Revenue & ROI
1. How does Frost attribute SEO traffic to actual retail sales?
2. What's the expected ROI timeline for cannabis brand SEO? (6mo? 12mo? 18mo?)
3. What's the cost of NOT doing SEO? (market share erosion, brand invisibility)

### Keyword Strategy
4. Should Frost target competitor BRAND names (Phat Panda, Wyld, etc.)? Legal? Effective?
5. Should Frost target DISPENSARY names (Uncle Ike's, Have a Heart)? What's the play?
6. Can Frost realistically compete with Leafly/Weedmaps for strain keywords?
7. What's the optimal split between informational vs transactional keywords?

### Content
8. How many blog posts per month for meaningful organic growth?
9. Should Frost create city-specific landing pages (e.g., `/seattle/edibles`)?
10. Is programmatic SEO viable? (auto-generating strain × city × dispensary pages)

### Technical
11. Does age-gating (required by WAC) hurt SEO? How do competitors handle it?
12. Should Frost use Next.js ISR or SSG for product/strain pages?
13. What's the right schema markup strategy for cannabis products?

### Competitive
14. Which WA cannabis brands have the strongest SEO? What can Frost learn?
15. Where are the content gaps that nobody is filling?
16. What's Frost's realistic timeline to page 1 for target keywords?

---

## Sources & References

- [WAC 314-55-155 — Cannabis Advertising Requirements](https://app.leg.wa.gov/wac/default.aspx?cite=314-55-155)
- [WSLCB Cannabis Advertising FAQs](https://lcb.wa.gov/enforcement/cannabis_advertising_faqs)
- [WSLCB Draft Rules Update Dec 2025 (ESB 5206)](https://lcb.wa.gov/sites/default/files/2025-12/DRAFT_WAC_314-55-155_Cannabis_Advertising_(ESB%205206).pdf)
- [Cannabis Dispensary SEO Guide — Flowhub](https://www.flowhub.com/learn/cannabis-dispensary-seo-how-to-rank)
- [Cannabis SEO Keywords — MediaJel](https://www.mediajel.com/blogs/cannabis-seo-keywords)
- [Cannabis Marketing Playbook 2026 — StupidDOPE](https://stupiddope.com/2026/02/cannabis-marketing-playbook-2026-seo-ai-authority/)
- [Cannabis Marketing Strategies 2026 — MediaJel](https://www.mediajel.com/blogs/cannabis-marketing-strategies)
- [Cannabis SEO Agency Best Practices — Latched Agency](https://www.latchedagency.com/resources/guide-to-cannabis-seo-in-the-usa)
- [Cannabis SEO Keyword Selection — Cannabis Marketing Association](https://thecannabismarketingassociation.com/the-5-ws-for-selecting-the-right-cannabis-seo-keywords/)
- [Ecommerce SEO for Cannabis 2025 — MRB Marketing](https://www.mrb.marketing/post/can-ecommerce-seo-drive-cannabis-sales-a-2025-update)
- [WSLCB Retail License Increase Announcement](https://lcb.wa.gov/pressreleases/lcb-to-increase-number-of-retail-mj-stores)
- [WA Cannabis Regulations 2026 — Hashtag Cannabis](https://seattlehashtag.com/blog/washingtons-new-cannabis-regulations-to-watch-in-2026)

---

## Appendix A: Research Agent Outputs (Raw Data)

> The following data was gathered by 4 parallel research agents. It supplements the strategy framework in Parts 3-4 with hard numbers.

### A.1 Refined Market Numbers
- **471 active retail stores** (cap is 556, gap = forfeited/revoked licenses being reissued via Social Equity Program)
- **~6.2 dispensaries per 100K residents** (6th highest in the nation)
- **$1.1-1.2B annual cannabis sales** in WA (2025)
- **No delivery allowed** — all online orders are pickup-only
- **Indefinite moratorium** on new retail licenses since 2016 (except 52 social equity licenses: 9 issued as of Feb 2025)
- **~1,146 active producer + processor licenses** — highly fragmented market

### A.2 Top Competitor Brands (SEO Targets)

| Brand | Scale | Website | SEO Threat Level |
|-------|-------|---------|-----------------|
| Phat Panda | 550+ employees, multi-state (WA/CA/MA) | phatpanda.com | Medium — has brand site |
| Wyld | #1 edible brand in America, ~$250M annual | wyldcanna.com | High — polished national site |
| NWCS | 200 staff, 300+ products under 16 brands | nwcs425.com | Medium — product-rich site |
| Artizen | Tier 3, ranked 9th largest NA brand (2021) | artizencannabis.com | Low-Medium |
| Lifted Cannabis | #1 infused flower/pre-roll (Q2 2025) | — | Low — weak web presence |
| Ceres | #1 order volume Q2 2025 | — | Low — weak web presence |

**Key insight**: Most WA producers have weak-to-nonexistent SEO. Wyld is the only real threat with a polished national site. Frost can leapfrog the field.

### A.3 Dispensary Chains (Local SEO Targets)

| Chain | Locations | Online Presence | SEO Play |
|-------|-----------|----------------|----------|
| Uncle Ike's | 5 (all Seattle) | ikes.com — polished | "Available at Uncle Ike's" pages |
| Have a Heart | 5 (WA) | haveaheartcc.com | Store partnership pages |
| The Joint | 4-6 | — | Store partnership pages |
| Hashtag Cannabis | 2 (Seattle) | seattlehashtag.com — **strongest blog** | Content competitor — learn from their approach |
| The Bakeree | 2 (Seattle) | thebakereeseattle.com | Store partnership pages |
| Kaleafa | 3 WA + 7 OR | kaleafa.com | Multi-state chain pages |

### A.4 Keyword Target List (Priority Ranked)

#### TIER 1: Low-Difficulty, High-Value (Attack First)

| Keyword | Volume/mo | KD | Frost Asset |
|---------|----------|-----|-------------|
| Permanent Marker strain | 22,200 | 11 | Strain page |
| Zoap strain | 12,100 | 11 | Strain page |
| Gelonade strain | 12,100 | 10 | Strain page |
| Strawberry Cough strain | 14,800 | 11 | Strain page |
| Gary Payton strain | 22,200 | 13 | Strain page |
| Ice Cream Cake strain | 40,500 | 14 | Strain page |
| Apple Fritter strain | 27,100 | 17 | Strain page |
| THC drinks near me | 1,300 | 8 | Drinks category + store locator |
| Cannabis dehydrate you | 1,300 | 15 | Blog post |
| Can you eat cannabis | 720 | 33 | Blog post |
| Does weed help hangovers | 1,000 | 27 | Blog post |
| Seattle weed delivery | 720 | 24 | Local landing page |

#### TIER 2: Medium-Difficulty, High-Volume (Build Toward)

| Keyword | Volume/mo | KD | Frost Asset |
|---------|----------|-----|-------------|
| Blue Dream strain | 40,500 | 30 | Strain page (already exists) |
| Wedding Cake strain | 40,500 | 32 | Strain page (already exists) + blog post exists |
| Cereal Milk strain | 27,100 | 25 | Strain page |
| Biscotti strain | 22,200 | 32 | Strain page |
| Jealousy strain | 22,200 | 33 | Strain page |
| Gelato strain | 33,100 | 38 | Strain page |
| Runtz strain | 33,100 | 43 | Strain page + blog post exists |
| THC edibles | 9,900 | — | Edibles category page |
| Cannabis flower | 4,400 | — | Flower category page |
| Cannabis concentrates | 2,400 | — | Concentrates category page |
| Seattle dispensary | 2,400 | 62 | Store locator / local page |

#### TIER 3: High-Difficulty, High-Volume (Long-Term Authority)

| Keyword | Volume/mo | KD | Frost Asset |
|---------|----------|-----|-------------|
| Dispensary near me | 2,240,000 | 67 | Store locator |
| CBD gummies | 165,000 | — | Blog content (Frost doesn't sell CBD-only) |
| Girl Scout Cookies strain | 49,500 | 44 | Strain page |
| Gorilla Glue strain | 27,100 | 38 | Strain page |
| Jack Herer strain | 22,200 | 48 | Strain page |
| Sour Diesel strain | 22,200 | 48 | Strain page |
| Indica vs sativa | ~50,000+ | 60+ | Education hub |

### A.5 Blue Ocean Opportunities

| Opportunity | Why It's Blue Ocean | Frost Advantage |
|------------|-------------------|-----------------|
| Cannabis drinks/beverages SEO | KD 8, category exploding, almost no brand content | Northern Lights Co. beverage line (7 products) |
| Terpene education hub | Leafly has thin content, brands don't invest here | 90 strains with full terpene profiles in mock data |
| WA-specific local landing pages | No brand does city-specific cannabis content well | 13 dispensary partners across WA metros |
| Programmatic strain × city pages | "/strains/blue-dream/seattle" — nobody does this | 90 strains × 8 metro areas = 720 pages |
| Cannabis pairing guides | Food/activity + strain pairing is underserved | Blog post already exists ("Pairing Cannabis with PNW Cuisine") |
| Microdosing content | Growing 43% YoY, few authoritative pages | Edible/beverage products are natural fit |

### A.6 Online Ordering Platform Landscape

| Platform | Role | Frost Integration Play |
|---------|------|----------------------|
| Dutchie | Dominant — 6,500+ dispensaries, $22B+ annual | Embed Dutchie links on store locator pages |
| Leafly | Seattle HQ, "Leafly Pickup" ordering | Claim Frost brand page, link to retailers |
| Jane/iheartjane | White-label menus embedded in dispensary sites | Ensure Frost products appear in Jane menus |
| Weedmaps | Listings and menus, massive consumer traffic | Claim brand page, optimize product listings |

### A.7 Regulatory Summary (What Frost CAN Do for SEO)

| SEO Activity | Legal Status | WAC Reference |
|-------------|-------------|---------------|
| Product pages with effects | ALLOWED | WAC 314-55-155 (effect descriptors OK) |
| Store locator with retail links | ALLOWED | Standard industry practice |
| Blog/content marketing | ALLOWED | Educational content permitted |
| Age gate on website | BEST PRACTICE | Not mandated but near-universal |
| Strain pages with terpene data | ALLOWED | Product info is permitted |
| City-specific landing pages | ALLOWED | Location info is permitted |
| "Available at [Store]" pages | ALLOWED | Listing retail partners is standard |
| Health/medical claims | PROHIBITED | WAC 314-55-155 — zero tolerance |
| Out-of-state geo-targeting (paid) | PROHIBITED | Cannot target non-WA residents |
| Giveaway/coupon promotions | PROHIBITED | WAC 314-55-155 — banned |

### Sources (Research Agents)
- [Washington Cannabis Market Study — JLARC 2025](https://leg.wa.gov/jlarc/reports/2025/CannabisMarket/)
- [Cannabis Dispensary & Delivery Keywords — Aperture Growth](https://www.aperturegrowth.co/strategy/cannabis-keywords/)
- [Cannabis SEO Keywords — NisonCo](https://nisonco.com/cannabis-seo-keywords-dispensaries/)
- [Cannabis SEO Keywords Guide — MediaJel](https://www.mediajel.com/blogs/cannabis-seo-keywords)
- [2025 Most Popular Cannabis Strains — Marijuana Herald](https://themarijuanaherald.com/2025/12/2025s-most-popular-cannabis-strains/)
- [GreenState Cannabis Rankings — Washington](https://www.greenstate.com/state-by-state/washington/)
- [Cultivera Q2 2025 Market Report](https://cultivera.com/market-report-q2-2025/)
- [Flowhub Cannabis Industry Statistics 2026](https://www.flowhub.com/cannabis-industry-statistics)
- [Hashtag Cannabis — WA 2026 Regulations](https://seattlehashtag.com/blog/washingtons-new-cannabis-regulations-to-watch-in-2026)
- [LCB Shelf Space / Pay-to-Play](https://medium.com/wslcb-topics-and-trends/shelf-space-or-pay-to-play-agreements-abec1e367d8f)
- [Wyld Cannabis Sales — Headset](https://www.headset.io/brands/wyld)
- [Phat Panda — Official](https://phatpanda.com/)
- [WSLCB Cannabis Advertising FAQ](https://lcb.wa.gov/enforcement/cannabis_advertising_faqs)
- [WAC 314-55-155 — Official Text](https://app.leg.wa.gov/wac/default.aspx?cite=314-55-155)
- [Draft WAC Amendments Dec 2025 (ESB 5206)](https://lcb.wa.gov/sites/default/files/2025-12/DRAFT_WAC_314-55-155_Cannabis_Advertising_(ESB%205206).pdf)
