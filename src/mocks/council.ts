import type { KnowledgeEntry, CouncilSession } from '@/modules/council/types';

function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const knowledgeEntries: KnowledgeEntry[] = [
  // --- Compliance (3) ---
  {
    id: 'kb-comp-1',
    title: 'WSLCB Payment Compliance — 5 Day Rule',
    category: 'compliance',
    content: `Washington State Liquor and Cannabis Board requires all cannabis licensees to remit payment for product within five calendar days of delivery. This applies to all transactions between licensed producers/processors and retailers.\n\nFailure to comply with the 5-day payment rule can result in administrative violations, fines, and potential license suspension. Our internal policy is to flag any account with an outstanding balance past 3 days and escalate at day 4 to ensure we never cross the threshold.\n\nFor accounts on payment plans or extended terms, all arrangements must be documented and pre-approved by the compliance team. No verbal agreements are acceptable under WSLCB audit standards.\n\nThe finance team runs a daily aging report at 8 AM to catch any accounts approaching the deadline. Sales reps are notified immediately when their accounts hit 72 hours outstanding.`,
    lastUpdated: getDateOffset(-5),
    updatedBy: 'Sarah Chen',
    referencedCount: 42,
  },
  {
    id: 'kb-comp-2',
    title: 'CCRS Daily Reporting Requirements',
    category: 'compliance',
    content: `All inventory movements must be reported to the Cannabis Central Reporting System (CCRS) within 24 hours. This includes harvests, transfers, sales, waste/destruction, and adjustments.\n\nOur compliance team runs a reconciliation check every morning at 7 AM comparing our internal inventory system against CCRS. Discrepancies must be resolved the same business day.\n\nManifest creation for transfers between licensed facilities must be completed in CCRS before the product physically leaves the originating facility. Drivers must carry printed manifests during transport.\n\nQuarterly audits compare physical inventory counts to CCRS records. Variance greater than 2% triggers an internal investigation and potential WSLCB notification.`,
    lastUpdated: getDateOffset(-12),
    updatedBy: 'Marcus Rivera',
    referencedCount: 38,
  },
  {
    id: 'kb-comp-3',
    title: 'License Renewal Process',
    category: 'compliance',
    content: `Cannabis licenses in Washington State must be renewed annually. The renewal window opens 90 days before expiration and the application must be submitted no later than 30 days prior.\n\nOur renewal checklist includes: updated floor plans, current ownership documentation, financial disclosures, insurance certificates, and local jurisdiction approval letters. The compliance manager maintains a master calendar of all renewal deadlines.\n\nRenewal fees must be paid at the time of application submission. Late renewals incur additional fees and may result in a gap in licensure during which no operations may be conducted.`,
    lastUpdated: getDateOffset(-30),
    updatedBy: 'Sarah Chen',
    referencedCount: 15,
  },

  // --- Cultivation SOPs (3) ---
  {
    id: 'kb-cult-1',
    title: 'Harvest Timing Protocol',
    category: 'cultivation-sop',
    content: `Harvest timing is determined by a combination of trichome maturity analysis, pistil coloration, and downstream capacity availability. The cultivation lead performs daily trichome checks during the final two weeks of flower.\n\nOptimal harvest window: 70-80% cloudy trichomes with 10-20% amber. Harvesting too early (mostly clear trichomes) results in lower potency and reduced yield. Harvesting too late (majority amber) produces a heavier sedative effect that may not match target profiles.\n\nBefore any harvest is initiated, the cultivation lead must confirm with manufacturing that drying room capacity is available and that the trim team is scheduled. Harvest notifications must be posted in the #cultivation channel at least 48 hours in advance.\n\nAll harvest data (room, strain, wet weight, trichome assessment) must be logged in the cultivation tracker and reported to CCRS within 24 hours.`,
    lastUpdated: getDateOffset(-8),
    updatedBy: 'Jake Morrison',
    referencedCount: 28,
  },
  {
    id: 'kb-cult-2',
    title: 'Dry Room Temperature and Humidity Standards',
    category: 'cultivation-sop',
    content: `Dry rooms must maintain 60°F ± 2°F temperature and 55% ± 5% relative humidity throughout the drying cycle. Standard dry time is 10-14 days depending on density and ambient conditions.\n\nEnvironmental controls are monitored via automated sensors with alerts triggering at ±3°F temperature or ±7% humidity deviation. Any alert must be addressed within 30 minutes during business hours.\n\nAirflow should be indirect — fans should circulate air in the room but never blow directly on hanging plant material. Direct airflow causes uneven drying and can degrade terpene profiles.\n\nDry room logs are maintained daily including temperature, humidity, visual inspection notes, and any corrective actions taken. The cultivation lead signs off on each batch before it moves to trimming.`,
    lastUpdated: getDateOffset(-15),
    updatedBy: 'Jake Morrison',
    referencedCount: 22,
  },
  {
    id: 'kb-cult-3',
    title: 'IPM Guide',
    category: 'cultivation-sop',
    content: `Integrated Pest Management (IPM) is our first line of defense against pests and pathogens. We follow a prevention-first approach: beneficial insects, environmental controls, and cultural practices before any approved pesticide application.\n\nWeekly scouting is mandatory for all rooms. Scouts check undersides of leaves, stems, and soil/media surfaces. Findings are logged in the IPM tracker with photos. Any pest identification triggers a 24-hour response protocol.\n\nApproved biological controls include Stratiolaelaps scimitus (fungus gnat larvae), Amblyseius swirskii (thrips/whitefly), and Phytoseiulus persimilis (spider mites). Chemical controls are limited to WSLCB-approved products only, applied only after biological controls have been attempted.`,
    lastUpdated: getDateOffset(-20),
    updatedBy: 'Priya Patel',
    referencedCount: 19,
  },

  // --- Extraction SOPs (3) ---
  {
    id: 'kb-ext-1',
    title: 'Hydrocarbon Extraction Safety Checklist',
    category: 'extraction-sop',
    content: `Before initiating any hydrocarbon extraction run, the operator must complete the full safety checklist. No exceptions. The checklist includes: gas detection system verification, ventilation fan operation check, fire suppression system status, PPE inspection, and buddy system confirmation.\n\nAll hydrocarbon extraction must be performed in the certified C1D1 room. The door interlock system must be active. If the gas detection system triggers at 10% LEL, all operations halt immediately and the room is evacuated.\n\nPost-run procedures include full system purge, residual solvent testing of the extract, and equipment cleaning. All run data (input weight, solvent volume, output weight, temperatures, pressures) must be logged in the extraction tracker.`,
    lastUpdated: getDateOffset(-10),
    updatedBy: 'Carlos Mendez',
    referencedCount: 31,
  },
  {
    id: 'kb-ext-2',
    title: 'Distillation Temperature Profiles',
    category: 'extraction-sop',
    content: `Short-path distillation temperature profiles are strain-dependent but follow standard ranges. First pass: mantle temperature 140-160°C, head temperature 157-167°C, vacuum 50-200 microns. Second pass (if needed): mantle 150-170°C, head 160-175°C.\n\nTerpene fractions are collected at lower temperatures (120-140°C mantle) before the main cannabinoid pass. These fractions are stored separately for potential reintroduction or sale as terpene isolates.\n\nThe operator must monitor the distillation continuously and adjust parameters based on visual indicators (color of distillate, vapor behavior). Equipment must be fully cooled before disassembly.\n\nAll distillation batches are sampled for potency and residual solvent testing before moving to formulation.`,
    lastUpdated: getDateOffset(-18),
    updatedBy: 'Carlos Mendez',
    referencedCount: 25,
  },
  {
    id: 'kb-ext-3',
    title: 'Solventless Press Procedures',
    category: 'extraction-sop',
    content: `Rosin press operations use heat and pressure to extract cannabinoids without solvents. Input material must be properly cured flower or ice water hash. Fresh frozen material requires pre-processing through ice water extraction first.\n\nStandard press parameters for flower rosin: 190-220°F, 1000-2000 PSI, 60-120 second press time. Hash rosin parameters: 160-190°F, 800-1200 PSI, 45-90 seconds. Parameters are adjusted based on material moisture content and desired consistency.\n\nYield targets: flower rosin 15-25% return, hash rosin 60-80% return from starting hash weight. Yields below target thresholds trigger a review of input material quality and press parameters.`,
    lastUpdated: getDateOffset(-22),
    updatedBy: 'Carlos Mendez',
    referencedCount: 17,
  },

  // --- Sales Playbooks (3) ---
  {
    id: 'kb-sales-1',
    title: 'New Account Onboarding Checklist',
    category: 'sales-playbook',
    content: `New account onboarding follows a structured 30-day process designed to maximize first-order success and set the foundation for a long-term relationship. Day 1: Welcome call, credit application submission, menu review. Day 3-5: First order placed. Day 7: Delivery confirmation and quality check call.\n\nWithin the first 14 days, schedule an in-person vendor day or store visit. Bring product samples for budtender education. Focus on our top 5 SKUs that align with the store's customer profile.\n\nDay 21-30: Follow-up call to review sell-through data, adjust order quantities, and identify any category gaps we can fill. Document all interactions in CRM with next steps and owner assigned.\n\nAccounts that receive a vendor day within the first 30 days show 40% higher retention at 6 months compared to those that don't.`,
    lastUpdated: getDateOffset(-7),
    updatedBy: 'Tanya Williams',
    referencedCount: 35,
  },
  {
    id: 'kb-sales-2',
    title: 'Competitive Displacement Response',
    category: 'sales-playbook',
    content: `When a competitor gains shelf space at one of our accounts, the response must be swift and strategic. Step 1: Confirm the displacement through direct conversation with the buyer. Understand the specific reason (price, product quality, terms, relationship).\n\nStep 2: Assess the competitive threat. Is this a one-time substitution or a strategic shift? Check if the same competitor has displaced us at other accounts recently.\n\nStep 3: Respond with value, not just price. Options include: vendor day scheduling, exclusive strain releases, improved terms (case where justified), or bundled promotions. Dropping price should be a last resort and requires sales manager approval.\n\nStep 4: Document the displacement in CRM as a competitive alert. This feeds the competitor intel module and helps identify patterns across the territory.`,
    lastUpdated: getDateOffset(-14),
    updatedBy: 'Tanya Williams',
    referencedCount: 29,
  },
  {
    id: 'kb-sales-3',
    title: 'Category Expansion Pitch Framework',
    category: 'sales-playbook',
    content: `When pitching a new product category to an existing account, lead with data, not product features. Start with the store's current category mix and identify gaps relative to market trends.\n\nFramework: 1) Show category growth data for their market/neighborhood. 2) Present our specific products and how they fill the identified gap. 3) Offer a low-risk trial — small initial order with a restock guarantee. 4) Commit to budtender training on the new category.\n\nExample: "Edibles are growing 22% YoY in your neighborhood, but you're currently only stocking 3 edible SKUs. Our gummy 10-pack has a 92% reorder rate across similar stores. Let's try a half-case and I'll come in next Tuesday to train your team."`,
    lastUpdated: getDateOffset(-9),
    updatedBy: 'Tanya Williams',
    referencedCount: 24,
  },

  // --- Company (2) ---
  {
    id: 'kb-company-1',
    title: 'Mission Statement & Values',
    category: 'company-info',
    content: `Frost exists to elevate the cannabis industry through operational excellence, genuine relationships, and unwavering quality. We believe that a well-run cannabis company can be a force for good in every community it touches.\n\nOur core values: 1) Quality Without Compromise — from seed to sale, every touchpoint meets our standard. 2) Relationships Over Transactions — we succeed when our retail partners succeed. 3) Data-Driven Decisions — intuition is valuable, but data is definitive. 4) Continuous Improvement — yesterday's best practice is today's baseline.`,
    lastUpdated: getDateOffset(-60),
    updatedBy: 'Michael Torres',
    referencedCount: 12,
  },
  {
    id: 'kb-company-2',
    title: 'Team Communication Standards',
    category: 'company-info',
    content: `Internal communication follows a tiered urgency model. Slack is the primary channel for day-to-day communication. Use appropriate channels: #sales for pipeline updates, #cultivation for grow room status, #compliance for regulatory matters, #general for everything else.\n\nUrgent issues (production stops, compliance alerts, customer escalations) require a direct Slack message to the responsible team lead AND a phone call if no response within 15 minutes. Email is for external communication and formal documentation only.\n\nWeekly all-hands meeting every Monday at 9 AM. Department standups are daily at 8:30 AM. All meetings start on time and have a written agenda posted at least 2 hours in advance.`,
    lastUpdated: getDateOffset(-45),
    updatedBy: 'Michael Torres',
    referencedCount: 8,
  },

  // --- HR Policy (1) ---
  {
    id: 'kb-hr-1',
    title: 'Employee Handbook Summary',
    category: 'hr-policy',
    content: `All employees receive the full handbook during onboarding. Key highlights: PTO accrues at 1.25 days per month (15 days/year) starting day one. Sick leave follows Washington State requirements at 1 hour per 40 hours worked.\n\nCannabis consumption policy: employees may consume cannabis products off-duty and off-premises. On-site consumption is strictly prohibited, including in parking areas. Impairment during work hours is grounds for immediate termination.\n\nBenefits enrollment opens within 30 days of hire date and annually during open enrollment (November). Medical, dental, and vision plans are available with company covering 80% of premiums for individual coverage.\n\nPerformance reviews are conducted quarterly with formal goal-setting in January and July. Compensation adjustments are reviewed annually in January based on performance, market data, and company performance.`,
    lastUpdated: getDateOffset(-90),
    updatedBy: 'Lisa Park',
    referencedCount: 5,
  },
];

const councilSessions: CouncilSession[] = [
  {
    id: 'cs-1',
    question: 'Should we launch a beverage line?',
    agents: [
      {
        name: 'Sales',
        perspective: 'Market opportunity is strong. Three of our top 10 accounts have specifically asked about beverage products in the last quarter. Green State Co\'s seltzers are gaining shelf space at stores where we have flower and edible placements. Capitol Hill Collective allocated 4 linear feet of cooler space for cannabis beverages last month. If we don\'t move soon, competitors will lock up that shelf space. I recommend targeting 5 accounts for a pilot launch within 60 days.',
      },
      {
        name: 'Manufacturing',
        perspective: 'We don\'t currently have the equipment or facility space for beverage production. A canning line, water treatment system, and nano-emulsion technology would require $180K-$250K in capital investment and 3-4 months of build-out. However, we could partner with a co-manufacturer who already has the infrastructure. Two licensed co-manufacturers in the state (Pacific Beverage Co and NW Infusions) are currently taking on new brands. This would reduce our margin but get us to market in 30-45 days instead of 4 months.',
      },
      {
        name: 'Compliance',
        perspective: 'Beverage products have specific labeling requirements under WSLCB that differ from our current product lines. We\'ll need to submit new product templates for approval — typical turnaround is 2-3 weeks. Serving size limitations (max 10mg THC per serving) and child-resistant packaging requirements apply. If using a co-manufacturer, their facility must be listed on our license or we need a separate processing agreement filed with the board.',
      },
      {
        name: 'Analytics',
        perspective: 'Cannabis beverage category in Washington grew 40% year-over-year, making it the fastest-growing category. However, it still represents only 3.2% of total market revenue. Consumer demographic data shows beverages skew toward new cannabis consumers (21-30 age group) and social-use occasions. Average basket size increases $12 when beverages are added to an existing flower/concentrate purchase. Churn risk: accounts that request a category we don\'t carry are 2.3x more likely to shift volume to competitors who do.',
      },
    ],
    synthesis: 'Recommendation: Launch a beverage pilot using a co-manufacturer to minimize capital risk and accelerate time-to-market. Target 5 accounts that have expressed interest. Start with 2 SKUs (a seltzer and a lemonade) at 10mg THC per serving. Begin compliance paperwork immediately to run parallel with co-manufacturer negotiations. Revisit in-house production decision after 90 days of sell-through data. Estimated pilot cost: $25K-$35K. Expected break-even at 60 days post-launch.',
    timestamp: getDateOffset(-2),
    status: 'completed',
  },
  {
    id: 'cs-2',
    question: 'How should we respond to CloudNine\'s price cut on vape carts?',
    agents: [
      {
        name: 'Sales',
        perspective: 'CloudNine dropped their Stratus 510 Cart to $18 wholesale (was $22) and launched a new Cirrus disposable at $15. We\'ve already lost placements at Pacific Leaf and Rainier Remedies. Two more accounts (Emerald City, Summit Collective) have mentioned the price difference in the last week. Our current wholesale price for comparable products is $24. Matching their price would require a 25% cut and likely erode our premium positioning. I recommend a targeted response at threatened accounts rather than a blanket price cut.',
      },
      {
        name: 'Analytics',
        perspective: 'Historical data shows that when we\'ve competed on price alone, we win back shelf space 30% of the time but reduce overall margin by 18%. When we compete on value (vendor days, exclusive strains, bundled promotions), we retain or recover 65% of threatened placements with only a 6% margin impact. CloudNine\'s margin on the $18 cart is razor-thin — they\'re likely subsidizing with concentrate sales. This pricing isn\'t sustainable long-term.',
      },
      {
        name: 'Manufacturing',
        perspective: 'We can reduce our COGS on 510 carts by approximately $2/unit by switching to a domestic hardware supplier and optimizing our fill process. This would bring our floor price to $20 wholesale while maintaining current margins. However, the hardware change needs 2 weeks for sample validation and testing. We could also introduce a new "value tier" cart using distillate instead of live resin at a lower price point without cannibalizing our premium line.',
      },
    ],
    synthesis: 'Recommendation: Do not engage in a price war. Instead, implement a three-pronged value differentiation strategy. 1) Immediate: Schedule vendor days at the 4 at-risk accounts within the next 2 weeks — focus on budtender education about our live resin quality advantage over CloudNine\'s distillate-based products. 2) Short-term (2-4 weeks): Introduce a value-tier distillate cart at $20 wholesale to compete directly with Cirrus without diluting our premium brand. 3) Medium-term: Reduce premium cart COGS through hardware optimization to improve margin resilience. Monitor CloudNine\'s pricing sustainability quarterly.',
    timestamp: getDateOffset(-5),
    status: 'completed',
  },
  {
    id: 'cs-3',
    question: 'Is Room 3 ready for harvest?',
    agents: [
      {
        name: 'Cultivation',
        perspective: 'Room 3 (Wedding Cake, planted January 15) is at day 62 of flower. Trichome analysis from this morning shows 60% cloudy, 25% clear, and 15% amber on the upper canopy. Lower canopy is running about 5 days behind at 50% cloudy and 40% clear. Pistils are approximately 70% brown. Based on the trichome progression rate over the last week, we estimate optimal harvest window opens in 3 days (day 65) for the upper canopy. Full-room harvest should target day 67-68 to allow the lower canopy to mature. Estimated wet weight: 28-32 lbs across 24 plants.',
      },
      {
        name: 'Manufacturing',
        perspective: 'Dry Room B is currently occupied with the Gelato harvest from last week (day 6 of drying, needs 4-8 more days). Dry Room A is available and can accommodate up to 35 lbs wet weight. Trim team has availability starting Thursday. If we harvest Room 3 on day 67-68, we can get it into Dry Room A with no bottleneck. If we harvest earlier, we\'d need to split between rooms or hold product, which is not ideal for quality consistency.',
      },
    ],
    synthesis: 'Recommendation: Hold harvest for 3 more days to allow trichome maturity to reach optimal 70-80% cloudy range across the full canopy. Target harvest on day 67 (Thursday). Dry Room A is available and trim team is scheduled. Cultivation lead should perform daily trichome checks and escalate if amber percentage exceeds 25% before the target date. Expected yield: 2.4 lbs dry weight (based on historical 8:1 wet-to-dry ratio for Wedding Cake). Notify manufacturing and compliance for CCRS harvest reporting.',
    timestamp: getDateOffset(-1),
    status: 'completed',
  },
];

export function getKnowledgeEntries(category?: string): KnowledgeEntry[] {
  if (category && category !== 'all') {
    return knowledgeEntries.filter((e) => e.category === category);
  }
  return knowledgeEntries;
}

export function getCouncilSessions(): CouncilSession[] {
  return councilSessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
