import type {
  LoyaltyAccount,
  PurchaseHistoryItem,
  SweepstakesEntry,
  PointsActivity,
} from "@/types/merch";

const PLACEHOLDER_IMG = "/FrostLogo_SnowflakeOnly.png";

export const MOCK_LOYALTY: LoyaltyAccount = {
  points: 2450,
  tier: "glacier",
  lifetimePoints: 4820,
  memberSince: "2025-06-15",
  nextTier: "avalanche",
  pointsToNextTier: 2550, // 5000 - 2450
};

export const MOCK_PURCHASES: readonly PurchaseHistoryItem[] = [
  {
    id: "ord-001",
    date: "2026-03-08",
    items: [
      { name: "Blue Frost OG — Eighth", quantity: 1, price: 45 },
      { name: "Frost Bite Gummies (10pk)", quantity: 2, price: 25 },
    ],
    total: 95,
    pointsEarned: 95,
    storeLocation: "Frost — Tacoma",
  },
  {
    id: "ord-002",
    date: "2026-03-01",
    items: [
      { name: "Glacier Live Resin Cart — 1g", quantity: 1, price: 50 },
    ],
    total: 50,
    pointsEarned: 50,
    storeLocation: "Frost — Seattle Capitol Hill",
  },
  {
    id: "ord-003",
    date: "2026-02-20",
    items: [
      { name: "Northern Haze — Quarter", quantity: 1, price: 75 },
      { name: "Frost Sparkling Citrus (4pk)", quantity: 1, price: 28 },
      { name: "Frost Rolling Papers", quantity: 3, price: 5 },
    ],
    total: 118,
    pointsEarned: 118,
    storeLocation: "Frost — Bellevue",
  },
  {
    id: "ord-004",
    date: "2026-02-10",
    items: [
      { name: "Glacier Kush — Eighth", quantity: 2, price: 42 },
    ],
    total: 84,
    pointsEarned: 84,
    storeLocation: "Frost — Tacoma",
  },
  {
    id: "ord-005",
    date: "2026-01-28",
    items: [
      { name: "Frost Bite Gummies (10pk)", quantity: 1, price: 25 },
      { name: "Glacier Hoodie — L", quantity: 1, price: 75 },
    ],
    total: 100,
    pointsEarned: 100,
    storeLocation: "Frost — Seattle Capitol Hill",
  },
  {
    id: "ord-006",
    date: "2026-01-15",
    items: [
      { name: "Northern Lights Rosin — 1g", quantity: 1, price: 65 },
      { name: "Frost Classic Tee — M", quantity: 1, price: 35 },
    ],
    total: 100,
    pointsEarned: 100,
    storeLocation: "Frost — Olympia",
  },
];

export const MOCK_SWEEPSTAKES: readonly SweepstakesEntry[] = [
  {
    id: "sweep-001",
    title: "Win a Frost Avalanche Jacket",
    description: "Enter for a chance to win our premium Avalanche shell jacket. 3 winners selected.",
    endsAt: "2026-04-01T23:59:59Z",
    entries: 1,
    maxEntries: 5,
    entryCost: 50,
    prize: "Avalanche Jacket ($120 value)",
    imageUrl: PLACEHOLDER_IMG,
  },
  {
    id: "sweep-002",
    title: "Ultimate Frost Smoke Kit",
    description: "4-piece grinder, rolling tray, papers, and glass pipe — the complete Frost setup.",
    endsAt: "2026-03-31T23:59:59Z",
    entries: 0,
    maxEntries: 10,
    entryCost: 25,
    prize: "Frost Smoke Kit ($102 value)",
    imageUrl: PLACEHOLDER_IMG,
  },
  {
    id: "sweep-003",
    title: "$500 Frost Store Credit",
    description: "Win $500 in store credit redeemable at any Frost dispensary location.",
    endsAt: "2026-04-15T23:59:59Z",
    entries: 2,
    maxEntries: 3,
    entryCost: 100,
    prize: "$500 Store Credit",
    imageUrl: PLACEHOLDER_IMG,
  },
];

export const MOCK_POINTS_ACTIVITY: readonly PointsActivity[] = [
  { id: "pa-001", date: "2026-03-08", description: "Purchase at Frost — Tacoma", points: 95, type: "purchase" },
  { id: "pa-002", date: "2026-03-05", description: "Sweepstakes entry — Avalanche Jacket", points: -50, type: "sweepstakes" },
  { id: "pa-003", date: "2026-03-01", description: "Purchase at Frost — Seattle", points: 50, type: "purchase" },
  { id: "pa-004", date: "2026-02-28", description: "Birthday bonus!", points: 200, type: "bonus" },
  { id: "pa-005", date: "2026-02-20", description: "Purchase at Frost — Bellevue", points: 118, type: "purchase" },
  { id: "pa-006", date: "2026-02-15", description: "Redeemed — Frost Snapback Hat", points: -300, type: "redemption" },
  { id: "pa-007", date: "2026-02-10", description: "Purchase at Frost — Tacoma", points: 84, type: "purchase" },
  { id: "pa-008", date: "2026-01-28", description: "Purchase at Frost — Seattle", points: 100, type: "purchase" },
  { id: "pa-009", date: "2026-01-15", description: "Purchase at Frost — Olympia", points: 100, type: "purchase" },
  { id: "pa-010", date: "2026-01-01", description: "New Year bonus!", points: 100, type: "bonus" },
];

export const TIER_THRESHOLDS = {
  frost: { min: 0, max: 999, label: "Frost", color: "#94A3B8" },
  glacier: { min: 1000, max: 4999, label: "Glacier", color: "#5BB8E6" },
  avalanche: { min: 5000, max: Infinity, label: "Avalanche", color: "#A78BFA" },
} as const;
