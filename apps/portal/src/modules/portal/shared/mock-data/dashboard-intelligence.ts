import type {
  DashboardScorecardData,
  DashboardSavingsData,
  FlashDeal,
  AllocationDrop,
} from '../types';

export function getScorecardForAccount(accountId: string): DashboardScorecardData {
  const scorecards: Record<string, DashboardScorecardData> = {
    'acct-1': {
      frostVelocity: 4.2,
      categoryAvgVelocity: 1.8,
      velocityMultiplier: 2.3,
      totalUnitsSold: 847,
      totalRevenue: 28400,
      avgTurnRate: 3.1,
      avgDaysOnShelf: 11,
      topSku: { name: 'Blue Dream 1/8oz', velocity: 6.8 },
      frostSkuCount: 7,
      peerAvgSkuCount: 12,
    },
    'acct-2': {
      frostVelocity: 3.1,
      categoryAvgVelocity: 1.8,
      velocityMultiplier: 1.7,
      totalUnitsSold: 420,
      totalRevenue: 14200,
      avgTurnRate: 2.4,
      avgDaysOnShelf: 15,
      topSku: { name: 'Wedding Cake Pre-Roll 5pk', velocity: 5.2 },
      frostSkuCount: 5,
      peerAvgSkuCount: 12,
    },
    'acct-3': {
      frostVelocity: 2.0,
      categoryAvgVelocity: 1.8,
      velocityMultiplier: 1.1,
      totalUnitsSold: 180,
      totalRevenue: 6100,
      avgTurnRate: 1.6,
      avgDaysOnShelf: 22,
      topSku: { name: 'Gelato Concentrate 1g', velocity: 3.4 },
      frostSkuCount: 3,
      peerAvgSkuCount: 12,
    },
  };
  return scorecards[accountId] ?? scorecards['acct-2'];
}

export function getSavingsForAccount(accountId: string): DashboardSavingsData {
  const savings: Record<string, DashboardSavingsData> = {
    'acct-1': {
      totalSavingsThisQuarter: 2340,
      volumeDiscounts: 1420,
      loyaltyRebates: 520,
      promoCredits: 280,
      earlyPayCredits: 120,
    },
    'acct-2': {
      totalSavingsThisQuarter: 890,
      volumeDiscounts: 540,
      loyaltyRebates: 200,
      promoCredits: 150,
      earlyPayCredits: 0,
    },
    'acct-3': {
      totalSavingsThisQuarter: 210,
      volumeDiscounts: 130,
      loyaltyRebates: 0,
      promoCredits: 80,
      earlyPayCredits: 0,
    },
  };
  return savings[accountId] ?? savings['acct-2'];
}

export function getFlashDeals(): FlashDeal[] {
  const now = new Date();
  const hoursFromNow = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'fd-1',
      productId: 'prod-gelato-conc',
      productName: 'Gelato Live Resin 1g',
      category: 'concentrates',
      originalPrice: 22,
      dealPrice: 17.60,
      discountPercent: 20,
      expiresAt: hoursFromNow(3.7),
      claimed: false,
      totalAvailable: 50,
      totalClaimed: 34,
    },
    {
      id: 'fd-2',
      productId: 'prod-bd-preroll',
      productName: 'Blue Dream Pre-Roll 5pk',
      category: 'prerolls',
      originalPrice: 18,
      dealPrice: 15.30,
      discountPercent: 15,
      expiresAt: hoursFromNow(8.2),
      claimed: false,
      totalAvailable: 100,
      totalClaimed: 61,
    },
  ];
}

export function getAllocationDrops(): AllocationDrop[] {
  const now = new Date();
  const daysFromNow = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'drop-1',
      productName: 'Ice Water Hash — Zkittlez',
      strainName: 'Zkittlez',
      category: 'concentrates',
      dropDate: daysFromNow(5),
      reservationDeadline: daysFromNow(2),
      totalAllocations: 40,
      allocationsRemaining: 12,
      reserved: false,
      estimatedPrice: 38,
    },
    {
      id: 'drop-2',
      productName: 'Small Batch Flower — Sunset Sherbet',
      strainName: 'Sunset Sherbet',
      category: 'flower',
      dropDate: daysFromNow(12),
      reservationDeadline: daysFromNow(8),
      totalAllocations: 60,
      allocationsRemaining: 41,
      reserved: false,
      estimatedPrice: 28,
    },
    {
      id: 'drop-3',
      productName: 'Spring Seltzer Pack — Mango Haze',
      strainName: 'Mango Haze',
      category: 'beverages',
      dropDate: daysFromNow(18),
      reservationDeadline: daysFromNow(14),
      totalAllocations: 80,
      allocationsRemaining: 67,
      reserved: false,
      estimatedPrice: 12,
    },
  ];
}
