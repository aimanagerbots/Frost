import type { TerritoryData, TerritoryMetrics } from '@/modules/crm/types';
import { accounts, salesReps } from './crm';

// --- Territory Boundaries (simplified polygons for WA state regions) ---

const seattleMetroBounds: { lat: number; lng: number }[][] = [
  [
    { lat: 47.80, lng: -122.50 },
    { lat: 47.80, lng: -122.10 },
    { lat: 47.50, lng: -122.10 },
    { lat: 47.50, lng: -122.50 },
  ],
];

const southSoundBounds: { lat: number; lng: number }[][] = [
  [
    { lat: 47.50, lng: -123.10 },
    { lat: 47.50, lng: -122.10 },
    { lat: 46.90, lng: -122.10 },
    { lat: 46.90, lng: -123.10 },
  ],
];

const eastRuralBounds: { lat: number; lng: number }[][] = [
  // Spokane area
  [
    { lat: 48.00, lng: -117.80 },
    { lat: 48.00, lng: -117.00 },
    { lat: 47.40, lng: -117.00 },
    { lat: 47.40, lng: -117.80 },
  ],
  // Bellingham area
  [
    { lat: 49.00, lng: -122.70 },
    { lat: 49.00, lng: -122.20 },
    { lat: 48.60, lng: -122.20 },
    { lat: 48.60, lng: -122.70 },
  ],
  // Tri-Cities / Aberdeen
  [
    { lat: 47.10, lng: -124.10 },
    { lat: 47.10, lng: -118.90 },
    { lat: 46.00, lng: -118.90 },
    { lat: 46.00, lng: -124.10 },
  ],
];

// --- Map accounts to territories by rep assignment ---

function buildTerritoryData(): TerritoryData[] {
  const repMap: Record<string, { repId: string; repName: string; color: string; bounds: { lat: number; lng: number }[][] }> = {
    'rep-jake': { repId: 'rep-jake', repName: 'Jake Morrison', color: '#3B82F6', bounds: seattleMetroBounds },
    'rep-priya': { repId: 'rep-priya', repName: 'Priya Patel', color: '#8B5CF6', bounds: southSoundBounds },
    'rep-carlos': { repId: 'rep-carlos', repName: 'Carlos Ruiz', color: '#F59E0B', bounds: eastRuralBounds },
    'rep-dana': { repId: 'rep-dana', repName: 'Dana Whitfield', color: '#10B981', bounds: [] },
  };

  return Object.values(repMap).map((rep) => ({
    ...rep,
    accounts: accounts
      .filter((a) => a.assignedRepId === rep.repId)
      .map((a) => ({
        id: a.id,
        name: a.name,
        lat: a.address.lat,
        lng: a.address.lng,
        health: a.healthScore,
        revenue30d: a.thirtyDayRevenue,
        status: a.status,
        vmiEnrolled: a.vmiEnrolled,
      })),
  }));
}

function buildTerritoryMetrics(): TerritoryMetrics[] {
  return salesReps
    .filter((r) => r.id !== 'rep-dana')
    .map((rep) => {
      const repAccounts = accounts.filter((a) => a.assignedRepId === rep.id);
      const totalRevenue = repAccounts.reduce((sum, a) => sum + a.thirtyDayRevenue, 0);
      const avgHealth = repAccounts.length > 0
        ? Math.round(repAccounts.reduce((sum, a) => sum + a.healthScore, 0) / repAccounts.length)
        : 0;
      const atRiskCount = repAccounts.filter((a) => a.status === 'at-risk' || a.status === 'churning').length;

      return {
        repId: rep.id,
        repName: rep.name,
        totalAccounts: repAccounts.length,
        totalRevenue,
        avgHealth,
        atRiskCount,
      };
    });
}

// --- Exports ---

export function getTerritoryData(): TerritoryData[] {
  return buildTerritoryData();
}

export function getTerritoryMetrics(): TerritoryMetrics[] {
  return buildTerritoryMetrics();
}
