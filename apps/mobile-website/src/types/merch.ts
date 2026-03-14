/* ── Merch & Loyalty types ── */

export type MerchSubcategory = "apparel" | "accessories" | "smoking";

export interface MerchItem {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly subcategory: MerchSubcategory;
  readonly itemType: string; // e.g. "shirt", "hoodie", "grinder"
  readonly description: string;
  readonly price: number;
  readonly pointsCost: number;
  readonly sizes?: readonly string[];
  readonly imageUrl: string;
  readonly inStock: boolean;
  readonly isNew: boolean;
}

export type LoyaltyTier = "frost" | "glacier" | "avalanche";

export interface LoyaltyAccount {
  readonly points: number;
  readonly tier: LoyaltyTier;
  readonly lifetimePoints: number;
  readonly memberSince: string;
  readonly nextTier: LoyaltyTier | null;
  readonly pointsToNextTier: number;
}

export interface PurchaseHistoryItem {
  readonly id: string;
  readonly date: string;
  readonly items: readonly { readonly name: string; readonly quantity: number; readonly price: number }[];
  readonly total: number;
  readonly pointsEarned: number;
  readonly storeLocation: string;
}

export interface SweepstakesEntry {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly endsAt: string;
  readonly entries: number;
  readonly maxEntries: number;
  readonly entryCost: number; // points per entry
  readonly prize: string;
  readonly imageUrl: string;
}

export interface PointsActivity {
  readonly id: string;
  readonly date: string;
  readonly description: string;
  readonly points: number; // positive = earned, negative = spent
  readonly type: "purchase" | "redemption" | "sweepstakes" | "bonus";
}
