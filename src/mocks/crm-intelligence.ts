// CRM Intelligence & Tools Mock Data

import type {
  RevenueAnalytics,
  AccountHealthModel,
  Forecast,
  ProductRecommendation,
  ComplianceLicense,
  CompliancePayment,
  WinLossEntry,
  Playbook,
  PlaybookExecution,
} from '@/modules/crm/types';

// ─── Revenue Analytics ───────────────────────────────────────

const revenueAnalytics: RevenueAnalytics = {
  period: 'this-quarter',
  totalRevenue: 3_624_000,
  revenueByCategory: [
    { category: 'flower', revenue: 1_449_600, prevRevenue: 1_380_000, change: 5.0 },
    { category: 'preroll', revenue: 724_800, prevRevenue: 690_000, change: 5.0 },
    { category: 'vaporizer', revenue: 543_600, prevRevenue: 580_000, change: -6.3 },
    { category: 'concentrate', revenue: 362_400, prevRevenue: 320_000, change: 13.3 },
    { category: 'edible', revenue: 362_400, prevRevenue: 340_000, change: 6.6 },
    { category: 'beverage', revenue: 181_200, prevRevenue: 165_000, change: 9.8 },
  ],
  revenueByRep: [
    { repId: 'rep-jake', name: 'Jake Morrison', revenue: 1_124_000, target: 1_020_000, pctOfTarget: 110.2 },
    { repId: 'rep-priya', name: 'Priya Patel', revenue: 988_000, target: 1_040_000, pctOfTarget: 95.0 },
    { repId: 'rep-carlos', name: 'Carlos Ruiz', revenue: 812_000, target: 1_040_000, pctOfTarget: 78.1 },
    { repId: 'rep-dana', name: 'Dana Whitfield', revenue: 700_000, target: 700_000, pctOfTarget: 100.0 },
  ],
  revenueByRegion: [
    { region: 'Seattle Metro', revenue: 1_993_200, accounts: 10 },
    { region: 'Tacoma / South Sound', revenue: 724_800, accounts: 5 },
    { region: 'Spokane / East', revenue: 543_600, accounts: 6 },
    { region: 'Other', revenue: 362_400, accounts: 7 },
  ],
  topProducts: [
    { name: 'Frost OG Flower 3.5g', category: 'flower', revenue: 186_400, unitsSold: 4660 },
    { name: 'Blue Dream Flower 3.5g', category: 'flower', revenue: 162_800, unitsSold: 4070 },
    { name: 'Glacier Extracts Live Rosin 1g', category: 'concentrate', revenue: 148_200, unitsSold: 2470 },
    { name: 'Frost Premium Preroll 6-Pack', category: 'preroll', revenue: 134_600, unitsSold: 3846 },
    { name: 'Northern Lights Mango Gummies 10pk', category: 'edible', revenue: 118_400, unitsSold: 5920 },
    { name: 'Indica Blend Preroll 1g', category: 'preroll', revenue: 112_000, unitsSold: 5600 },
    { name: 'Frost Haze Vape Cart 1g', category: 'vaporizer', revenue: 98_600, unitsSold: 1972 },
    { name: 'Sativa Sunrise Flower 7g', category: 'flower', revenue: 94_200, unitsSold: 1884 },
    { name: 'Glacier Live Resin Cart 0.5g', category: 'vaporizer', revenue: 88_400, unitsSold: 2526 },
    { name: 'Frost Sparkling Cannabis Water', category: 'beverage', revenue: 82_600, unitsSold: 6892 },
    { name: 'Purple Punch Flower 3.5g', category: 'flower', revenue: 78_400, unitsSold: 1960 },
    { name: 'Hybrid Blend Preroll 3-Pack', category: 'preroll', revenue: 72_800, unitsSold: 3640 },
    { name: 'Frost CBD Gummies 20pk', category: 'edible', revenue: 68_200, unitsSold: 2273 },
    { name: 'Tangie Dream Vape Cart 1g', category: 'vaporizer', revenue: 64_800, unitsSold: 1296 },
    { name: 'Wedding Cake Flower 3.5g', category: 'flower', revenue: 62_400, unitsSold: 1560 },
    { name: 'Frost Infused Preroll 1g', category: 'preroll', revenue: 58_200, unitsSold: 2910 },
    { name: 'Lemon Haze Live Rosin 0.5g', category: 'concentrate', revenue: 54_600, unitsSold: 1820 },
    { name: 'Frost Cannabis Lemonade', category: 'beverage', revenue: 48_400, unitsSold: 4033 },
    { name: 'GSC Badder 1g', category: 'concentrate', revenue: 44_200, unitsSold: 1105 },
    { name: 'Frost THC Chocolate Bar', category: 'edible', revenue: 42_800, unitsSold: 2140 },
  ],
  monthlyRevenue: [
    { month: '2025-04', flower: 380000, preroll: 190000, vaporizer: 165000, concentrate: 95000, edible: 88000, beverage: 42000 },
    { month: '2025-05', flower: 395000, preroll: 198000, vaporizer: 172000, concentrate: 98000, edible: 92000, beverage: 45000 },
    { month: '2025-06', flower: 410000, preroll: 205000, vaporizer: 178000, concentrate: 102000, edible: 95000, beverage: 48000 },
    { month: '2025-07', flower: 425000, preroll: 212000, vaporizer: 185000, concentrate: 108000, edible: 100000, beverage: 52000 },
    { month: '2025-08', flower: 440000, preroll: 220000, vaporizer: 190000, concentrate: 112000, edible: 104000, beverage: 55000 },
    { month: '2025-09', flower: 435000, preroll: 218000, vaporizer: 186000, concentrate: 110000, edible: 102000, beverage: 53000 },
    { month: '2025-10', flower: 448000, preroll: 224000, vaporizer: 192000, concentrate: 115000, edible: 108000, beverage: 56000 },
    { month: '2025-11', flower: 460000, preroll: 230000, vaporizer: 198000, concentrate: 118000, edible: 112000, beverage: 58000 },
    { month: '2025-12', flower: 475000, preroll: 238000, vaporizer: 204000, concentrate: 122000, edible: 116000, beverage: 62000 },
    { month: '2026-01', flower: 465000, preroll: 232000, vaporizer: 196000, concentrate: 118000, edible: 110000, beverage: 58000 },
    { month: '2026-02', flower: 478000, preroll: 239000, vaporizer: 200000, concentrate: 120000, edible: 118000, beverage: 60000 },
    { month: '2026-03', flower: 490000, preroll: 245000, vaporizer: 184000, concentrate: 124000, edible: 122000, beverage: 63000 },
  ],
};

// ─── Account Health Model ────────────────────────────────────

const healthModel: AccountHealthModel = {
  factors: [
    { name: 'Order Frequency', weight: 25, description: 'How consistently the account places orders relative to their established cadence' },
    { name: 'Revenue Trend', weight: 20, description: 'Direction and magnitude of revenue change over last 90 days vs prior 90 days' },
    { name: 'Payment Reliability', weight: 20, description: 'Percentage of invoices paid within the 5-day compliance window' },
    { name: 'Communication Engagement', weight: 15, description: 'Response rate to outreach, meeting attendance, and inbound inquiry frequency' },
    { name: 'Category Diversity', weight: 10, description: 'Number of product categories ordered — more diverse accounts are stickier' },
    { name: 'Competitive Exposure', weight: 10, description: 'Inverse measure of competitor presence — less competitor shelf space is better' },
  ],
  distribution: [
    { tier: 'Thriving', count: 8, pctChange: 2.0 },
    { tier: 'Healthy', count: 10, pctChange: -1.0 },
    { tier: 'At Risk', count: 6, pctChange: 1.5 },
    { tier: 'Churning', count: 4, pctChange: -2.0 },
  ],
  avgScore: 72.4,
  avgScoreTrend: [68, 69, 70, 71, 70, 71, 72, 71, 73, 72, 73, 72.4],
  correlations: [
    { factor: 'Category Diversity', impact: 'high', description: 'Accounts with >3 categories have 40% lower churn rate' },
    { factor: 'Payment Reliability', impact: 'high', description: 'Payment reliability above 90% correlates with 25% higher lifetime revenue' },
    { factor: 'Communication Engagement', impact: 'medium', description: 'Accounts that respond to outreach within 24hrs are 3x less likely to churn' },
    { factor: 'Competitive Exposure', impact: 'medium', description: 'Accounts with >50% competitor shelf share have 2.5x higher churn risk' },
    { factor: 'VMI Enrollment', impact: 'high', description: 'VMI-enrolled accounts have 60% higher retention and 35% higher AOV' },
  ],
};

// ─── Forecasts ───────────────────────────────────────────────

const forecasts: Forecast[] = [
  {
    period: '30-day',
    predicted: 1_248_000,
    confidence: 85,
    lower: 1_160_000,
    upper: 1_336_000,
    basis: 'Linear regression on 12-month revenue trend with seasonal adjustments. Accounts for 2 at-risk accounts trending toward churn and 1 new account onboarding.',
  },
  {
    period: '60-day',
    predicted: 2_520_000,
    confidence: 78,
    lower: 2_280_000,
    upper: 2_760_000,
    basis: 'Extended trend analysis incorporating pipeline opportunities ($340K weighted), win-back campaign expected recovery ($45K), and seasonal spring uptick.',
  },
  {
    period: '90-day',
    predicted: 3_840_000,
    confidence: 70,
    lower: 3_360_000,
    upper: 4_320_000,
    basis: 'Full quarter projection based on historical Q2 performance, product launch revenue (Glacier Extracts), and 3 pending category expansion deals.',
  },
];

// ─── Product Recommendations ─────────────────────────────────

const productRecommendations: ProductRecommendation[] = [
  // Cascade Wellness (4-5: category expansion)
  { id: 'rec-001', accountId: 'acct-cascade', accountName: 'Cascade Wellness', productName: 'Frost Premium Preroll 6-Pack', category: 'preroll', reason: 'Cascade Wellness currently orders only flower and edibles. Their customer demo skews 25-35 — a prime preroll audience. Adding prerolls could capture $2,100/month in incremental revenue based on similar-profile accounts.', estimatedRevenue: 2100, confidence: 82, status: 'new' },
  { id: 'rec-002', accountId: 'acct-cascade', accountName: 'Cascade Wellness', productName: 'Glacier Extracts Live Rosin 1g', category: 'concentrate', reason: 'Zero concentrate presence despite being in a college town with high concentrate demand. Competitor store 0.5 miles away sells $4,200/month in concentrates. Estimated displacement potential: $1,800/month.', estimatedRevenue: 1800, confidence: 75, competitorContext: 'Competitor "Elevated" carries 3 concentrate brands with dedicated display', status: 'pitched' },
  { id: 'rec-003', accountId: 'acct-cascade', accountName: 'Cascade Wellness', productName: 'Frost Sparkling Cannabis Water', category: 'beverage', reason: 'Health-focused brand positioning aligns perfectly with cannabis beverages. Tom Wheeler expressed interest in "wellness-oriented products" during last meeting. Low-risk trial order: $600.', estimatedRevenue: 900, confidence: 68, status: 'new' },
  { id: 'rec-004', accountId: 'acct-cascade', accountName: 'Cascade Wellness', productName: 'Frost Haze Vape Cart 1g', category: 'vaporizer', reason: 'No vaporizer products on shelf despite 22% of WA dispensary sales being vape. Cascade is leaving significant revenue on the table.', estimatedRevenue: 1400, confidence: 71, competitorContext: 'Nearby competitor carries 5 vape brands', status: 'new' },

  // Greenfield (2-3: upsell)
  { id: 'rec-005', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', productName: 'Lemon Haze Live Rosin 0.5g', category: 'concentrate', reason: 'Greenfield already sells our 1g live rosin at $60/unit. The 0.5g SKU at $35 would capture price-sensitive customers currently buying competitor half-grams. Estimated cannibalization: minimal (different price tier).', estimatedRevenue: 2800, confidence: 88, status: 'accepted' },
  { id: 'rec-006', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', productName: 'Frost THC Chocolate Bar', category: 'edible', reason: 'Sarah Chen mentioned that chocolate edibles outsell gummies 2:1 at Greenfield. We currently only supply gummies. Adding chocolate could capture $1,500/month.', estimatedRevenue: 1500, confidence: 85, status: 'pitched' },
  { id: 'rec-007', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', productName: 'Frost Infused Preroll 1g', category: 'preroll', reason: 'Infused prerolls are their fastest-growing category (up 30% last quarter). They currently buy from a competitor at a 10% premium. We can win this on price and quality.', estimatedRevenue: 2200, confidence: 78, competitorContext: 'Currently buying infused prerolls from "High Standards" at $8.50/unit vs our $7.80', status: 'new' },

  // Pacific Leaf (3: win-back suggestions)
  { id: 'rec-008', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf', productName: 'Frost OG Flower 3.5g', category: 'flower', reason: 'Pacific Leaf reduced flower orders by 25% after bringing on Green Mountain. Our Frost OG tests at 28% THC vs Green Mountain\'s 24%. Offering competitive pricing at $22/unit (down from $25) could recapture 60% of lost volume.', estimatedRevenue: 3200, confidence: 72, competitorContext: 'Green Mountain pricing: $20/unit, lower THC, but eco-friendly packaging', status: 'pitched' },
  { id: 'rec-009', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf', productName: 'Northern Lights Mango Gummies 10pk', category: 'edible', reason: 'Pacific Leaf has zero edible orders from us despite edibles being 15% of their total sales. They currently source from Bliss Bites exclusively. Our gummies have better dosage accuracy (±5% vs ±15%).', estimatedRevenue: 1800, confidence: 65, competitorContext: 'Bliss Bites has exclusive merchandising deal expiring April 2026', status: 'new' },
  { id: 'rec-010', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf', productName: 'Frost Cannabis Lemonade', category: 'beverage', reason: 'David Kim mentioned interest in expanding beverage selection. Pacific Leaf is near a busy lunch corridor with high walk-in traffic — beverages perform well in that context.', estimatedRevenue: 700, confidence: 58, status: 'dismissed' },

  // Other accounts
  { id: 'rec-011', accountId: 'acct-puget-sound', accountName: 'Puget Sound Provisions', productName: 'GSC Badder 1g', category: 'concentrate', reason: 'Lisa Park requested samples of our concentrate line. Puget Sound has sophisticated concentrate buyers and currently allocates 18% of shelf to concentrates but only buys carts from us.', estimatedRevenue: 2400, confidence: 80, status: 'pitched' },
  { id: 'rec-012', accountId: 'acct-004', accountName: 'Bellevue Botanicals', productName: 'Frost CBD Gummies 20pk', category: 'edible', reason: 'Premium Eastside location with health-conscious clientele. CBD products are trending up 40% in their demographic. Currently no CBD edibles on shelf.', estimatedRevenue: 1200, confidence: 76, status: 'accepted' },
  { id: 'rec-013', accountId: 'acct-001', accountName: 'Ballard Buds', productName: 'Tangie Dream Vape Cart 1g', category: 'vaporizer', reason: 'Their vape cart sales are up 22% but they only carry 2 of our 5 cart SKUs. Tangie Dream is our #2 vape SKU by volume — high demand, proven seller.', estimatedRevenue: 1600, confidence: 83, status: 'new' },
  { id: 'rec-014', accountId: 'acct-summit', accountName: 'Summit Cannabis Co.', productName: 'Frost Sparkling Cannabis Water', category: 'beverage', reason: 'Summit is near hiking trailheads and outdoor recreation. Cannabis beverages index 3x higher in outdoor-adjacent retail. Grant Holloway has been asking about expanding beyond flower.', estimatedRevenue: 800, confidence: 62, status: 'pitched' },
  { id: 'rec-015', accountId: 'acct-olympic', accountName: 'Olympic Greens', productName: 'Frost Premium Preroll 6-Pack', category: 'preroll', reason: 'Olympic Greens has a tourism-heavy customer base. Preroll multipacks are the #1 tourist purchase category in WA cannabis retail.', estimatedRevenue: 1900, confidence: 77, status: 'new' },
  { id: 'rec-016', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective', productName: 'Glacier Extracts Live Rosin 1g', category: 'concentrate', reason: 'Capitol Hill demographic heavily favors premium concentrates. The Collective currently buys from 2 competitors but has expressed interest in our Glacier line after the recent vendor day.', estimatedRevenue: 3400, confidence: 84, competitorContext: 'Currently buying from "Dab Lab" and "Solventless Solutions" — both priced higher than Glacier', status: 'accepted' },
  { id: 'rec-017', accountId: 'acct-012', accountName: 'Bellingham Bloom', productName: 'Frost CBD Gummies 20pk', category: 'edible', reason: 'College town near WWU with growing CBD demand. No CBD edibles currently on shelf despite 3 customer requests logged by budtenders in February.', estimatedRevenue: 900, confidence: 70, status: 'new' },
  { id: 'rec-018', accountId: 'acct-015', accountName: 'Everett Extracts', productName: 'Lemon Haze Live Rosin 0.5g', category: 'concentrate', reason: 'Despite the store name, they carry only 1 concentrate brand. Adding our half-gram rosin at $35 fills a price gap between their $25 wax and $60 full-gram options.', estimatedRevenue: 1400, confidence: 74, status: 'pitched' },
  { id: 'rec-019', accountId: 'acct-008', accountName: 'Olympia Organics', productName: 'Frost Infused Preroll 1g', category: 'preroll', reason: 'Organic-focused store that currently sells only our plain prerolls. Infused prerolls are a natural upsell — their customers already trust the brand.', estimatedRevenue: 1100, confidence: 72, status: 'new' },
  { id: 'rec-020', accountId: 'acct-006', accountName: 'Redmond Relief', productName: 'Frost Haze Vape Cart 1g', category: 'vaporizer', reason: 'Tech-corridor location (near Microsoft) with high vape demand. Currently only buys flower from us. Vape carts are 30% of their total sales from other brands.', estimatedRevenue: 2100, confidence: 79, status: 'new' },
  { id: 'rec-021', accountId: 'acct-016', accountName: 'Bainbridge Botanics', productName: 'Frost THC Chocolate Bar', category: 'edible', reason: 'Boutique Island location with affluent clientele. Premium chocolate edibles align with their brand. Will Thornton has been looking for upscale edible options.', estimatedRevenue: 800, confidence: 73, status: 'pitched' },
  { id: 'rec-022', accountId: 'acct-spokane-valley', accountName: 'Spokane Valley Dispensary', productName: 'Frost OG Flower 3.5g', category: 'flower', reason: 'They buy competitor flower at higher prices. Our Frost OG quality scores better in blind tests. Win-back pricing at $21/unit could recapture this account.', estimatedRevenue: 2600, confidence: 66, competitorContext: 'Currently buying "Peak Farms" flower at $24/unit', status: 'new' },
  { id: 'rec-023', accountId: 'acct-007', accountName: 'Tacoma Treehouse', productName: 'Northern Lights Mango Gummies 10pk', category: 'edible', reason: 'Tacoma area showing 18% edible growth. Treehouse currently has no edible SKUs from us despite carrying our flower and prerolls.', estimatedRevenue: 1000, confidence: 68, status: 'new' },
  { id: 'rec-024', accountId: 'acct-003', accountName: 'Fremont Flowers', productName: 'Glacier Extracts Live Rosin 1g', category: 'concentrate', reason: 'Fremont is a premium neighborhood with high concentrate demand. Olivia Grant mentioned wanting to expand concentrates in Q2.', estimatedRevenue: 2000, confidence: 76, status: 'new' },
  { id: 'rec-025', accountId: 'acct-rainier', accountName: 'Rainier Remedies', productName: 'Indica Blend Preroll 1g', category: 'preroll', reason: 'Their customer base prefers indica-dominant products. Single prerolls are their highest-margin category. Easy add-on to existing orders.', estimatedRevenue: 600, confidence: 64, status: 'dismissed' },
  { id: 'rec-026', accountId: 'acct-harbor', accountName: 'Harbor Cannabis', productName: 'Blue Dream Flower 3.5g', category: 'flower', reason: 'Rural location with limited selection. Blue Dream is a universally popular strain that would diversify their narrow flower offering beyond just Frost OG.', estimatedRevenue: 500, confidence: 55, status: 'dismissed' },
  { id: 'rec-027', accountId: 'acct-011', accountName: 'Yakima Valley Green', productName: 'Frost Premium Preroll 6-Pack', category: 'preroll', reason: 'Growing account that just expanded to prerolls. The 6-pack multipacks have strong sell-through in similar mid-tier accounts.', estimatedRevenue: 800, confidence: 69, status: 'new' },
  { id: 'rec-028', accountId: 'acct-014', accountName: 'Tri-Cities Terpenes', productName: 'Frost Haze Vape Cart 1g', category: 'vaporizer', reason: 'Name implies terpene interest but they carry zero vape products from us. Introducing Frost Haze (high terpene profile) aligns with their brand identity.', estimatedRevenue: 1100, confidence: 67, status: 'new' },
  { id: 'rec-029', accountId: 'acct-005', accountName: 'Kirkland Kush', productName: 'Frost OG Flower 3.5g', category: 'flower', reason: 'At-risk account with declining orders. Offering a loyalty discount on their top-selling strain (Frost OG) could slow the decline. 10% off for 3 months.', estimatedRevenue: 1200, confidence: 52, competitorContext: 'Rumored to be talking to a new distributor', status: 'pitched' },
  { id: 'rec-030', accountId: 'acct-evergreen', accountName: 'Evergreen Wellness', productName: 'Frost CBD Gummies 20pk', category: 'edible', reason: 'Wellness-positioned store in Spokane. CBD products are their fastest growing category but they only source from one supplier.', estimatedRevenue: 1300, confidence: 71, status: 'accepted' },
];

// ─── Compliance: Licenses ────────────────────────────────────

const today = new Date('2026-03-06');
function daysUntil(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const complianceLicenses: ComplianceLicense[] = [
  // 1 expired
  { accountId: 'acct-013', accountName: 'Vancouver Vapor', licenseNumber: 'WA-CCB-420313', expirationDate: '2026-02-28', daysRemaining: daysUntil('2026-02-28'), status: 'expired' },
  // 2 expiring within 30 days
  { accountId: 'acct-009', accountName: 'Spokane Smoke Shop', licenseNumber: 'WA-CCB-420309', expirationDate: '2026-03-25', daysRemaining: daysUntil('2026-03-25'), status: 'expiring' },
  { accountId: 'acct-005', accountName: 'Kirkland Kush', licenseNumber: 'WA-CCB-420305', expirationDate: '2026-04-01', daysRemaining: daysUntil('2026-04-01'), status: 'expiring' },
  // 3 expiring within 6 months
  { accountId: 'acct-harbor', accountName: 'Harbor Cannabis', licenseNumber: 'WA-CCB-412011', expirationDate: '2026-07-15', daysRemaining: daysUntil('2026-07-15'), status: 'expiring' },
  { accountId: 'acct-010', accountName: 'Walla Walla Weed Co', licenseNumber: 'WA-CCB-420310', expirationDate: '2026-08-20', daysRemaining: daysUntil('2026-08-20'), status: 'expiring' },
  { accountId: 'acct-007', accountName: 'Tacoma Treehouse', licenseNumber: 'WA-CCB-420307', expirationDate: '2026-09-10', daysRemaining: daysUntil('2026-09-10'), status: 'expiring' },
  // Remaining: valid (6+ months)
  { accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', licenseNumber: 'WA-CCB-410001', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf', licenseNumber: 'WA-CCB-410002', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-emerald-city', accountName: 'Emerald City Cannabis', licenseNumber: 'WA-CCB-410003', expirationDate: '2027-03-15', daysRemaining: daysUntil('2027-03-15'), status: 'valid' },
  { accountId: 'acct-cascade', accountName: 'Cascade Wellness', licenseNumber: 'WA-CCB-410004', expirationDate: '2027-08-30', daysRemaining: daysUntil('2027-08-30'), status: 'valid' },
  { accountId: 'acct-puget-sound', accountName: 'Puget Sound Provisions', licenseNumber: 'WA-CCB-410005', expirationDate: '2027-05-15', daysRemaining: daysUntil('2027-05-15'), status: 'valid' },
  { accountId: 'acct-summit', accountName: 'Summit Cannabis Co.', licenseNumber: 'WA-CCB-410006', expirationDate: '2027-04-20', daysRemaining: daysUntil('2027-04-20'), status: 'valid' },
  { accountId: 'acct-rainier', accountName: 'Rainier Remedies', licenseNumber: 'WA-CCB-410007', expirationDate: '2027-07-30', daysRemaining: daysUntil('2027-07-30'), status: 'valid' },
  { accountId: 'acct-olympic', accountName: 'Olympic Greens', licenseNumber: 'WA-CCB-410008', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-spokane-valley', accountName: 'Spokane Valley Dispensary', licenseNumber: 'WA-CCB-410009', expirationDate: '2027-09-15', daysRemaining: daysUntil('2027-09-15'), status: 'valid' },
  { accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective', licenseNumber: 'WA-CCB-410010', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-evergreen', accountName: 'Evergreen Wellness', licenseNumber: 'WA-CCB-410012', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-001', accountName: 'Ballard Buds', licenseNumber: 'WA-CCB-420301', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-002', accountName: 'Capitol Hill Green', licenseNumber: 'WA-CCB-420302', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-003', accountName: 'Fremont Flowers', licenseNumber: 'WA-CCB-420303', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-004', accountName: 'Bellevue Botanicals', licenseNumber: 'WA-CCB-420304', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-006', accountName: 'Redmond Relief', licenseNumber: 'WA-CCB-420306', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-008', accountName: 'Olympia Organics', licenseNumber: 'WA-CCB-420308', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-011', accountName: 'Yakima Valley Green', licenseNumber: 'WA-CCB-420311', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-012', accountName: 'Bellingham Bloom', licenseNumber: 'WA-CCB-420312', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-014', accountName: 'Tri-Cities Terpenes', licenseNumber: 'WA-CCB-420314', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-015', accountName: 'Everett Extracts', licenseNumber: 'WA-CCB-420315', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
  { accountId: 'acct-016', accountName: 'Bainbridge Botanics', licenseNumber: 'WA-CCB-420316', expirationDate: '2027-06-30', daysRemaining: daysUntil('2027-06-30'), status: 'valid' },
];

// ─── Compliance: Payments ────────────────────────────────────

const compliancePayments: CompliancePayment[] = [
  // Rainier Remedies — 3 overdue
  { accountId: 'acct-rainier', accountName: 'Rainier Remedies', orderNumber: 'ORD-2026-0289', deliveryDate: '2026-02-25', amount: 4200, daysElapsed: 9, maxDays: 5, status: 'overdue', method: 'cod' },
  { accountId: 'acct-rainier', accountName: 'Rainier Remedies', orderNumber: 'ORD-2026-0302', deliveryDate: '2026-02-27', amount: 3800, daysElapsed: 7, maxDays: 5, status: 'overdue', method: 'cod' },
  { accountId: 'acct-rainier', accountName: 'Rainier Remedies', orderNumber: 'ORD-2026-0315', deliveryDate: '2026-03-01', amount: 2900, daysElapsed: 5, maxDays: 5, status: 'overdue', method: 'cod' },
  // Vancouver Vapor — 1 overdue
  { accountId: 'acct-013', accountName: 'Vancouver Vapor', orderNumber: 'ORD-2026-0298', deliveryDate: '2026-02-28', amount: 1400, daysElapsed: 6, maxDays: 5, status: 'overdue', method: 'cod' },
  // Approaching (day 4)
  { accountId: 'acct-005', accountName: 'Kirkland Kush', orderNumber: 'ORD-2026-0324', deliveryDate: '2026-03-02', amount: 1800, daysElapsed: 4, maxDays: 5, status: 'approaching', method: 'cod' },
  // Compliant
  { accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', orderNumber: 'ORD-2026-0330', deliveryDate: '2026-03-04', amount: 3800, daysElapsed: 2, maxDays: 5, status: 'compliant', method: 'ach' },
  { accountId: 'acct-puget-sound', accountName: 'Puget Sound Provisions', orderNumber: 'ORD-2026-0328', deliveryDate: '2026-03-04', amount: 2600, daysElapsed: 2, maxDays: 5, status: 'compliant', method: 'ach' },
  { accountId: 'acct-004', accountName: 'Bellevue Botanicals', orderNumber: 'ORD-2026-0331', deliveryDate: '2026-03-05', amount: 3400, daysElapsed: 1, maxDays: 5, status: 'compliant', method: 'ach' },
  { accountId: 'acct-001', accountName: 'Ballard Buds', orderNumber: 'ORD-2026-0332', deliveryDate: '2026-03-05', amount: 2800, daysElapsed: 1, maxDays: 5, status: 'compliant', method: 'ach' },
  { accountId: 'acct-summit', accountName: 'Summit Cannabis Co.', orderNumber: 'ORD-2026-0326', deliveryDate: '2026-03-03', amount: 2200, daysElapsed: 3, maxDays: 5, status: 'compliant', method: 'cod' },
];

// ─── Win/Loss Log ────────────────────────────────────────────

const winLossLog: WinLossEntry[] = [
  // 8 wins
  { id: 'wl-001', accountId: 'acct-004', accountName: 'Bellevue Botanicals', outcome: 'won', date: '2026-02-15', reason: 'Premium positioning and VMI enrollment sealed the deal. Competitor couldn\'t match our automated reorder system.', reasonCategory: 'relationship', productsAffected: ['Frost Premium Flower Line', 'Glacier Extracts'], revenueImpact: 8200, notes: 'Rachel Nguyen was impressed by our VMI demo. Key differentiator was the automated sell-through analytics dashboard.', competitor: 'Northwest Naturals' },
  { id: 'wl-002', accountId: 'acct-016', accountName: 'Bainbridge Botanics', outcome: 'won', date: '2026-01-20', reason: 'Boutique focus and premium brand alignment. Will Thornton wanted a distributor that matched his store\'s aesthetic.', reasonCategory: 'product-quality', productsAffected: ['Full product line'], revenueImpact: 3200, notes: 'Won against 2 competitors purely on brand quality and packaging design. Price was not a factor.' },
  { id: 'wl-003', accountId: 'acct-008', accountName: 'Olympia Organics', outcome: 'won', date: '2025-12-10', reason: 'Organic certification and clean cultivation practices differentiated us from competitors who couldn\'t verify their growing methods.', reasonCategory: 'product-quality', productsAffected: ['Frost OG Flower', 'Blue Dream Flower'], revenueImpact: 5400, notes: 'Megan Fox specifically cited our COA transparency and pesticide-free testing as deciding factors.' },
  { id: 'wl-004', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective', outcome: 'won', date: '2026-01-05', reason: 'Competitive displacement — outperformed Solventless Solutions on concentrate quality and pricing.', reasonCategory: 'pricing', productsAffected: ['Glacier Extracts Live Rosin 1g'], revenueImpact: 4800, notes: 'Naomi Chen did a side-by-side quality test. Our rosin scored higher on terpene preservation. Price was 12% lower.', competitor: 'Solventless Solutions' },
  { id: 'wl-005', accountId: 'acct-012', accountName: 'Bellingham Bloom', outcome: 'won', date: '2025-11-15', reason: 'Filled a geographic gap — no other premium distributor was servicing Bellingham with next-day delivery.', reasonCategory: 'delivery', productsAffected: ['Flower line', 'Preroll line'], revenueImpact: 3800, notes: 'Claire Dawson had been waiting 6 months for a distributor willing to do weekly Bellingham runs.' },
  { id: 'wl-006', accountId: 'acct-015', accountName: 'Everett Extracts', outcome: 'won', date: '2025-10-22', reason: 'Referral from Ballard Buds. Hannah Lee reached out directly after hearing about our VMI program.', reasonCategory: 'relationship', productsAffected: ['Premium Flower', 'Vape Carts'], revenueImpact: 4600, notes: 'Power of word-of-mouth. Jen Takahashi from Ballard Buds made the introduction at a trade show.' },
  { id: 'wl-007', accountId: 'acct-003', accountName: 'Fremont Flowers', outcome: 'won', date: '2025-09-08', reason: 'Competitive win on delivery reliability. Previous distributor had 3 missed deliveries in one month.', reasonCategory: 'delivery', productsAffected: ['Full product line'], revenueImpact: 6200, notes: 'Olivia Grant was frustrated with inconsistent deliveries. Our 98% on-time rate sealed it.' },
  { id: 'wl-008', accountId: 'acct-011', accountName: 'Yakima Valley Green', outcome: 'won', date: '2025-11-30', reason: 'Price-competitive entry into Eastern WA. Roberto Silva wanted better margins than his current distributor offered.', reasonCategory: 'pricing', productsAffected: ['Frost OG Flower', 'Indica Blend Preroll'], revenueImpact: 2400, notes: 'Won on a slim margin — our pricing was only 3% better, but delivery reliability tipped the scales.' },

  // 7 losses
  { id: 'wl-009', accountId: 'acct-emerald-city', accountName: 'Emerald City Cannabis', outcome: 'lost', date: '2026-02-01', reason: 'Lost to Brand X on vape pricing — they undercut by 15% on 510 carts. Amanda Torres said margins were too thin with our pricing.', reasonCategory: 'pricing', productsAffected: ['Frost Haze Vape Cart 1g', 'Glacier Live Resin Cart 0.5g'], revenueImpact: 7200, notes: 'Brand X is a new entrant with venture funding — likely selling below cost to gain market share. This pricing won\'t last, but Emerald City doesn\'t care about sustainability.', competitor: 'Brand X' },
  { id: 'wl-010', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf', outcome: 'lost', date: '2026-01-15', reason: 'Green Mountain won flower allocation with eco-friendly packaging. Our packaging is not recyclable.', reasonCategory: 'product-quality', productsAffected: ['Frost OG Flower 3.5g', 'Blue Dream Flower 3.5g'], revenueImpact: 4800, notes: 'David Kim said his customers increasingly ask about sustainability. Green Mountain\'s compostable mylar bags were the deciding factor. We need to accelerate our eco-packaging roadmap.', competitor: 'Green Mountain' },
  { id: 'wl-011', accountId: 'acct-009', accountName: 'Spokane Smoke Shop', outcome: 'lost', date: '2025-12-20', reason: 'Budget competitor offered 20% lower prices on comparable flower. Tyler Reed is purely price-driven.', reasonCategory: 'pricing', productsAffected: ['Frost OG Flower 3.5g'], revenueImpact: 1800, notes: 'This is a race to the bottom we can\'t win. Consider maintaining minimal presence and focusing on higher-margin accounts.', competitor: 'Valley Green Farms' },
  { id: 'wl-012', accountId: 'acct-harbor', accountName: 'Harbor Cannabis', outcome: 'lost', date: '2026-01-28', reason: 'Rural delivery costs too high. Earl Dawkins found a local distributor with lower delivery fees.', reasonCategory: 'delivery', productsAffected: ['Full product line'], revenueImpact: 1200, notes: 'Harbor is 90 minutes from our nearest hub. Delivery cost per order is $45 vs $15 for Seattle accounts. May need to revisit delivery zone pricing.' },
  { id: 'wl-013', accountId: 'acct-010', accountName: 'Walla Walla Weed Co', outcome: 'lost', date: '2026-02-10', reason: 'Competitor offered exclusive territorial rights. We can\'t match exclusivity due to existing accounts in the area.', reasonCategory: 'competitor', productsAffected: ['Flower line'], revenueImpact: 1600, notes: 'Amy Collins wanted exclusive distribution in Walla Walla. We have 2 other accounts within 30 miles so couldn\'t offer that.', competitor: 'Pacific Roots' },
  { id: 'wl-014', accountId: 'acct-014', accountName: 'Tri-Cities Terpenes', outcome: 'lost', date: '2026-02-20', reason: 'Product quality complaint — 2 batches of flower arrived below stated THC potency on COA. Testing discrepancy.', reasonCategory: 'product-quality', productsAffected: ['Wedding Cake Flower 3.5g'], revenueImpact: 2200, notes: 'Jason Briggs tested independently and found 22% THC vs our stated 27%. This is a QA issue that needs immediate attention. Lost trust.' },
  { id: 'wl-015', accountId: 'acct-006', accountName: 'Redmond Relief', outcome: 'lost', date: '2026-01-10', reason: 'Competitor bundled delivery with free merchandising. Karen Osei preferred the all-inclusive package.', reasonCategory: 'competitor', productsAffected: ['Vape Carts', 'Edibles'], revenueImpact: 3400, notes: 'We lost the vape and edible categories but retained flower. The competitor offers free point-of-sale displays which we should consider matching.', competitor: 'Elevated Distribution' },

  // 5 churns
  { id: 'wl-016', accountId: 'acct-emerald-city', accountName: 'Emerald City Cannabis', outcome: 'churned', date: '2026-03-01', reason: 'Complete account loss after gradual decline over 4 months. No orders in 45 days. Multiple re-engagement attempts failed.', reasonCategory: 'relationship', productsAffected: ['Full product line'], revenueImpact: 8500, notes: 'Started with loss of vape category (Feb), then flower (Mar). Amanda Torres stopped returning calls in February. Jake made 3 in-person visits with no progress.' },
  { id: 'wl-017', accountId: 'acct-013', accountName: 'Vancouver Vapor', outcome: 'churned', date: '2026-02-15', reason: 'Chronic payment issues led to order hold, which accelerated churn. 4 overdue invoices totaling $5,600.', reasonCategory: 'compliance', productsAffected: ['Vape Carts', 'Concentrates'], revenueImpact: 1800, notes: 'We had to put them on payment hold after 3 consecutive late payments. Nina Walsh expressed frustration but never resolved the outstanding balance. License also expired.' },
  { id: 'wl-018', accountId: 'acct-005', accountName: 'Kirkland Kush', outcome: 'churned', date: '2026-02-28', reason: 'Declining foot traffic at location. Steve Park mentioned lease renegotiation and possible store closure.', reasonCategory: 'closure', productsAffected: ['Flower', 'Prerolls'], revenueImpact: 2400, notes: 'This may not be recoverable — the underlying issue is the business itself struggling, not our product or service. Monitor for lease outcome.' },
  { id: 'wl-019', accountId: 'acct-harbor', accountName: 'Harbor Cannabis', outcome: 'churned', date: '2026-03-05', reason: 'Completed transition to local distributor after gradual decline. Rural location economics made us uncompetitive.', reasonCategory: 'delivery', productsAffected: ['Full product line'], revenueImpact: 3100, notes: 'Final order was 2 months ago. Earl called to formally end the relationship. Said it was purely about delivery logistics and costs, not product quality. Wished us well.' },
  { id: 'wl-020', accountId: 'acct-009', accountName: 'Spokane Smoke Shop', outcome: 'churned', date: '2026-02-05', reason: 'Price-driven customer found consistently cheaper alternatives. No brand loyalty despite 18 months of service.', reasonCategory: 'pricing', productsAffected: ['Flower'], revenueImpact: 1200, notes: 'Tyler Reed will always chase the lowest price. Not a strategic loss — our margin was already thin. Redirect effort to higher-value Spokane accounts.' },
];

// ─── Playbooks ───────────────────────────────────────────────

const playbooks: Playbook[] = [
  {
    id: 'pb-001',
    name: 'New Account Onboarding',
    description: 'Complete workflow from first contact through 30-day check-in for new retail accounts. Ensures consistent experience and fast ramp to productive ordering.',
    type: 'new-account',
    estimatedDuration: '30 days',
    successRate: 85,
    steps: [
      { id: 'pb-001-s1', title: 'Initial Discovery Call', instructions: 'Schedule a 30-minute discovery call with the decision-maker. Focus on understanding their current product mix, customer demographics, delivery preferences, and pain points with existing distributors. Take detailed notes for the account profile.', aiPrompt: 'Generate a discovery call agenda based on the account\'s location, size, and market segment.', actionType: 'call', estimatedTime: '30 min', order: 1 },
      { id: 'pb-001-s2', title: 'Create Account Profile', instructions: 'Based on the discovery call, create a complete account profile in the CRM. Include all contacts, delivery preferences, license information, and initial category interest. Set up the account in the system with proper territory assignment.', actionType: 'task', estimatedTime: '20 min', order: 2 },
      { id: 'pb-001-s3', title: 'Send Welcome Package', instructions: 'Email the welcome package including: product catalog, price sheet, delivery schedule for their area, VMI program overview, and budtender education materials. Attach the personalized introductory offer (10% off first 3 orders).', aiPrompt: 'Draft a personalized welcome email that references specific products discussed during the discovery call.', actionType: 'email', estimatedTime: '15 min', order: 3 },
      { id: 'pb-001-s4', title: 'First Order Setup', instructions: 'Work with the buyer to create their first order. Recommend a starter assortment based on their customer profile and store size. Use the category recommendation engine to suggest the optimal product mix. Aim for 15-25 SKUs.', actionType: 'meeting', estimatedTime: '45 min', order: 4 },
      { id: 'pb-001-s5', title: 'Delivery Day Check-in', instructions: 'Call or visit on their first delivery day to ensure everything arrived correctly. Walk the budtenders through key products, share talking points, and leave behind any promotional materials. Collect feedback on the delivery experience.', actionType: 'call', estimatedTime: '20 min', order: 5 },
      { id: 'pb-001-s6', title: 'Wait: 7 Days', instructions: 'Allow 7 days for the account to sell through initial inventory and form opinions. Monitor any support tickets or questions during this period.', actionType: 'wait', estimatedTime: '7 days', order: 6 },
      { id: 'pb-001-s7', title: '7-Day Follow-Up', instructions: 'Call to check sell-through, gather budtender feedback, and identify any products that aren\'t moving. Discuss reorder timing and suggest adjustments to the product mix based on early performance data.', aiPrompt: 'Analyze the account\'s first week sales data and generate adjustment recommendations.', actionType: 'call', estimatedTime: '20 min', order: 7 },
      { id: 'pb-001-s8', title: '30-Day Business Review', instructions: 'Schedule a formal 30-day review meeting. Present: total sales, top-selling products, category performance, and growth opportunities. Propose VMI enrollment if appropriate. Set quarterly targets and establish regular check-in cadence.', aiPrompt: 'Generate a 30-day performance report with visualizations and recommendations.', actionType: 'meeting', estimatedTime: '45 min', order: 8 },
    ],
  },
  {
    id: 'pb-002',
    name: 'Win-Back a Churning Account',
    description: 'Systematic re-engagement process for accounts showing churn signals. Focuses on understanding why they\'re leaving and presenting targeted solutions.',
    type: 'win-back',
    estimatedDuration: '21 days',
    successRate: 35,
    steps: [
      { id: 'pb-002-s1', title: 'Analyze Churn Signals', instructions: 'Review the account\'s health score history, order frequency changes, payment patterns, and recent interactions. Identify the specific trigger(s) for decline: pricing, product quality, delivery issues, competitor activity, or relationship gap.', aiPrompt: 'Analyze this account\'s data and identify the top 3 likely churn drivers with supporting evidence.', actionType: 'task', estimatedTime: '30 min', order: 1 },
      { id: 'pb-002-s2', title: 'Personal Outreach Call', instructions: 'Call the primary contact directly. Don\'t pitch — listen. Ask: "I noticed your orders have slowed down. Can you help me understand what\'s changed?" Document their specific concerns verbatim.', actionType: 'call', estimatedTime: '20 min', order: 2 },
      { id: 'pb-002-s3', title: 'Build Recovery Proposal', instructions: 'Based on the conversation, create a tailored recovery offer. This might include: competitive pricing match, product quality guarantee, dedicated delivery slot, free budtender training session, or extended payment terms (with management approval).', aiPrompt: 'Generate a recovery proposal based on the account\'s stated concerns and competitive situation.', actionType: 'task', estimatedTime: '30 min', order: 3 },
      { id: 'pb-002-s4', title: 'Present Recovery Offer', instructions: 'Email or deliver the recovery proposal. Frame it as "we value your business and want to earn it back." Include specific commitments with timelines. Request a follow-up call in 3 days.', aiPrompt: 'Draft a recovery email that addresses the account\'s specific concerns with concrete solutions.', actionType: 'email', estimatedTime: '15 min', order: 4 },
      { id: 'pb-002-s5', title: 'Wait: 3 Days', instructions: 'Give the account time to consider the proposal. Avoid follow-up pressure during this window.', actionType: 'wait', estimatedTime: '3 days', order: 5 },
      { id: 'pb-002-s6', title: 'Follow-Up and Close', instructions: 'Call to discuss the proposal. If accepted, process the first recovery order immediately. If declined, document the specific reasons and escalate to management for a final retention attempt. Log the outcome in the win/loss log regardless.', actionType: 'call', estimatedTime: '20 min', order: 6 },
    ],
  },
  {
    id: 'pb-003',
    name: 'Category Expansion',
    description: 'Guide for expanding an existing account into new product categories. Uses data-driven recommendations to identify the highest-opportunity categories.',
    type: 'category-expansion',
    estimatedDuration: '14 days',
    successRate: 62,
    steps: [
      { id: 'pb-003-s1', title: 'Identify Category Gap', instructions: 'Review the account\'s current category mix vs the average mix of similar-profile accounts. Identify the 1-2 categories with the highest revenue potential. Check the product recommendation engine for specific SKU suggestions.', aiPrompt: 'Compare this account\'s category mix to peers and identify the top expansion opportunity with estimated revenue.', actionType: 'task', estimatedTime: '15 min', order: 1 },
      { id: 'pb-003-s2', title: 'Pitch Meeting', instructions: 'Schedule a brief meeting (in-person preferred) to present the category expansion opportunity. Bring samples of recommended products. Lead with data: "Stores similar to yours that carry [category] see an average of $X/month in additional revenue."', actionType: 'meeting', estimatedTime: '30 min', order: 2 },
      { id: 'pb-003-s3', title: 'Trial Order Setup', instructions: 'If interested, set up a small trial order (5-8 SKUs in the new category). Offer a 15% discount on the first order to reduce risk. Include a sample pack for budtender education.', aiPrompt: 'Generate a trial order recommendation with the optimal SKU assortment for this account\'s customer profile.', actionType: 'task', estimatedTime: '15 min', order: 3 },
      { id: 'pb-003-s4', title: 'Budtender Training', instructions: 'Schedule a 20-minute training session for the budtender team on the new category. Cover: product features, customer talking points, competitor comparisons, and shelf placement recommendations.', actionType: 'meeting', estimatedTime: '20 min', order: 4 },
      { id: 'pb-003-s5', title: '14-Day Performance Review', instructions: 'Review sell-through data after 2 weeks. If performing well, recommend expanding the assortment. If underperforming, adjust shelf placement or suggest swapping slow movers before writing off the category.', aiPrompt: 'Analyze the 14-day trial performance and recommend next steps: expand, adjust, or discontinue.', actionType: 'call', estimatedTime: '15 min', order: 5 },
    ],
  },
  {
    id: 'pb-004',
    name: 'New Product Launch',
    description: 'Coordinated launch process for introducing a new product to target accounts. Ensures consistent messaging and optimal placement.',
    type: 'product-launch',
    estimatedDuration: '21 days',
    successRate: 72,
    steps: [
      { id: 'pb-004-s1', title: 'Identify Target Accounts', instructions: 'Use the product recommendation engine to identify the top 10-15 accounts most likely to succeed with this product. Consider: customer demographics, existing category mix, shelf space availability, and buyer receptiveness.', aiPrompt: 'Rank all accounts by likelihood of success with [product] and explain the reasoning for the top 10.', actionType: 'task', estimatedTime: '20 min', order: 1 },
      { id: 'pb-004-s2', title: 'Pre-Launch Teaser', instructions: 'Send a teaser email to target accounts with product details, launch pricing, and exclusive early access offer. Include professional photography and key selling points. Create FOMO with "limited initial allocation."', aiPrompt: 'Draft a product launch teaser email with compelling copy and key selling points.', actionType: 'email', estimatedTime: '15 min', order: 2 },
      { id: 'pb-004-s3', title: 'Wait: 3 Days', instructions: 'Allow the teaser to generate interest before following up.', actionType: 'wait', estimatedTime: '3 days', order: 3 },
      { id: 'pb-004-s4', title: 'Follow-Up Calls', instructions: 'Call each target account to discuss the new product. Address questions, take pre-orders, and schedule vendor day visits for hands-on product training. Track interest level and objections.', actionType: 'call', estimatedTime: '2 hours', order: 4 },
      { id: 'pb-004-s5', title: 'Process Launch Orders', instructions: 'Process all pre-orders and first orders. Ensure launch pricing is applied correctly. Coordinate delivery timing so all launch accounts receive product within the same week.', actionType: 'task', estimatedTime: '30 min', order: 5 },
      { id: 'pb-004-s6', title: 'In-Store Activation', instructions: 'Visit top accounts on delivery day. Set up displays, train budtenders on the new product, and provide shelf talkers and promotional materials.', actionType: 'meeting', estimatedTime: '3 hours', order: 6 },
      { id: 'pb-004-s7', title: '30-Day Adoption Report', instructions: 'Compile a 30-day adoption report: units sold by account, reorder rates, customer feedback, and competitive impact. Share results with the team and identify accounts needing follow-up support.', aiPrompt: 'Generate a 30-day product launch performance report with account-level metrics and recommendations.', actionType: 'task', estimatedTime: '30 min', order: 7 },
    ],
  },
  {
    id: 'pb-005',
    name: 'Payment Compliance Issue',
    description: 'Step-by-step process for handling payment compliance violations under Washington State\'s 5-day payment window for cannabis deliveries.',
    type: 'payment-issue',
    estimatedDuration: '10 days',
    successRate: 78,
    steps: [
      { id: 'pb-005-s1', title: 'Verify the Issue', instructions: 'Confirm the payment is truly overdue — check for processing delays, bank holidays, or ACH timing. Verify delivery was received and accepted. Pull the specific invoice and delivery confirmation.', actionType: 'task', estimatedTime: '10 min', order: 1 },
      { id: 'pb-005-s2', title: 'Day 4 Courtesy Reminder', instructions: 'If payment is approaching the deadline (day 4), send a friendly reminder: "Hi [name], just a quick reminder that payment for [invoice] is due by [date]. Let me know if you need anything." This prevents most issues.', aiPrompt: 'Draft a friendly payment reminder that maintains the relationship while communicating urgency.', actionType: 'email', estimatedTime: '5 min', order: 2 },
      { id: 'pb-005-s3', title: 'Day 6 Direct Call', instructions: 'If payment is overdue (day 6+), call the buyer directly. Keep it professional: "I need to follow up on invoice [number]. Is there an issue with this payment I can help resolve?" Document their response and committed payment date.', actionType: 'call', estimatedTime: '15 min', order: 3 },
      { id: 'pb-005-s4', title: 'Escalation Notice', instructions: 'If no resolution by day 8, send a formal notice that future orders will be held pending payment. CC your manager. Document everything for compliance records. Update the account health score.', aiPrompt: 'Draft a professional escalation notice that references specific invoices and WA state payment requirements.', actionType: 'email', estimatedTime: '10 min', order: 4 },
      { id: 'pb-005-s5', title: 'Order Hold Decision', instructions: 'At day 10, make the call: hold all future orders until payment is received, or negotiate a structured payment plan (requires management approval). Document the decision and notify the account formally.', actionType: 'note', estimatedTime: '15 min', order: 5 },
    ],
  },
  {
    id: 'pb-006',
    name: 'Competitive Displacement Response',
    description: 'Respond to a competitor winning shelf space at one of our accounts. Focuses on understanding the competitive threat and developing a targeted response.',
    type: 'competitive-response',
    estimatedDuration: '14 days',
    successRate: 45,
    steps: [
      { id: 'pb-006-s1', title: 'Intelligence Gathering', instructions: 'Identify: Which competitor? What products? What pricing? What terms? Get this from the buyer if possible, otherwise from vendor day observations or market intelligence. Document in the competitive log.', actionType: 'task', estimatedTime: '20 min', order: 1 },
      { id: 'pb-006-s2', title: 'Competitive Analysis', instructions: 'Compare the competitor\'s offering against ours: price per unit, THC/quality metrics, packaging, minimum orders, delivery terms, and any bundled services (merchandising, training). Identify our advantages and disadvantages.', aiPrompt: 'Generate a competitive comparison matrix based on available data about the competing brand and our products.', actionType: 'task', estimatedTime: '30 min', order: 2 },
      { id: 'pb-006-s3', title: 'Strategy Meeting', instructions: 'Meet with your manager to decide the response: price match, quality positioning, service differentiation, or accept the loss. Consider the account\'s overall value and the cost of a competitive response.', actionType: 'meeting', estimatedTime: '30 min', order: 3 },
      { id: 'pb-006-s4', title: 'Counter-Proposal', instructions: 'Present the counter-offer to the buyer. Lead with value, not just price: quality data, customer satisfaction scores, delivery reliability, and service commitments. If applicable, offer a limited-time competitive pricing match.', aiPrompt: 'Draft a competitive response proposal that emphasizes our unique value proposition vs the specific competitor.', actionType: 'meeting', estimatedTime: '30 min', order: 4 },
      { id: 'pb-006-s5', title: 'Wait: 5 Days', instructions: 'Allow the buyer time to evaluate both options. Avoid pressure tactics.', actionType: 'wait', estimatedTime: '5 days', order: 5 },
      { id: 'pb-006-s6', title: 'Resolution and Documentation', instructions: 'Get the final decision. If we won: document what worked for future competitive battles. If we lost: log it in win/loss, update the competitive map, and adjust pricing strategy for similar accounts to prevent future losses.', actionType: 'note', estimatedTime: '15 min', order: 6 },
    ],
  },
];

// ─── Playbook Executions ─────────────────────────────────────

const playbookExecutions: PlaybookExecution[] = [
  // 3 active
  { id: 'exec-001', playbookId: 'pb-002', accountId: 'acct-emerald-city', accountName: 'Emerald City Cannabis', startedAt: '2026-02-20', currentStep: 3, completedSteps: [1, 2], status: 'active' },
  { id: 'exec-002', playbookId: 'pb-003', accountId: 'acct-cascade', accountName: 'Cascade Wellness', startedAt: '2026-03-01', currentStep: 2, completedSteps: [1], status: 'active' },
  { id: 'exec-003', playbookId: 'pb-001', accountId: 'acct-016', accountName: 'Bainbridge Botanics', startedAt: '2026-01-20', currentStep: 5, completedSteps: [1, 2, 3, 4], status: 'active' },
  // 3 completed
  { id: 'exec-004', playbookId: 'pb-001', accountId: 'acct-008', accountName: 'Olympia Organics', startedAt: '2025-11-15', currentStep: 8, completedSteps: [1, 2, 3, 4, 5, 6, 7, 8], status: 'completed' },
  { id: 'exec-005', playbookId: 'pb-004', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', startedAt: '2026-02-01', currentStep: 7, completedSteps: [1, 2, 3, 4, 5, 6, 7], status: 'completed' },
  { id: 'exec-006', playbookId: 'pb-005', accountId: 'acct-rainier', accountName: 'Rainier Remedies', startedAt: '2026-02-25', currentStep: 5, completedSteps: [1, 2, 3, 4, 5], status: 'completed' },
  // 2 abandoned
  { id: 'exec-007', playbookId: 'pb-002', accountId: 'acct-009', accountName: 'Spokane Smoke Shop', startedAt: '2026-01-10', currentStep: 3, completedSteps: [1, 2], status: 'abandoned' },
  { id: 'exec-008', playbookId: 'pb-006', accountId: 'acct-harbor', accountName: 'Harbor Cannabis', startedAt: '2026-01-28', currentStep: 4, completedSteps: [1, 2, 3], status: 'abandoned' },
];

// ─── Export Factory Functions ─────────────────────────────────

export async function getRevenueAnalytics(): Promise<RevenueAnalytics> {
  await new Promise((r) => setTimeout(r, 300));
  return revenueAnalytics;
}

export async function getHealthModel(): Promise<AccountHealthModel> {
  await new Promise((r) => setTimeout(r, 300));
  return healthModel;
}

export async function getForecasts(): Promise<Forecast[]> {
  await new Promise((r) => setTimeout(r, 300));
  return forecasts;
}

export async function getProductRecommendations(accountId?: string): Promise<ProductRecommendation[]> {
  await new Promise((r) => setTimeout(r, 300));
  if (accountId) return productRecommendations.filter((r) => r.accountId === accountId);
  return productRecommendations;
}

export async function getComplianceLicenses(): Promise<ComplianceLicense[]> {
  await new Promise((r) => setTimeout(r, 300));
  return complianceLicenses;
}

export async function getCompliancePayments(): Promise<CompliancePayment[]> {
  await new Promise((r) => setTimeout(r, 300));
  return compliancePayments;
}

export async function getWinLossLog(): Promise<WinLossEntry[]> {
  await new Promise((r) => setTimeout(r, 300));
  return winLossLog;
}

export async function getPlaybooks(): Promise<Playbook[]> {
  await new Promise((r) => setTimeout(r, 300));
  return playbooks;
}

export async function getPlaybookExecutions(): Promise<PlaybookExecution[]> {
  await new Promise((r) => setTimeout(r, 300));
  return playbookExecutions;
}
