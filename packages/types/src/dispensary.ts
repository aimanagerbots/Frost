/** Standard address with coordinates */
export interface GeoAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

/** Canonical Washington State regions used across all Frost apps */
export const WA_REGIONS = [
  'Seattle Metro',
  'Eastside',
  'South Sound',
  'Tacoma',
  'Olympia',
  'Northwest WA',
  'Southwest WA',
  'Central WA',
  'Eastern WA',
  'Spokane',
  'Tri-Cities',
  'Peninsula',
  'Coastal',
  'Kitsap',
] as const;

export type WARegion = (typeof WA_REGIONS)[number];

/** Dispensary location for store locator / product finder */
export interface DispensaryLocation {
  id: string;
  /** Optional link to CRM Account.id (e.g. "acct-greenfield") */
  crmAccountId?: string;
  name: string;
  slug: string;
  dba: string;
  address: GeoAddress;
  region: string;
  phone?: string;
  website?: string;
  hours?: string;
  imageUrl?: string;
  logoUrl?: string;
  description?: string;
  frostPartnerSince?: string;
  featuredDeal?: string;
  categoriesCarried: string[];
}
