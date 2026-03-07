import type {
  VMIAccount,
  VMISellThrough,
  VMIMarketShare,
  VMIMetrics,
  VMIDailyEmail,
} from '@/modules/vmi/types';

// --- VMI Accounts ---
const vmiAccounts: VMIAccount[] = [
  {
    accountId: 'acc-greenfield',
    accountName: 'Greenfield Dispensary',
    enrolled: true,
    enrolledDate: '2024-06-15',
    skuCount: 15,
    totalVelocity: 85,
    reorderAlerts: 4,
    lastRestockDate: '2025-02-28',
  },
  {
    accountId: 'acc-summit',
    accountName: 'Summit Collective',
    enrolled: true,
    enrolledDate: '2024-09-01',
    skuCount: 12,
    totalVelocity: 45,
    reorderAlerts: 2,
    lastRestockDate: '2025-03-01',
  },
  {
    accountId: 'acc-capitol',
    accountName: 'Capitol Hill Collective',
    enrolled: true,
    enrolledDate: '2024-11-10',
    skuCount: 10,
    totalVelocity: 62,
    reorderAlerts: 1,
    lastRestockDate: '2025-03-03',
  },
];

// --- Sell-Through Data ---
const sellThroughData: VMISellThrough[] = [
  // Greenfield (15 SKUs)
  { accountId: 'acc-greenfield', sku: 'FL-WC-3.5', productName: 'Wedding Cake 3.5g', category: 'flower', dailyAvg: 8.2, weeklyTotal: 57, currentStock: 18, parLevel: 30, daysOnHand: 2.2, reorderRecommended: true, reorderQty: 24 },
  { accountId: 'acc-greenfield', sku: 'FL-BD-3.5', productName: 'Blue Dream 3.5g', category: 'flower', dailyAvg: 6.5, weeklyTotal: 46, currentStock: 24, parLevel: 25, daysOnHand: 3.7, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'FL-GEL-3.5', productName: 'Gelato 3.5g', category: 'flower', dailyAvg: 7.1, weeklyTotal: 50, currentStock: 12, parLevel: 28, daysOnHand: 1.7, reorderRecommended: true, reorderQty: 28 },
  { accountId: 'acc-greenfield', sku: 'PR-BD-1G', productName: 'Blue Dream Pre-Roll 1g', category: 'preroll', dailyAvg: 12.4, weeklyTotal: 87, currentStock: 45, parLevel: 50, daysOnHand: 3.6, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'PR-OGK-1G', productName: 'OG Kush Pre-Roll 1g', category: 'preroll', dailyAvg: 9.8, weeklyTotal: 69, currentStock: 22, parLevel: 40, daysOnHand: 2.2, reorderRecommended: true, reorderQty: 30 },
  { accountId: 'acc-greenfield', sku: 'VP-GEL-500', productName: 'Gelato 510 Cart 0.5g', category: 'vaporizer', dailyAvg: 5.3, weeklyTotal: 37, currentStock: 20, parLevel: 22, daysOnHand: 3.8, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'VP-BD-1G', productName: 'Blue Dream Disposable 1g', category: 'vaporizer', dailyAvg: 4.1, weeklyTotal: 29, currentStock: 15, parLevel: 18, daysOnHand: 3.7, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'CN-LR-1G', productName: 'Live Resin Badder 1g', category: 'concentrate', dailyAvg: 3.8, weeklyTotal: 27, currentStock: 8, parLevel: 15, daysOnHand: 2.1, reorderRecommended: true, reorderQty: 12 },
  { accountId: 'acc-greenfield', sku: 'ED-GUM-10PK', productName: 'Gummy 10-Pack 100mg', category: 'edible', dailyAvg: 6.2, weeklyTotal: 43, currentStock: 28, parLevel: 25, daysOnHand: 4.5, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'ED-CHO-4PK', productName: 'Chocolate Bar 4-Pack', category: 'edible', dailyAvg: 3.5, weeklyTotal: 25, currentStock: 18, parLevel: 15, daysOnHand: 5.1, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'FL-GSC-3.5', productName: 'GSC 3.5g', category: 'flower', dailyAvg: 4.8, weeklyTotal: 34, currentStock: 20, parLevel: 20, daysOnHand: 4.2, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'PR-WC-5PK', productName: 'Wedding Cake 5-Pack', category: 'preroll', dailyAvg: 3.2, weeklyTotal: 22, currentStock: 14, parLevel: 14, daysOnHand: 4.4, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'BV-LEMON-4PK', productName: 'Lemon Sparkling 4-Pack', category: 'beverage', dailyAvg: 2.8, weeklyTotal: 20, currentStock: 16, parLevel: 12, daysOnHand: 5.7, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'VP-SD-500', productName: 'Sour Diesel 510 Cart', category: 'vaporizer', dailyAvg: 3.6, weeklyTotal: 25, currentStock: 14, parLevel: 15, daysOnHand: 3.9, reorderRecommended: false },
  { accountId: 'acc-greenfield', sku: 'CN-SHT-1G', productName: 'Shatter 1g', category: 'concentrate', dailyAvg: 2.7, weeklyTotal: 19, currentStock: 12, parLevel: 12, daysOnHand: 4.4, reorderRecommended: false },

  // Summit (12 SKUs)
  { accountId: 'acc-summit', sku: 'FL-WC-3.5', productName: 'Wedding Cake 3.5g', category: 'flower', dailyAvg: 5.1, weeklyTotal: 36, currentStock: 10, parLevel: 20, daysOnHand: 2.0, reorderRecommended: true, reorderQty: 18 },
  { accountId: 'acc-summit', sku: 'FL-BD-3.5', productName: 'Blue Dream 3.5g', category: 'flower', dailyAvg: 4.2, weeklyTotal: 29, currentStock: 18, parLevel: 18, daysOnHand: 4.3, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'PR-BD-1G', productName: 'Blue Dream Pre-Roll 1g', category: 'preroll', dailyAvg: 7.5, weeklyTotal: 53, currentStock: 30, parLevel: 30, daysOnHand: 4.0, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'VP-GEL-500', productName: 'Gelato 510 Cart 0.5g', category: 'vaporizer', dailyAvg: 3.8, weeklyTotal: 27, currentStock: 8, parLevel: 16, daysOnHand: 2.1, reorderRecommended: true, reorderQty: 14 },
  { accountId: 'acc-summit', sku: 'ED-GUM-10PK', productName: 'Gummy 10-Pack 100mg', category: 'edible', dailyAvg: 4.5, weeklyTotal: 32, currentStock: 20, parLevel: 18, daysOnHand: 4.4, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'FL-GEL-3.5', productName: 'Gelato 3.5g', category: 'flower', dailyAvg: 3.9, weeklyTotal: 27, currentStock: 16, parLevel: 16, daysOnHand: 4.1, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'CN-LR-1G', productName: 'Live Resin Badder 1g', category: 'concentrate', dailyAvg: 2.4, weeklyTotal: 17, currentStock: 10, parLevel: 10, daysOnHand: 4.2, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'PR-OGK-1G', productName: 'OG Kush Pre-Roll 1g', category: 'preroll', dailyAvg: 5.2, weeklyTotal: 36, currentStock: 22, parLevel: 22, daysOnHand: 4.2, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'VP-BD-1G', productName: 'Blue Dream Disposable 1g', category: 'vaporizer', dailyAvg: 2.8, weeklyTotal: 20, currentStock: 12, parLevel: 12, daysOnHand: 4.3, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'ED-CHO-4PK', productName: 'Chocolate Bar 4-Pack', category: 'edible', dailyAvg: 2.1, weeklyTotal: 15, currentStock: 10, parLevel: 10, daysOnHand: 4.8, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'FL-NL-3.5', productName: 'Northern Lights 3.5g', category: 'flower', dailyAvg: 1.8, weeklyTotal: 13, currentStock: 8, parLevel: 8, daysOnHand: 4.4, reorderRecommended: false },
  { accountId: 'acc-summit', sku: 'BV-LEMON-4PK', productName: 'Lemon Sparkling 4-Pack', category: 'beverage', dailyAvg: 1.7, weeklyTotal: 12, currentStock: 10, parLevel: 8, daysOnHand: 5.9, reorderRecommended: false },

  // Capitol Hill (10 SKUs)
  { accountId: 'acc-capitol', sku: 'FL-WC-3.5', productName: 'Wedding Cake 3.5g', category: 'flower', dailyAvg: 6.8, weeklyTotal: 48, currentStock: 22, parLevel: 26, daysOnHand: 3.2, reorderRecommended: false },
  { accountId: 'acc-capitol', sku: 'CN-LR-1G', productName: 'Live Resin Badder 1g', category: 'concentrate', dailyAvg: 5.2, weeklyTotal: 36, currentStock: 10, parLevel: 20, daysOnHand: 1.9, reorderRecommended: true, reorderQty: 16 },
  { accountId: 'acc-capitol', sku: 'VP-GEL-500', productName: 'Gelato 510 Cart 0.5g', category: 'vaporizer', dailyAvg: 8.4, weeklyTotal: 59, currentStock: 30, parLevel: 34, daysOnHand: 3.6, reorderRecommended: false },
  { accountId: 'acc-capitol', sku: 'FL-BD-3.5', productName: 'Blue Dream 3.5g', category: 'flower', dailyAvg: 5.5, weeklyTotal: 39, currentStock: 20, parLevel: 22, daysOnHand: 3.6, reorderRecommended: false },
  { accountId: 'acc-capitol', sku: 'PR-BD-1G', productName: 'Blue Dream Pre-Roll 1g', category: 'preroll', dailyAvg: 9.2, weeklyTotal: 64, currentStock: 35, parLevel: 38, daysOnHand: 3.8, reorderRecommended: false },
  { accountId: 'acc-capitol', sku: 'ED-GUM-10PK', productName: 'Gummy 10-Pack 100mg', category: 'edible', dailyAvg: 7.8, weeklyTotal: 55, currentStock: 32, parLevel: 32, daysOnHand: 4.1, reorderRecommended: false },
  { accountId: 'acc-capitol', sku: 'CN-SHT-1G', productName: 'Shatter 1g', category: 'concentrate', dailyAvg: 4.1, weeklyTotal: 29, currentStock: 18, parLevel: 16, daysOnHand: 4.4, reorderRecommended: false },
  { accountId: 'acc-capitol', sku: 'VP-SD-500', productName: 'Sour Diesel 510 Cart', category: 'vaporizer', dailyAvg: 6.2, weeklyTotal: 43, currentStock: 24, parLevel: 26, daysOnHand: 3.9, reorderRecommended: false },
  { accountId: 'acc-capitol', sku: 'FL-GEL-3.5', productName: 'Gelato 3.5g', category: 'flower', dailyAvg: 5.0, weeklyTotal: 35, currentStock: 18, parLevel: 20, daysOnHand: 3.6, reorderRecommended: false },
  { accountId: 'acc-capitol', sku: 'PR-WC-5PK', productName: 'Wedding Cake 5-Pack', category: 'preroll', dailyAvg: 3.8, weeklyTotal: 27, currentStock: 16, parLevel: 16, daysOnHand: 4.2, reorderRecommended: false },
];

// --- Market Share Data ---
const marketShareData: VMIMarketShare[] = [
  // Greenfield
  { accountId: 'acc-greenfield', category: 'flower', ourShare: 35, ourRevenue: 28400, topCompetitor: 'Kush Gardens', competitorShare: 28 },
  { accountId: 'acc-greenfield', category: 'vaporizer', ourShare: 22, ourRevenue: 12600, topCompetitor: 'CloudNine Extracts', competitorShare: 31 },
  { accountId: 'acc-greenfield', category: 'preroll', ourShare: 41, ourRevenue: 18200, topCompetitor: 'Pacific Roots', competitorShare: 18 },
  { accountId: 'acc-greenfield', category: 'concentrate', ourShare: 28, ourRevenue: 9800, topCompetitor: 'CloudNine Extracts', competitorShare: 25 },
  { accountId: 'acc-greenfield', category: 'edible', ourShare: 18, ourRevenue: 7200, topCompetitor: 'Green State Co', competitorShare: 32 },
  // Summit
  { accountId: 'acc-summit', category: 'flower', ourShare: 30, ourRevenue: 15200, topCompetitor: 'Kush Gardens', competitorShare: 32 },
  { accountId: 'acc-summit', category: 'vaporizer', ourShare: 19, ourRevenue: 6800, topCompetitor: 'CloudNine Extracts', competitorShare: 35 },
  { accountId: 'acc-summit', category: 'preroll', ourShare: 38, ourRevenue: 10400, topCompetitor: 'Mountain High', competitorShare: 22 },
  { accountId: 'acc-summit', category: 'edible', ourShare: 20, ourRevenue: 5200, topCompetitor: 'Green State Co', competitorShare: 28 },
  // Capitol Hill
  { accountId: 'acc-capitol', category: 'flower', ourShare: 32, ourRevenue: 22100, topCompetitor: 'Evergreen Premium', competitorShare: 24 },
  { accountId: 'acc-capitol', category: 'vaporizer', ourShare: 36, ourRevenue: 19800, topCompetitor: 'CloudNine Extracts', competitorShare: 28 },
  { accountId: 'acc-capitol', category: 'concentrate', ourShare: 30, ourRevenue: 14200, topCompetitor: 'Evergreen Premium', competitorShare: 22 },
  { accountId: 'acc-capitol', category: 'preroll', ourShare: 35, ourRevenue: 11600, topCompetitor: 'Kush Gardens', competitorShare: 20 },
  { accountId: 'acc-capitol', category: 'edible', ourShare: 22, ourRevenue: 8400, topCompetitor: 'Green State Co', competitorShare: 30 },
];

// --- Export Functions ---
export function getVMIAccounts(): VMIAccount[] {
  return vmiAccounts;
}

export function getVMISellThrough(accountId?: string): VMISellThrough[] {
  if (accountId) return sellThroughData.filter((s) => s.accountId === accountId);
  return sellThroughData;
}

export function getVMIMarketShare(accountId?: string): VMIMarketShare[] {
  if (accountId) return marketShareData.filter((m) => m.accountId === accountId);
  return marketShareData;
}

export function getVMIMetrics(): VMIMetrics {
  const totalAlerts = vmiAccounts.reduce((s, a) => s + a.reorderAlerts, 0);
  const totalVelocity = vmiAccounts.reduce((s, a) => s + a.totalVelocity, 0);
  const allShares = marketShareData.map((m) => m.ourShare);
  const avgShare = allShares.length ? Math.round(allShares.reduce((s, v) => s + v, 0) / allShares.length) : 0;
  const totalItems = sellThroughData.length;
  const itemsInStock = sellThroughData.filter((s) => s.currentStock >= s.parLevel).length;
  const fillRate = totalItems ? Math.round((itemsInStock / totalItems) * 100) : 0;

  return {
    enrolledAccounts: vmiAccounts.filter((a) => a.enrolled).length,
    totalSKUs: vmiAccounts.reduce((s, a) => s + a.skuCount, 0),
    reorderAlerts: totalAlerts,
    avgDailyVelocity: totalVelocity,
    avgMarketShare: avgShare,
    fillRate,
  };
}

export function getVMIDailyEmails(): VMIDailyEmail[] {
  return vmiAccounts.filter((a) => a.enrolled).map((account) => {
    const reorderItems = sellThroughData.filter(
      (s) => s.accountId === account.accountId && s.reorderRecommended
    );
    const reps: Record<string, string> = {
      'acc-greenfield': 'Jake Morrison',
      'acc-summit': 'Priya Sharma',
      'acc-capitol': 'Carlos Ruiz',
    };
    const alerts: Record<string, string[]> = {
      'acc-greenfield': ['CloudNine dropped vape cart price by 12% — monitor sell-through impact', 'Green State new gummy line gaining shelf space'],
      'acc-summit': ['Kush Gardens running flower BOGO this week'],
      'acc-capitol': ['Evergreen Premium now stocking concentrate shelf — new competitor'],
    };
    return {
      accountId: account.accountId,
      accountName: account.accountName,
      repName: reps[account.accountId] ?? 'Unassigned',
      reorderItems,
      competitiveAlerts: alerts[account.accountId] ?? [],
      generatedAt: new Date().toISOString(),
    };
  });
}
